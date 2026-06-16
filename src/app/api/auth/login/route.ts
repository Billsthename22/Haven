// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("=== 🔐 SECURE PRISMA LOGIN ATTEMPT ===");

    // 1. Inputs validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Locate the user profile inside your Prisma Cloud DB
    const user = await prisma.profile.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    // 3. Prevent unverified profiles from logging in early
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          error: "Please verify your email before logging in.", 
          requiresVerification: true 
        }, 
        { status: 403 }
      );
    }

    // 4. Validate the incoming password against your stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    console.log("🔒 Credentials verified! Generating server session cookie...");

    // 5. Establish a clean, secure server session cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", cleanEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week session validity
      path: "/",
    });

    console.log("=== 🎉 LOGIN SUCCESSFUL ===");
    return NextResponse.json({ success: true, message: "Welcome back to Haven." });

  } catch (error: unknown) {
    console.error("❌ CRITICAL LOGIN BACKEND CRASH:", error);
    const message =
      error instanceof Error ? error.message : "Login authentication failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
