// src/lib/charts/registry.ts
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
  transformOpenMeteoForLine,
  transformOpenBreweryForBar,
  transformPokeApiForScatter,
  transformSpaceXLaunches,
} from "./transforms";

// Dynamically import chart components
const BarChart = dynamic(() => import("@/components/graphs/barchart"), { ssr: false });
const PieChart = dynamic(() => import("@/components/graphs/piechart"), { ssr: false });
const HeatmapChart = dynamic(() => import("@/components/graphs/heatmapchart"), { ssr: false });
const BrandBarChart = dynamic(() => import("@/components/graphs/brandbarchart"), { ssr: false });
const GenderPieChart = dynamic(() => import("@/components/graphs/genderpiechart"), { ssr: false });
const TodoBarChart = dynamic(() => import("@/components/graphs/todobarchart"), { ssr: false });
const PostBarChart = dynamic(() => import("@/components/graphs/postbarchart"), { ssr: false });
const CartLineChart = dynamic(() => import("@/components/graphs/cartlinechart"), { ssr: false });
const WeatherLineChart = dynamic(() => import("@/components/graphs/weatherlinechart"), { ssr: false });
const BreweriesBarChart = dynamic(() => import("@/components/graphs/breweriesbarchart"), { ssr: false });

// Switch Open Library to ECharts version
const OpenLibraryDonutChart = dynamic(
  () => import("@/components/graphs/openlibrarydonutchart_echarts"),
  { ssr: false }
);

const PokemonScatter = dynamic(() => import("@/components/graphs/pokemonscatter"), { ssr: false });
const SpaceXLaunchesArea = dynamic(() => import("@/components/graphs/spacexlaunchesarea"), { ssr: false });

/**
 * Central registry of all available charts
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

  // Open-source APIs
  {
    name: "Weather Line Chart",
    displayName: "Open-Meteo: Temp Next 24h (London)",
    apiConfig: {
      endpoint:
        "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m&forecast_days=2&timezone=UTC",
      queryKey: ["open-meteo", "london", "hourly"],
      transform: transformOpenMeteoForLine,
    },
    Component: WeatherLineChart,
  },
  {
    name: "Breweries Bar Chart",
    displayName: "Open Brewery DB: Breweries by State",
    apiConfig: {
      endpoint: "https://api.openbrewerydb.org/v1/breweries?per_page=200",
      queryKey: ["openbrewery", "states"],
      transform: transformOpenBreweryForBar,
    },
    Component: BreweriesBarChart,
  },
  {
    name: "Open Library Donut Chart",
    displayName: "Open Library: Works by Sub-Subject (Science)",
    apiConfig: {
      endpoint: "https://openlibrary.org/subjects/science.json?limit=200&details=true",
      queryKey: ["openlibrary", "science"],
      transform: (d: any) => d, // component normalizes
    },
    Component: OpenLibraryDonutChart,
  },
  {
    name: "Pokémon Scatter",
    displayName: "PokéAPI: Base XP vs ID (First 50)",
    apiConfig: {
      endpoint: "https://pokeapi.co/api/v2/pokemon?limit=50",
      queryKey: ["pokeapi", "first50"],
      transform: transformPokeApiForScatter,
    },
    Component: PokemonScatter,
    chartOptions: { multiFetch: true }, // fetch each pokemon detail to get id/base_experience
  },
  {
    name: "SpaceX Launches Area",
    displayName: "SpaceX: Launches per Year",
    apiConfig: {
      endpoint: "https://api.spacexdata.com/v5/launches",
      queryKey: ["spacex", "launches"],
      transform: transformSpaceXLaunches,
    },
    Component: SpaceXLaunchesArea,
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

export function getChartByName(name: string): ChartConfig | undefined {
  return chartRegistry.find((chart) => chart.name === name);
}

export function getAllChartNames(): string[] {
  return chartRegistry.map((chart) => chart.name);
}
