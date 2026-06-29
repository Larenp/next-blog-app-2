import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_editorial_luxury_2025";

async function verifyTokenEdge(token) {
    if (!token || typeof token !== 'string') return null;
    
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const [encodedPayload, signature] = parts;

    try {
        // Convert secret to key buffer
        const encoder = new TextEncoder();
        const keyData = encoder.encode(JWT_SECRET);
        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify', 'sign']
        );

        // Verify the signature
        const dataBuffer = encoder.encode(encodedPayload);
        
        // Decode base64url signature to binary
        const signatureBytes = base64urlToBytes(signature);
        
        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBytes,
            dataBuffer
        );

        if (!isValid) return null;

        const decodedPayload = JSON.parse(
            new TextDecoder().decode(base64urlToBytes(encodedPayload))
        );

        if (decodedPayload.exp && Date.now() > decodedPayload.exp) {
            return null;
        }

        return decodedPayload;

    } catch (err) {
        return null;
    }
}

function base64urlToBytes(base64url) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export async function proxy(request) {
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie ? tokenCookie.value : null;

    const url = request.nextUrl.clone();

    if (!token) {
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
