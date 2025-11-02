"use client";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { chartRegistry } from "@/lib/charts/registry";
import { ChartWrapper } from "@/components/graphs/ChartWrapper";

const fetchData = async (url: string) => {
  // Skip fetch if no URL (e.g., heatmap doesn't need API data)
  if (!url) return null;
  
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedGraphs, renderKeys, toggleGraph } = useStore();

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
      // No param = first visit, default to all
      useStore.setState({ selectedGraphs: chartRegistry.map((g) => g.name) });
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

  // Get configs for selected charts
  const selectedConfigs = useMemo(
    () => chartRegistry.filter((chart) => selectedGraphs.includes(chart.name)),
    [selectedGraphs]
  );

  // Fetch data for all selected charts in parallel using useQueries
  const queries = useQueries({
    queries: selectedConfigs.map((config) => ({
      queryKey: config.apiConfig.queryKey,
      queryFn: () => fetchData(config.apiConfig.endpoint),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Refetch all queries
  const refetchAll = () => {
    queries.forEach((query) => query.refetch());
  };

  // Check if any query is loading
  const isAnyLoading = queries.some((q) => q.isLoading);

  // Prepare chart data with transformed results
  const chartData = useMemo(
    () =>
      selectedConfigs.map((config, idx) => {
        const query = queries[idx];
        const transformedData = query.data
          ? config.apiConfig.transform(query.data)
          : null;

        return {
          config,
          data: transformedData,
          isLoading: query.isLoading,
          error: query.error as Error | null,
          renderKey: renderKeys[config.name] || 0,
        };
      }),
    [selectedConfigs, queries, renderKeys]
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/40 p-4 flex flex-col gap-2">
        <CardTitle className="text-lg font-bold">Graphs</CardTitle>
        {chartRegistry.map((chart) => (
          <div key={chart.name} className="flex items-center space-x-2">
            <Checkbox
              id={chart.name}
              checked={selectedGraphs.includes(chart.name)}
              onCheckedChange={() => toggleGraph(chart.name)}
            />
            <label htmlFor={chart.name} className="text-sm font-medium">
              {chart.displayName}
            </label>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Product Dashboard</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetchAll}
                disabled={isAnyLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnyLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Chart Grid */}
          {selectedGraphs.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No charts selected. Select charts from the sidebar to view them.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chartData.map(({ config, data, isLoading, error, renderKey }) => (
                <ChartWrapper
                  key={`${config.name}-${renderKey}`}
                  Component={config.Component}
                  data={data}
                  isLoading={isLoading}
                  error={error}
                  renderKey={renderKey}
                  options={config.chartOptions}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}