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
      // forward minimal headers that won't break CORS preflights
      headers: {
        "accept": req.headers.get("accept") ?? "*/*",
        "user-agent": "next-proxy/1.0",
      },
      cache: "no-store",
    });

    status = res.status;
    contentType = res.headers.get("content-type") ?? "";

    // Read fully so we can log size and (optionally) preview body.
    const ab = await res.arrayBuffer();
    size = ab.byteLength;
    bodyForClient = new Uint8Array(ab);

    // Optional body logging (guarded + bounded)
    const shouldLogBody = process.env.LOG_PROXY_BODIES === "1" && size <= 200_000;
    if (shouldLogBody) {
      const preview = new TextDecoder().decode(bodyForClient).slice(0, 5000);
      console.log(
        `[proxy] ${status} ${redact(target)} ` +
          `(size=${size}B type=${contentType}) bodyPreview=\n${preview}`
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
    // meta log always
    console.log(
      `[proxy] meta ${status} ${redact(target)} (size=${size}B, ${ms.toFixed(1)}ms, type=${contentType || "-"})`
    );
  }

  // Mirror upstream headers (safely)
  const headers = new Headers();
  if (contentType) headers.set("content-type", contentType);
  // avoid passing hop-by-hop or misleading cache headers
  headers.set("cache-control", "no-store");

  return new NextResponse(bodyForClient, { status, headers });
}
