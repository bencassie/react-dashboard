"use client";
import { memo } from "react";
import { ResponsiveAreaBump } from "@nivo/bump";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function NivoAreaChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Area Chart";

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

  const areaData = data || [];

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveAreaBump
            data={areaData}
            margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
            spacing={8}
            colors={{ scheme: "nivo" }}
            blendMode="multiply"
            fillOpacity={0.85}
            activeFillOpacity={1}
            inactiveFillOpacity={0.15}
            borderWidth={3}
            borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const NivoAreaChart = memo(NivoAreaChartInner);
NivoAreaChart.displayName = "NivoAreaChart";
export default NivoAreaChart;
