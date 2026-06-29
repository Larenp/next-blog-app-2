import { ConnectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { verifyPassword, signToken } from "@/lib/utils/auth";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        await ConnectDB();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, msg: "Missing fields" }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();

        // Find user
        const user = await UserModel.findOne({ email: cleanEmail });
        if (!user) {
            return NextResponse.json({ success: false, msg: "Invalid email or password" }, { status: 400 });
        }

        // Verify password
        const isPasswordCorrect = verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ success: false, msg: "Invalid email or password" }, { status: 400 });
        }

        // Sign Token
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        });

        // Set secure HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days (seconds)
            path: '/'
        });

        return NextResponse.json({
            success: true,
            msg: "Logged in successfully",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}
