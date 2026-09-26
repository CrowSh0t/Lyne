import { NextResponse } from 'next/server';

// Заміни на свій базовий URL з .env, якщо він відрізняється
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5097/api';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Відправляємо POST-запит на ASP.NET бекенд
        const res = await fetch(`${BACKEND_URL}/Inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Якщо потрібна авторизація, дістаємо токен з cookies/headers і передаємо сюди
                // 'Authorization': request.headers.get('Authorization')
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json({ error: errorText }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Inquiry API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}