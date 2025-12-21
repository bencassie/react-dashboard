"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsPieChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Pie Chart";
  const radius = options?.radius || "60%";

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

  const pieData = (data || []).map((item: any, index: number) => ({
    ...item,
    itemStyle: {
      color: PASTEL_COLORS[index % PASTEL_COLORS.length]
    }
  }));

  const pieOption = {
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
        radius: radius,
        data: pieData,
        label: {
          show: true,
          formatter: "{b}: {d}%",
          color: "#000"
        },
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
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={pieOption} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const EchartsPieChart = memo(EchartsPieChartInner);
EchartsPieChart.displayName = "EchartsPieChart";
export default EchartsPieChart;