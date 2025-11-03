// src/components/graphs/openlibrarydonutchart_echarts.tsx
"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartComponentProps } from "@/lib/charts/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

function toNameValueTable(raw: any, limit = 12): { name: string; value: number }[] {
  if (!raw) return [];
  if (Array.isArray(raw.subjects) && raw.subjects.length) {
    return raw.subjects
      .map((s: any) => ({
        name: String(s?.name ?? s?.key ?? "").trim(),
        value: Number(s?.work_count ?? s?.count ?? 0),
      }))
      .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }
  if (Array.isArray(raw.works) && raw.works.length) {
    const counts = new Map<string, number>();
    for (const w of raw.works) {
      const a = Array.isArray((w as any)?.subject) ? (w as any).subject : [];
      const b = Array.isArray((w as any)?.subjects) ? (w as any).subjects : [];
      for (const s of [...a, ...b]) {
        const k = String(s ?? "").trim();
        if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    return Array.from(counts, ([name, value]) => ({ name, value }))
      .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }
  if (Array.isArray((raw as any).table)) {
    return (raw.table as any[])
      .map((d) => ({ name: String(d.name), value: Number(d.value) }))
      .filter((d) => d.name && Number.isFinite(d.value) && d.value > 0);
  }
  if (raw.name && raw.work_count) {
    const name = String(raw.name).trim();
    const value = Number(raw.work_count);
    return name && Number.isFinite(value) && value > 0 ? [{ name, value }] : [];
  }
  return [];
}

function OpenLibraryDonutChartEchartsInner({ data, isLoading, error }: ChartComponentProps) {
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

  const table = useMemo(() => toNameValueTable(data, 12), [data]);

  if (table.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No usable data returned from API.</div>
          <pre className="mt-3 max-h-48 overflow-auto text-xs text-muted-foreground">
            {JSON.stringify(
              data && typeof data === "object"
                ? {
                    keys: Object.keys(data),
                    sample: Array.isArray((data as any)?.subjects)
                      ? (data as any).subjects?.[0]
                      : Array.isArray((data as any)?.works)
                      ? (data as any).works?.[0]
                      : null,
                  }
                : typeof data,
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    );
  }

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    series: [
      {
        type: "pie",
        radius: ["50%", "75%"],
        avoidLabelOverlap: true,
        label: { show: true, formatter: "{b}" },
        labelLine: { show: true },
        data: table,
      },
    ],
  };

  return (
    <Card>
      <CardHeader><CardTitle>Open Library: Works by Sub-Subject</CardTitle></CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
}

const OpenLibraryDonutChartEcharts = memo(OpenLibraryDonutChartEchartsInner);
OpenLibraryDonutChartEcharts.displayName = "OpenLibraryDonutChartEcharts";
export default OpenLibraryDonutChartEcharts;
