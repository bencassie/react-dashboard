import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/carts?limit=50", {
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

    return NextResponse.json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
