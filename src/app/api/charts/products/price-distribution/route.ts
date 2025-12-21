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

    const priceRanges: Record<string, number> = {
      "0-50": 0,
      "51-100": 0,
      "101-500": 0,
      "501-1000": 0,
      "1001+": 0,
    };

    products.forEach((p: any) => {
      const price = p.price;
      if (price <= 50) priceRanges["0-50"]++;
      else if (price <= 100) priceRanges["51-100"]++;
      else if (price <= 500) priceRanges["101-500"]++;
      else if (price <= 1000) priceRanges["501-1000"]++;
      else priceRanges["1001+"]++;
    });

    const order = ["0-50", "51-100", "101-500", "501-1000", "1001+"];
    const transformed = order.map((range, index) => ({
      date: new Date(2024, index, 1).toISOString(),
      count: priceRanges[range],
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching products price-distribution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
