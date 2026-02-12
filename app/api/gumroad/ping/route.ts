import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const payload = await req.json().catch(() => "No JSON body");
  console.log("Ping payload:", payload);
  return NextResponse.json({ ok: true });
}
