"use client";
import { memo, useMemo } from "react";
import { VegaLite } from "react-vega";
import type { VisualizationSpec } from "vega-lite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function OpenLibraryDonutChartInner({ data, isLoading, error }: ChartComponentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-96 w-full" /></CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
        <CardContent><p className="text-red-500">Error loading data</p></CardContent>
      </Card>
    );
  }

  const spec: VisualizationSpec = useMemo(() => ({
    width: "container",
    height: 360,
    autosize: { type: "fit", contains: "padding" },
    mark: { type: "arc", innerRadius: 100 },
    encoding: {
      theta: { field: "value", type: "quantitative" },
      color: { field: "name", type: "nominal", legend: { orient: "right" } },
      tooltip: [{ field: "name" }, { field: "value" }],
    },
    data: { name: "table" },
  }), []);

  const vegaData = { table: Array.isArray(data) ? data : [] };

  return (
    <Card>
      <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          {vegaData.table.length === 0 ? (
            <div className="text-sm text-muted-foreground">No data.</div>
          ) : (
            <VegaLite spec={spec} data={vegaData} actions={false} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const OpenLibraryDonutChart = memo(OpenLibraryDonutChartInner);
OpenLibraryDonutChart.displayName = "OpenLibraryDonutChart";
export default OpenLibraryDonutChart;
