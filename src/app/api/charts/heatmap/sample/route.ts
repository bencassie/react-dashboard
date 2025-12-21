import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Cache the heatmap data to avoid regenerating on every request
let cachedData: any = null;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function GET() {
  try {
    // Return cached data if available and fresh
    const now = Date.now();
    if (cachedData && (now - cacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Generate sample heatmap data on the server
    const transformed = Array.from({ length: 7 }, (_, i) => ({
      id: `Day ${i + 1}`,
      data: Array.from({ length: 12 }, (_, h) => ({
        x: `${h * 2}:00`,
        y: Math.floor(Math.random() * 100),
      })),
    }));

    // Update cache
    cachedData = transformed;
    cacheTime = now;

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error generating heatmap sample:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
