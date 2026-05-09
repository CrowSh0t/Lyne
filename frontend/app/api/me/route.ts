import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get('access_token')?.value;
    
    console.log('access_token:', accessToken);

    const res = await fetch('http://localhost:5097/api/me', {
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const text = await res.text();
    console.log('ME response:', res.status, text);

    try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: text }, { status: res.status });
    }
}