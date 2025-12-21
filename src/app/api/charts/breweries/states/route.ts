import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=200", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch breweries data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : [];

    const counts: Record<string, number> = {};
    for (const b of list) {
      const state = b.state_province || b.state || "Unknown";
      counts[state] = (counts[state] || 0) + 1;
    }

    const transformed = Object.entries(counts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching breweries states:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
