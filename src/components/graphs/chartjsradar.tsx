"use client";
import { memo } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function ChartJsRadarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Radar Chart";
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

  const chartData = data || [];

  // For Pokemon radar: data = [{name: "bulbasaur", height: 7, weight: 69, baseExp: 64}, ...]
  // Extract Pokemon names and metrics
  const labels = chartData.map((d: any) => d.name);
  const firstItem = chartData[0] || {};
  const metrics = Object.keys(firstItem).filter(k => k !== 'name' && typeof firstItem[k] === 'number');

  // Create datasets for each metric
  const colors = [
    { bg: "rgba(255, 99, 132, 0.2)", border: "rgba(255, 99, 132, 1)" },
    { bg: "rgba(54, 162, 235, 0.2)", border: "rgba(54, 162, 235, 1)" },
    { bg: "rgba(255, 206, 86, 0.2)", border: "rgba(255, 206, 86, 1)" },
  ];

  const datasets = metrics.map((metric, idx) => ({
    label: metric,
    data: chartData.map((d: any) => d[metric] || 0),
    backgroundColor: colors[idx % colors.length].bg,
    borderColor: colors[idx % colors.length].border,
    borderWidth: 2,
  }));

  const ds = {
    labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Radar data={ds} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

const ChartJsRadarChart = memo(ChartJsRadarChartInner);
ChartJsRadarChart.displayName = "ChartJsRadarChart";
export default ChartJsRadarChart;
