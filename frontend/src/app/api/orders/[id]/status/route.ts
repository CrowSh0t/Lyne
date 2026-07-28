import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie");
    const authHeader = req.headers.get("authorization");

    console.log('authHeader:', authHeader);
    console.log('forwarding to:', `${BACKEND_URL}/api/orders/${id}/status`);
    

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    console.log('body to backend:', JSON.stringify(body));

    const res = await fetch(`${BACKEND_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
    });

    console.log('backend status:', res.status); // ← і це
    console.log('body to backend:', JSON.stringify(body));
    return new NextResponse(null, { status: res.status });
}