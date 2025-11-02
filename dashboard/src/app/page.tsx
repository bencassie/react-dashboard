"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { graphs, type GraphModule } from "@/components/graphs";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
type Store = {
  selectedGraphs: string[];
  toggleGraph: (name: string) => void;
};
const useStore = create<Store>()((set) => ({
  selectedGraphs: [], // Initialize empty; set from URL on mount
  toggleGraph: (name) =>
    set((state) => ({
      selectedGraphs: state.selectedGraphs.includes(name)
        ? state.selectedGraphs.filter((g) => g !== name)
        : [...state.selectedGraphs, name],
    })),
}));
const apiUrl = "https://dummyjson.com/products";
const isDev = process.env.NODE_ENV === "development";
const getTimestamp = () => new Date().toISOString();
const fetchData = async (url: string) => {
  if (isDev) {
    console.log(`[${getTimestamp()}] API request begin:`, url);
  }
  const startTime = performance.now();
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  const endTime = performance.now();
  if (isDev) {
    console.log(`[${getTimestamp()}] API request end:`, url, `(${Math.round(endTime - startTime)}ms)`);
  }
 
  return data;
};
export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedGraphs, toggleGraph } = useStore();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data", apiUrl],
    queryFn: () => fetchData(apiUrl),
  });

  // Initialize store from URL params on mount
  useEffect(() => {
    const param = searchParams.get("selected");
    let initialSelected: string[] = graphs.map((g) => g.name); // Default to all
    if (param) {
      const fromUrl = param
        .split(",")
        .map((s) => s.trim())
        .filter((s) => graphs.some((g) => g.name === s));
      if (fromUrl.length > 0) {
        initialSelected = fromUrl;
      }
    }
    useStore.setState({ selectedGraphs: initialSelected });
  }, []); // Run once on mount

  // Sync store changes to URL
  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());
    if (selectedGraphs.length === graphs.length) {
      query.delete("selected");
    } else {
      query.set("selected", selectedGraphs.join(","));
    }
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }, [selectedGraphs, router, pathname, searchParams]);

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
            <Skeleton className="h-96 w-full" />
          ) : error ? (
            <p className="text-red-500">Error loading data</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {graphs
                .filter((graph) => selectedGraphs.includes(graph.name))
                .map((graph) => (
                  <graph.Component key={graph.name} data={data} isLoading={isLoading} error={error} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}