import { NextResponse } from "next/server";
import { otpCache } from "../requestotp/route";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, email } = body;

    if (!email || !code) {
      return NextResponse.json({ error: "Missing required validation keys." }, { status: 400 });
    }

    const emailKey = email.toLowerCase().trim();
    const cachedData = otpCache.get(emailKey);

    if (!cachedData) {
      return NextResponse.json({ error: "No active verification challenge exists for this account." }, { status: 400 });
    }

    if (Date.now() > cachedData.expiresAt) {
      otpCache.delete(emailKey);
      return NextResponse.json({ error: "Verification token footprint has expired. Request a new stream." }, { status: 400 });
    }

    if (cachedData.code !== code.trim()) {
      return NextResponse.json({ error: "Security key mismatch. Check signature string." }, { status: 400 });
    }

    otpCache.delete(emailKey);

    return NextResponse.json({ success: true, message: "Identity signature match successful." });
  } catch (error: unknown) {
    console.error("VERIFY_OTP_EXCEPTION:", error);
    return NextResponse.json({ error: "Validation lifecycle exception encountered." }, { status: 500 });
  }
}
