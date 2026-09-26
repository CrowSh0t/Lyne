import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawText = await res.text();
    console.log("ME BACKEND RAW RESPONSE:", rawText);

    let data: any = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { error: rawText };
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("ME ROUTE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}