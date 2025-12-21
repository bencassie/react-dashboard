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

  const radarData = useMemo(() => {
    // Check if data is in the special radar format with indicator/data
    if (data && typeof data === 'object' && 'indicator' in data && 'data' in data) {
      return data;
    }
    // Fallback to simple format
    return { indicator: [], data: data || [] };
  }, [data]);

  const option = {
    tooltip: { trigger: "item" },
    legend: {
      data: radarData.data?.map((item: any) => item.name) || [],
    },
    radar: {
      indicator: radarData.indicator?.length > 0
        ? radarData.indicator
        : radarData.data?.map((item: any) => ({ name: item.name, max: item.max || 100 })) || [],
    },
    series: [
      {
        type: "radar",
        data: radarData.data || [],
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
