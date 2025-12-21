"use client";
import { memo } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function RechartsRadarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
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

  // For Pokemon radar: data = [{name: "bulbasaur", height: 7, weight: 69, baseExp: 64}, ...]
  // We need to create one Radar component per Pokemon
  const firstItem = data?.[0] || {};
  const metrics = Object.keys(firstItem).filter(k => k !== 'name' && typeof firstItem[k] === 'number');

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              {metrics.map((metric, idx) => (
                <Radar
                  key={metric}
                  name={metric}
                  dataKey={metric}
                  stroke={`hsl(${idx * 120}, 70%, 50%)`}
                  fill={`hsl(${idx * 120}, 70%, 50%)`}
                  fillOpacity={0.3}
                />
              ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const RechartsRadarChart = memo(RechartsRadarChartInner);
RechartsRadarChart.displayName = "RechartsRadarChart";
export default RechartsRadarChart;
