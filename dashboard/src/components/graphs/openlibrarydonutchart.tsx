"use client";
import { memo, useMemo } from "react";
import { VegaLite } from "react-vega";
import type { VisualizationSpec } from "vega-lite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

/**
 * Accepts any of:
 * 1) { table: {name,value}[] } (already prepared)
 * 2) { works: [{ subject?: string[] }...] }  -> counts subjects
 * 3) { subjects: [{ name: string, work_count: number }...] } -> maps directly
 * 4) { name, work_count } at root (rare)
 */
function toNameValueTable(raw: any, limit = 12): { name: string; value: number }[] {
  if (!raw) return [];

  // 1) Already prepared
  if (Array.isArray((raw as any).table)) {
    return (raw.table as any[])
      .map((d) => ({ name: String(d.name), value: Number(d.value) }))
      .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0);
  }

  // 2) From works[].subject[]
  if (Array.isArray(raw.works)) {
    const counts = new Map<string, number>();
    for (const w of raw.works) {
      const subjects: string[] = Array.isArray(w?.subject) ? w.subject : [];
      for (const s of subjects) {
        const key = String(s).trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  // 3) From subjects[].{name, work_count}
  if (Array.isArray(raw.subjects)) {
    return raw.subjects
      .map((s: any) => ({ name: String(s?.name ?? "").trim(), value: Number(s?.work_count ?? 0) }))
      .filter((d: any) => d.name && Number.isFinite(d.value) && d.value > 0)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, limit);
  }

  // 4) Root {name, work_count}
  if (raw.name && raw.work_count) {
    return [{ name: String(raw.name), value: Number(raw.work_count) }].filter(
      (d) => d.name && Number.isFinite(d.value) && d.value > 0
    );
  }

  // Fallback: try common keys
  const maybeArray = Array.isArray(raw) ? raw : [];
  if (maybeArray.length && typeof maybeArray[0] === "object") {
    const projected = maybeArray
      .map((d: any) => ({
        name: String(d?.name ?? d?.label ?? d?.id ?? "").trim(),
        value: Number(d?.value ?? d?.count ?? d?.work_count ?? 0),
      }))
      .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0);
    if (projected.length) return projected.slice(0, limit);
  }

  return [];
}

function OpenLibraryDonutChartInner({ data, isLoading, error }: ChartComponentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-96 w-full" /></CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
        <CardContent><p className="text-red-500">Error loading data</p></CardContent>
      </Card>
    );
  }

  const table = toNameValueTable(data, 12);

  if (table.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No usable data returned from API.</div>
          <pre className="mt-3 max-h-48 overflow-auto text-xs text-muted-foreground">
            {JSON.stringify(
              data && typeof data === "object"
                ? { keys: Object.keys(data), sample: Array.isArray(data?.works) ? data.works[0] : data?.subjects?.[0] }
                : typeof data,
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    );
  }

  const spec: VisualizationSpec = useMemo(
    () => ({
      width: "container",
      height: 360,
      autosize: { type: "fit", contains: "padding" },
      data: { name: "table" },
      mark: { type: "arc", innerRadius: 100 },
      encoding: {
        theta: { field: "value", type: "quantitative", stack: "normalize" },
        color: { field: "name", type: "nominal", legend: { orient: "right" } },
        tooltip: [
          { field: "name", type: "nominal", title: "Subject" },
          { field: "value", type: "quantitative", title: "Count" },
        ],
        order: { field: "value", type: "quantitative", sort: "descending" },
      },
    }),
    []
  );

  return (
    <Card>
      <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <VegaLite spec={spec} data={{ table }} actions={false} />
        </div>
      </CardContent>
    </Card>
  );
}

const OpenLibraryDonutChart = memo(OpenLibraryDonutChartInner);
OpenLibraryDonutChart.displayName = "OpenLibraryDonutChart";
export default OpenLibraryDonutChart;
