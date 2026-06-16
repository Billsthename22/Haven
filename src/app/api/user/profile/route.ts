import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const user = await prisma.profile.findUnique({
      where: { email: sessionEmail },
      select: { id: true, fullName: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}