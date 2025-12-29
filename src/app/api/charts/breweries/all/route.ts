import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=200", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch breweries" },
        { status: res.status }
      );
    }

    const breweries = await res.json();

    return NextResponse.json(breweries);
  } catch (error) {
    console.error("Error fetching breweries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
