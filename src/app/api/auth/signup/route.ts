// src/app/api/auth/Signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/src/lib/mailer"; // Your custom cyber-tactical mailer utility

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();
    
    // Safety check for inputs
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if user already exists in your Prisma Cloud DB
    const existingUser = await prisma.profile.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // 2. Hash the password securely with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Create the unverified profile record inside your cloud tables
    await prisma.profile.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        passwordHash,
      },
    });

    // 4. Generate a clean 6-digit verification code string
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    // 5. Save the generated OTP token string in your database tracking table
    await prisma.otpCode.create({
      data: {
        email: cleanEmail,
        code: otpCode,
        expiresAt,
      },
    });

    // 6. Dispatch the token through your beautiful custom HTML email format
    const emailResult = await sendOtpEmail({ to: cleanEmail, otp: otpCode });

    // Break early if Google rejects SMTP authentication parameters
    if (!emailResult.success) {
      return NextResponse.json(
        { error: `Email transmission failed: ${emailResult.error || "Check SMTP configuration."}` },
        { status: 500 }
      );
    }

    // Handshake successful! Frontend can now toggle the verification modal frame
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("❌ BACKEND SIGNUP EXCEPTION CRASH:", error);
    const message =
      error instanceof Error ? error.message : "Registration processing failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
