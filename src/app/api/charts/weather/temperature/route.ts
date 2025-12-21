import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m&forecast_days=2&timezone=UTC",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const hours = data?.hourly?.time ?? [];
    const temps = data?.hourly?.temperature_2m ?? [];

    const transformed = hours.slice(0, 24).map((t: string, i: number) => ({
      time: t.slice(11, 16),
      temp: temps[i],
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching weather temperature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
