"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsBarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Bar Chart";
  const xKey = options?.xKey || "name";
  const yKey = options?.yKey || "value";

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

  const barData = useMemo(() => data || [], [data]);

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: barData.map((item: any) => item[xKey]),
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: "value" },
    series: [{ data: barData.map((item: any) => item[yKey]), type: "bar" }],
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const EchartsBarChart = memo(EchartsBarChartInner);
EchartsBarChart.displayName = "EchartsBarChart";
export default EchartsBarChart;
