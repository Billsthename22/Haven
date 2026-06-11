import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const otpCache = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, channel, destination } = body;

    if (!email || !channel || !destination) {
      return NextResponse.json({ error: "Missing required tracking fields." }, { status: 400 });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpCache.set(email.toLowerCase().trim(), { code: generatedOtp, expiresAt });

    console.log(`[GMAIL OTP ENGINE] Generated Code: ${generatedOtp} for ${email}`);

    if (channel === "email") {
      await transporter.sendMail({
        from: `"Safe Haven Security" <${process.env.GMAIL_USER}>`,
        to: destination.toLowerCase().trim(),
        subject: "Your Safe Haven Verification Passcode",
        html: `
          <div style="font-family: sans-serif; background-color: #09090b; color: #ffffff; padding: 40px; text-align: center; border-radius: 20px;">
            <h2 style="color: #10b981; margin-bottom: 10px;">Safe Haven Security Engine</h2>
            <p style="color: #a1a1aa; font-size: 14px;">Use the verification passcode below to authorize your account registration stream.</p>
            <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 30px auto; max-width: 220px; color: #34d399; border-radius: 12px;">
              ${generatedOtp}
            </div>
            <p style="color: #71717a; font-size: 12px;">This token expires in 10 minutes. If you did not initialize this pipeline, ignore this payload.</p>
          </div>
        `,
      });
    } else if (channel === "phone") {
      console.log(`[PHONE MOCK DISPATCH] Texting ${destination} with code: ${generatedOtp}`);
    }

    return NextResponse.json({ success: true, message: "Security handshake dispatched." });
  } catch (error: unknown) {
    console.error("GMAIL_OTP_DISPATCH_FAILURE:", error);
    return NextResponse.json(
      { error: "Failed to dispatch system validation token delivery via Gmail." },
      { status: 500 }
    );
  }
}
