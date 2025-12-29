"use client";
import { memo, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

function D3AreaChartInner({ data, isLoading, error, options, renderKey }: ChartComponentProps) {
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const title = options?.title || "Area Chart";
  const xKey = options?.xKey || "date";
  const yKey = options?.yKey || "count";
  const dims = { width: 800, height: 360, margin: { top: 20, right: 20, bottom: 70, left: 40 } };
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

    const x = d3
      .scaleUtc()
      .domain(d3.extent(series, (d: any) => d[xKey]) as unknown as [Date, Date])
      .range([0, innerW]);

    const yMax = d3.max(series, (d: any) => Number(d[yKey]) || 0) || 100;
    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerH, 0]);

    const area = d3
      .area<any>()
      .x((d) => x(d[xKey]))
      .y0(innerH)
      .y1((d) => y(Number(d[yKey]) || 0));

    g.append("path")
      .datum(series)
      .attr("d", area as any)
      .attr("fill", PASTEL_COLORS[0])
      .attr("opacity", 0.6);

    const line = d3
      .line<any>()
      .x((d) => x(d[xKey]))
      .y((d) => y(Number(d[yKey]) || 0));

    g.append("path")
      .datum(series)
      .attr("d", line as any)
      .attr("fill", "none")
      .attr("stroke", PASTEL_COLORS[0])
      .attr("stroke-width", 2);

    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");
    g.append("g").call(d3.axisLeft(y));
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

const D3AreaChart = memo(D3AreaChartInner);
D3AreaChart.displayName = "D3AreaChart";
export default D3AreaChart;