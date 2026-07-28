import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${BACKEND_URL}/api/Orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}