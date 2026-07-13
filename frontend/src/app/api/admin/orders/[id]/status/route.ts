// app/api/admin/orders/[id]/status/route.ts
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`http://localhost:5097/api/Admin/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return new NextResponse(null, { status: res.status });
}