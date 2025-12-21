"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsLineChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Line Chart";
  const xKey = options?.xKey || "x";
  const yKey = options?.yKey || "y";
  const xLabel = options?.xLabel || "";

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-96 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent><p className="text-red-500">Error loading data</p></CardContent>
      </Card>
    );
  }

  const lineData = data || [];
  const lineOption = {
    xAxis: {
      type: "category",
      data: lineData.map((item: any) => item[xKey] || xLabel.replace("${id}", item.id)),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: lineData.map((item: any) => item[yKey]),
        type: "line",
        smooth: true,
      },
    ],
    tooltip: { trigger: "axis" },
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={lineOption} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const EchartsLineChart = memo(EchartsLineChartInner);
EchartsLineChart.displayName = "EchartsLineChart";
export default EchartsLineChart;