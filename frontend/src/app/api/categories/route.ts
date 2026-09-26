import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5097';

export async function GET() {
  const res = await fetch('http://localhost:5097/api/Categories');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Зчитуємо заголовок авторизації та куки
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    // 2. Відправляємо POST запит на C# бекенд
    const backendRes = await fetch(`${BACKEND_URL}/api/Admin/Categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    // 3. Безпечно розпаршуємо відповідь від сервера
    const textData = await backendRes.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : null;
    } catch {
      data = { rawText: textData };
    }

    if (!backendRes.ok) {
      console.error('POST Categories Error:', backendRes.status, data);
      return NextResponse.json(
        { error: 'Backend Server Error', details: data },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('POST Categories Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

