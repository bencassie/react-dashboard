"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function PieChartInner({ data, isLoading, error }: ChartComponentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading data</p>
        </CardContent>
      </Card>
    );
  }

  // Data is now pre-transformed from the registry!
  // It's already in the format: [{ name, value }, ...]
  const pieData = data || [];

  const pieOption = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.5)",
          },
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={pieOption} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const PieChart = memo(PieChartInner);
PieChart.displayName = "PieChart";
export default PieChart;