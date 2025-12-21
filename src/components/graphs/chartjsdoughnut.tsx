"use client";
import { memo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS_RGBA, PASTEL_COLORS_BORDER } from "@/lib/charts/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartJsDoughnutChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Doughnut Chart";

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
  const labels = chartData.map((d: any) => d.name);
  const values = chartData.map((d: any) => d.value);

  const ds = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: PASTEL_COLORS_RGBA,
        borderColor: PASTEL_COLORS_BORDER,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Doughnut data={ds} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

const ChartJsDoughnutChart = memo(ChartJsDoughnutChartInner);
ChartJsDoughnutChart.displayName = "ChartJsDoughnutChart";
export default ChartJsDoughnutChart;
