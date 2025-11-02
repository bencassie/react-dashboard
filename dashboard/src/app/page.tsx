"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink } from "lucide-react";

// ECharts must be client-only
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

// Zustand Store
type Store = {
  view: "bar" | "pie" | "heatmap";
  apiUrl: string;
  setView: (v: Store["view"]) => void;
  setApiUrl: (url: string) => void;
};
const useStore = create<Store>()(
  persist(
    (set) => ({
      view: "bar",
      apiUrl: "https://dummyjson.com/products",
      setView: (view) => set({ view }),
      setApiUrl: (apiUrl) => set({ apiUrl }),
    }),
    { name: "dashboard-store" }
  )
);

// Fetch via proxy
const fetchData = async (url: string) => {
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Page() {
  const { view, setView, apiUrl } = useStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["data", apiUrl],
    queryFn: () => fetchData(apiUrl),
  });

  // Sync URL ?view=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("view") as Store["view"];
    if (v && ["bar", "pie", "heatmap"].includes(v)) setView(v);
  }, [setView]);

  useEffect(() => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("view", view);
    window.history.replaceState({}, "", newUrl);
  }, [view]);

  const products = data?.products || [];

  // Nivo Bar: Price vs Rating
  const barData = products.slice(0, 10).map((p: any) => ({
    id: p.title.slice(0, 20),
    price: p.price,
    rating: p.rating,
  }));

  // ECharts Pie: Category Distribution
  const pieData = products.reduce((acc: Record<string, number>, p: any) => {
    const cat = p.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieOption = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: Object.entries(pieData).map(([name, value]) => ({ name, value })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" } },
      },
    ],
  };

  // Nivo Heatmap: Fake correlation matrix
  const heatmapData = Array.from({ length: 7 }, (_, i) => ({
    id: `Day ${i + 1}`,
    data: Array.from({ length: 24 }, (_, h) => ({
      x: `${h}:00`,
      y: Math.floor(Math.random() * 100),
    })),
  }));

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Product Dashboard</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["data", apiUrl] })}
            >
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

        <Tabs value={view} onValueChange={(v) => setView(v as Store["view"])} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
            <TabsTrigger value="bar">Bar (Nivo)</TabsTrigger>
            <TabsTrigger value="pie">Pie (ECharts)</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap (Nivo)</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Price vs Rating (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-96 w-full" />
                ) : error ? (
                  <p className="text-red-500">Error loading data</p>
                ) : (
                  <div className="h-96">
                    <ResponsiveBar
                      data={barData}
                      keys={["price", "rating"]}
                      indexBy="id"
                      margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
                      padding={0.3}
                      valueScale={{ type: "linear" }}
                      indexScale={{ type: "band", round: true }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: "Product",
                        legendPosition: "middle",
                        legendOffset: 50,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        legend: "Value",
                        legendPosition: "middle",
                        legendOffset: -40,
                      }}
                      legends={[
                        {
                          dataFrom: "keys",
                          anchor: "bottom-right",
                          direction: "column",
                          translateX: 120,
                          itemWidth: 100,
                          itemHeight: 20,
                        },
                      ]}
                      role="application"
                      ariaLabel="Bar chart of price and rating"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pie" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-96 w-full" />
                ) : (
                  <div className="h-96">
                    <ReactECharts option={pieOption} style={{ height: "100%", width: "100%" }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Heatmap (Sample)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveHeatMap
                    data={heatmapData}
                    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                    colors={{ type: "sequential", scheme: "purples", minValue: 0, maxValue: 100 }}
                    axisTop={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -90,
                      legend: "Hour",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      legend: "Day",
                      legendPosition: "middle",
                      legendOffset: -60,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
