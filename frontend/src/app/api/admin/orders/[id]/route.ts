// app/api/admin/orders/[id]/route.ts
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieHeader = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");
  const res = await fetch(`http://localhost:5097/api/Admin/orders/${id}`, 
    { method: 'DELETE',
      headers: {
         ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      }
     });
  return new NextResponse(null, { status: res.status });
}