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

    const ageRanges: Record<string, number> = {
      "18-25": 0,
      "26-35": 0,
      "36-45": 0,
      "46-60": 0,
      "60+": 0,
    };

    users.forEach((u: any) => {
      const age = u.age;
      if (age <= 25) ageRanges["18-25"]++;
      else if (age <= 35) ageRanges["26-35"]++;
      else if (age <= 45) ageRanges["36-45"]++;
      else if (age <= 60) ageRanges["46-60"]++;
      else ageRanges["60+"]++;
    });

    const transformed = Object.entries(ageRanges).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching users age-distribution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
