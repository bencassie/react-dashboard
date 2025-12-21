"use client";
import { memo, useMemo } from "react";
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

function PlotlyRadarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Radar Chart";

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

  const chartData = useMemo(() => {
    const rawData = data || [];
    if (!rawData.length) return [];

    // Extract Pokemon names and metrics
    const firstItem = rawData[0] || {};
    const metrics = Object.keys(firstItem).filter(k => k !== 'name' && typeof firstItem[k] === 'number');

    // Create traces for each metric
    return metrics.map((metric, idx) => ({
      type: "scatterpolar",
      r: rawData.map((d: any) => d[metric] || 0),
      theta: rawData.map((d: any) => d.name),
      fill: "toself",
      name: metric,
      line: {
        color: PASTEL_COLORS[idx % PASTEL_COLORS.length]
      },
      fillcolor: PASTEL_COLORS[idx % PASTEL_COLORS.length] + "40"
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Plot
            data={chartData as any}
            layout={{
              autosize: true,
              title: undefined,
              margin: { t: 40, r: 40, l: 40, b: 40 },
              polar: {
                radialaxis: {
                  visible: true,
                  range: [0, 250]
                }
              },
              showlegend: true,
              legend: {
                x: 0,
                y: 1
              }
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

const PlotlyRadarChart = memo(PlotlyRadarChartInner);
PlotlyRadarChart.displayName = "PlotlyRadarChart";
export default PlotlyRadarChart;
