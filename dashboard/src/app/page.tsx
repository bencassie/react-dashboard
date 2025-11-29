"use client";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useCallback, startTransition } from "react";
import { useStore } from "@/lib/store";
import { chartRegistry } from "@/lib/charts/registry";
import { ChartWrapper } from "@/components/graphs/chartwrapper";
import { Sidebar } from "@/components/sidebar";

const fetchData = async (url: string, options?: { multiFetch?: boolean }) => {
  if (!url) return null;
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
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

  // Memoize chart registry data for sidebar
  const chartList = useMemo(
    () => chartRegistry.map((c) => ({ name: c.name, displayName: c.displayName })),
    []
  );

  // Wrap toggle in startTransition for non-urgent updates
  const handleToggle = useCallback((name: string) => {
    startTransition(() => {
      toggleGraph(name);
    });
  }, [toggleGraph]);

  // Get configs for selected charts
  const selectedConfigs = useMemo(
    () => chartRegistry.filter((chart) => selectedGraphs.includes(chart.name)),
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

  // Refetch all queries
  const refetchAll = useCallback(() => {
    queries.forEach((query) => query.refetch());
  }, [queries]);

  // Check if any query is loading
  const isAnyLoading = queries.some((q) => q.isLoading);

  // Prepare chart data with transformed results
  const chartData = useMemo(
    () =>
      selectedConfigs.map((config, idx) => {
        const query = queries[idx];
        
        // Handle client-side data generation (no endpoint)
        const transformedData = config.apiConfig.endpoint === ""
          ? config.apiConfig.transform(null)
          : query.data
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
      <Sidebar 
        charts={chartList}
        selectedGraphs={selectedGraphs}
        onToggle={handleToggle}
      />

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
                  debounceMs={150}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}