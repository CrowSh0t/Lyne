import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isFavorite = await req.json();

    const authHeader = req.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`http://localhost:5097/api/products/set-favorite/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(isFavorite),
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request body or internal error" },
      { status: 400 }
    );
  }
}