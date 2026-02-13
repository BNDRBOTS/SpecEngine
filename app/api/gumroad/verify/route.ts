import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

// CONFIGURATION
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'FALLBACK_DEV_SECRET_DO_NOT_USE_IN_PROD');
const GUMROAD_PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID;

// SIMPLE RATE LIMITER (In-Memory)
// In production, replace with Redis (Upstash/Vercel KV)
const RATE_LIMIT = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 Minutes
const MAX_ATTEMPTS = 20;

export async function POST(req: Request) {
  try {
    // 1. RATE LIMIT CHECK
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const record = RATE_LIMIT.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > WINDOW_MS) {
      record.count = 0;
      record.lastReset = now;
    }

    if (record.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ ok: false, message: "Too many attempts. Please try again later." }, { status: 429 });
    }
    
    RATE_LIMIT.set(ip, { ...record, count: record.count + 1 });

    // 2. INPUT VALIDATION
    const body = await req.json().catch(() => ({}));
    const { license_key } = body;

    if (!license_key) {
      return NextResponse.json({ ok: false, message: "License key required" }, { status: 400 });
    }

    if (!GUMROAD_PRODUCT_ID) {
      console.error("SERVER ERROR: GUMROAD_PRODUCT_ID is not set in environment variables.");
      return NextResponse.json({ ok: false, message: "Server misconfiguration" }, { status: 500 });
    }

    // 3. GUMROAD VERIFICATION
    const gumroadRes = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: GUMROAD_PRODUCT_ID,
        license_key: license_key
      })
    });

    const data = await gumroadRes.json();

    if (!data.success || data.purchase.refunded || data.purchase.chargebacked) {
      return NextResponse.json({ 
        ok: false, 
        message: data.message || "Invalid or revoked license." 
      }, { status: 403 });
    }

    // 4. SECURE SESSION ISSUANCE (JWT via HttpOnly Cookie)
    // Using 'jose' for Edge compatibility
    const token = await new SignJWT({ 
      sub: data.purchase.id,
      email: data.purchase.email,
      license: license_key, // Store mostly for debugging/validation, mask in logs
      type: 'standard'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ ok: true, message: "License Verified" });
    
    response.cookies.set({
      name: 'spec_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ ok: false, message: "Internal Authentication Error" }, { status: 500 });
  }
}
