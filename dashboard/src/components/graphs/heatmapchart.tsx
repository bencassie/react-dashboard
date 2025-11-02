"use client";
import { useMemo } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const isDev = process.env.NODE_ENV === "development";
const getTimestamp = () => new Date().toISOString();
export default function HeatmapChart() {
  if (isDev) {
    console.log(`[${getTimestamp()}] HeatmapChart render begin`);
  }
  const heatmapData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: `Day ${i + 1}`,
        data: Array.from({ length: 24 }, (_, h) => ({
          x: `${h}:00`,
          y: Math.floor(Math.random() * 100),
        })),
      })),
    []
  );
 
  if (isDev) {
    console.log(`[${getTimestamp()}] HeatmapChart render end`);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap (Sample)</CardTitle>
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
              legend: "Hour",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: "Day",
              legendPosition: "middle",
              legendOffset: -60,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}