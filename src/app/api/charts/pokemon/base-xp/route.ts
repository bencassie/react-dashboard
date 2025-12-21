import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pokemon list" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const results = data?.results ?? [];

    // Fetch detailed data for each pokemon
    const detailUrls = results.map((r: any) => r.url).filter(Boolean).slice(0, 50);
    const detailResponses = await Promise.all(
      detailUrls.map((url: string) => fetch(url, { cache: "no-store" }))
    );
    const detailJson = await Promise.all(
      detailResponses.map((r) => (r.ok ? r.json() : null))
    );

    const transformed = detailJson
      .filter(Boolean)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        base_experience: p.base_experience ?? 0,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching pokemon base-xp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
