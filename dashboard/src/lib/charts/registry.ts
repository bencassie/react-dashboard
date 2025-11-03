// src/lib/charts/registry.ts
import dynamic from "next/dynamic";
import type { ChartConfig } from "./types";
import {
  transformProductsForPriceRatingBar,
  transformProductsForCategoryPie,
  generateSampleHeatmapData,
  transformProductsForBrandCountsBar,
  transformUsersForGenderDistributionPie,
  transformTodosForCompletionStatusBar,
  transformPostsForTopReactionsBar,
  transformCartsForTotalValueLine,
  transformOpenMeteoForHourlyTemperatureLine,
  transformOpenBreweryForStateCountsBar,
  transformOpenLibraryForSubjectWorksDonut,
  transformPokeApiForBaseExperienceScatter,
  transformSpaceXForLaunchesPerYearArea,
} from "./transforms";

// Generic chart components (provider-graphtype naming)
const NivoBarChart = dynamic(() => import("@/components/graphs/nivobar"), { ssr: false });
const EchartsPieChart = dynamic(() => import("@/components/graphs/echartspie"), { ssr: false });
const NivoHeatmapChart = dynamic(() => import("@/components/graphs/nivoheatmap"), { ssr: false });
const EchartsLineChart = dynamic(() => import("@/components/graphs/echartsline"), { ssr: false });
const RechartsLineChart = dynamic(() => import("@/components/graphs/rechartsline"), { ssr: false });
const RechartsBarChart = dynamic(() => import("@/components/graphs/rechartsbar"), { ssr: false });
const EchartsDonutChart = dynamic(() => import("@/components/graphs/echartsdonut"), { ssr: false });
const PlotlyScatterChart = dynamic(() => import("@/components/graphs/plotlyscatter"), { ssr: false });
const D3AreaChart = dynamic(() => import("@/components/graphs/d3area"), { ssr: false });

/**
 * Central registry of all available charts
 * Components are generic, transforms are app-specific
 */
export const chartRegistry: ChartConfig[] = [
  {
    name: "Product Price Rating",
    displayName: "Price vs Rating (Top 10)",
    apiConfig: {
      endpoint: "https://dummyjson.com/products",
      queryKey: ["products", "price-rating"],
      transform: transformProductsForPriceRatingBar,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Price vs Rating (Top 10)",
      keys: ["price", "rating"],
      indexBy: "id",
      xAxisLabel: "Product",
      yAxisLabel: "Value",
    },
  },
  {
    name: "Product Categories",
    displayName: "Category Distribution",
    apiConfig: {
      endpoint: "https://dummyjson.com/products",
      queryKey: ["products", "categories"],
      transform: transformProductsForCategoryPie,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Category Distribution",
      radius: "60%",
    },
  },
  {
    name: "Activity Heatmap",
    displayName: "Activity Heatmap (Sample)",
    apiConfig: {
      endpoint: "",
      queryKey: ["heatmap", "sample"],
      transform: generateSampleHeatmapData,
    },
    Component: NivoHeatmapChart,
    chartOptions: {
      title: "Activity Heatmap (Sample)",
      xAxisLabel: "Hour",
      yAxisLabel: "Day",
    },
  },
  {
    name: "Brand Counts",
    displayName: "Top Brands by Product Count",
    apiConfig: {
      endpoint: "https://dummyjson.com/products",
      queryKey: ["products", "brand-counts"],
      transform: transformProductsForBrandCountsBar,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Top Brands by Product Count",
      keys: ["count"],
      indexBy: "brand",
      xAxisLabel: "Brand",
      yAxisLabel: "Product Count",
    },
  },
  {
    name: "User Gender Distribution",
    displayName: "User Gender Distribution",
    apiConfig: {
      endpoint: "https://dummyjson.com/users",
      queryKey: ["users", "gender"],
      transform: transformUsersForGenderDistributionPie,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "User Gender Distribution",
      radius: "60%",
    },
  },
  {
    name: "Todo Status",
    displayName: "Todo Completion Status",
    apiConfig: {
      endpoint: "https://dummyjson.com/todos",
      queryKey: ["todos", "status"],
      transform: transformTodosForCompletionStatusBar,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Todo Completion Status",
      keys: ["count"],
      indexBy: "status",
      xAxisLabel: "Status",
      yAxisLabel: "Count",
    },
  },
  {
    name: "Post Reactions",
    displayName: "Top Posts by Reactions (Top 5)",
    apiConfig: {
      endpoint: "https://dummyjson.com/posts",
      queryKey: ["posts", "reactions"],
      transform: transformPostsForTopReactionsBar,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Top Posts by Reactions (Top 5)",
      keys: ["reactions"],
      indexBy: "title",
      xAxisLabel: "Post Title",
      yAxisLabel: "Reactions",
    },
  },
  {
    name: "Cart Totals",
    displayName: "Cart Totals Over Time",
    apiConfig: {
      endpoint: "https://dummyjson.com/carts",
      queryKey: ["carts", "totals"],
      transform: transformCartsForTotalValueLine,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Cart Totals Over Time",
      xKey: "id",
      yKey: "total",
      xLabel: "Cart ${id}",
    },
  },
  {
    name: "Weather Temperature",
    displayName: "Temperature Next 24h (London)",
    apiConfig: {
      endpoint:
        "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m&forecast_days=2&timezone=UTC",
      queryKey: ["open-meteo", "london", "hourly"],
      transform: transformOpenMeteoForHourlyTemperatureLine,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Temperature (°C) Next 24h - London",
      labelKey: "time",
      dataKey: "temp",
      datasetLabel: "Temp °C",
    },
  },
  {
    name: "Breweries By State",
    displayName: "Breweries by State (Top 10)",
    apiConfig: {
      endpoint: "https://api.openbrewerydb.org/v1/breweries?per_page=200",
      queryKey: ["openbrewery", "states"],
      transform: transformOpenBreweryForStateCountsBar,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Open Brewery DB: Breweries by State (Top 10)",
      dataKey: "count",
      xKey: "state",
    },
  },
  {
    name: "Library Subject Works",
    displayName: "Works by Subject (Science)",
    apiConfig: {
      endpoint: "https://openlibrary.org/subjects/science.json?limit=200&details=true",
      queryKey: ["openlibrary", "science"],
      transform: transformOpenLibraryForSubjectWorksDonut,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "Open Library: Works by Sub-Subject (Science)",
      innerRadius: "50%",
      outerRadius: "75%",
    },
  },
  {
    name: "Pokemon Base XP",
    displayName: "Base XP vs ID (First 50)",
    apiConfig: {
      endpoint: "https://pokeapi.co/api/v2/pokemon?limit=50",
      queryKey: ["pokeapi", "first50"],
      transform: transformPokeApiForBaseExperienceScatter,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "PokéAPI: Base Experience vs ID (First 50)",
      xKey: "id",
      yKey: "base_experience",
      textKey: "name",
      multiFetch: true,
    },
  },
  {
    name: "SpaceX Launches",
    displayName: "Launches per Year",
    apiConfig: {
      endpoint: "https://api.spacexdata.com/v5/launches",
      queryKey: ["spacex", "launches"],
      transform: transformSpaceXForLaunchesPerYearArea,
    },
    Component: D3AreaChart,
    chartOptions: {
      title: "SpaceX: Launches per Year",
    },
  },
];

export function getChartByName(name: string): ChartConfig | undefined {
  return chartRegistry.find((chart) => chart.name === name);
}

export function getAllChartNames(): string[] {
  return chartRegistry.map((chart) => chart.name);
}