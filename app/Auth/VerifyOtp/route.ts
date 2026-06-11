import { NextResponse } from "next/server";
import { otpCache } from "../RequestOtp/route"; // Import the live token map cache

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, email } = body;

    if (!email || !code) {
      return NextResponse.json({ error: "Missing required validation keys." }, { status: 400 });
    }

    const cachedData = otpCache.get(email.toLowerCase().trim());

    if (!cachedData) {
      return NextResponse.json({ error: "No active verification challenge exists for this account." }, { status: 400 });
    }

    // Check if code has expired
    if (Date.now() > cachedData.expiresAt) {
      otpCache.delete(email.toLowerCase().trim());
      return NextResponse.json({ error: "Verification token footprint has expired. Request a new stream." }, { status: 400 });
    }

    // Verify identity string match
    if (cachedData.code !== code.trim()) {
      return NextResponse.json({ error: "Security key mismatch. Check signature string." }, { status: 400 });
    }

    // Clear verification slot on successful authorization
    otpCache.delete(email.toLowerCase().trim());

    return NextResponse.json({ success: true, message: "Identity signature match successful." });

  } catch (error) {
    console.error("VERIFY_OTP_EXCEPTION:", error);
    return NextResponse.json({ error: "Validation lifecycle exception encountered." }, { status: 500 });
  }
}