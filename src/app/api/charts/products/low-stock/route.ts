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
      .filter((p: any) => p.stock < 50)
      .sort((a: any, b: any) => a.stock - b.stock)
      .slice(0, 10)
      .map((p: any) => ({
        product: p.title.slice(0, 15),
        stock: p.stock,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching products low-stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
