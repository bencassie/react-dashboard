"use client";
import { memo, useMemo } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

function NivoScatterChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Scatter Chart";
  const xKey = options?.xKey || "x";
  const yKey = options?.yKey || "y";

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

  const scatterData = useMemo(() => {
    return [{
      id: "data",
      data: (data || []).map((item: any) => ({
        x: item[xKey],
        y: item[yKey],
      }))
    }];
  }, [data, xKey, yKey]);

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveScatterPlot
            data={scatterData}
            colors={[PASTEL_COLORS[4]]}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: xKey,
              legendPosition: "middle",
              legendOffset: 46,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: yKey,
              legendPosition: "middle",
              legendOffset: -60,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const NivoScatterChart = memo(NivoScatterChartInner);
NivoScatterChart.displayName = "NivoScatterChart";
export default NivoScatterChart;
