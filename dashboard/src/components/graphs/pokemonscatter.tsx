"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";


const Plot = dynamic(async () => {
    const PlotComponent = createPlotlyComponent(Plotly);
    return (props: any) => <PlotComponent {...props} />;
}, { ssr: false });


function PokemonScatterInner({ data, isLoading, error }: ChartComponentProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>PokéAPI: Base Experience vs ID</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-96 w-full" /></CardContent>
            </Card>
        );
    }
    if (error) {
        return (
            <Card>
                <CardHeader><CardTitle>PokéAPI: Base Experience vs ID</CardTitle></CardHeader>
                <CardContent><p className="text-red-500">Error loading data</p></CardContent>
            </Card>
        );
    }


    const x = data?.map((p: any) => p.id) ?? [];
    const y = data?.map((p: any) => p.base_experience) ?? [];
    const text = data?.map((p: any) => p.name) ?? [];


    return (
        <Card>
            <CardHeader><CardTitle>PokéAPI: Base Experience vs ID</CardTitle></CardHeader>
            <CardContent>
                <div className="h-96 w-full">
                    <Plot
                        data={[{ x, y, text, type: "scatter", mode: "markers" }]}
                        layout={{ autosize: true, title: undefined, margin: { t: 20, r: 10, l: 40, b: 40 } }}
                        useResizeHandler
                        style={{ width: "100%", height: "100%" }}
                        config={{ displayModeBar: false }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}


const PokemonScatter = memo(PokemonScatterInner);
PokemonScatter.displayName = "PokemonScatter";
export default PokemonScatter;