import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`http://localhost:5097/api/products/${id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}