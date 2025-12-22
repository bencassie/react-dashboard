"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function EchartsHeatmapChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Heatmap";

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
    const rawData = data || [];

    // Extract unique x and y values
    const xValues = Array.from(new Set(rawData.flatMap((d: any) => d.data?.map((item: any) => item.x) || [])));
    const yValues = Array.from(new Set(rawData.map((d: any) => d.id))).reverse(); // Reverse to show Day 1 at top

    // Transform data to ECharts format: [[xIndex, yIndex, value], ...]
    const heatmapData: [number, number, number][] = [];
    rawData.forEach((row: any, yIndex: number) => {
      row.data?.forEach((cell: any) => {
        const xIndex = xValues.indexOf(cell.x);
        // Since yValues is reversed, find the correct index in the reversed array
        const reversedYIndex = yValues.indexOf(row.id);
        heatmapData.push([xIndex, reversedYIndex, cell.y || 0]);
      });
    });

    return {
      tooltip: {
        position: "top"
      },
      grid: {
        height: "70%",
        top: "10%",
        left: "10%",
        right: "10%"
      },
      xAxis: {
        type: "category",
        data: xValues,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: "category",
        data: yValues,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "5%",
        inRange: {
          color: ["#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
        }
      },
      series: [
        {
          type: "heatmap",
          data: heatmapData,
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
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

const EchartsHeatmapChart = memo(EchartsHeatmapChartInner);
EchartsHeatmapChart.displayName = "EchartsHeatmapChart";
export default EchartsHeatmapChart;
