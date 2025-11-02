"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { graphs } from "@/components/graphs";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";

const apiUrl = "https://dummyjson.com/products";

const fetchData = async (url: string) => {
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedGraphs, renderKeys, toggleGraph } = useStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data", apiUrl],
    queryFn: () => fetchData(apiUrl),
  });

  // Initialize from URL on mount (once only)
  useEffect(() => {
    const param = searchParams.get("selected");
    
    // If param exists (even if empty string), use it; otherwise default to all
    if (param !== null) {
      const selected = param
        ? param.split(",").filter((s) => graphs.some((g) => g.name === s))
        : []; // Empty string = no charts selected
      useStore.setState({ selectedGraphs: selected });
    } else {
      // No param = first visit, default to all
      useStore.setState({ selectedGraphs: graphs.map((g) => g.name) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sync to URL when selection changes (but avoid triggering re-initialization)
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

  const renderedGraphs = useMemo(
    () =>
      graphs
        .filter((graph) => selectedGraphs.includes(graph.name))
        .map((graph) => ({
          ...graph,
          key: renderKeys[graph.name] || 0,
        })),
    [selectedGraphs, renderKeys]
  );

  return (
    <div className="min-h-screen flex">
      <div className="w-64 border-r bg-muted/40 p-4 flex flex-col gap-2">
        <CardTitle className="text-lg font-bold">Graphs</CardTitle>
        {graphs.map((graph) => (
          <div key={graph.name} className="flex items-center space-x-2">
            <Checkbox
              id={graph.name}
              checked={selectedGraphs.includes(graph.name)}
              onCheckedChange={() => toggleGraph(graph.name)}
            />
            <label htmlFor={graph.name} className="text-sm font-medium">
              {graph.name}
            </label>
          </div>
        ))}
      </div>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Product Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={apiUrl} target="_blank" rel="noopener noreferrer">
                  API <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: graphs.length }, (_, i) => (
                <div key={i} className="h-[500px]">
                  <Card className="h-full animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-48 bg-muted rounded" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">Error loading data</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderedGraphs.map(({ Component, name, key }) => (
                <Component 
                  key={`${name}-${key}`} 
                  data={data} 
                  isLoading={false} 
                  error={null}
                  renderKey={key}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}