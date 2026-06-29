import { verifyToken } from "@/lib/utils/auth";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get('token');
        const token = tokenCookie ? tokenCookie.value : null;

        if (!token) {
            return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, msg: "Invalid or expired session" }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                userId: decoded.userId,
                email: decoded.email,
                name: decoded.name
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}
