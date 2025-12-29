import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/users?limit=100", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const users = data?.users || [];

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
