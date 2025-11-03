"use client";
import { memo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function RechartsLineChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Line Chart";
  const labelKey = options?.labelKey || "label";
  const dataKey = options?.dataKey || "value";
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

  const labels = data?.map((d: any) => d[labelKey]) ?? [];
  const values = data?.map((d: any) => d[dataKey]) ?? [];

  const ds = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: values,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Line data={ds} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

const RechartsLineChart = memo(RechartsLineChartInner);
RechartsLineChart.displayName = "RechartsLineChart";
export default RechartsLineChart;