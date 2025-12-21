import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/users", {
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

    const genderCount = users.reduce((acc: Record<string, number>, u: any) => {
      const gender = u.gender;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const transformed = Object.entries(genderCount).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching users gender:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
