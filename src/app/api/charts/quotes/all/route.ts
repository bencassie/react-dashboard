import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/quotes?limit=100", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch quotes" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const quotes = data?.quotes || [];

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
