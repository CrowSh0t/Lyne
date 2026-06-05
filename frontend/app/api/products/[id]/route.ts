import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`http://localhost:5097/api/products/${id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`http://localhost:5097/api/products/${id}`, {
    method: 'DELETE', // ← обов'язково
  });
  return new NextResponse(null, { status: res.status }); // DELETE зазвичай не повертає body
}