"use client";
import { useMemo, memo, useEffect, useState } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const isDev = process.env.NODE_ENV === "development";
const getTimestamp = () => new Date().toISOString();

function HeatmapChartInner() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isDev) {
      console.log(`[${getTimestamp()}] HeatmapChart mounted, setting ready`);
    }
    setIsReady(true);
  }, []);

  if (isDev) {
    console.log(`[${getTimestamp()}] HeatmapChart render begin (ready: ${isReady})`);
  }
  if (!isReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap (Sample)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }
  const heatmapData = useMemo(
    () =>
      // Reduced data size for perf: 7 days x 12 hours (84 cells vs 168) – still illustrative
      Array.from({ length: 7 }, (_, i) => ({
        id: `Day ${i + 1}`,
        data: Array.from({ length: 12 }, (_, h) => ({
          x: `${h * 2}:00`, // Every 2 hours for fewer cells
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
            // Enable pixelation for smoother rendering on dense data
            pixelRatio={1}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const HeatmapChart = memo(HeatmapChartInner);
HeatmapChart.displayName = "HeatmapChart";
export default HeatmapChart;