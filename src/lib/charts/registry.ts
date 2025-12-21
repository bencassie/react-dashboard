// src/lib/charts/registry.ts
import dynamic from "next/dynamic";
import type { ChartConfig } from "./types";
import {
  passthroughTransform,
  passthroughWithDateTransform,
  transformDifficultyToNameValue,
  transformStatusToNameValue,
} from "./transforms";

// Generic chart components (provider-graphtype naming)
// Existing components
const NivoBarChart = dynamic(() => import("@/components/graphs/nivobar"), { ssr: false });
const EchartsPieChart = dynamic(() => import("@/components/graphs/echartspie"), { ssr: false });
const NivoHeatmapChart = dynamic(() => import("@/components/graphs/nivoheatmap"), { ssr: false });
const EchartsLineChart = dynamic(() => import("@/components/graphs/echartsline"), { ssr: false });
const RechartsLineChart = dynamic(() => import("@/components/graphs/rechartsline"), { ssr: false });
const RechartsBarChart = dynamic(() => import("@/components/graphs/rechartsbar"), { ssr: false });
const EchartsDonutChart = dynamic(() => import("@/components/graphs/echartsdonut"), { ssr: false });
const PlotlyScatterChart = dynamic(() => import("@/components/graphs/plotlyscatter"), { ssr: false });
const D3AreaChart = dynamic(() => import("@/components/graphs/d3area"), { ssr: false });

// New Nivo components
const NivoLineChart = dynamic(() => import("@/components/graphs/nivoline"), { ssr: false });
const NivoPieChart = dynamic(() => import("@/components/graphs/nivopie"), { ssr: false });

// New ECharts components
const EchartsBarChart = dynamic(() => import("@/components/graphs/echartsbar"), { ssr: false });
const EchartsScatterChart = dynamic(() => import("@/components/graphs/echartsscatter"), { ssr: false });
const EchartsRadarChart = dynamic(() => import("@/components/graphs/echartsradar"), { ssr: false });

// New Chart.js components
const ChartJsBarChart = dynamic(() => import("@/components/graphs/chartjsbar"), { ssr: false });
const ChartJsDoughnutChart = dynamic(() => import("@/components/graphs/chartjsdoughnut"), { ssr: false });
const ChartJsPieChart = dynamic(() => import("@/components/graphs/chartjspie"), { ssr: false });
const ChartJsRadarChart = dynamic(() => import("@/components/graphs/chartjsradar"), { ssr: false });

// New Recharts components
const RechartsLine2Chart = dynamic(() => import("@/components/graphs/recharts-line2"), { ssr: false });
const RechartsAreaChart = dynamic(() => import("@/components/graphs/rechartsarea"), { ssr: false });
const RechartsPieChart = dynamic(() => import("@/components/graphs/rechartspie"), { ssr: false });
const RechartsRadarChart = dynamic(() => import("@/components/graphs/rechartsradar"), { ssr: false });

// New D3 components
const D3LineChart = dynamic(() => import("@/components/graphs/d3line"), { ssr: false });
const D3BarChart = dynamic(() => import("@/components/graphs/d3bar"), { ssr: false });

// New Plotly components
const PlotlyLineChart = dynamic(() => import("@/components/graphs/plotlyline"), { ssr: false });
const PlotlyBarChart = dynamic(() => import("@/components/graphs/plotlybar"), { ssr: false });
const PlotlyPieChart = dynamic(() => import("@/components/graphs/plotlypie"), { ssr: false });

/**
 * Central registry of all available charts
 * Using new dedicated API endpoints
 */
export const chartRegistry: ChartConfig[] = [
  // Products Charts (6 variations)
  {
    name: "Product Price Rating",
    displayName: "Price vs Rating (Top 10)",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating"],
      transform: passthroughTransform,
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
    name: "Product Categories Pie",
    displayName: "Category Distribution",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Product Category Distribution",
      radius: "60%",
    },
  },
  {
    name: "Product Categories Donut",
    displayName: "Category Donut Chart",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories", "donut"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "Product Categories (Donut)",
      innerRadius: "45%",
      outerRadius: "70%",
    },
  },
  {
    name: "Brand Counts Bar",
    displayName: "Top Brands",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts"],
      transform: passthroughTransform,
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
    name: "Brand Counts Recharts",
    displayName: "Brand Count (Alt)",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "alt"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Brand Product Counts",
      dataKey: "count",
      xKey: "brand",
    },
  },
  {
    name: "Low Stock Products",
    displayName: "Low Stock Alert",
    apiConfig: {
      endpoint: "/api/charts/products/low-stock",
      queryKey: ["products", "low-stock"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Low Stock Products (Top 10)",
      dataKey: "stock",
      xKey: "product",
    },
  },
  {
    name: "Product Discounts Line",
    displayName: "Product Discounts",
    apiConfig: {
      endpoint: "/api/charts/products/discounts",
      queryKey: ["products", "discounts"],
      transform: passthroughTransform,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Product Discount Percentages",
      labelKey: "id",
      dataKey: "discount",
      datasetLabel: "Discount %",
    },
  },
  {
    name: "Product Discounts ECharts",
    displayName: "Discounts (ECharts)",
    apiConfig: {
      endpoint: "/api/charts/products/discounts",
      queryKey: ["products", "discounts", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Product Discount Trend",
      xKey: "id",
      yKey: "discount",
      xLabel: "Product ${id}",
    },
  },
  {
    name: "Price Distribution Area",
    displayName: "Price Distribution",
    apiConfig: {
      endpoint: "/api/charts/products/price-distribution",
      queryKey: ["products", "price-distribution"],
      transform: passthroughWithDateTransform,
    },
    Component: D3AreaChart,
    chartOptions: {
      title: "Product Price Distribution by Range",
    },
  },

  // Users Charts (6 variations)
  {
    name: "User Gender Pie",
    displayName: "Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "User Gender Distribution",
      radius: "60%",
    },
  },
  {
    name: "User Gender Donut",
    displayName: "Gender Donut",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender", "donut"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "User Gender Split",
      innerRadius: "50%",
      outerRadius: "75%",
    },
  },
  {
    name: "User Age Distribution",
    displayName: "Age Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "User Age Distribution",
      innerRadius: "50%",
      outerRadius: "75%",
    },
  },
  {
    name: "User Age Pie",
    displayName: "Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "pie"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Age Group Distribution",
      radius: "65%",
    },
  },
  {
    name: "User Blood Type Donut",
    displayName: "Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "User Blood Type Distribution",
      innerRadius: "50%",
      outerRadius: "75%",
    },
  },
  {
    name: "User Blood Type Pie",
    displayName: "Blood Types",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type", "pie"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Blood Type Breakdown",
      radius: "60%",
    },
  },

  // Recipes Charts (6 variations)
  {
    name: "Recipe Ratings Scatter",
    displayName: "Recipe Ratings",
    apiConfig: {
      endpoint: "/api/charts/recipes/ratings",
      queryKey: ["recipes", "ratings"],
      transform: passthroughTransform,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "Recipe Ratings Distribution",
      xKey: "id",
      yKey: "rating",
      textKey: "name",
    },
  },
  {
    name: "Recipe Difficulty Bar",
    displayName: "Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty"],
      transform: passthroughTransform,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Recipe Difficulty Distribution",
      keys: ["count"],
      indexBy: "difficulty",
      xAxisLabel: "Difficulty",
      yAxisLabel: "Count",
    },
  },
  {
    name: "Recipe Difficulty Recharts",
    displayName: "Difficulty Levels",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "alt"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Recipe Difficulty Counts",
      dataKey: "count",
      xKey: "difficulty",
    },
  },
  {
    name: "Recipe Difficulty Pie",
    displayName: "Difficulty Split",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "pie"],
      transform: transformDifficultyToNameValue,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Recipe Difficulty Split",
      radius: "60%",
    },
  },
  {
    name: "Recipe Cooking Time Line",
    displayName: "Cooking Time",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time"],
      transform: passthroughTransform,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Recipe Cooking Times",
      xKey: "id",
      yKey: "time",
      xLabel: "Recipe ${id}",
    },
  },
  {
    name: "Recipe Cooking Time Recharts",
    displayName: "Cook Time (Alt)",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time", "alt"],
      transform: passthroughTransform,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Recipe Preparation Time",
      labelKey: "id",
      dataKey: "time",
      datasetLabel: "Minutes",
    },
  },

  // Todos, Posts, Carts, Quotes (8 variations)
  {
    name: "Todo Status Bar",
    displayName: "Todo Completion",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status"],
      transform: passthroughTransform,
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
    name: "Todo Status Recharts",
    displayName: "Todo Stats",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "alt"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Todo Status Breakdown",
      dataKey: "count",
      xKey: "status",
    },
  },
  {
    name: "Todo Status Pie",
    displayName: "Todo Status Split",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "pie"],
      transform: transformStatusToNameValue,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Todo Completion Split",
      radius: "60%",
    },
  },
  {
    name: "Post Reactions Bar",
    displayName: "Top Posts",
    apiConfig: {
      endpoint: "/api/charts/posts/reactions",
      queryKey: ["posts", "reactions"],
      transform: passthroughTransform,
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
    name: "Post Reactions Recharts",
    displayName: "Post Engagement",
    apiConfig: {
      endpoint: "/api/charts/posts/reactions",
      queryKey: ["posts", "reactions", "alt"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Post Reaction Counts",
      dataKey: "reactions",
      xKey: "title",
    },
  },
  {
    name: "Cart Totals Line",
    displayName: "Cart Totals",
    apiConfig: {
      endpoint: "/api/charts/carts/totals",
      queryKey: ["carts", "totals"],
      transform: passthroughTransform,
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
    name: "Cart Totals Recharts",
    displayName: "Cart Values",
    apiConfig: {
      endpoint: "/api/charts/carts/totals",
      queryKey: ["carts", "totals", "alt"],
      transform: passthroughTransform,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Shopping Cart Values",
      labelKey: "id",
      dataKey: "total",
      datasetLabel: "Total $",
    },
  },
  {
    name: "Quote Authors Pie",
    displayName: "Top Authors",
    apiConfig: {
      endpoint: "/api/charts/quotes/authors",
      queryKey: ["quotes", "authors"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Top Quote Authors",
      radius: "60%",
    },
  },
  {
    name: "Quote Authors Donut",
    displayName: "Author Distribution",
    apiConfig: {
      endpoint: "/api/charts/quotes/authors",
      queryKey: ["quotes", "authors", "donut"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "Quote Author Distribution",
      innerRadius: "50%",
      outerRadius: "75%",
    },
  },

  // Heatmap (1 chart)
  {
    name: "Activity Heatmap",
    displayName: "Activity Heatmap",
    apiConfig: {
      endpoint: "/api/charts/heatmap/sample",
      queryKey: ["heatmap", "sample"],
      transform: passthroughTransform,
    },
    Component: NivoHeatmapChart,
    chartOptions: {
      title: "Activity Heatmap (Sample)",
      xAxisLabel: "Hour",
      yAxisLabel: "Day",
    },
  },

  // External APIs (12 variations)
  {
    name: "Weather Temperature Line",
    displayName: "London Temperature",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature"],
      transform: passthroughTransform,
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
    name: "Weather Temperature ECharts",
    displayName: "Weather Forecast",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "24h Temperature Forecast",
      xKey: "time",
      yKey: "temp",
      xLabel: "Time",
    },
  },
  {
    name: "Breweries By State Bar",
    displayName: "Breweries by State",
    apiConfig: {
      endpoint: "/api/charts/breweries/states",
      queryKey: ["breweries", "states"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Breweries by State (Top 10)",
      dataKey: "count",
      xKey: "state",
    },
  },
  {
    name: "Breweries By State Nivo",
    displayName: "Brewery Distribution",
    apiConfig: {
      endpoint: "/api/charts/breweries/states",
      queryKey: ["breweries", "states", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "State Brewery Counts",
      keys: ["count"],
      indexBy: "state",
      xAxisLabel: "State",
      yAxisLabel: "Count",
    },
  },
  {
    name: "Library Subject Works Donut",
    displayName: "Library Subjects",
    apiConfig: {
      endpoint: "/api/charts/library/subject-works",
      queryKey: ["library", "subject-works"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "Open Library: Works by Subject",
      innerRadius: "50%",
      outerRadius: "75%",
    },
  },
  {
    name: "Library Subject Works Pie",
    displayName: "Science Topics",
    apiConfig: {
      endpoint: "/api/charts/library/subject-works",
      queryKey: ["library", "subject-works", "pie"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Science Subject Distribution",
      radius: "65%",
    },
  },
  {
    name: "Pokemon Base XP Scatter",
    displayName: "Pokemon Base XP",
    apiConfig: {
      endpoint: "/api/charts/pokemon/base-xp",
      queryKey: ["pokemon", "base-xp"],
      transform: passthroughTransform,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "Pokemon: Base Experience vs ID",
      xKey: "id",
      yKey: "base_experience",
      textKey: "name",
    },
  },
  {
    name: "Pokemon Height Weight Scatter",
    displayName: "Pokemon Size",
    apiConfig: {
      endpoint: "/api/charts/pokemon/height-weight",
      queryKey: ["pokemon", "height-weight"],
      transform: passthroughTransform,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "Pokemon: Height vs Weight",
      xKey: "height",
      yKey: "weight",
      textKey: "name",
    },
  },
  {
    name: "SpaceX Launches Area",
    displayName: "SpaceX Launches",
    apiConfig: {
      endpoint: "/api/charts/spacex/launches",
      queryKey: ["spacex", "launches"],
      transform: passthroughWithDateTransform,
    },
    Component: D3AreaChart,
    chartOptions: {
      title: "SpaceX: Launches per Year",
    },
  },

  // Additional variations for more charts (6 more)
  {
    name: "Product Price Bar",
    displayName: "Product Prices",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-only"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Product Prices",
      dataKey: "price",
      xKey: "id",
    },
  },
  {
    name: "Product Rating Bar",
    displayName: "Product Ratings",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "rating-only"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Product Ratings",
      dataKey: "rating",
      xKey: "id",
    },
  },
  {
    name: "Low Stock Alert Nivo",
    displayName: "Stock Alert (Nivo)",
    apiConfig: {
      endpoint: "/api/charts/products/low-stock",
      queryKey: ["products", "low-stock", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Low Stock Alert",
      keys: ["stock"],
      indexBy: "product",
      xAxisLabel: "Product",
      yAxisLabel: "Stock Level",
    },
  },
  {
    name: "User Demographics Summary",
    displayName: "User Demographics",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "demographics"],
      transform: passthroughTransform,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "User Demographics Overview",
      innerRadius: "40%",
      outerRadius: "70%",
    },
  },
  {
    name: "Recipe Stats Overview",
    displayName: "Recipe Overview",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "overview"],
      transform: transformDifficultyToNameValue,
    },
    Component: EchartsDonutChart,
    chartOptions: {
      title: "Recipe Statistics",
      innerRadius: "45%",
      outerRadius: "75%",
    },
  },
  {
    name: "Product Stock Status",
    displayName: "Stock Levels",
    apiConfig: {
      endpoint: "/api/charts/products/low-stock",
      queryKey: ["products", "stock-status"],
      transform: passthroughTransform,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Product Stock Levels",
      xKey: "product",
      yKey: "stock",
      xLabel: "Product",
    },
  },

  // New Nivo Line Charts
  {
    name: "Nivo Product Price-Rating Line",
    displayName: "Price vs Rating (Nivo)",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating-nivo"],
      transform: passthroughTransform,
    },
    Component: NivoLineChart,
    chartOptions: {
      title: "Product Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
  },
  {
    name: "Nivo Recipe Cooking Time Line",
    displayName: "Cooking Times (Nivo)",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time-nivo"],
      transform: passthroughTransform,
    },
    Component: NivoLineChart,
    chartOptions: {
      title: "Recipe Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },
  {
    name: "Nivo Weather Temperature Line",
    displayName: "Temperature Trend (Nivo)",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature-nivo"],
      transform: passthroughTransform,
    },
    Component: NivoLineChart,
    chartOptions: {
      title: "Temperature Over Time",
      xKey: "date",
      yKey: "temperature",
    },
  },

  // New Nivo Pie Charts
  {
    name: "Nivo Category Distribution Pie",
    displayName: "Categories (Nivo Pie)",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories-nivo-pie"],
      transform: passthroughTransform,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Product Categories Distribution",
    },
  },
  {
    name: "Nivo Gender Distribution Pie",
    displayName: "Gender Split (Nivo Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender-nivo-pie"],
      transform: passthroughTransform,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "User Gender Distribution",
    },
  },
  {
    name: "Nivo Blood Type Pie",
    displayName: "Blood Types (Nivo Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type-nivo-pie"],
      transform: passthroughTransform,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Blood Type Distribution",
    },
  },
  {
    name: "Nivo Recipe Difficulty Pie",
    displayName: "Recipe Difficulty (Nivo Pie)",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty-nivo-pie"],
      transform: transformDifficultyToNameValue,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Recipe Difficulty Levels",
    },
  },
  {
    name: "Nivo Todo Status Pie",
    displayName: "Todo Status (Nivo Pie)",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status-nivo-pie"],
      transform: transformStatusToNameValue,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Todo Completion Status",
    },
  },

  // New ECharts Bar Charts
  {
    name: "ECharts Brand Counts Bar",
    displayName: "Brand Counts (ECharts)",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts-echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Products by Brand",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "ECharts Age Distribution Bar",
    displayName: "Age Groups (ECharts)",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution-echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "User Age Distribution",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "ECharts Recipe Ratings Bar",
    displayName: "Recipe Ratings (ECharts)",
    apiConfig: {
      endpoint: "/api/charts/recipes/ratings",
      queryKey: ["recipes", "ratings-echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Recipe Ratings",
      xKey: "name",
      yKey: "rating",
    },
  },
  {
    name: "ECharts Post Reactions Bar",
    displayName: "Post Reactions (ECharts)",
    apiConfig: {
      endpoint: "/api/charts/posts/reactions",
      queryKey: ["posts", "reactions-echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Top Posts by Reactions",
      xKey: "title",
      yKey: "reactions",
    },
  },

  // New ECharts Scatter Charts
  {
    name: "ECharts Price-Rating Scatter",
    displayName: "Price vs Rating (Scatter)",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating-scatter"],
      transform: passthroughTransform,
    },
    Component: EchartsScatterChart,
    chartOptions: {
      title: "Product Price vs Rating Scatter",
      xKey: "price",
      yKey: "rating",
    },
  },
  {
    name: "ECharts Pokemon Stats Scatter",
    displayName: "Pokemon Height/Weight",
    apiConfig: {
      endpoint: "/api/charts/pokemon/height-weight",
      queryKey: ["pokemon", "height-weight-scatter"],
      transform: passthroughTransform,
    },
    Component: EchartsScatterChart,
    chartOptions: {
      title: "Pokemon Height vs Weight",
      xKey: "height",
      yKey: "weight",
    },
  },

  // New ECharts Radar Charts
  {
    name: "ECharts Product Metrics Radar",
    displayName: "Product Metrics (Radar)",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "metrics-radar"],
      transform: passthroughTransform,
    },
    Component: EchartsRadarChart,
    chartOptions: {
      title: "Product Metrics Overview",
      indicators: ["price", "rating"],
    },
  },

  // New Chart.js Bar Charts
  {
    name: "ChartJS Brand Counts Bar",
    displayName: "Brands (Chart.js Bar)",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts-chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Products by Brand",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "ChartJS Brewery States Bar",
    displayName: "Breweries by State (Chart.js)",
    apiConfig: {
      endpoint: "/api/charts/breweries/states",
      queryKey: ["breweries", "states-chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Breweries by State",
      xKey: "state",
      yKey: "count",
    },
  },
  {
    name: "ChartJS Quote Authors Bar",
    displayName: "Quote Authors (Chart.js)",
    apiConfig: {
      endpoint: "/api/charts/quotes/authors",
      queryKey: ["quotes", "authors-chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Top Quote Authors",
      xKey: "author",
      yKey: "count",
    },
  },

  // New Chart.js Doughnut Charts
  {
    name: "ChartJS Category Doughnut",
    displayName: "Categories (Doughnut)",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories-doughnut"],
      transform: passthroughTransform,
    },
    Component: ChartJsDoughnutChart,
    chartOptions: {
      title: "Product Categories",
    },
  },
  {
    name: "ChartJS Gender Doughnut",
    displayName: "Gender (Doughnut)",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender-doughnut"],
      transform: passthroughTransform,
    },
    Component: ChartJsDoughnutChart,
    chartOptions: {
      title: "User Gender Split",
    },
  },
  {
    name: "ChartJS Todo Status Doughnut",
    displayName: "Todos (Doughnut)",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status-doughnut"],
      transform: transformStatusToNameValue,
    },
    Component: ChartJsDoughnutChart,
    chartOptions: {
      title: "Todo Status",
    },
  },

  // New Chart.js Pie Charts
  {
    name: "ChartJS Blood Type Pie",
    displayName: "Blood Types (Chart.js Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type-chartjs-pie"],
      transform: passthroughTransform,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Blood Type Distribution",
    },
  },
  {
    name: "ChartJS Recipe Difficulty Pie",
    displayName: "Difficulty (Chart.js Pie)",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty-chartjs-pie"],
      transform: transformDifficultyToNameValue,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Recipe Difficulty",
    },
  },

  // New Chart.js Radar Charts
  {
    name: "ChartJS Product Metrics Radar",
    displayName: "Product Metrics (Chart.js Radar)",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "metrics-chartjs-radar"],
      transform: passthroughTransform,
    },
    Component: ChartJsRadarChart,
    chartOptions: {
      title: "Product Metrics",
      metrics: ["price", "rating"],
    },
  },

  // New Recharts Line Charts
  {
    name: "Recharts Recipe Cooking Time Line",
    displayName: "Cooking Times (Recharts Line)",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time-recharts-line"],
      transform: passthroughTransform,
    },
    Component: RechartsLine2Chart,
    chartOptions: {
      title: "Recipe Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },
  {
    name: "Recharts Post Reactions Line",
    displayName: "Post Reactions (Recharts Line)",
    apiConfig: {
      endpoint: "/api/charts/posts/reactions",
      queryKey: ["posts", "reactions-recharts-line"],
      transform: passthroughTransform,
    },
    Component: RechartsLine2Chart,
    chartOptions: {
      title: "Post Reactions Trend",
      xKey: "title",
      yKey: "reactions",
    },
  },
  {
    name: "Recharts SpaceX Launches Line",
    displayName: "SpaceX Launches (Recharts)",
    apiConfig: {
      endpoint: "/api/charts/spacex/launches",
      queryKey: ["spacex", "launches-recharts-line"],
      transform: passthroughWithDateTransform,
    },
    Component: RechartsLine2Chart,
    chartOptions: {
      title: "SpaceX Launch Success Rate",
      xKey: "date",
      yKey: "success",
    },
  },

  // New Recharts Area Charts
  {
    name: "Recharts Price Distribution Area",
    displayName: "Price Distribution (Area)",
    apiConfig: {
      endpoint: "/api/charts/products/price-distribution",
      queryKey: ["products", "price-distribution-area"],
      transform: passthroughWithDateTransform,
    },
    Component: RechartsAreaChart,
    chartOptions: {
      title: "Product Price Distribution",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "Recharts Weather Temperature Area",
    displayName: "Temperature (Area)",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature-area"],
      transform: passthroughTransform,
    },
    Component: RechartsAreaChart,
    chartOptions: {
      title: "Temperature Trends",
      xKey: "date",
      yKey: "temperature",
    },
  },

  // New Recharts Pie Charts
  {
    name: "Recharts Category Pie",
    displayName: "Categories (Recharts Pie)",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories-recharts-pie"],
      transform: passthroughTransform,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Product Categories",
    },
  },
  {
    name: "Recharts Gender Pie",
    displayName: "Gender (Recharts Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender-recharts-pie"],
      transform: passthroughTransform,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Gender Distribution",
    },
  },
  {
    name: "Recharts Blood Type Pie",
    displayName: "Blood Types (Recharts Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type-recharts-pie"],
      transform: passthroughTransform,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Blood Type Distribution",
    },
  },
  {
    name: "Recharts Todo Status Pie",
    displayName: "Todos (Recharts Pie)",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status-recharts-pie"],
      transform: transformStatusToNameValue,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Todo Status",
    },
  },

  // New Recharts Radar Charts
  {
    name: "Recharts Product Metrics Radar",
    displayName: "Product Metrics (Recharts Radar)",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "metrics-recharts-radar"],
      transform: passthroughTransform,
    },
    Component: RechartsRadarChart,
    chartOptions: {
      title: "Product Metrics",
      metrics: ["price", "rating"],
    },
  },

  // New D3 Line Charts
  {
    name: "D3 Recipe Cooking Time Line",
    displayName: "Cooking Times (D3)",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time-d3"],
      transform: passthroughTransform,
    },
    Component: D3LineChart,
    chartOptions: {
      title: "Recipe Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },
  {
    name: "D3 Recipe Ratings Line",
    displayName: "Recipe Ratings (D3)",
    apiConfig: {
      endpoint: "/api/charts/recipes/ratings",
      queryKey: ["recipes", "ratings-d3-line"],
      transform: passthroughTransform,
    },
    Component: D3LineChart,
    chartOptions: {
      title: "Recipe Ratings",
      xKey: "name",
      yKey: "rating",
    },
  },
  {
    name: "D3 Product Discounts Line",
    displayName: "Discounts (D3 Line)",
    apiConfig: {
      endpoint: "/api/charts/products/discounts",
      queryKey: ["products", "discounts-d3-line"],
      transform: passthroughTransform,
    },
    Component: D3LineChart,
    chartOptions: {
      title: "Product Discounts",
      xKey: "product",
      yKey: "discountPercentage",
    },
  },

  // New D3 Bar Charts
  {
    name: "D3 Brand Counts Bar",
    displayName: "Brands (D3 Bar)",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts-d3"],
      transform: passthroughTransform,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Products by Brand",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "D3 Age Distribution Bar",
    displayName: "Age Groups (D3)",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution-d3"],
      transform: passthroughTransform,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "User Age Distribution",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "D3 Quote Authors Bar",
    displayName: "Quote Authors (D3)",
    apiConfig: {
      endpoint: "/api/charts/quotes/authors",
      queryKey: ["quotes", "authors-d3"],
      transform: passthroughTransform,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Top Quote Authors",
      xKey: "author",
      yKey: "count",
    },
  },
  {
    name: "D3 Pokemon Base XP Bar",
    displayName: "Pokemon XP (D3)",
    apiConfig: {
      endpoint: "/api/charts/pokemon/base-xp",
      queryKey: ["pokemon", "base-xp-d3"],
      transform: passthroughTransform,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Pokemon Base Experience",
      xKey: "name",
      yKey: "base_experience",
    },
  },

  // New Plotly Line Charts
  {
    name: "Plotly Recipe Cooking Time Line",
    displayName: "Cooking Times (Plotly)",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Recipe Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },
  {
    name: "Plotly Recipe Ratings Line",
    displayName: "Recipe Ratings (Plotly)",
    apiConfig: {
      endpoint: "/api/charts/recipes/ratings",
      queryKey: ["recipes", "ratings-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Recipe Ratings",
      xKey: "name",
      yKey: "rating",
    },
  },
  {
    name: "Plotly Weather Temperature Line",
    displayName: "Temperature (Plotly)",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Temperature Trends",
      xKey: "date",
      yKey: "temperature",
    },
  },
  {
    name: "Plotly Cart Totals Line",
    displayName: "Cart Totals (Plotly)",
    apiConfig: {
      endpoint: "/api/charts/carts/totals",
      queryKey: ["carts", "totals-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Shopping Cart Totals",
      xKey: "userId",
      yKey: "total",
    },
  },

  // New Plotly Bar Charts
  {
    name: "Plotly Brand Counts Bar",
    displayName: "Brands (Plotly Bar)",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "Products by Brand",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "Plotly Age Distribution Bar",
    displayName: "Age Groups (Plotly)",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "User Age Distribution",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "Plotly Library Subject Works Bar",
    displayName: "Library Works (Plotly)",
    apiConfig: {
      endpoint: "/api/charts/library/subject-works",
      queryKey: ["library", "subject-works-plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "Library Works by Subject",
      xKey: "subject",
      yKey: "work_count",
    },
  },

  // New Plotly Pie Charts
  {
    name: "Plotly Category Pie",
    displayName: "Categories (Plotly Pie)",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories-plotly-pie"],
      transform: passthroughTransform,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Product Categories",
    },
  },
  {
    name: "Plotly Gender Pie",
    displayName: "Gender (Plotly Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender-plotly-pie"],
      transform: passthroughTransform,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Gender Distribution",
    },
  },
  {
    name: "Plotly Blood Type Pie",
    displayName: "Blood Types (Plotly Pie)",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type-plotly-pie"],
      transform: passthroughTransform,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Blood Type Distribution",
    },
  },
  {
    name: "Plotly Recipe Difficulty Pie",
    displayName: "Difficulty (Plotly Pie)",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty-plotly-pie"],
      transform: transformDifficultyToNameValue,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Recipe Difficulty Levels",
    },
  },
  {
    name: "Plotly Todo Status Pie",
    displayName: "Todos (Plotly Pie)",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status-plotly-pie"],
      transform: transformStatusToNameValue,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Todo Status",
    },
  },
];

export function getChartByName(name: string): ChartConfig | undefined {
  return chartRegistry.find((chart) => chart.name === name);
}

export function getAllChartNames(): string[] {
  return chartRegistry.map((chart) => chart.name);
}
