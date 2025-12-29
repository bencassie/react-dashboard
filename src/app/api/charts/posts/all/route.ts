import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/posts?limit=100", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const posts = data?.posts || [];

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
