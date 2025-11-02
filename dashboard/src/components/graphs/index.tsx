import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GraphModule } from "./types";

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

// Lazy-load all charts with SSR disabled; use consistent skeleton
const BarChart = dynamic(() => import("./barchart"), { 
  ssr: false,
  loading: ChartLoadingFallback
});
const PieChart = dynamic(() => import("./piechart"), { 
  ssr: false,
  loading: ChartLoadingFallback
});
const HeatmapChart = dynamic(() => import("./heatmapchart"), { 
  ssr: false,
  loading: ChartLoadingFallback
});

export const graphs: GraphModule[] = [
  { name: "Bar Chart", Component: BarChart },
  { name: "Pie Chart", Component: PieChart },
  { name: "Heatmap Chart", Component: HeatmapChart },
];