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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartJsBarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Bar Chart";
  const labelKey = options?.labelKey || "name";
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
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
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
