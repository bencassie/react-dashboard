"use client";
import { memo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);


function WeatherLineChartInner({ data, isLoading, error }: ChartComponentProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>Open‑Meteo: Temperature (°C) Next 24h</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-96 w-full" /></CardContent>
            </Card>
        );
    }
    if (error) {
        return (
            <Card>
                <CardHeader><CardTitle>Open‑Meteo: Temperature (°C) Next 24h</CardTitle></CardHeader>
                <CardContent><p className="text-red-500">Error loading data</p></CardContent>
            </Card>
        );
    }


    const labels = data?.map((d: any) => d.time) ?? [];
    const temps = data?.map((d: any) => d.temp) ?? [];


    const ds = {
        labels,
        datasets: [
            {
                label: "Temp °C",
                data: temps,
                fill: true,
            },
        ],
    };


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" as const } },
        scales: { y: { beginAtZero: false } },
    };


    return (
        <Card>
            <CardHeader><CardTitle>Open‑Meteo: Temperature (°C) Next 24h</CardTitle></CardHeader>
            <CardContent>
                <div className="h-96 w-full">
                    <Line data={ds} options={options} />
                </div>
            </CardContent>
        </Card>
    );
}


const WeatherLineChart = memo(WeatherLineChartInner);
WeatherLineChart.displayName = "WeatherLineChart";
export default WeatherLineChart;