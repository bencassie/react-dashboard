import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=100", {
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

    // Count products by category
    const categoryCounts = new Map<string, number>();

    products.forEach((p: any) => {
      const category = p.category || "Unknown";
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });

    // Convert to array format
    const transformed = Array.from(categoryCounts.entries())
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching product category distribution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
