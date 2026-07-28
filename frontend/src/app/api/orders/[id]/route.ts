import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = 'http://localhost:5097';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
  try {
    const cookieHeader = req.headers.get("cookie");
    const authHeader = req.headers.get("authorization");

    if (!cookieHeader && !authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/Orders/${id}`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type":
          res.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
