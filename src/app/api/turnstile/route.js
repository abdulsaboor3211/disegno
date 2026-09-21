import { NextResponse } from "next/server";

export async function GET() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();
  const headers = { "Cache-Control": "no-store" };

  if (!siteKey || !process.env.TURNSTILE_SECRET_KEY?.trim()) {
    return NextResponse.json(
      { error: "Security verification is temporarily unavailable. Please try again shortly." },
      { status: 503, headers }
    );
  }

  // Only the public site key is sent to the browser. The secret stays on the server.
  return NextResponse.json({ siteKey }, { headers });
}
