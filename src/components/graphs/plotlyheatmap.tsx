"use client";
import { memo, useMemo } from "react";
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

function PlotlyHeatmapChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Heatmap";

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

  const { xValues, yValues, zValues } = useMemo(() => {
    const rawData = data || [];

    // Extract x and y values
    const xVals = Array.from(new Set(rawData.flatMap((d: any) => d.data?.map((item: any) => item.x) || [])));
    const yVals = rawData.map((d: any) => d.id);

    // Build z matrix (y rows x x columns)
    const zVals: number[][] = rawData.map((row: any) => {
      return xVals.map(xVal => {
        const cell = row.data?.find((item: any) => item.x === xVal);
        return cell?.y || 0;
      });
    });

    return { xValues: xVals, yValues: yVals, zValues: zVals };
  }, [data]);

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Plot
            data={[{
              x: xValues,
              y: yValues,
              z: zValues,
              type: "heatmap",
              colorscale: "YlGnBu"
            }]}
            layout={{
              autosize: true,
              title: undefined,
              margin: { t: 40, r: 40, l: 80, b: 60 },
              xaxis: { side: "bottom" },
              yaxis: { autorange: "reversed" }
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

const PlotlyHeatmapChart = memo(PlotlyHeatmapChartInner);
PlotlyHeatmapChart.displayName = "PlotlyHeatmapChart";
export default PlotlyHeatmapChart;
