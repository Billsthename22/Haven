import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("auth_session")?.value;

  if (!sessionEmail) {
    return null;
  }

  const currentUser = await prisma.profile.findUnique({
    where: { email: sessionEmail.toLowerCase().trim() },
    select: { id: true },
  });

  return currentUser?.id ?? null;
}

function formatConversation(room: {
  id: string;
  name: string;
  isGroup: boolean;
  participants: { id: string; fullName: string; isOnline: boolean }[];
  messages: { text: string; createdAt: Date }[];
}, currentUserId: string) {
  const lastMsg = room.messages[0];
  const peer = room.participants.find((p) => p.id !== currentUserId);
  const displayName = room.isGroup ? room.name : (peer?.fullName || "Encrypted Node");

  return {
    id: room.id,
    name: displayName,
    initials: displayName.substring(0, 2).toUpperCase(),
    hue: room.isGroup ? "#10b981" : "#0ea5e9",
    message: lastMsg ? lastMsg.text : "No transmissions recorded",
    time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    unread: 0,
    online: room.isGroup ? false : (peer?.isOnline || false),
  };
}

export async function GET() {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: currentUserId }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            isOnline: true,
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = rooms.map((room) => formatConversation(room, currentUserId));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Prisma conversations query failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId } = await request.json();

    if (!recipientId || typeof recipientId !== "string") {
      return NextResponse.json({ error: "Missing recipientId" }, { status: 400 });
    }

    if (recipientId === currentUserId) {
      return NextResponse.json({ error: "Cannot create a conversation with yourself" }, { status: 400 });
    }

    const recipient = await prisma.profile.findUnique({
      where: { id: recipientId },
      select: { id: true, fullName: true },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const include = {
      participants: {
        select: {
          id: true,
          fullName: true,
          isOnline: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" as const },
        take: 1,
      },
    };

    const existingRoom = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { id: currentUserId } } },
          { participants: { some: { id: recipientId } } },
        ],
      },
      include,
    });

    if (existingRoom) {
      return NextResponse.json(formatConversation(existingRoom, currentUserId));
    }

    const room = await prisma.conversation.create({
      data: {
        name: recipient.fullName,
        isGroup: false,
        participants: {
          connect: [{ id: currentUserId }, { id: recipientId }],
        },
      },
      include,
    });

    return NextResponse.json(formatConversation(room, currentUserId), { status: 201 });
  } catch (error) {
    console.error("Prisma conversation creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
