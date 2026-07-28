import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = 'http://localhost:5097';


export async function DELETE(req: NextRequest) {
    const cookieHeader = req.headers.get("cookie");
    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${BACKEND_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            ...(authHeader ? { Authorization: authHeader } : {}),
        },
    });

    return new NextResponse(null, { status: res.status });
}