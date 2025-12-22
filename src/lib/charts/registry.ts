// src/lib/charts/registry.ts
import dynamic from "next/dynamic";
import type { ChartConfig } from "./types";
import {
  passthroughTransform,
  passthroughWithDateTransform,
  transformDifficultyToNameValue,
  transformStatusToNameValue,
  transformPokemonForRechartsRadar,
  transformPokemonForEchartsRadar,
  transformPokemonForChartJsRadar,
  transformForNivoLine,
  transformProductsForTreemap,
  transformProductsForSunburst,
  transformProductsForPriceBoxPlot,
  transformRecipesForCookTimeBoxPlot,
  passthroughTransformForFunnel,
} from "./transforms";

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
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Bar - Nivo - Brand Counts",
      keys: ["count"],
      indexBy: "brand",
      xAxisLabel: "Brand",
      yAxisLabel: "Count",
    },
  },
  {
    name: "Bar Recharts Brand Counts",
    displayName: "Bar - Recharts - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Bar - Recharts - Brand Counts",
      dataKey: "count",
      xKey: "brand",
    },
  },
  {
    name: "Bar ECharts Brand Counts",
    displayName: "Bar - ECharts - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Bar - ECharts - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "Bar ChartJS Brand Counts",
    displayName: "Bar - Chart.js - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Bar - Chart.js - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "Bar Plotly Brand Counts",
    displayName: "Bar - Plotly - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "Bar - Plotly - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
  },
  {
    name: "Bar D3 Brand Counts",
    displayName: "Bar - D3 - Brand Counts",
    apiConfig: {
      endpoint: "/api/charts/products/brand-counts",
      queryKey: ["products", "brand-counts", "d3"],
      transform: passthroughTransform,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Bar - D3 - Brand Counts",
      xKey: "brand",
      yKey: "count",
    },
  },

  // ============================================================================
  // BAR CHARTS - Age Distribution (6 providers)
  // ============================================================================
  {
    name: "Bar Nivo Age Distribution",
    displayName: "Bar - Nivo - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoBarChart,
    chartOptions: {
      title: "Bar - Nivo - Age Groups",
      keys: ["count"],
      indexBy: "range",
      xAxisLabel: "Age Range",
      yAxisLabel: "Count",
    },
  },
  {
    name: "Bar Recharts Age Distribution",
    displayName: "Bar - Recharts - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsBarChart,
    chartOptions: {
      title: "Bar - Recharts - Age Groups",
      dataKey: "count",
      xKey: "range",
    },
  },
  {
    name: "Bar ECharts Age Distribution",
    displayName: "Bar - ECharts - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsBarChart,
    chartOptions: {
      title: "Bar - ECharts - Age Groups",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "Bar ChartJS Age Distribution",
    displayName: "Bar - Chart.js - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsBarChart,
    chartOptions: {
      title: "Bar - Chart.js - Age Groups",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "Bar Plotly Age Distribution",
    displayName: "Bar - Plotly - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyBarChart,
    chartOptions: {
      title: "Bar - Plotly - Age Groups",
      xKey: "range",
      yKey: "count",
    },
  },
  {
    name: "Bar D3 Age Distribution",
    displayName: "Bar - D3 - Age Groups",
    apiConfig: {
      endpoint: "/api/charts/users/age-distribution",
      queryKey: ["users", "age-distribution", "d3"],
      transform: passthroughTransform,
    },
    Component: D3BarChart,
    chartOptions: {
      title: "Bar - D3 - Age Groups",
      xKey: "range",
      yKey: "count",
    },
  },

  // ============================================================================
  // PIE CHARTS - Product Categories (5 providers, D3 doesn't have pie)
  // ============================================================================
  {
    name: "Pie Nivo Categories",
    displayName: "Pie - Nivo - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Product Categories",
    },
  },
  {
    name: "Pie Recharts Categories",
    displayName: "Pie - Recharts - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Product Categories",
    },
  },
  {
    name: "Pie ECharts Categories",
    displayName: "Pie - ECharts - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Product Categories",
      radius: "60%",
    },
  },
  {
    name: "Pie ChartJS Categories",
    displayName: "Pie - Chart.js - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories", "chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Product Categories",
    },
  },
  {
    name: "Pie Plotly Categories",
    displayName: "Pie - Plotly - Product Categories",
    apiConfig: {
      endpoint: "/api/charts/products/categories",
      queryKey: ["products", "categories", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Product Categories",
    },
  },

  // ============================================================================
  // PIE CHARTS - Gender Distribution (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Gender",
    displayName: "Pie - Nivo - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Gender Distribution",
    },
  },
  {
    name: "Pie Recharts Gender",
    displayName: "Pie - Recharts - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Gender Distribution",
    },
  },
  {
    name: "Pie ECharts Gender",
    displayName: "Pie - ECharts - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Gender Distribution",
      radius: "60%",
    },
  },
  {
    name: "Pie ChartJS Gender",
    displayName: "Pie - Chart.js - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender", "chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Gender Distribution",
    },
  },
  {
    name: "Pie Plotly Gender",
    displayName: "Pie - Plotly - Gender Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/gender",
      queryKey: ["users", "gender", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Gender Distribution",
    },
  },

  // ============================================================================
  // PIE CHARTS - Blood Type (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Blood Type",
    displayName: "Pie - Nivo - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Blood Type Distribution",
    },
  },
  {
    name: "Pie Recharts Blood Type",
    displayName: "Pie - Recharts - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Blood Type Distribution",
    },
  },
  {
    name: "Pie ECharts Blood Type",
    displayName: "Pie - ECharts - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Blood Type Distribution",
      radius: "60%",
    },
  },
  {
    name: "Pie ChartJS Blood Type",
    displayName: "Pie - Chart.js - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type", "chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Blood Type Distribution",
    },
  },
  {
    name: "Pie Plotly Blood Type",
    displayName: "Pie - Plotly - Blood Type Distribution",
    apiConfig: {
      endpoint: "/api/charts/users/blood-type",
      queryKey: ["users", "blood-type", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Blood Type Distribution",
    },
  },

  // ============================================================================
  // PIE CHARTS - Recipe Difficulty (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Recipe Difficulty",
    displayName: "Pie - Nivo - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "nivo"],
      transform: transformDifficultyToNameValue,
    },
    Component: NivoPieChart,
    chartOptions: {
      title: "Pie - Nivo - Recipe Difficulty",
    },
  },
  {
    name: "Pie Recharts Recipe Difficulty",
    displayName: "Pie - Recharts - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "recharts"],
      transform: transformDifficultyToNameValue,
    },
    Component: RechartsPieChart,
    chartOptions: {
      title: "Pie - Recharts - Recipe Difficulty",
    },
  },
  {
    name: "Pie ECharts Recipe Difficulty",
    displayName: "Pie - ECharts - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "echarts"],
      transform: transformDifficultyToNameValue,
    },
    Component: EchartsPieChart,
    chartOptions: {
      title: "Pie - ECharts - Recipe Difficulty",
      radius: "60%",
    },
  },
  {
    name: "Pie ChartJS Recipe Difficulty",
    displayName: "Pie - Chart.js - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "chartjs"],
      transform: transformDifficultyToNameValue,
    },
    Component: ChartJsPieChart,
    chartOptions: {
      title: "Pie - Chart.js - Recipe Difficulty",
    },
  },
  {
    name: "Pie Plotly Recipe Difficulty",
    displayName: "Pie - Plotly - Recipe Difficulty",
    apiConfig: {
      endpoint: "/api/charts/recipes/difficulty",
      queryKey: ["recipes", "difficulty", "plotly"],
      transform: transformDifficultyToNameValue,
    },
    Component: PlotlyPieChart,
    chartOptions: {
      title: "Pie - Plotly - Recipe Difficulty",
    },
  },

  // ============================================================================
  // PIE CHARTS - Todo Status (5 providers)
  // ============================================================================
  {
    name: "Pie Nivo Todo Status",
    displayName: "Pie - Nivo - Todo Status",
    apiConfig: {
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "nivo"],
      transform: transformStatusToNameValue,
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
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "recharts"],
      transform: transformStatusToNameValue,
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
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "echarts"],
      transform: transformStatusToNameValue,
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
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "chartjs"],
      transform: transformStatusToNameValue,
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
      endpoint: "/api/charts/todos/status",
      queryKey: ["todos", "status", "plotly"],
      transform: transformStatusToNameValue,
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
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time", "nivo"],
      transform: transformForNivoLine("name", "cookTimeMinutes", "Recipes"),
    },
    Component: NivoLineChart,
    chartOptions: {
      title: "Line - Nivo - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },
  {
    name: "Line Recharts Cooking Time",
    displayName: "Line - Recharts - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsLineChart,
    chartOptions: {
      title: "Line - Recharts - Cooking Times",
      labelKey: "name",
      dataKey: "cookTimeMinutes",
      datasetLabel: "Minutes",
    },
  },
  {
    name: "Line ECharts Cooking Time",
    displayName: "Line - ECharts - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsLineChart,
    chartOptions: {
      title: "Line - ECharts - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
      xLabel: "Recipe ${name}",
    },
  },
  {
    name: "Line Plotly Cooking Time",
    displayName: "Line - Plotly - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyLineChart,
    chartOptions: {
      title: "Line - Plotly - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },
  {
    name: "Line D3 Cooking Time",
    displayName: "Line - D3 - Cooking Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/cooking-time",
      queryKey: ["recipes", "cooking-time", "d3"],
      transform: passthroughTransform,
    },
    Component: D3LineChart,
    chartOptions: {
      title: "Line - D3 - Cooking Times",
      xKey: "name",
      yKey: "cookTimeMinutes",
    },
  },

  // ============================================================================
  // SCATTER CHARTS - Product Price vs Rating (6 providers)
  // ============================================================================
  {
    name: "Scatter Nivo Price Rating",
    displayName: "Scatter - Nivo - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating", "nivo"],
      transform: passthroughTransform,
    },
    Component: NivoScatterChart,
    chartOptions: {
      title: "Scatter - Nivo - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
  },
  {
    name: "Scatter Recharts Price Rating",
    displayName: "Scatter - Recharts - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating", "recharts"],
      transform: passthroughTransform,
    },
    Component: RechartsScatterChart,
    chartOptions: {
      title: "Scatter - Recharts - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
  },
  {
    name: "Scatter ECharts Price Rating",
    displayName: "Scatter - ECharts - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating", "echarts"],
      transform: passthroughTransform,
    },
    Component: EchartsScatterChart,
    chartOptions: {
      title: "Scatter - ECharts - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
  },
  {
    name: "Scatter ChartJS Price Rating",
    displayName: "Scatter - Chart.js - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating", "chartjs"],
      transform: passthroughTransform,
    },
    Component: ChartJsScatterChart,
    chartOptions: {
      title: "Scatter - Chart.js - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
  },
  {
    name: "Scatter Plotly Price Rating",
    displayName: "Scatter - Plotly - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating", "plotly"],
      transform: passthroughTransform,
    },
    Component: PlotlyScatterChart,
    chartOptions: {
      title: "Scatter - Plotly - Price vs Rating",
      xKey: "price",
      yKey: "rating",
      textKey: "id",
    },
  },
  {
    name: "Scatter D3 Price Rating",
    displayName: "Scatter - D3 - Price vs Rating",
    apiConfig: {
      endpoint: "/api/charts/products/price-rating",
      queryKey: ["products", "price-rating", "d3"],
      transform: passthroughTransform,
    },
    Component: D3ScatterChart,
    chartOptions: {
      title: "Scatter - D3 - Price vs Rating",
      xKey: "price",
      yKey: "rating",
    },
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
      endpoint: "/api/charts/spacex/launches",
      queryKey: ["spacex", "launches", "recharts"],
      transform: passthroughWithDateTransform,
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
      endpoint: "/api/charts/spacex/launches",
      queryKey: ["spacex", "launches", "d3"],
      transform: passthroughWithDateTransform,
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
      queryKey: ["products", "all", "treemap"],
      transform: transformProductsForTreemap,
    },
    Component: EChartsTreemap,
    chartOptions: {
      title: "Treemap - ECharts - Products by Category",
    },
  },

  // ============================================================================
  // BOX PLOT CHARTS - Statistical Distributions (1 provider: ECharts)
  // ============================================================================
  {
    name: "BoxPlot ECharts Product Prices",
    displayName: "Box Plot - ECharts - Product Prices",
    apiConfig: {
      endpoint: "/api/charts/products/all",
      queryKey: ["products", "all", "boxplot-prices"],
      transform: transformProductsForPriceBoxPlot,
    },
    Component: EChartsBoxPlot,
    chartOptions: {
      title: "Box Plot - ECharts - Product Prices by Category",
    },
  },
  {
    name: "BoxPlot ECharts Recipe Cook Times",
    displayName: "Box Plot - ECharts - Recipe Cook Times",
    apiConfig: {
      endpoint: "/api/charts/recipes/all",
      queryKey: ["recipes", "all", "boxplot-cooktimes"],
      transform: transformRecipesForCookTimeBoxPlot,
    },
    Component: EChartsBoxPlot,
    chartOptions: {
      title: "Box Plot - ECharts - Cook Times by Difficulty",
    },
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
      queryKey: ["products", "all", "sunburst"],
      transform: transformProductsForSunburst,
    },
    Component: EChartsSunburst,
    chartOptions: {
      title: "Sunburst - ECharts - Products by Category",
    },
  },
];
