import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getDb } from "@/src/lib/db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const db = getDb();
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const targetEmail = email.toLowerCase().trim();

    // 1. Verify user exists using Supabase Client syntax
    const { data: user, error: userError } = await db
      .from("User")
      .select("id")
      .eq("email", targetEmail)
      .maybeSingle(); // Avoid throwing an error if no user matches

    if (userError) {
      console.error("Database user check error:", userError);
      return NextResponse.json({ error: "Database verification failed" }, { status: 500 });
    }

    // Security check: Safeguard against user enumeration attacks
    if (!user) {
      return NextResponse.json({ message: "Check your inbox for reset instructions." });
    }

    // 2. Generate a secure, unique id string and token payload
    const tokenId = crypto.randomUUID(); 
    const plainToken = crypto.randomBytes(32).toString("hex");
    
    // Hash the token using SHA-256 to securely populate "tokenHash"
    const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // Supabase expects ISO timestamp strings

    // 3. Insert record directly into "PasswordResetToken" using Supabase insert syntax
    const { error: insertError } = await db
      .from("PasswordResetToken")
      .insert({
        id: tokenId,
        email: targetEmail,
        tokenHash: tokenHash,
        expiresAt: expiresAt
      });

    if (insertError) {
      console.error("Database token insertion error:", insertError);
      return NextResponse.json({ error: "Failed to generate security token" }, { status: 500 });
    }

    // 4. Send out the recovery link using the un-hashed plain token
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${plainToken}`;

    await transporter.sendMail({
      from: `"SYSTEM ARCHITECT" <${process.env.GMAIL_USER}>`,
      to: targetEmail,
      subject: "RECOVERY: Authentication Reset Initiated",
      html: `
        <div style="background-color: #0a0a0b; color: #ffffff; font-family: 'Inter', sans-serif; padding: 40px; border-radius: 4px; border: 1px solid #222;">
          <div style="border-left: 2px solid #10b981; padding-left: 20px;">
            <h2 style="text-transform: uppercase; letter-spacing: 2px; font-size: 14px; color: #10b981;">Security Protocol</h2>
            <h1 style="font-size: 24px; margin-top: 10px;">Password Reset Requested</h1>
            <p style="color: #888; line-height: 1.6; margin-top: 20px;">
              A recovery request was detected for account: <span style="color: #fff;">${targetEmail}</span>. 
              Click the command below to authorize a password override.
            </p>
            <div style="margin-top: 30px;">
              <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 2px; display: inline-block;">
                AUTHORIZE RESET
              </a>
            </div>
            <p style="color: #444; font-size: 11px; margin-top: 40px; text-transform: uppercase;">
              Expires in 60 minutes. If you did not initiate this, secure your credentials immediately.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "Reset link dispatched." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
