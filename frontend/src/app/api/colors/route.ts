import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function GET(req: NextRequest) {
  try {
    // 1. Беремо токен/куки з запиту клієнта
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    const res = await fetch(`${BACKEND_URL}/api/colors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      // Відключаємо кешування Next.js, щоб дані з БД завжди були свіжими
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`GET Colors Error: Status ${res.status}`);
      return NextResponse.json(
        { error: `Backend returned status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('GET Colors Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Беремо заголовок Authorization з запиту браузера
    const authHeader = req.headers.get('authorization');

    // ДІАГНОСТИКА: Виведемо в консоль сервера Next.js, чи прийшов токен
    console.log('🔍 Auth Header received in Next.js:', authHeader ? 'YES' : 'NO');

    // 2. Відправляємо на C# бекенд
    const backendRes = await fetch(`${BACKEND_URL}/api/Admin/colors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const textData = await backendRes.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : null;
    } catch {
      data = { rawText: textData };
    }

    if (!backendRes.ok) {
      console.error('POST Colors Error:', backendRes.status, data);
      return NextResponse.json(
        { error: 'Backend Server Error', details: data },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('POST Colors Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}