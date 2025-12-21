import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch(
      "https://openlibrary.org/subjects/science.json?limit=200&details=true",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch library data" },
        { status: res.status }
      );
    }

    const raw = await res.json();

    // Handle different response structures
    if (Array.isArray(raw.subjects) && raw.subjects.length) {
      const transformed = raw.subjects
        .map((s: any) => ({
          name: String(s?.name ?? s?.key ?? "").trim(),
          value: Number(s?.work_count ?? s?.count ?? 0),
        }))
        .filter((d: any) => d.name && Number.isFinite(d.value) && d.value > 0)
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 12);

      return NextResponse.json(transformed);
    }

    if (Array.isArray(raw.works) && raw.works.length) {
      const counts = new Map<string, number>();
      for (const w of raw.works) {
        const subjects = Array.isArray(w?.subject)
          ? w.subject
          : Array.isArray(w?.subjects)
          ? w.subjects
          : [];
        for (const s of subjects) {
          const k = String(s ?? "").trim();
          if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
        }
      }
      const transformed = Array.from(counts, ([name, value]) => ({ name, value }))
        .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 12);

      return NextResponse.json(transformed);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching library subject-works:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
