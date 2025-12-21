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

    const bloodTypeCount = users.reduce((acc: Record<string, number>, u: any) => {
      const bloodType = u.bloodGroup || "Unknown";
      acc[bloodType] = (acc[bloodType] || 0) + 1;
      return acc;
    }, {});

    const transformed = Object.entries(bloodTypeCount).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching users blood-type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
