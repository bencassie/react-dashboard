"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsRadarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Radar Chart";
  const indicators = options?.indicators || [];

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

  const radarData = useMemo(() => data || [], [data]);

  const option = {
    tooltip: { trigger: "item" },
    radar: {
      indicator: indicators.length > 0 ? indicators : radarData.map((item: any) => ({ name: item.name, max: item.max || 100 })),
    },
    series: [
      {
        type: "radar",
        data: radarData,
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

const EchartsRadarChart = memo(EchartsRadarChartInner);
EchartsRadarChart.displayName = "EchartsRadarChart";
export default EchartsRadarChart;
