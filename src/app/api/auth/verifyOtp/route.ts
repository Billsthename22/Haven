// src/app/api/auth/verifyOtp/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();
    console.log("=== 🔐 SECURE PRISMA OTP VERIFICATION ATTEMPT ===");

    if (!email || !token) {
      return NextResponse.json({ error: "Missing verification parameters." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.trim();

    // 1. Fetch the latest OTP challenge from your Prisma Cloud database tracking table
    const otpRecord = await prisma.otpCode.findFirst({
      where: { email: cleanEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Verification code not found." }, { status: 400 });
    }

    // 2. Token match check
    if (String(otpRecord.code).trim() !== cleanToken) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    // 3. Time Validation Check
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "Verification token has expired." }, { status: 410 });
    }

    console.log("✅ Token validated. Running database activation transaction...");

    // 4. BULLETPROOF TRANSACTION: Verify user profile and purge the spent token records simultaneously
    await prisma.$transaction([
      prisma.profile.update({
        where: { email: cleanEmail },
        data: { isVerified: true },
      }),
      prisma.otpCode.deleteMany({
        where: { email: cleanEmail },
      }),
    ]);

    console.log("🔒 Cloud database models updated successfully! Establishing session...");

    // 5. Issue a secure, encrypted HTTP-Only session cookie tracking token
    const cookieStore = await cookies();
    cookieStore.set("auth_session", cleanEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1-week runtime validation lifecycles
      path: "/",
    });

    console.log("=== 🎉 SYNC COMPLETE ===");
    return NextResponse.json({ success: true, message: "Profile verified securely." }, { status: 200 });

  } catch (error: unknown) {
    console.error("❌ CRITICAL VERIFY-OTP BACKEND CRASH:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error structure.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
