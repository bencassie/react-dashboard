import BarChart from "./BarChart";
import PieChart from "./PieChart";
import HeatmapChart from "./HeatmapChart";

export type GraphModule = {
  name: string;
  Component: React.FC<{ data?: any; isLoading?: boolean; error?: Error }>;
};

export const graphs: GraphModule[] = [
  { name: "Bar Chart", Component: BarChart },
  { name: "Pie Chart", Component: PieChart },
  { name: "Heatmap Chart", Component: HeatmapChart },
];