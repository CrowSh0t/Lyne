import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://localhost:5097/api/products');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch('http://localhost:5097/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}