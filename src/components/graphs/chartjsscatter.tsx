"use client";
import { memo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS_RGBA, PASTEL_COLORS_BORDER } from "@/lib/charts/colors";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function ChartJsScatterChartInner({ data, isLoading, error, options }: ChartComponentProps) {
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

  const scatterData = (data || []).map((item: any) => ({
    x: item[xKey],
    y: item[yKey],
  }));

  const chartData = {
    datasets: [
      {
        label: "Data",
        data: scatterData,
        backgroundColor: PASTEL_COLORS_RGBA[5],
        borderColor: PASTEL_COLORS_BORDER[5],
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
      },
      y: {
        type: "linear" as const,
      },
    },
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Scatter data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

const ChartJsScatterChart = memo(ChartJsScatterChartInner);
ChartJsScatterChart.displayName = "ChartJsScatterChart";
export default ChartJsScatterChart;
