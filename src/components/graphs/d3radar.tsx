"use client";
import { memo, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";
import { PASTEL_COLORS } from "@/lib/charts/colors";

function D3RadarChartInner({ data, isLoading, error, options }: ChartComponentProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const title = options?.title || "Radar Chart";
  const dims = { width: 600, height: 500, margin: 80 };
  const series = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (!ref.current || !series?.length) return;

    const { width, height, margin } = dims;
    const radius = Math.min(width, height) / 2 - margin;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Extract metrics and data
    const firstItem = series[0] || {};
    const metrics = Object.keys(firstItem).filter(k => k !== 'name' && typeof firstItem[k] === 'number');
    const angleStep = (2 * Math.PI) / series.length;

    // Create radial scale for each metric
    const maxValues = metrics.map(metric => d3.max(series, (d: any) => d[metric]) || 100);
    const globalMax = Math.max(...maxValues);
    const rScale = d3.scaleLinear().domain([0, globalMax]).range([0, radius]);

    // Draw circular grid lines
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      g.append("circle")
        .attr("r", (radius / levels) * i)
        .attr("fill", "none")
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1);
    }

    // Draw axes for each Pokemon
    series.forEach((item: any, i: number) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#999")
        .attr("stroke-width", 1);

      g.append("text")
        .attr("x", x * 1.15)
        .attr("y", y * 1.15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .text(item.name);
    });

    // Draw polygon for each metric
    metrics.forEach((metric, metricIdx) => {
      const points: [number, number][] = series.map((item: any, i: number) => {
        const angle = angleStep * i - Math.PI / 2;
        const value = item[metric] || 0;
        const r = rScale(value);
        return [Math.cos(angle) * r, Math.sin(angle) * r];
      });

      const lineGenerator = d3.line()
        .x(d => d[0])
        .y(d => d[1]);

      g.append("path")
        .datum([...points, points[0]]) // Close the path
        .attr("d", lineGenerator as any)
        .attr("fill", PASTEL_COLORS[metricIdx % PASTEL_COLORS.length])
        .attr("fill-opacity", 0.3)
        .attr("stroke", PASTEL_COLORS[metricIdx % PASTEL_COLORS.length])
        .attr("stroke-width", 2);
    });

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${-radius}, ${radius * 0.8})`);

    metrics.forEach((metric, idx) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${idx * 20})`);

      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", PASTEL_COLORS[idx % PASTEL_COLORS.length]);

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size", "12px")
        .text(metric);
    });

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
        <svg ref={ref} className="w-full h-[500px]" />
      </CardContent>
    </Card>
  );
}

const D3RadarChart = memo(D3RadarChartInner);
D3RadarChart.displayName = "D3RadarChart";
export default D3RadarChart;
