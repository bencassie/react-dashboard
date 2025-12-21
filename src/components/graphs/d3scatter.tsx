"use client";
import { memo, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

function D3ScatterChartInner({ data, isLoading, error, options, renderKey }: ChartComponentProps) {
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const title = options?.title || "Scatter Chart";
  const xKey = options?.xKey || "x";
  const yKey = options?.yKey || "y";
  const dims = { width: 800, height: 360, margin: { top: 20, right: 20, bottom: 70, left: 50 } };
  const series = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (!svgElement || !series?.length) return;

    const { width, height, margin } = dims;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xExtent = d3.extent(series, (d: any) => Number(d[xKey]) || 0) as [number, number];
    const yExtent = d3.extent(series, (d: any) => Number(d[yKey]) || 0) as [number, number];

    const xScale = d3
      .scaleLinear()
      .domain([Math.min(xExtent[0], 0), xExtent[1]])
      .range([0, innerW])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(yExtent[0], 0), yExtent[1]])
      .range([innerH, 0])
      .nice();

    // Draw circles
    g.selectAll("circle")
      .data(series)
      .join("circle")
      .attr("cx", (d: any) => xScale(Number(d[xKey]) || 0))
      .attr("cy", (d: any) => yScale(Number(d[yKey]) || 0))
      .attr("r", 5)
      .attr("fill", PASTEL_COLORS[6])
      .attr("fill-opacity", 0.7)
      .attr("stroke", PASTEL_COLORS[6])
      .attr("stroke-width", 1);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(d3.axisLeft(yScale));
  }, [series, xKey, yKey, svgElement]);

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
        <svg ref={(el) => setSvgElement(el)} className="w-full h-96" />
      </CardContent>
    </Card>
  );
}

const D3ScatterChart = memo(D3ScatterChartInner);
D3ScatterChart.displayName = "D3ScatterChart";
export default D3ScatterChart;
