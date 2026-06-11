import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL && !process.env.Supabase_Database_URL) {
      return NextResponse.json(
        { error: "Database connection is not configured. Set DATABASE_URL or Supabase_Database_URL in .env.local." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    console.error("SIGNUP_FAILED:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : "account";
      const label = target.includes("email") ? "Email" : target.includes("username") ? "Username" : "Account";

      return NextResponse.json(
        { error: `${label} already exists.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
