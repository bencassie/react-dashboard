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

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
