"use client";
import { useMemo, memo } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function NivoHeatmap2ChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Heatmap";
  const xAxisLabel = options?.xAxisLabel || "X";
  const yAxisLabel = options?.yAxisLabel || "Y";

  const heatmapData = useMemo(() => data || [], [data]);

  const margin = useMemo(() => ({ top: 60, right: 90, bottom: 60, left: 90 }), []);

  const axisTop = useMemo(() => ({
    tickSize: 5,
    tickPadding: 5,
    tickRotation: -90,
    legend: xAxisLabel,
    legendPosition: "middle" as const,
    legendOffset: -40,
  }), [xAxisLabel]);

  const axisLeft = useMemo(() => ({
    tickSize: 5,
    tickPadding: 5,
    legend: yAxisLabel,
    legendPosition: "middle" as const,
    legendOffset: -60,
  }), [yAxisLabel]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveHeatMap
            data={heatmapData}
            margin={margin}
            colors={{ type: "sequential", scheme: "blues", minValue: 0, maxValue: 100 }}
            axisTop={axisTop}
            axisLeft={axisLeft}
            pixelRatio={1}
            animate={false}
            enableLabels={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const NivoHeatmap2Chart = memo(NivoHeatmap2ChartInner);
NivoHeatmap2Chart.displayName = "NivoHeatmap2Chart";
export default NivoHeatmap2Chart;
