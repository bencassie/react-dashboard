"use client";
import { memo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS_RGBA, PASTEL_COLORS_BORDER } from "@/lib/charts/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartJsBarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Bar Chart";
  const xKey = options?.xKey || options?.labelKey || "name";
  const yKey = options?.yKey || options?.dataKey || "value";
  const datasetLabel = options?.datasetLabel || "Data";

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

  const labels = data?.map((d: any) => d[xKey]) ?? [];
  const values = data?.map((d: any) => d[yKey]) ?? [];

  const ds = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: values,
        backgroundColor: values.map((_, i) => PASTEL_COLORS_RGBA[i % PASTEL_COLORS_RGBA.length]),
        borderColor: values.map((_, i) => PASTEL_COLORS_BORDER[i % PASTEL_COLORS_BORDER.length]),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Bar data={ds} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

const ChartJsBarChart = memo(ChartJsBarChartInner);
ChartJsBarChart.displayName = "ChartJsBarChart";
export default ChartJsBarChart;
