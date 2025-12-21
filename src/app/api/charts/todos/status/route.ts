import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/todos", {
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

    const completed = todos.filter((t: any) => t.completed).length;
    const incomplete = todos.length - completed;

    const transformed = [
      { status: "Completed", count: completed },
      { status: "Incomplete", count: incomplete },
    ];

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching todos status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
