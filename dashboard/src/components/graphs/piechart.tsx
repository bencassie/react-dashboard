"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function PieChart({ data, isLoading }: { data?: any; isLoading?: boolean }) {
  console.log('PieChart render begin');
  if (isLoading) {
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
  console.log('PieChart render end');
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