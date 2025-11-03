"use client";
import { memo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function TodoBarChartInner({ data, isLoading, error }: ChartComponentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Todo Completion Status</CardTitle>
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
          <CardTitle>Todo Completion Status</CardTitle>
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
        <CardTitle>Todo Completion Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveBar
            data={barData}
            keys={["count"]}
            indexBy="status"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              legend: "Status",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: "Count",
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
            ariaLabel="Bar chart of todo completion status"
          />
        </div>
      </CardContent>
    </Card>
  );
}

const TodoBarChart = memo(TodoBarChartInner);
TodoBarChart.displayName = "TodoBarChart";
export default TodoBarChart;