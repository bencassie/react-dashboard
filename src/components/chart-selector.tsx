"use client";
import { memo, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, Filter } from "lucide-react";

type ChartSelectorProps = {
  charts: Array<{ name: string; displayName: string }>;
  selectedGraphs: string[];
  onToggle: (name: string) => void;
};

type GroupedChart = {
  name: string;
  displayName: string;
  vendor: string;
  type: string;
};

const VENDORS = ["Nivo", "ECharts", "Recharts", "Chart.js", "ChartJS", "D3", "Plotly"];
const CHART_TYPES = ["Bar", "Line", "Pie", "Doughnut", "Area", "Scatter", "Radar", "Heatmap", "Bump"];

function extractVendorAndType(displayName: string): { vendor: string; type: string } {
  // Find vendor in display name
  const vendor = VENDORS.find(v => displayName.includes(v)) || "Other";

  // Find chart type in display name
  const type = CHART_TYPES.find(t => displayName.toLowerCase().includes(t.toLowerCase())) || "Other";

  return { vendor: vendor === "ChartJS" ? "Chart.js" : vendor, type };
}

export const ChartSelector = memo(({ charts, selectedGraphs, onToggle }: ChartSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getVendorColor = (vendor: string) => {
    const colors: Record<string, string> = {
      "Nivo": "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20",
      "ECharts": "bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20",
      "Recharts": "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20",
      "Chart.js": "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20",
      "D3": "bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20",
      "Plotly": "bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/20",
    };
    return colors[vendor] || "bg-gray-500/10 text-gray-700 border-gray-500/20 hover:bg-gray-500/20";
  };

  return (
    <div className="w-full">
      {/* Compact Header - Always Visible */}
      <div
        className="px-6 py-3 bg-background border-b flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold">Chart Selection</h2>
            <p className="text-xs text-muted-foreground">
              {selectedGraphs.length} of {charts.length} charts selected
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="ml-2 text-sm">{isExpanded ? "Hide" : "Show"} Filters</span>
        </Button>
      </div>

      {/* Expandable Chart List - Overlay */}
      {isExpanded && (
        <div className="absolute left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-b shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="max-w-[1800px] mx-auto p-6 space-y-3">
            {chartTypeOrder.map(type => (
              <div key={type} className="flex flex-wrap items-start gap-2">
                <h3 className="font-bold text-sm whitespace-nowrap pt-1.5">{type} Charts -</h3>
                <div className="flex flex-wrap gap-2 flex-1">
                  {groupedCharts[type]?.map(chart => {
                    const isSelected = selectedGraphs.includes(chart.name);
                    return (
                      <Badge
                        key={chart.name}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all px-3 py-1.5 text-sm ${
                          isSelected
                            ? getVendorColor(chart.vendor) + " font-medium"
                            : "hover:bg-muted"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(chart.name);
                        }}
                      >
                        <span className="font-semibold mr-1">{chart.vendor}</span>
                        <span className="opacity-75">· {chart.displayName.replace(chart.vendor, '').replace(/\(.*?\)/g, '').trim()}</span>
                        {isSelected && <X className="ml-2 h-3 w-3" />}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ChartSelector.displayName = "ChartSelector";
