import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const rawText = await res.text();
    console.log("BACKEND RAW RESPONSE:", rawText);

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { error: rawText || 'Backend returned non-JSON response' };
    }

    const response = NextResponse.json(data, { status: res.status });

    if (res.ok && data.token) {
      response.cookies.set("access_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: data.expiresAt ? new Date(data.expiresAt) : undefined,
      });
    }

    return response;
  } catch (error: any) {
    console.error("LOGIN ROUTE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}