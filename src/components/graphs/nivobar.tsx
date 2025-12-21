"use client";
import { memo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function NivoBarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const title = options?.title || "Bar Chart";
  const keys = options?.keys || ["value"];
  const indexBy = options?.indexBy || "id";
  const xAxisLabel = options?.xAxisLabel || "";
  const yAxisLabel = options?.yAxisLabel || "";

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading data</p>
        </CardContent>
      </Card>
    );
  }

  const barData = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveBar
            data={barData}
            keys={keys}
            indexBy={indexBy}
            margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: xAxisLabel,
              legendPosition: "middle",
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: yAxisLabel,
              legendPosition: "middle",
              legendOffset: -40,
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                translateX: 120,
                itemWidth: 100,
                itemHeight: 20,
              },
            ]}
            role="application"
            ariaLabel={`Bar chart: ${title}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const NivoBarChart = memo(NivoBarChartInner);
NivoBarChart.displayName = "NivoBarChart";
export default NivoBarChart;