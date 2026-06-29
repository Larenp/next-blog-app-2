import { ConnectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { hashPassword, signToken } from "@/lib/utils/auth";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        await ConnectDB();
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, msg: "Missing fields" }, { status: 400 });
        }

        // Clean email format
        const cleanEmail = email.toLowerCase().trim();

        // Check if email already exists
        const userExists = await UserModel.findOne({ email: cleanEmail });
        if (userExists) {
            return NextResponse.json({ success: false, msg: "Email is already registered" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = hashPassword(password);

        // Create User
        const newUser = await UserModel.create({
            name,
            email: cleanEmail,
            password: hashedPassword
        });

        // Generate Token
        const token = signToken({
            userId: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name
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
            msg: "Account created successfully",
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}
