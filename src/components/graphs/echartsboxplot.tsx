"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EChartsBoxPlotInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Box Plot";

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

  const chartOption = useMemo(() => {
    if (!data || !data.categories || !data.values) return {};

    return {
      tooltip: { trigger: "item" },
      xAxis: {
        type: "category",
        data: data.categories
      },
      yAxis: {
        type: "value"
      },
      series: [{
        type: "boxplot",
        data: data.values
      }]
    };
  }, [data]);

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={chartOption} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const EChartsBoxPlot = memo(EChartsBoxPlotInner);
EChartsBoxPlot.displayName = "EChartsBoxPlot";
export default EChartsBoxPlot;
