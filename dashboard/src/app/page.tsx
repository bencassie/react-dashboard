"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { graphs, type GraphModule } from "@/components/graphs";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Store = {
  selectedGraphs: string[];
  toggleGraph: (name: string) => void;
};

const useStore = create<Store>()((set) => ({
  selectedGraphs: graphs.map((g) => g.name),
  toggleGraph: (name) =>
    set((state) => ({
      selectedGraphs: state.selectedGraphs.includes(name)
        ? state.selectedGraphs.filter((g) => g !== name)
        : [...state.selectedGraphs, name],
    })),
}));

const apiUrl = "https://dummyjson.com/products";

const fetchData = async (url: string) => {
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Page() {
  const { selectedGraphs, toggleGraph } = useStore();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data", apiUrl],
    queryFn: () => fetchData(apiUrl),
  });

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