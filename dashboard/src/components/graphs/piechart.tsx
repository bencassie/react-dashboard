"use client";
import { memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });
const isDev = process.env.NODE_ENV === "development";
const getTimestamp = () => new Date().toISOString();

function PieChartInner({ data, isLoading }: { data?: any; isLoading?: boolean }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isDev) {
      console.log(`[${getTimestamp()}] PieChart mounted, setting ready`);
    }
    setIsReady(true);
  }, []);

  if (isDev) {
    console.log(`[${getTimestamp()}] PieChart render begin (ready: ${isReady})`);
  }
  if (isLoading || !isReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }
  const products = data?.products || [];
  const pieData = products.reduce((acc: Record<string, number>, p: any) => {
    const cat = p.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const pieOption = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: Object.entries(pieData).map(([name, value]) => ({ name, value })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" } },
      },
    ],
  };
  if (isDev) {
    console.log(`[${getTimestamp()}] PieChart render end`);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={pieOption} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const PieChart = memo(PieChartInner);
PieChart.displayName = "PieChart";
export default PieChart;