import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/recipes", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const recipes = data?.recipes || [];

    const transformed = recipes
      .slice(0, 15)
      .map((r: any) => ({
        id: r.id,
        time: r.cookTimeMinutes || 0,
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching recipes cooking-time:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
