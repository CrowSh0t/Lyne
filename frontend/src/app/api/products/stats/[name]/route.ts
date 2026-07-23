import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const res = await fetch(`http://localhost:5097/api/Products/stats/${name}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}