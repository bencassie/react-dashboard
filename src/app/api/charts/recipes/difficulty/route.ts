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

    const difficultyCount = recipes.reduce((acc: Record<string, number>, r: any) => {
      const difficulty = r.difficulty || "Unknown";
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    const transformed = Object.entries(difficultyCount).map(([difficulty, count]) => ({
      difficulty,
      count,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching recipes difficulty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
