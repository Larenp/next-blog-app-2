import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/'
        });
        return NextResponse.json({ success: true, msg: "Logged out successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}

// Support GET requests as well for convenience
export async function GET() {
    try {
        const cookieStore = await cookies();
        cookieStore.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/'
        });
        return NextResponse.json({ success: true, msg: "Logged out successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}
