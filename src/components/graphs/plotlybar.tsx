"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

const Plot = dynamic(async () => {
  const PlotComponent = createPlotlyComponent(Plotly);
  return (props: any) => <PlotComponent {...props} />;
}, { ssr: false });

function PlotlyBarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Bar Chart";
  const xKey = options?.xKey || "name";
  const yKey = options?.yKey || "value";

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

  const x = data?.map((p: any) => String(p[xKey] ?? "")) ?? [];
  const y = data?.map((p: any) => Number(p[yKey]) || 0) ?? [];

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Plot
            data={[{
              x,
              y,
              type: "bar",
              marker: {
                color: x.map((_: string, i: number) => PASTEL_COLORS[i % PASTEL_COLORS.length])
              }
            }]}
            layout={{
              autosize: true,
              title: undefined,
              margin: { t: 20, r: 10, l: 40, b: 40 },
              xaxis: { fixedrange: true },
              yaxis: { fixedrange: true }
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
            config={{ displayModeBar: false }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const PlotlyBarChart = memo(PlotlyBarChartInner);
PlotlyBarChart.displayName = "PlotlyBarChart";
export default PlotlyBarChart;

