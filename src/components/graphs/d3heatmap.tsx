"use client";
import { memo, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function D3HeatmapChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const title = options?.title || "Heatmap";
  const dims = { width: 800, height: 360, margin: { top: 60, right: 20, bottom: 60, left: 80 } };
  const series = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (!ref.current || !series?.length) return;

    const { width, height, margin } = dims;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract unique x and y values
    const xValues = Array.from(new Set(series.flatMap((d: any) => d.data?.map((item: any) => item.x) || [])));
    const yValues = series.map((d: any) => d.id);

    // Flatten data for D3
    const flatData: { x: string; y: string; value: number }[] = [];
    series.forEach((row: any) => {
      row.data?.forEach((cell: any) => {
        flatData.push({
          x: cell.x,
          y: row.id,
          value: cell.y || 0
        });
      });
    });

    // Create scales
    const xScale = d3.scaleBand()
      .domain(xValues)
      .range([0, innerW])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(yValues)
      .range([0, innerH])
      .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(flatData, d => d.value) || 100]);

    // Draw rectangles
    g.selectAll("rect")
      .data(flatData)
      .join("rect")
      .attr("x", d => xScale(d.x) || 0)
      .attr("y", d => yScale(d.y) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(yScale));

  }, [series]);

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
        <svg ref={ref} className="w-full h-96" />
      </CardContent>
    </Card>
  );
}

const D3HeatmapChart = memo(D3HeatmapChartInner);
D3HeatmapChart.displayName = "D3HeatmapChart";
export default D3HeatmapChart;
