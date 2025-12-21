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

    const categoryCount = products.reduce(
      (acc: Record<string, number>, p: any) => {
        const cat = p.category;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {}
    );

    const transformed = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching products categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
