import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=30", {
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

    // Return products with price (x), rating (y), stock (size)
    const transformed = products.map((p: any) => ({
      id: p.id,
      name: p.title,
      price: p.price,
      rating: p.rating,
      stock: p.stock,
      category: p.category,
      brand: p.brand || "Unknown",
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching products bubble data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
