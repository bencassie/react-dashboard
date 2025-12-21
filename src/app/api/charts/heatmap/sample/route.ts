import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Generate sample heatmap data on the server
    const transformed = Array.from({ length: 7 }, (_, i) => ({
      id: `Day ${i + 1}`,
      data: Array.from({ length: 12 }, (_, h) => ({
        x: `${h * 2}:00`,
        y: Math.floor(Math.random() * 100),
      })),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error generating heatmap sample:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
