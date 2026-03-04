// app/api/[...proxy]/route.ts
// Proxies /api/* → real backend (ซ่อน backend URL ไม่ให้ client เห็น)
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

async function handler(
  req: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  const path    = params.proxy.join("/");
  const url     = `${BACKEND}/${path}${req.nextUrl.search}`;
  const headers = new Headers();

  headers.set("content-type", "application/json");
  const auth = req.headers.get("authorization");
  if (auth) headers.set("authorization", auth);

  try {
    const res  = await fetch(url, {
      method:  req.method,
      headers,
      body:    ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
      cache:   "no-store",
    });
    const body = await res.text();
    return new NextResponse(body, {
      status:  res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error("[Proxy Error]", err);
    return NextResponse.json({ message: "Proxy error" }, { status: 502 });
  }
}

export const GET    = handler;
export const POST   = handler;
export const PATCH  = handler;
export const PUT    = handler;
export const DELETE = handler;
