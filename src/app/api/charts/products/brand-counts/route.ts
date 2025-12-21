import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/products", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const products = data?.products || [];

    const brandCount = products.reduce((acc: Record<string, number>, p: any) => {
      const brand = p.brand || "Unknown";
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {});

    const transformed = Object.entries(brandCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([brand, count]) => ({
        brand,
        count,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching products brand-counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
