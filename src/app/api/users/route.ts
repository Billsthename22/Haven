import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.profile.findUnique({
      where: { email: sessionEmail.toLowerCase().trim() },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const users = await prisma.profile.findMany({
      where: { id: { not: currentUser.id } },
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        isOnline: true,
      },
    });

    return NextResponse.json(
      users.map((user) => ({
        id: user.id,
        name: user.fullName,
        initials: getInitials(user.fullName),
        handle: `@${user.email.split("@")[0]}`,
        online: user.isOnline,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch user directory:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
