"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsScatterChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Scatter Chart";
  const xKey = options?.xKey || "x";
  const yKey = options?.yKey || "y";

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

  const scatterData = useMemo(() => data || [], [data]);

  const option = {
    tooltip: { trigger: "item" },
    xAxis: { type: "value" },
    yAxis: { type: "value" },
    series: [
      {
        data: scatterData.map((item: any) => [item[xKey], item[yKey]]),
        type: "scatter",
        symbolSize: 10,
      },
    ],
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

const EchartsScatterChart = memo(EchartsScatterChartInner);
EchartsScatterChart.displayName = "EchartsScatterChart";
export default EchartsScatterChart;
