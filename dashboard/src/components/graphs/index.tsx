import dynamic from "next/dynamic";
import { useState, useEffect, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GraphModule } from "./types";

const ChartLoadingFallback = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 w-48 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-96 w-full" />
    </CardContent>
  </Card>
);

// Ensures skeleton shows before chart renders (only on remount/toggle, not initial load)
function withSkeletonDelay<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P & { renderKey?: number }) {
    const [isReady, setIsReady] = useState(false);
    const { renderKey, ...restProps } = props;
    
    // Skip delay on initial render (renderKey 0 or undefined)
    const shouldDelay = renderKey && renderKey > 0;

    useEffect(() => {
      if (shouldDelay) {
        const timer = setTimeout(() => setIsReady(true), 50);
        return () => clearTimeout(timer);
      } else {
        // No delay for initial render
        setIsReady(true);
      }
    }, [shouldDelay]);

    if (shouldDelay && !isReady) {
      return <ChartLoadingFallback />;
    }

    return <Component {...(restProps as P)} />;
  };
}

const BarChartBase = dynamic(() => import("./barchart"), { ssr: false });
const PieChartBase = dynamic(() => import("./piechart"), { ssr: false });
const HeatmapChartBase = dynamic(() => import("./heatmapchart"), { ssr: false });

const BarChart = withSkeletonDelay(BarChartBase);
const PieChart = withSkeletonDelay(PieChartBase);
const HeatmapChart = withSkeletonDelay(HeatmapChartBase);

export const graphs: GraphModule[] = [
  { name: "Bar Chart", Component: BarChart },
  { name: "Pie Chart", Component: PieChart },
  { name: "Heatmap Chart", Component: HeatmapChart },
];