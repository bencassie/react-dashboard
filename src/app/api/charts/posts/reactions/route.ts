import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/posts", {
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

    const transformed = posts
      .sort((a: any, b: any) => {
        const aTotal = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0);
        const bTotal = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0);
        return bTotal - aTotal;
      })
      .slice(0, 5)
      .map((p: any) => ({
        title: p.title.slice(0, 20),
        reactions: (p.reactions?.likes || 0) + (p.reactions?.dislikes || 0),
      }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching posts reactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
