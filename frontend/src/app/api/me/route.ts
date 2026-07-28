import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const authHeader = req.headers.get('authorization');

    const res = await fetch(`${BACKEND_URL}/api/me`, {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
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