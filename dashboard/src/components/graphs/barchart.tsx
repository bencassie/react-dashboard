"use client";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BarChart({ data, isLoading, error }: { data?: any; isLoading?: boolean; error?: Error }) {
  console.log('BarChart render begin');
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price vs Rating (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price vs Rating (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading data</p>
        </CardContent>
      </Card>
    );
  }

  const products = data?.products || [];
  const barData = products.slice(0, 10).map((p: any) => ({
    id: p.title.slice(0, 20),
    price: p.price,
    rating: p.rating,
  }));

  console.log('BarChart render end');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price vs Rating (Top 10)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveBar
            data={barData}
            keys={["price", "rating"]}
            indexBy="id"
            margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Product",
              legendPosition: "middle",
              legendOffset: 50,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: "Value",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                translateX: 120,
                itemWidth: 100,
                itemHeight: 20,
              },
            ]}
            role="application"
            ariaLabel="Bar chart of price and rating"
          />
        </div>
      </CardContent>
    </Card>
  );
}