import dynamic from "next/dynamic";
import type { ChartConfig } from "./types";
import {
  transformProductsForBarChart,
  transformProductsForPieChart,
  transformForHeatmap,
  transformProductsForBrandBar,
  transformUsersForGenderPie,
  transformTodosForBar,
  transformPostsForBar,
  transformCartsForLine,
} from "./transforms";

// Dynamically import chart components
const BarChart = dynamic(() => import("@/components/graphs/barchart"), {
  ssr: false,
});
const PieChart = dynamic(() => import("@/components/graphs/piechart"), {
  ssr: false,
});
const HeatmapChart = dynamic(() => import("@/components/graphs/heatmapchart"), {
  ssr: false,
});
const BrandBarChart = dynamic(() => import("@/components/graphs/brandbarchart"), {
  ssr: false,
});
const GenderPieChart = dynamic(() => import("@/components/graphs/genderpiechart"), {
  ssr: false,
});
const TodoBarChart = dynamic(() => import("@/components/graphs/todobarchart"), {
  ssr: false,
});
const PostBarChart = dynamic(() => import("@/components/graphs/postbarchart"), {
  ssr: false,
});
const CartLineChart = dynamic(() => import("@/components/graphs/cartlinechart"), {
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
  {
    name: "Brand Bar Chart",
    displayName: "Top Brands by Product Count",
    apiConfig: {
      endpoint: "https://dummyjson.com/products",
      queryKey: ["products", "brands"],
      transform: transformProductsForBrandBar,
    },
    Component: BrandBarChart,
  },
  {
    name: "Gender Pie Chart",
    displayName: "User Gender Distribution",
    apiConfig: {
      endpoint: "https://dummyjson.com/users",
      queryKey: ["users", "gender"],
      transform: transformUsersForGenderPie,
    },
    Component: GenderPieChart,
  },
  {
    name: "Todo Bar Chart",
    displayName: "Todo Completion Status",
    apiConfig: {
      endpoint: "https://dummyjson.com/todos",
      queryKey: ["todos", "status"],
      transform: transformTodosForBar,
    },
    Component: TodoBarChart,
  },
  {
    name: "Post Bar Chart",
    displayName: "Top Posts by Reactions (Top 5)",
    apiConfig: {
      endpoint: "https://dummyjson.com/posts",
      queryKey: ["posts", "reactions"],
      transform: transformPostsForBar,
    },
    Component: PostBarChart,
  },
  {
    name: "Cart Line Chart",
    displayName: "Cart Totals Over Time",
    apiConfig: {
      endpoint: "https://dummyjson.com/carts",
      queryKey: ["carts", "totals"],
      transform: transformCartsForLine,
    },
    Component: CartLineChart,
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