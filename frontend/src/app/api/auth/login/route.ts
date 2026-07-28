import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieHeader = req.headers.get("cookie");
    const authHeader = req.headers.get("authorization");

    const res = await fetch(
      `${BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    const rawText = await res.text();
    console.log("BACKEND RAW RESPONSE:", rawText); // ← подивіться в терміналі, що там реально

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      // бекенд повернув не-JSON (напр. .NET exception text або HTML error page)
      data = { error: rawText || 'Backend returned non-JSON response' };
    }

    const response = NextResponse.json(data, { status: res.status });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (error: any) {
    console.error("LOGIN ROUTE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}