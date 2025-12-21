"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsDonutChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Donut Chart";
  const innerRadius = options?.innerRadius || "50%";
  const outerRadius = options?.outerRadius || "75%";

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

  const table = useMemo(() => {
    const rawData = data || [];
    return rawData.map((item: any, index: number) => ({
      ...item,
      itemStyle: {
        color: PASTEL_COLORS[index % PASTEL_COLORS.length]
      }
    }));
  }, [data]);

  if (table.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "middle",
      textStyle: {
        color: "#333"
      }
    },
    series: [
      {
        type: "pie",
        radius: [innerRadius, outerRadius],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: "{b}: {d}%",
          color: "#000"
        },
        labelLine: { show: true },
        data: table,
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

const EchartsDonutChart = memo(EchartsDonutChartInner);
EchartsDonutChart.displayName = "EchartsDonutChart";
export default EchartsDonutChart;