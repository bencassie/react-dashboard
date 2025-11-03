"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const Plot = dynamic(async () => {
  const PlotComponent = createPlotlyComponent(Plotly);
  return (props: any) => <PlotComponent {...props} />;
}, { ssr: false });

function PlotlyScatterChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Scatter Plot";
  const xKey = options?.xKey || "x";
  const yKey = options?.yKey || "y";
  const textKey = options?.textKey || "name";

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

  const x = data?.map((p: any) => p[xKey]) ?? [];
  const y = data?.map((p: any) => p[yKey]) ?? [];
  const text = data?.map((p: any) => p[textKey]) ?? [];

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Plot
            data={[{ x, y, text, type: "scatter", mode: "markers" }]}
            layout={{ autosize: true, title: undefined, margin: { t: 20, r: 10, l: 40, b: 40 } }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
            config={{ displayModeBar: false }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const PlotlyScatterChart = memo(PlotlyScatterChartInner);
PlotlyScatterChart.displayName = "PlotlyScatterChart";
export default PlotlyScatterChart;