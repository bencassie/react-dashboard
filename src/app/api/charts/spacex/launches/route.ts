import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://api.spacexdata.com/v5/launches", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch SpaceX launches" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const launches = Array.isArray(data) ? data : [];

    const counts: Record<string, number> = {};
    for (const l of launches) {
      const y = (l.date_utc || l.date_local || "").slice(0, 4);
      if (y) counts[y] = (counts[y] || 0) + 1;
    }

    const transformed = Object.entries(counts)
      .map(([year, count]) => ({
        date: new Date(`${year}-01-01T00:00:00Z`).toISOString(),
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching spacex launches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
