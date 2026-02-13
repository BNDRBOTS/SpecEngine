import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'FALLBACK_DEV_SECRET_DO_NOT_USE_IN_PROD');

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('spec_session');

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    await jwtVerify(token.value, JWT_SECRET);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
