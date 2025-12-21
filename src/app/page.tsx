"use client";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useCallback, startTransition, useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { chartRegistry } from "@/lib/charts/registry";
import { ChartWrapper } from "@/components/graphs/chartwrapper";
import { ChartSelector } from "@/components/chart-selector";

const VENDORS = ["Nivo", "ECharts", "Recharts", "Chart.js", "ChartJS", "D3", "Plotly"];
const CHART_TYPES = ["Bar", "Line", "Pie", "Doughnut", "Area", "Scatter", "Radar", "Heatmap", "Bump"];

function extractVendorAndType(displayName: string): { vendor: string; type: string } {
  const vendor = VENDORS.find(v => displayName.includes(v)) || "Other";
  const type = CHART_TYPES.find(t => displayName.toLowerCase().includes(t.toLowerCase())) || "Other";
  return { vendor: vendor === "ChartJS" ? "Chart.js" : vendor, type };
}

const fetchData = async (url: string, options?: { multiFetch?: boolean }) => {
  if (!url) return null;

  // Direct API routes don't need proxy, external URLs do
  const fetchUrl = url.startsWith('/api/')
    ? url
    : `/api/proxy?url=${encodeURIComponent(url)}`;

  const res = await fetch(fetchUrl);
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();

  // Handle multi‑fetch enrichment (used by PokéAPI)
  if (options?.multiFetch && Array.isArray(json?.results)) {
    const detailUrls: string[] = json.results.map((r: any) => r.url).filter(Boolean).slice(0, 50);
    const detailResponses = await Promise.all(
      detailUrls.map((u) => fetch(`/api/proxy?url=${encodeURIComponent(u)}`))
    );
    const detailJson = await Promise.all(detailResponses.map((r) => (r.ok ? r.json() : null)));
    // stitch back
    return { ...json, enriched: detailJson.filter(Boolean) };
  }

  return json;
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedGraphs, renderKeys, toggleGraph, setSelectedGraphs } = useStore();

  // Progressive rendering: track which charts are ready to render
  const [readyToRender, setReadyToRender] = useState<Set<string>>(new Set());
  const prevSelectedGraphsRef = useRef<string[]>([]);

  // Initialize from URL on mount (once only)
  useEffect(() => {
    const param = searchParams.get("selected");

    // If param exists (even if empty string), use it; otherwise default to all
    if (param !== null) {
      const selected = param
        ? param.split(",").filter((s) => chartRegistry.some((g) => g.name === s))
        : []; // Empty string = no charts selected
      useStore.setState({ selectedGraphs: selected });
    } else {
      // No param = first visit, default to first 10 charts for better performance
      useStore.setState({ selectedGraphs: chartRegistry.slice(0, 10).map((g) => g.name) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sync to URL when selection changes
  useEffect(() => {
    const currentParam = searchParams.get("selected") || "";
    const newValue = selectedGraphs.join(",");

    // Only update URL if it's actually different
    if (currentParam !== newValue) {
      const query = new URLSearchParams(searchParams.toString());
      query.set("selected", newValue);
      router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    }
  }, [selectedGraphs, router, pathname, searchParams]);

  // Progressive rendering: gradually add charts to render queue
  useEffect(() => {
    const prevSelected = prevSelectedGraphsRef.current;
    const prevSet = new Set(prevSelected);
    const currentSet = new Set(selectedGraphs);

    if (selectedGraphs.length === 0) {
      setReadyToRender(new Set());
      prevSelectedGraphsRef.current = selectedGraphs;
      return;
    }

    // Find newly added charts (in current but not in previous)
    const newCharts = selectedGraphs.filter(name => !prevSet.has(name));

    if (newCharts.length === 0) {
      // No new charts, just clean up removed ones
      setReadyToRender((prev) => {
        return new Set([...prev].filter(name => currentSet.has(name)));
      });
      prevSelectedGraphsRef.current = selectedGraphs;
      return;
    }

    // Preserve ready state for charts that are still selected and add new ones
    const immediate = newCharts.slice(0, 3);
    setReadyToRender((prev) => {
      const updated = new Set([...prev].filter(name => currentSet.has(name)));
      // Add first 3 new charts immediately
      immediate.forEach(name => updated.add(name));
      return updated;
    });

    // Queue remaining new charts with staggered delays
    const rest = newCharts.slice(3);
    if (rest.length === 0) {
      prevSelectedGraphsRef.current = selectedGraphs;
      return;
    }

    const delays: NodeJS.Timeout[] = [];
    rest.forEach((name, index) => {
      const delay = setTimeout(() => {
        setReadyToRender((current) => new Set([...current, name]));
      }, (index + 1) * 50); // 50ms between each chart

      delays.push(delay);
    });

    prevSelectedGraphsRef.current = selectedGraphs;

    return () => {
      delays.forEach(clearTimeout);
    };
  }, [selectedGraphs]);

  // Memoize chart registry data for sidebar
  const chartList = useMemo(
    () => chartRegistry.map((c) => ({ name: c.name, displayName: c.displayName })),
    []
  );

  // Debounced toggle with refs to track timeouts
  const toggleTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const handleToggle = useCallback((name: string) => {
    // Clear existing timeout for this chart
    const existing = toggleTimeouts.current.get(name);
    if (existing) {
      clearTimeout(existing);
    }

    // Debounce the actual state update
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        toggleGraph(name);
        toggleTimeouts.current.delete(name);
      });
    }, 150); // 150ms debounce

    toggleTimeouts.current.set(name, timeoutId);
  }, [toggleGraph]);

  // Wrap selectAll in startTransition for non-urgent updates
  const handleSelectAll = useCallback((names: string[]) => {
    startTransition(() => {
      setSelectedGraphs(names);
    });
  }, [setSelectedGraphs]);

  // Get configs for selected charts in registry order (not selection order)
  const selectedConfigs = useMemo(
    () => chartRegistry.filter(chart => selectedGraphs.includes(chart.name)),
    [selectedGraphs]
  );

  // Fetch data for all selected charts in parallel using useQueries
  const queries = useQueries({
    queries: selectedConfigs.map((config) => ({
      queryKey: config.apiConfig.queryKey,
      queryFn: () =>
        fetchData(config.apiConfig.endpoint, {
          multiFetch: !!config.chartOptions?.multiFetch,
        }),
      staleTime: 5 * 60 * 1000,       // 5 min "fresh"
      gcTime: 15 * 60 * 1000,         // keep in cache 15 min
      refetchOnWindowFocus: false,    // no tab-focus refetch
      refetchOnMount: false,          // no refetch if cache fresh
      refetchOnReconnect: false,      // no refetch on reconnect
      retry: (failureCount, err: any) => {
        const status = err?.status ?? err?.response?.status;
        if (status && status >= 400 && status < 500) return false; // don't retry 4xx
        return failureCount < 2; // small backoff for transient errors
      },
    })),
  });

  // Prepare chart data with transformed results
  const chartData = useMemo(
    () =>
      selectedConfigs.map((config, idx) => {
        const query = queries[idx];
        const isReady = readyToRender.has(config.name);

        // Handle client-side data generation (no endpoint)
        const transformedData = config.apiConfig.endpoint === ""
          ? config.apiConfig.transform(null)
          : query?.data
          ? config.apiConfig.transform(query.data)
          : null;

        return {
          config,
          data: transformedData,
          isLoading: query?.isLoading || !isReady, // Show loading if not ready to render
          error: (query?.error as Error | null) ?? null,
          renderKey: renderKeys[config.name] || 0,
          isReady,
        };
      }),
    [selectedConfigs, queries, renderKeys, readyToRender]
  );

  // Group charts by type for display
  const groupedChartData = useMemo(() => {
    const groups: Record<string, typeof chartData> = {};

    chartData.forEach(item => {
      const { type } = extractVendorAndType(item.config.displayName);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
    });

    return groups;
  }, [chartData, selectedGraphs, readyToRender]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      {/* Compact Header with Filters */}
      <div className="bg-background/80 backdrop-blur-md sticky top-0 z-20 border-b border-border/40">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-3">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">
              Chart Library Comparison
            </h1>
            <div className="flex items-center gap-3">
              <ChartSelector
                charts={chartList}
                selectedGraphs={selectedGraphs}
                onToggle={handleToggle}
                onSelectAll={handleSelectAll}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 bg-muted/20">
        <div className="max-w-[1800px] mx-auto">
          {/* Chart Grid */}
          {selectedGraphs.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              <p className="text-lg">No charts selected. Click on the tags above to select charts for comparison.</p>
            </Card>
          ) : (
            <>
              {/* Progressive loading indicator */}
              {readyToRender.size < selectedGraphs.length && (
                <div className="mb-4 text-sm text-muted-foreground">
                  Loading charts: {readyToRender.size} / {selectedGraphs.length}
                </div>
              )}

              {/* Grouped Charts Display */}
              <div className="space-y-12">
                {CHART_TYPES.filter(type => groupedChartData[type]?.length > 0).map(type => (
                  <div key={type} className="space-y-4">
                    {/* Group Header */}
                    <div className="border-b-2 border-primary/20 pb-2">
                      <h2 className="text-2xl font-bold text-foreground">
                        {type} Charts
                        <span className="ml-3 text-sm font-normal text-muted-foreground">
                          ({groupedChartData[type].length})
                        </span>
                      </h2>
                    </div>

                    {/* Charts in this group */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {groupedChartData[type].map(({ config, data, isLoading, error, renderKey }) => (
                        <ChartWrapper
                          key={`${config.name}-${renderKey}`}
                          Component={config.Component}
                          data={data}
                          isLoading={isLoading}
                          error={error}
                          renderKey={renderKey}
                          options={config.chartOptions}
                          debounceMs={150}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}