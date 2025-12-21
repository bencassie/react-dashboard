"use client";
import { memo, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

function D3BarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const title = options?.title || "Bar Chart";
  const xKey = options?.xKey || "name";
  const yKey = options?.yKey || "value";
  const dims = { width: 800, height: 360, margin: { top: 20, right: 20, bottom: 30, left: 40 } };
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

    const x = d3
      .scaleBand()
      .domain(series.map((d: any) => String(d[xKey])))
      .range([0, innerW])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d: any) => Number(d[yKey]) || 0) || 100])
      .nice()
      .range([innerH, 0]);

    g.selectAll(".bar")
      .data(series)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: any) => x(String(d[xKey])) || 0)
      .attr("y", (d: any) => y(Number(d[yKey]) || 0))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => innerH - y(Number(d[yKey]) || 0))
      .attr("fill", "currentColor")
      .attr("opacity", 0.7);

    g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));
  }, [series, xKey, yKey]);

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

const D3BarChart = memo(D3BarChartInner);
D3BarChart.displayName = "D3BarChart";
export default D3BarChart;
