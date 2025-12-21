// app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure server console logging

function redact(u: string) {
  try {
    const url = new URL(u);
    // scrub obvious secrets in query
    for (const k of url.searchParams.keys()) {
      if (/(token|key|secret|sig|auth)/i.test(k)) {
        url.searchParams.set(k, "REDACTED");
      }
    }
    return url.toString();
  } catch {
    return u;
  }
}

function isTextual(ct: string) {
  if (!ct) return false;
  const lower = ct.toLowerCase();
  return (
    lower.startsWith("application/json") ||
    lower.startsWith("text/") ||
    lower.includes("+json") ||
    lower.includes("javascript") ||
    lower.includes("xml")
  );
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    console.error(`[proxy] 400 missing ?url`);
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const target = decodeURIComponent(urlParam);
  const started = process.hrtime.bigint();

  let status = 0;
  let size = 0;
  let bodyForClient: string | Uint8Array = "";
  let contentType = "";
  let errorMsg: string | undefined;

  try {
    const res = await fetch(target, {
      headers: {
        accept: req.headers.get("accept") ?? "*/*",
        "user-agent": "next-proxy/1.0",
      },
      cache: "no-store",
      redirect: "follow",
    });

    status = res.status;
    contentType = res.headers.get("content-type") ?? "";

    // Read fully so we can log size and preview body.
    const ab = await res.arrayBuffer();
    size = ab.byteLength;
    bodyForClient = new Uint8Array(ab);

    // ALWAYS log response body (guarded + bounded)
    // - Only attempt decode for textual content-types
    // - Cap at 1MB and 8k preview chars
    const sizeOk = size <= 1_000_000;
    if (isTextual(contentType) && sizeOk) {
      try {
        const preview = new TextDecoder().decode(bodyForClient).slice(0, 8000);
        console.log(
          `[proxy] body ${status} ${redact(target)} (size=${size}B type=${contentType})\n${preview}`
        );
      } catch (e) {
        console.warn(
          `[proxy] failed to decode textual body for log ${redact(target)}: ${(e as Error)?.message ?? e}`
        );
      }
    } else {
      // Non-textual or too large: still log meta about body
      const reason = !isTextual(contentType)
        ? "non-textual"
        : `too-large(${size}B)`;
      console.log(
        `[proxy] body ${status} ${redact(target)} (size=${size}B type=${contentType || "-"} ${reason})`
      );
    }
  } catch (err: any) {
    errorMsg = err?.message ?? String(err);
    status = 502;
    console.error(`[proxy] fetch error for ${redact(target)} -> ${errorMsg}`);
    return NextResponse.json({ error: "Upstream fetch failed", detail: errorMsg }, { status });
  } finally {
    const ended = process.hrtime.bigint();
    const ms = Number(ended - started) / 1_000_000;
    console.log(
      `[proxy] meta ${status} ${redact(target)} (size=${size}B, ${ms.toFixed(1)}ms, type=${contentType || "-"})`
    );
  }

  // Mirror upstream headers (safely)
  const headers = new Headers();
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", "no-store");

  return new NextResponse(bodyForClient, { status, headers });
}
