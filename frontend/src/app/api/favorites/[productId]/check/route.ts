import { NextResponse } from "next/server";


function forwardAuth(req: Request): HeadersInit {
    const headers: HeadersInit = {};
    const auth = req.headers.get("authorization");
    if (auth) headers["Authorization"] = auth;
    return headers;
}

function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}


export async function GET(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        if (!req.headers.get("authorization")) return unauthorized();

        const { productId } = await params;
        const res = await fetch(
            `http://localhost:5097/api/Favorites/${productId}/check`,
            { headers: forwardAuth(req) }
        );
        const text = await res.text();
        return new NextResponse(text, {
            status: res.status,
            headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}