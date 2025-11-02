"use client";
import { memo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function BarChartInner({ data, isLoading, error }: ChartComponentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price vs Rating (Top 10)</CardTitle>
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
          <CardTitle>Price vs Rating (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading data</p>
        </CardContent>
      </Card>
    );
  }

  // Data is now pre-transformed from the registry!
  // It's already in the format: [{ id, price, rating }, ...]
  const barData = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price vs Rating (Top 10)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveBar
            data={barData}
            keys={["price", "rating"]}
            indexBy="id"
            margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Product",
              legendPosition: "middle",
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: "Value",
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
            ariaLabel="Bar chart of price and rating"
          />
        </div>
      </CardContent>
    </Card>
  );
}

const BarChart = memo(BarChartInner);
BarChart.displayName = "BarChart";
export default BarChart;