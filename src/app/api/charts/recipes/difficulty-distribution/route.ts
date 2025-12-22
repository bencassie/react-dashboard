import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/recipes?limit=100", {
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

    // Count recipes by difficulty
    const difficultyCounts = new Map<string, number>();

    recipes.forEach((r: any) => {
      const difficulty = r.difficulty || "Unknown";
      difficultyCounts.set(difficulty, (difficultyCounts.get(difficulty) || 0) + 1);
    });

    // Convert to array format with consistent ordering
    const transformed = Array.from(difficultyCounts.entries())
      .map(([difficulty, count]) => ({
        difficulty,
        count,
      }))
      .sort((a, b) => {
        // Sort: Easy, Medium, Hard, Unknown
        const order = { Easy: 0, Medium: 1, Hard: 2, Unknown: 3 };
        return (order[a.difficulty as keyof typeof order] || 3) - (order[b.difficulty as keyof typeof order] || 3);
      });

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching recipe difficulty distribution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
