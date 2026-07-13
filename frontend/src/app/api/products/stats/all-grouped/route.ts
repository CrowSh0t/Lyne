
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:5097/api/Products/stats/all-grouped');
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}