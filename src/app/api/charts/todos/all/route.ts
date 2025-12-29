import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/todos?limit=150", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch todos" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const todos = data?.todos || [];

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
