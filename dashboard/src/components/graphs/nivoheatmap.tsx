"use client";
import { useMemo, memo } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartComponentProps } from "@/lib/charts/types";

function NivoHeatmapChartInner({ data, options }: ChartComponentProps) {
  const title = options?.title || "Heatmap";
  const xAxisLabel = options?.xAxisLabel || "X";
  const yAxisLabel = options?.yAxisLabel || "Y";

  const heatmapData = useMemo(() => data || [], [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveHeatMap
            data={heatmapData}
            margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
            colors={{ type: "sequential", scheme: "purples", minValue: 0, maxValue: 100 }}
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -90,
              legend: xAxisLabel,
              legendPosition: "middle",
              legendOffset: -40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: yAxisLabel,
              legendPosition: "middle",
              legendOffset: -60,
            }}
            pixelRatio={1}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const NivoHeatmapChart = memo(NivoHeatmapChartInner);
NivoHeatmapChart.displayName = "NivoHeatmapChart";
export default NivoHeatmapChart;