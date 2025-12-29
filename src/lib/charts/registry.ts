// src/lib/charts/registry.ts
import dynamic from "next/dynamic";
import type { ChartConfig } from "./types";
import {
  passthroughTransform,
  transformPokemonForRechartsRadar,
  transformPokemonForEchartsRadar,
  transformPokemonForChartJsRadar,
  transformForNivoLine,
  transformProductsForTreemap,
  transformProductsForSunburst,
  transformProductsForPriceBoxPlot,
  transformRecipesForCookTimeBoxPlot,
  passthroughTransformForFunnel,
  // Products - client-side transforms
  transformProductsForBrandCountsFiltered,
  transformProductsForCategories,
  transformProductsForPriceRatingFiltered,
  // Users - client-side transforms
  transformUsersForGender,
  transformUsersForBloodType,
  transformUsersForAgeDistribution,
  // Recipes - client-side transforms
  transformRecipesForDifficulty,
  transformRecipesForCookingTime,
  transformRecipesForCookingTimeNivoLine,
  // Todos - client-side transforms
  transformTodosForStatus,
  // SpaceX - client-side transforms
  transformSpaceXForLaunchesPerYear,
} from "./transforms";
import type { ChartFilterConfig } from "./filter-types";

// Chart components - dynamically imported for code splitting
const NivoBarChart = dynamic(() => import("@/components/graphs/nivobar"), { ssr: false });
const NivoLineChart = dynamic(() => import("@/components/graphs/nivoline"), { ssr: false });
const NivoPieChart = dynamic(() => import("@/components/graphs/nivopie"), { ssr: false });
const NivoScatterChart = dynamic(() => import("@/components/graphs/nivoscatter"), { ssr: false });
const NivoHeatmap2Chart = dynamic(() => import("@/components/graphs/nivoheatmap2"), { ssr: false });

const RechartsBarChart = dynamic(() => import("@/components/graphs/rechartsbar"), { ssr: false });
const RechartsLineChart = dynamic(() => import("@/components/graphs/rechartsline"), { ssr: false });
const RechartsPieChart = dynamic(() => import("@/components/graphs/rechartspie"), { ssr: false });
const RechartsRadarChart = dynamic(() => import("@/components/graphs/rechartsradar"), { ssr: false });
const RechartsScatterChart = dynamic(() => import("@/components/graphs/rechartsscatter"), { ssr: false });
const RechartsAreaChart = dynamic(() => import("@/components/graphs/rechartsarea"), { ssr: false });

const EchartsBarChart = dynamic(() => import("@/components/graphs/echartsbar"), { ssr: false });
const EchartsLineChart = dynamic(() => import("@/components/graphs/echartsline"), { ssr: false });
const EchartsPieChart = dynamic(() => import("@/components/graphs/echartspie"), { ssr: false });
const EchartsRadarChart = dynamic(() => import("@/components/graphs/echartsradar"), { ssr: false });
const EchartsScatterChart = dynamic(() => import("@/components/graphs/echartsscatter"), { ssr: false });
const EchartsHeatmapChart = dynamic(() => import("@/components/graphs/echartsheatmap"), { ssr: false });

const ChartJsBarChart = dynamic(() => import("@/components/graphs/chartjsbar"), { ssr: false });
const ChartJsPieChart = dynamic(() => import("@/components/graphs/chartjspie"), { ssr: false });
const ChartJsRadarChart = dynamic(() => import("@/components/graphs/chartjsradar"), { ssr: false });
const ChartJsScatterChart = dynamic(() => import("@/components/graphs/chartjsscatter"), { ssr: false });

const PlotlyBarChart = dynamic(() => import("@/components/graphs/plotlybar"), { ssr: false });
const PlotlyLineChart = dynamic(() => import("@/components/graphs/plotlyline"), { ssr: false });
const PlotlyPieChart = dynamic(() => import("@/components/graphs/plotlypie"), { ssr: false });
const PlotlyRadarChart = dynamic(() => import("@/components/graphs/plotlyradar"), { ssr: false });
const PlotlyScatterChart = dynamic(() => import("@/components/graphs/plotlyscatter"), { ssr: false });
const PlotlyHeatmapChart = dynamic(() => import("@/components/graphs/plotlyheatmap"), { ssr: false });

const D3BarChart = dynamic(() => import("@/components/graphs/d3bar"), { ssr: false });
const D3LineChart = dynamic(() => import("@/components/graphs/d3line"), { ssr: false });
const D3RadarChart = dynamic(() => import("@/components/graphs/d3radar"), { ssr: false });
const D3ScatterChart = dynamic(() => import("@/components/graphs/d3scatter"), { ssr: false });
const D3HeatmapChart = dynamic(() => import("@/components/graphs/d3heatmap"), { ssr: false });
const D3AreaChart = dynamic(() => import("@/components/graphs/d3area"), { ssr: false });

const EChartsTreemap = dynamic(() => import("@/components/graphs/echartstreemap"), { ssr: false });
const EChartsBoxPlot = dynamic(() => import("@/components/graphs/echartsboxplot"), { ssr: false });
const EChartsFunnel = dynamic(() => import("@/components/graphs/echartsfunnel"), { ssr: false });
const EChartsSunburst = dynamic(() => import("@/components/graphs/echartssunburst"), { ssr: false });

// Filter configuration for Products data source
const productsFilterConfig: ChartFilterConfig = {
  filters: [
    {
      id: "category",
      type: "multi-select",
      label: "Category",
      field: "category",
      options: "auto",
      defaultValue: [],
    },
    {
      id: "priceRange",
      type: "range",
      label: "Price",
      field: "price",
      bounds: "auto",
      step: 10,
      defaultValue: { min: 0, max: 2000 },
    },
    {
      id: "rating",
      type: "range",
      label: "Rating",
      field: "rating",
      bounds: { min: 0, max: 5 },
      step: 0.5,
      defaultValue: { min: 0, max: 5 },
    },
  ],
  layout: "inline",
};

// Filter configuration for Users data source
const usersFilterConfig: ChartFilterConfig = {
  filters: [
    {
      id: "gender",
      type: "multi-select",
      label: "Gender",
      field: "gender",
      options: "auto",
      defaultValue: [],
    },
    {
      id: "age",
      type: "range",
      label: "Age",
      field: "age",
      bounds: "auto",
      defaultValue: { min: 0, max: 100 },
    },
    {
      id: "bloodGroup",
      type: "multi-select",
      label: "Blood Type",
      field: "bloodGroup",
      options: "auto",
      defaultValue: [],
    },
  ],
  layout: "inline",
};

// Filter configuration for Recipes data source
const recipesFilterConfig: ChartFilterConfig = {
  filters: [
    {
      id: "difficulty",
      type: "multi-select",
      label: "Difficulty",
      field: "difficulty",
      options: ["Easy", "Medium", "Hard"],
      defaultValue: [],
    },
    {
      id: "cuisine",
      type: "multi-select",
      label: "Cuisine",
      field: "cuisine",
      options: "auto",
      defaultValue: [],
    },
    {
      id: "rating",
      type: "range",
      label: "Rating",
      field: "rating",
      bounds: { min: 0, max: 5 },
      step: 0.5,
      defaultValue: { min: 0, max: 5 },
    },
  ],
  layout: "inline",
};

/**
 * Reorganized chart registry for fair library comparison
 * Each data set has one chart per provider (where chart type makes sense)
 * This allows users to compare the same data across different libraries
 */
export const chartRegistry: ChartConfig[] = [
  // ============================================================================
  // BAR CHARTS - Brand Counts (6 providers)
  // ============================================================================
  {
    name: "Bar Nivo Brand Counts",
    displayName: "Bar - Nivo - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForBrandCountsFiltered,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Bar - Nivo - Brand Counts",
      keys: ["count"],
      indexBy: "brand",
      xAxisLabel: "Brand",
      yAxisLabel: "Count",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Bar Recharts Brand Counts",
    displayName: "Bar - Recharts - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForBrandCountsFiltered,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Bar - Recharts - Brand Counts",
      dataKey: "count",
      xKey: "brand",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Bar ECharts Brand Counts",
    displayName: "Bar - ECharts - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForBrandCountsFiltered,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Bar - ECharts - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Bar ChartJS Brand Counts",
    displayName: "Bar - Chart.js - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForBrandCountsFiltered,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Bar - Chart.js - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Bar Plotly Brand Counts",
    displayName: "Bar - Plotly - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForBrandCountsFiltered,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "Bar - Plotly - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Bar D3 Brand Counts",
    displayName: "Bar - D3 - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForBrandCountsFiltered,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Bar - D3 - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
    filterConfig: productsFilterConfig,
  },

  // ============================================================================
  // BAR CHARTS - Age Distribution (6 providers)
  // ============================================================================
  {
    name: "Bar Nivo Age Distribution",
    displayName: "Bar - Nivo - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForAgeDistribution,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Bar - Nivo - Age Groups",
      keys: ["count"],
      indexBy: "range",
      xAxisLabel: "Age Range",
      yAxisLabel: "Count",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Bar Recharts Age Distribution",
    displayName: "Bar - Recharts - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForAgeDistribution,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Bar - Recharts - Age Groups",
      dataKey: "count",
      xKey: "range",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Bar ECharts Age Distribution",
    displayName: "Bar - ECharts - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForAgeDistribution,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Bar - ECharts - Age Groups",
      xKey: "range",
      yKey: "count",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Bar ChartJS Age Distribution",
    displayName: "Bar - Chart.js - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForAgeDistribution,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Bar - Chart.js - Age Groups",
      xKey: "range",
      yKey: "count",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Bar Plotly Age Distribution",
    displayName: "Bar - Plotly - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForAgeDistribution,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "Bar - Plotly - Age Groups",
      xKey: "range",
      yKey: "count",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Bar D3 Age Distribution",
    displayName: "Bar - D3 - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForAgeDistribution,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Bar - D3 - Age Groups",
      xKey: "range",
      yKey: "count",
    },
    filterConfig: usersFilterConfig,
  },

  // ============================================================================
  // PIE CHARTS - Product Categories (5 providers, D3 doesn't have pie)
  // ============================================================================
  {
    name: "Pie Nivo Categories",
    displayName: "Pie - Nivo - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForCategories,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Product Categories",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Pie Recharts Categories",
    displayName: "Pie - Recharts - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForCategories,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Product Categories",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Pie ECharts Categories",
    displayName: "Pie - ECharts - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForCategories,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Product Categories",
      radius: "60%",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Pie ChartJS Categories",
    displayName: "Pie - Chart.js - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForCategories,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Product Categories",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Pie Plotly Categories",
    displayName: "Pie - Plotly - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForCategories,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Product Categories",
    },
    filterConfig: productsFilterConfig,
  },

  // ============================================================================
  // PIE CHARTS - Gender Distribution (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Gender",
    displayName: "Pie - Nivo - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForGender,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Gender Distribution",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie Recharts Gender",
    displayName: "Pie - Recharts - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForGender,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Gender Distribution",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie ECharts Gender",
    displayName: "Pie - ECharts - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForGender,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Gender Distribution",
      radius: "60%",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie ChartJS Gender",
    displayName: "Pie - Chart.js - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForGender,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Gender Distribution",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie Plotly Gender",
    displayName: "Pie - Plotly - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForGender,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Gender Distribution",
    },
    filterConfig: usersFilterConfig,
  },

  // ============================================================================
  // PIE CHARTS - Blood Type (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Blood Type",
    displayName: "Pie - Nivo - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForBloodType,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Blood Type Distribution",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie Recharts Blood Type",
    displayName: "Pie - Recharts - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForBloodType,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Blood Type Distribution",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie ECharts Blood Type",
    displayName: "Pie - ECharts - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForBloodType,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Blood Type Distribution",
      radius: "60%",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie ChartJS Blood Type",
    displayName: "Pie - Chart.js - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForBloodType,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Blood Type Distribution",
    },
    filterConfig: usersFilterConfig,
  },
  {
    name: "Pie Plotly Blood Type",
    displayName: "Pie - Plotly - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/all",
      queryKey: ["users", "all"],
      dataSourceId: "users",
      transform: transformUsersForBloodType,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Blood Type Distribution",
    },
    filterConfig: usersFilterConfig,
  },

  // ============================================================================
  // PIE CHARTS - Recipe Difficulty (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Recipe Difficulty",
    displayName: "Pie - Nivo - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForDifficulty,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Recipe Difficulty",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Pie Recharts Recipe Difficulty",
    displayName: "Pie - Recharts - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForDifficulty,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Recipe Difficulty",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Pie ECharts Recipe Difficulty",
    displayName: "Pie - ECharts - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForDifficulty,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Recipe Difficulty",
      radius: "60%",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Pie ChartJS Recipe Difficulty",
    displayName: "Pie - Chart.js - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForDifficulty,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Recipe Difficulty",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Pie Plotly Recipe Difficulty",
    displayName: "Pie - Plotly - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForDifficulty,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Recipe Difficulty",
    },
    filterConfig: recipesFilterConfig,
  },

  // ============================================================================
  // PIE CHARTS - Todo Status (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Todo Status",
    displayName: "Pie - Nivo - Todo Status",
    apiConfig: {
      endpoint: "/api/charts/todos/all",
      queryKey: ["todos", "all"],
      dataSourceId: "todos",
      transform: transformTodosForStatus,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Todo Status",
    },
  },
  {
    name: "Pie Recharts Todo Status",
    displayName: "Pie - Recharts - Todo Status",
    apiConfig: {
      endpoint: "/api/charts/todos/all",
      queryKey: ["todos", "all"],
      dataSourceId: "todos",
      transform: transformTodosForStatus,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Todo Status",
    },
  },
  {
    name: "Pie ECharts Todo Status",
    displayName: "Pie - ECharts - Todo Status",
    apiConfig: {
      endpoint: "/api/charts/todos/all",
      queryKey: ["todos", "all"],
      dataSourceId: "todos",
      transform: transformTodosForStatus,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Todo Status",
      radius: "60%",
    },
  },
  {
    name: "Pie ChartJS Todo Status",
    displayName: "Pie - Chart.js - Todo Status",
    apiConfig: {
      endpoint: "/api/charts/todos/all",
      queryKey: ["todos", "all"],
      dataSourceId: "todos",
      transform: transformTodosForStatus,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Todo Status",
    },
  },
  {
    name: "Pie Plotly Todo Status",
    displayName: "Pie - Plotly - Todo Status",
    apiConfig: {
      endpoint: "/api/charts/todos/all",
      queryKey: ["todos", "all"],
      dataSourceId: "todos",
      transform: transformTodosForStatus,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Todo Status",
    },
  },

  // ============================================================================
  // LINE CHARTS - Weather Temperature (6 providers)
  // ============================================================================
  {
    name: "Line Nivo Temperature",
    displayName: "Line - Nivo - Temperature Trend",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature", "nivo"],
      transform: transformForNivoLine("date", "temperature", "Temperature"),
    },
    Component: NivoLineChart,
    chartOptions: {
      title: "Line - Nivo - Temperature Trend",
      xKey: "date",
      yKey: "temperature",
    },
  },
  {
    name: "Line Recharts Temperature",
    displayName: "Line - Recharts - Temperature Trend",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Line - Recharts - Temperature Trend",
      labelKey: "date",
      dataKey: "temperature",
      datasetLabel: "Temp °C",
    },
  },
  {
    name: "Line ECharts Temperature",
    displayName: "Line - ECharts - Temperature Trend",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Line - ECharts - Temperature Trend",
      xKey: "date",
      yKey: "temperature",
      xLabel: "Time",
    },
  },
  {
    name: "Line Plotly Temperature",
    displayName: "Line - Plotly - Temperature Trend",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Line - Plotly - Temperature Trend",
      xKey: "date",
      yKey: "temperature",
    },
  },
  {
    name: "Line D3 Temperature",
    displayName: "Line - D3 - Temperature Trend",
    apiConfig: {
      endpoint: "/api/charts/weather/temperature",
      queryKey: ["weather", "temperature", "d3"],
      transform: passthroughTransform,
    },
    Component: D3LineChart,
    chartOptions: {
      title: "Line - D3 - Temperature Trend",
      xKey: "date",
      yKey: "temperature",
    },
  },

  // ============================================================================
  // LINE CHARTS - Recipe Cooking Time (5 providers)
  // ============================================================================
  {
    name: "Line Nivo Cooking Time",
    displayName: "Line - Nivo - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForCookingTimeNivoLine,
    },
    Component: NivoLineChart,
    chartOptions: {
      title: "Line - Nivo - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Line Recharts Cooking Time",
    displayName: "Line - Recharts - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForCookingTime,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Line - Recharts - Cooking Times",
      labelKey: "name",
      dataKey: "cookTimeMinutes",
      datasetLabel: "Minutes",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Line ECharts Cooking Time",
    displayName: "Line - ECharts - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForCookingTime,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Line - ECharts - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
      xLabel: "Recipe ${name}",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Line Plotly Cooking Time",
    displayName: "Line - Plotly - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForCookingTime,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Line - Plotly - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
    filterConfig: recipesFilterConfig,
  },
  {
    name: "Line D3 Cooking Time",
    displayName: "Line - D3 - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForCookingTime,
    },
    Component: D3LineChart,
    chartOptions: {
      title: "Line - D3 - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
    filterConfig: recipesFilterConfig,
  },

  // ============================================================================
  // SCATTER CHARTS - Product Price vs Rating (6 providers)
  // ============================================================================
  {
    name: "Scatter Nivo Price Rating",
    displayName: "Scatter - Nivo - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceRatingFiltered,
    },
    Component: NivoScatterChart,
    chartOptions: {
      title: "Scatter - Nivo - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Scatter Recharts Price Rating",
    displayName: "Scatter - Recharts - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceRatingFiltered,
    },
    Component: RechartsScatterChart,
    chartOptions: {
      title: "Scatter - Recharts - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Scatter ECharts Price Rating",
    displayName: "Scatter - ECharts - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceRatingFiltered,
    },
    Component: EchartsScatterChart,
    chartOptions: {
      title: "Scatter - ECharts - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Scatter ChartJS Price Rating",
    displayName: "Scatter - Chart.js - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceRatingFiltered,
    },
    Component: ChartJsScatterChart,
    chartOptions: {
      title: "Scatter - Chart.js - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Scatter Plotly Price Rating",
    displayName: "Scatter - Plotly - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceRatingFiltered,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "Scatter - Plotly - Price vs Rating",
      xKey: "price",
      yKey: "rating",
      textKey: "id",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "Scatter D3 Price Rating",
    displayName: "Scatter - D3 - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceRatingFiltered,
    },
    Component: D3ScatterChart,
    chartOptions: {
      title: "Scatter - D3 - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
    filterConfig: productsFilterConfig,
  },

  // ============================================================================
  // SCATTER CHARTS - Pokemon Height vs Weight (3 providers)
  // ============================================================================
  {
    name: "Scatter ECharts Pokemon",
    displayName: "Scatter - ECharts - Pokemon Size",
    apiConfig: {
      endpoint: "/api/charts/pokemon/height-weight",
      queryKey: ["pokemon", "height-weight", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsScatterChart,
    chartOptions: {
      title: "Scatter - ECharts - Pokemon Size",
      xKey: "height",
      yKey: "weight",
    },
  },
  {
    name: "Scatter Plotly Pokemon",
    displayName: "Scatter - Plotly - Pokemon Size",
    apiConfig: {
      endpoint: "/api/charts/pokemon/height-weight",
      queryKey: ["pokemon", "height-weight", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "Scatter - Plotly - Pokemon Size",
      xKey: "height",
      yKey: "weight",
      textKey: "name",
    },
  },
  {
    name: "Scatter D3 Pokemon",
    displayName: "Scatter - D3 - Pokemon Size",
    apiConfig: {
      endpoint: "/api/charts/pokemon/height-weight",
      queryKey: ["pokemon", "height-weight", "d3"],
      transform: passthroughTransform,
    },
    Component: D3ScatterChart,
    chartOptions: {
      title: "Scatter - D3 - Pokemon Size",
      xKey: "height",
      yKey: "weight",
    },
  },

  // ============================================================================
  // RADAR CHARTS - Pokemon Stats (5 providers)
  // ============================================================================
  {
    name: "Radar Recharts Pokemon Stats",
    displayName: "Radar - Recharts - Pokemon Stats",
    apiConfig: {
      endpoint: "/api/charts/pokemon/stats",
      queryKey: ["pokemon", "stats", "recharts"],
      transform: transformPokemonForRechartsRadar,
    },
    Component: RechartsRadarChart,
    chartOptions: {
      title: "Radar - Recharts - Pokemon Stats",
    },
  },
  {
    name: "Radar ECharts Pokemon Stats",
    displayName: "Radar - ECharts - Pokemon Stats",
    apiConfig: {
      endpoint: "/api/charts/pokemon/stats",
      queryKey: ["pokemon", "stats", "echarts"],
      transform: transformPokemonForEchartsRadar,
    },
    Component: EchartsRadarChart,
    chartOptions: {
      title: "Radar - ECharts - Pokemon Stats",
    },
  },
  {
    name: "Radar ChartJS Pokemon Stats",
    displayName: "Radar - Chart.js - Pokemon Stats",
    apiConfig: {
      endpoint: "/api/charts/pokemon/stats",
      queryKey: ["pokemon", "stats", "chartjs"],
      transform: transformPokemonForChartJsRadar,
    },
    Component: ChartJsRadarChart,
    chartOptions: {
      title: "Radar - Chart.js - Pokemon Stats",
    },
  },
  {
    name: "Radar Plotly Pokemon Stats",
    displayName: "Radar - Plotly - Pokemon Stats",
    apiConfig: {
      endpoint: "/api/charts/pokemon/stats",
      queryKey: ["pokemon", "stats", "plotly"],
      transform: transformPokemonForChartJsRadar,
    },
    Component: PlotlyRadarChart,
    chartOptions: {
      title: "Radar - Plotly - Pokemon Stats",
    },
  },
  {
    name: "Radar D3 Pokemon Stats",
    displayName: "Radar - D3 - Pokemon Stats",
    apiConfig: {
      endpoint: "/api/charts/pokemon/stats",
      queryKey: ["pokemon", "stats", "d3"],
      transform: transformPokemonForChartJsRadar,
    },
    Component: D3RadarChart,
    chartOptions: {
      title: "Radar - D3 - Pokemon Stats",
    },
  },

  // ============================================================================
  // HEATMAP - Activity Heatmap (4 providers)
  // ============================================================================
  {
    name: "Heatmap Nivo Activity",
    displayName: "Heatmap - Nivo - Activity",
    apiConfig: {
      endpoint: "/api/charts/heatmap/sample",
      queryKey: ["heatmap", "sample", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoHeatmap2Chart,
    chartOptions: {
      title: "Heatmap - Nivo - Activity",
      xAxisLabel: "Hour",
      yAxisLabel: "Day",
    },
  },
  {
    name: "Heatmap ECharts Activity",
    displayName: "Heatmap - ECharts - Activity",
    apiConfig: {
      endpoint: "/api/charts/heatmap/sample",
      queryKey: ["heatmap", "sample", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsHeatmapChart,
    chartOptions: {
      title: "Heatmap - ECharts - Activity",
    },
  },
  {
    name: "Heatmap Plotly Activity",
    displayName: "Heatmap - Plotly - Activity",
    apiConfig: {
      endpoint: "/api/charts/heatmap/sample",
      queryKey: ["heatmap", "sample", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyHeatmapChart,
    chartOptions: {
      title: "Heatmap - Plotly - Activity",
    },
  },
  {
    name: "Heatmap D3 Activity",
    displayName: "Heatmap - D3 - Activity",
    apiConfig: {
      endpoint: "/api/charts/heatmap/sample",
      queryKey: ["heatmap", "sample", "d3"],
      transform: passthroughTransform,
    },
    Component: D3HeatmapChart,
    chartOptions: {
      title: "Heatmap - D3 - Activity",
    },
  },

  // ============================================================================
  // AREA CHARTS - SpaceX Launches (2 providers)
  // ============================================================================
  {
    name: "Area Recharts SpaceX",
    displayName: "Area - Recharts - SpaceX Launches",
    apiConfig: {
      endpoint: "/api/charts/spacex/all",
      queryKey: ["spacex", "all"],
      dataSourceId: "spacex",
      transform: transformSpaceXForLaunchesPerYear,
    },
    Component: RechartsAreaChart,
    chartOptions: {
      title: "Area - Recharts - SpaceX Launches",
      xKey: "date",
      dataKey: "count",
    },
  },
  {
    name: "Area D3 SpaceX",
    displayName: "Area - D3 - SpaceX Launches",
    apiConfig: {
      endpoint: "/api/charts/spacex/all",
      queryKey: ["spacex", "all"],
      dataSourceId: "spacex",
      transform: transformSpaceXForLaunchesPerYear,
    },
    Component: D3AreaChart,
    chartOptions: {
      title: "Area - D3 - SpaceX Launches",
      xKey: "date",
      yKey: "count",
    },
  },

  // ============================================================================
  // TREEMAP CHARTS - Products by Category (1 provider: ECharts)
  // ============================================================================
  {
    name: "Treemap ECharts Products",
    displayName: "Treemap - ECharts - Products by Category",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForTreemap,
    },
    Component: EChartsTreemap,
    chartOptions: {
      title: "Treemap - ECharts - Products by Category",
    },
    filterConfig: productsFilterConfig,
  },

  // ============================================================================
  // BOX PLOT CHARTS - Statistical Distributions (1 provider: ECharts)
  // ============================================================================
  {
    name: "BoxPlot ECharts Product Prices",
    displayName: "Box Plot - ECharts - Product Prices",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForPriceBoxPlot,
    },
    Component: EChartsBoxPlot,
    chartOptions: {
      title: "Box Plot - ECharts - Product Prices by Category",
    },
    filterConfig: productsFilterConfig,
  },
  {
    name: "BoxPlot ECharts Recipe Cook Times",
    displayName: "Box Plot - ECharts - Recipe Cook Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all"],
      dataSourceId: "recipes",
      transform: transformRecipesForCookTimeBoxPlot,
    },
    Component: EChartsBoxPlot,
    chartOptions: {
      title: "Box Plot - ECharts - Cook Times by Difficulty",
    },
    filterConfig: recipesFilterConfig,
  },

  // ============================================================================
  // FUNNEL CHARTS - Conversion Pipeline (1 provider: ECharts)
  // ============================================================================
  {
    name: "Funnel ECharts Conversion",
    displayName: "Funnel - ECharts - E-commerce Conversion",
    apiConfig: {
      endpoint: "/api/charts/analytics/funnel",
      queryKey: ["analytics", "funnel"],
      transform: passthroughTransformForFunnel,
    },
    Component: EChartsFunnel,
    chartOptions: {
      title: "Funnel - ECharts - E-commerce Conversion",
    },
  },

  // ============================================================================
  // SUNBURST CHARTS - Hierarchical Product Data (1 provider: ECharts)
  // ============================================================================
  {
    name: "Sunburst ECharts Products",
    displayName: "Sunburst - ECharts - Products by Category",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all"],
      dataSourceId: "products",
      transform: transformProductsForSunburst,
    },
    Component: EChartsSunburst,
    chartOptions: {
      title: "Sunburst - ECharts - Products by Category",
    },
    filterConfig: productsFilterConfig,
  },
];
