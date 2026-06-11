import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const foundUser = await db.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!foundUser.isVerified) {
      return NextResponse.json(
        { error: "Please verify your account before signing in." },
        { status: 403 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT secret is not configured." },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const token = await new SignJWT({
      userId: foundUser.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set("safehaven_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error("LOGIN_FAILED:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
