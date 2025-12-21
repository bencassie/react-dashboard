"use client";
import { memo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

function RechartsScatterChartInner({ data, isLoading, error, options }: ChartComponentProps) {
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

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" dataKey={xKey} name={xKey} />
              <YAxis type="number" dataKey={yKey} name={yKey} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="Data"
                data={data}
                fill={PASTEL_COLORS[3]}
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const RechartsScatterChart = memo(RechartsScatterChartInner);
RechartsScatterChart.displayName = "RechartsScatterChart";
export default RechartsScatterChart;
