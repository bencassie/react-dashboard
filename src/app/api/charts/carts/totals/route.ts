import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/carts", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch carts" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const carts = data?.carts || [];

    const transformed = carts.map((c: any) => ({
      id: c.id,
      total: c.total || 0,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching carts totals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
