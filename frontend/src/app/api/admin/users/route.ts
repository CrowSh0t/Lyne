import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const auth = req.headers.get('authorization');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch('http://localhost:5097/api/Admin/users', {
        headers: { Authorization: auth }
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}