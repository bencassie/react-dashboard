"use client";
import { memo, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp, Filter } from "lucide-react";

type ChartSelectorProps = {
  charts: Array<{ name: string; displayName: string }>;
  selectedGraphs: string[];
  onToggle: (name: string) => void;
  onSelectAll: (names: string[]) => void;
};

type GroupedChart = {
  name: string;
  displayName: string;
  vendor: string;
  type: string;
};

// Memoized individual badge component for performance
const ChartBadge = memo(({
  chart,
  isSelected,
  vendorColor,
  onToggle
}: {
  chart: GroupedChart;
  isSelected: boolean;
  vendorColor: string;
  onToggle: (name: string) => void;
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(chart.name);
  }, [chart.name, onToggle]);

  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={`cursor-pointer transition-all px-3 py-1.5 text-xs ${
        isSelected ? vendorColor + " font-medium" : "hover:bg-muted"
      }`}
      onClick={handleClick}
    >
      <span className="font-semibold mr-1">{chart.vendor}</span>
      <span className="opacity-75">
        · {chart.displayName.replace(chart.vendor, '').replace(/\(.*?\)/g, '').trim()}
      </span>
      {isSelected && <X className="ml-2 h-3 w-3" />}
    </Badge>
  );
});

ChartBadge.displayName = "ChartBadge";

const VENDORS = ["Nivo", "ECharts", "Recharts", "Chart.js", "ChartJS", "D3", "Plotly"];
const CHART_TYPES = ["Bar", "Line", "Pie", "Doughnut", "Area", "Scatter", "Radar", "Heatmap", "Bump"];

function extractVendorAndType(displayName: string): { vendor: string; type: string } {
  // Find vendor in display name
  const vendor = VENDORS.find(v => displayName.includes(v)) || "Other";

  // Find chart type in display name
  const type = CHART_TYPES.find(t => displayName.toLowerCase().includes(t.toLowerCase())) || "Other";

  return { vendor: vendor === "ChartJS" ? "Chart.js" : vendor, type };
}

export const ChartSelector = memo(({ charts, selectedGraphs, onToggle, onSelectAll }: ChartSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Track mounted state for portal (SSR compatibility)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize selected graphs as a Set for O(1) lookup
  const selectedSet = useMemo(() => new Set(selectedGraphs), [selectedGraphs]);

  // Wrap onToggle to add pending state feedback
  const handleToggle = useCallback((name: string) => {
    setIsPending(true);
    onToggle(name);
    // Reset pending after a short delay
    setTimeout(() => setIsPending(false), 300);
  }, [onToggle]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isOutsidePortal = portalRef.current && !portalRef.current.contains(target);

      if (isOutsideContainer && isOutsidePortal) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isExpanded]);

  const groupedCharts = useMemo(() => {
    // Group charts by type and vendor
    const groups: Record<string, GroupedChart[]> = {};

    charts.forEach(chart => {
      const { vendor, type } = extractVendorAndType(chart.displayName);

      if (!groups[type]) {
        groups[type] = [];
      }

      groups[type].push({
        ...chart,
        vendor,
        type,
      });
    });

    // Sort each group by vendor
    Object.keys(groups).forEach(type => {
      groups[type].sort((a, b) => {
        const vendorOrder = VENDORS.indexOf(a.vendor) - VENDORS.indexOf(b.vendor);
        if (vendorOrder !== 0) return vendorOrder;
        return a.displayName.localeCompare(b.displayName);
      });
    });

    return groups;
  }, [charts]);

  const chartTypeOrder = useMemo(() => {
    return CHART_TYPES.filter(type => groupedCharts[type]?.length > 0);
  }, [groupedCharts]);

  const getVendorColor = useCallback((vendor: string) => {
    const colors: Record<string, string> = {
      "Nivo": "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20",
      "ECharts": "bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20",
      "Recharts": "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20",
      "Chart.js": "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20",
      "D3": "bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20",
      "Plotly": "bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/20",
    };
    return colors[vendor] || "bg-gray-500/10 text-gray-700 border-gray-500/20 hover:bg-gray-500/20";
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Filter Button */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 bg-muted/40 hover:bg-muted/60 rounded-full cursor-pointer transition-all shadow-sm hover:shadow-md border border-border/30 ${
          isPending ? "opacity-60" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Filter className={`w-4 h-4 text-muted-foreground ${isPending ? "animate-pulse" : ""}`} />
        <span className="text-sm font-medium">
          {selectedGraphs.length} / {charts.length}
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {/* Floating Sidebar - Right Side - Rendered via Portal */}
      {isMounted && isExpanded && createPortal(
        <div ref={portalRef} className="fixed right-4 md:right-8 top-16 bottom-4 w-[400px] z-[9999] bg-background border-2 border-border rounded-lg shadow-2xl overflow-y-auto">
          <div className="p-4 space-y-3">
            {/* Select All / Deselect All */}
            <div className="flex items-center gap-3 pb-3 border-b sticky top-0 bg-background z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll(charts.map(chart => chart.name));
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                Select All
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll([]);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Deselect All
              </button>
              <span className="text-xs text-muted-foreground ml-auto">
                {selectedGraphs.length} / {charts.length}
              </span>
            </div>

            {chartTypeOrder.map(type => (
              <div key={type} className="space-y-2">
                <h3 className="font-bold text-sm text-foreground sticky top-0 bg-background py-1 border-b">
                  {type} Charts ({groupedCharts[type]?.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupedCharts[type]?.map(chart => (
                    <ChartBadge
                      key={chart.name}
                      chart={chart}
                      isSelected={selectedSet.has(chart.name)}
                      vendorColor={getVendorColor(chart.vendor)}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});

ChartSelector.displayName = "ChartSelector";
