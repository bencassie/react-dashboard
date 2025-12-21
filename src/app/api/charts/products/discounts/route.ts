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

    const transformed = products
      .slice(0, 20)
      .map((p: any) => ({
        id: p.id,
        discount: p.discountPercentage || 0,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching products discounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
