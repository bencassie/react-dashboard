import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing ?url=", { status: 400 });
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
        "access-control-allow-origin": "*",
      },
    });
  } catch {
    return new Response("Proxy fetch failed", { status: 502 });
  }
}