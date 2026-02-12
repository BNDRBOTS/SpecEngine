import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, license_key } = body;

    if (!product_id || !license_key) {
      return NextResponse.json({ ok: false, message: "Missing credentials" }, { status: 400 });
    }

    const gumroadRes = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        product_id,
        license_key
      })
    });

    const data = await gumroadRes.json();

    if (data.success) {
      return NextResponse.json({ ok: true, message: "Valid" });
    } else {
      return NextResponse.json({ ok: false, message: "Invalid license" }, { status: 403 });
    }

  } catch (error) {
    console.error("Gumroad Verification Error:", error);
    return NextResponse.json({ ok: false, message: "Verification failed" }, { status: 500 });
  }
}
