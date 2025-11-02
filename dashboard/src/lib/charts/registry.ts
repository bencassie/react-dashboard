import dynamic from "next/dynamic";
import type { ChartConfig } from "./types";
import {
  transformProductsForBarChart,
  transformProductsForPieChart,
  transformForHeatmap,
} from "./transforms";

// Dynamically import chart components
const BarChart = dynamic(() => import("@/components/graphs/BarChart"), {
  ssr: false,
});
const PieChart = dynamic(() => import("@/components/graphs/PieChart"), {
  ssr: false,
});
const HeatmapChart = dynamic(() => import("@/components/graphs/HeatmapChart"), {
  ssr: false,
});

/**
 * Central registry of all available charts
 * 
 * To add a new chart:
 * 1. Create the chart component in /components/graphs
 * 2. Create a transform function in transforms.ts
 * 3. Add a new ChartConfig object to this array
 */
export const chartRegistry: ChartConfig[] = [
  {
    name: "Bar Chart",
    displayName: "Price vs Rating (Top 10)",
    apiConfig: {
      endpoint: "https://dummyjson.com/products",
      queryKey: ["products", "bar"],
      transform: transformProductsForBarChart,
    },
    Component: BarChart,
  },
  {
    name: "Pie Chart",
    displayName: "Category Distribution",
    apiConfig: {
      endpoint: "https://dummyjson.com/products",
      queryKey: ["products", "pie"],
      transform: transformProductsForPieChart,
    },
    Component: PieChart,
  },
  {
    name: "Heatmap Chart",
    displayName: "Activity Heatmap (Sample)",
    apiConfig: {
      // Heatmap doesn't need real API data, but we keep the structure consistent
      endpoint: "",
      queryKey: ["heatmap", "sample"],
      transform: transformForHeatmap,
    },
    Component: HeatmapChart,
  },
];

/**
 * Helper to get a chart config by name
 */
export function getChartByName(name: string): ChartConfig | undefined {
  return chartRegistry.find((chart) => chart.name === name);
}

/**
 * Helper to get all chart names
 */
export function getAllChartNames(): string[] {
  return chartRegistry.map((chart) => chart.name);
}