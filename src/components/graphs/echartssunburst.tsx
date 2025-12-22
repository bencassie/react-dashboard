"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EChartsSunburstInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Sunburst";

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

  const chartOption = useMemo(() => ({
    tooltip: { trigger: "item" },
    series: [{
      type: "sunburst",
      data: data ? [data] : [],
      radius: ["15%", "90%"],
      label: {
        rotate: "radial"
      }
    }]
  }), [data]);

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

const EChartsSunburst = memo(EChartsSunburstInner);
EChartsSunburst.displayName = "EChartsSunburst";
export default EChartsSunburst;
