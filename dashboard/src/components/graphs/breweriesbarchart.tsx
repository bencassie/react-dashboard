"use client";
import { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";


function BreweriesBarChartInner({ data, isLoading, error }: ChartComponentProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>Open Brewery DB: Breweries by State (Top 10)</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-96 w-full" /></CardContent>
            </Card>
        );
    }
    if (error) {
        return (
            <Card>
                <CardHeader><CardTitle>Open Brewery DB: Breweries by State (Top 10)</CardTitle></CardHeader>
                <CardContent><p className="text-red-500">Error loading data</p></CardContent>
            </Card>
        );
    }


    return (
        <Card>
            <CardHeader><CardTitle>Open Brewery DB: Breweries by State (Top 10)</CardTitle></CardHeader>
            <CardContent>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="state" angle={-30} textAnchor="end" interval={0} height={60} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}


const BreweriesBarChart = memo(BreweriesBarChartInner);
BreweriesBarChart.displayName = "BreweriesBarChart";
export default BreweriesBarChart;