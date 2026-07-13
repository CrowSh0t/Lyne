
import {NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:5097/api/Admin/users');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}