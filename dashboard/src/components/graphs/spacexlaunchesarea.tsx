"use client";
import { memo, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";


function SpaceXLaunchesAreaInner({ data, isLoading, error }: ChartComponentProps) {
    const ref = useRef<SVGSVGElement | null>(null);


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
            .scaleUtc()
            .domain(d3.extent(series, (d: any) => d.date) as [Date, Date])
            .range([0, innerW]);


        const y = d3
            .scaleLinear()
            .domain([0, d3.max(series, (d: any) => d.count)!])
            .nice()
            .range([innerH, 0]);


        const area = d3
            .area<any>()
            .x((d) => x(d.date))
            .y0(innerH)
            .y1((d) => y(d.count));


        g.append("path").datum(series).attr("d", area as any).attr("fill", "currentColor").attr("opacity", 0.2);


        const line = d3
            .line<any>()
            .x((d) => x(d.date))
            .y((d) => y(d.count));


        g.append("path").datum(series).attr("d", line as any).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 2);


        g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
        g.append("g").call(d3.axisLeft(y));
    }, [series]);


    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>SpaceX: Launches per Year</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-96 w-full" /></CardContent>
            </Card>
        );
    }
    if (error) {
        return (
            <Card>
                <CardHeader><CardTitle>SpaceX: Launches per Year</CardTitle></CardHeader>
                <CardContent><p className="text-red-500">Error loading data</p></CardContent>
            </Card>
        );
    }


    return (
        <Card>
            <CardHeader><CardTitle>SpaceX: Launches per Year</CardTitle></CardHeader>
            <CardContent>
                <svg ref={ref} className="w-full h-96" />
            </CardContent>
        </Card>
    );
}


const SpaceXLaunchesArea = memo(SpaceXLaunchesAreaInner);
SpaceXLaunchesArea.displayName = "SpaceXLaunchesArea";
export default SpaceXLaunchesArea;