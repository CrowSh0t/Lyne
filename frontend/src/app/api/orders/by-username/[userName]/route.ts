import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = 'http://localhost:5097';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userName: string }> }
) {
  const { userName } = await params;
  const cookieHeader = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");

  const res = await fetch(`${BACKEND_URL}/api/orders/by-username/${userName}`, {
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}