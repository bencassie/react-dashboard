import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/quotes", {
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

    const categoryCount = quotes.reduce((acc: Record<string, number>, q: any) => {
      const author = q.author || "Unknown";
      acc[author] = (acc[author] || 0) + 1;
      return acc;
    }, {});

    const transformed = Object.entries(categoryCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 8)
      .map(([author, count]) => ({
        name: author.slice(0, 15),
        value: count,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching quotes authors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
