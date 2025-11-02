import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GraphModule } from "./types";
import { useState, useEffect, ComponentType } from "react";

// Consistent loading fallback for dynamic imports (matches Suspense)
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

// Wrapper that shows skeleton during initial mount (fixes remount issue)
function withMountDelay<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      // Small delay to ensure skeleton shows before chart renders
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    }, []);

    if (!isMounted) {
      return <ChartLoadingFallback />;
    }

    return <Component {...props} />;
  };
}

// Lazy-load all charts with SSR disabled; use consistent skeleton
const BarChartBase = dynamic(() => import("./barchart"), { 
  ssr: false,
  loading: ChartLoadingFallback
});
const PieChartBase = dynamic(() => import("./piechart"), { 
  ssr: false,
  loading: ChartLoadingFallback
});
const HeatmapChartBase = dynamic(() => import("./heatmapchart"), { 
  ssr: false,
  loading: ChartLoadingFallback
});

// Wrap with mount delay to show skeleton on remount
const BarChart = withMountDelay(BarChartBase);
const PieChart = withMountDelay(PieChartBase);
const HeatmapChart = withMountDelay(HeatmapChartBase);

export const graphs: GraphModule[] = [
  { name: "Bar Chart", Component: BarChart },
  { name: "Pie Chart", Component: PieChart },
  { name: "Heatmap Chart", Component: HeatmapChart },
];