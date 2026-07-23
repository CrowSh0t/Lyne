import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ userName: string }> }) {
  const { userName } = await params;
  console.log(userName);
  const res = await fetch(`http://localhost:5097/api/admin/orders/${userName}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}