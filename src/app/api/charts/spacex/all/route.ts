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

    const launches = await res.json();

    return NextResponse.json(launches);
  } catch (error) {
    console.error("Error fetching SpaceX launches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
