import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`http://localhost:5097/api/sizes/${id}`, {
    method: 'DELETE', 
  });
  return new NextResponse(null, { status: res.status });
}

