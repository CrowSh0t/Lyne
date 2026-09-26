import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = 'http://localhost:5097';

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ cartItemId: string }> }
) {
  try {
    const { cartItemId } = await params;

    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    const res = await fetch(`${BACKEND_URL}/api/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    if (!res.ok) {
      console.error(`DELETE Color Error: Status ${res.status}`);
      return NextResponse.json(
        { error: `Backend returned status ${res.status}` },
        { status: res.status }
      );
    }

    return new NextResponse(null, { status: res.status });
  } catch (error: any) {
    console.error('DELETE Color Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}