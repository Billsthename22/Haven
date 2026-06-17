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

// GET: Fetch historical message log stream
export async function GET(request: Request) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  
  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversation parameter" }, { status: 400 });
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: currentUserId } },
      },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const logs = await prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: { createdAt: "asc" },
    });

    const formattedMessages = logs.map((msg) => ({
      id: msg.id,
      sender: msg.senderId === currentUserId ? "me" : "other",
      text: msg.text,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve logs" }, { status: 500 });
  }
}

// POST: Securely append a new message string
export async function POST(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, text } = await request.json();

    if (!conversationId || !text) {
      return NextResponse.json({ error: "Missing payload details" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: currentUserId } },
      },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Run as a transaction so the conversation row 'updatedAt' changes when a message is sent
    const savedMsg = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: { conversationId, senderId: currentUserId, text },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return msg;
    });

    return NextResponse.json(savedMsg);
  } catch (error) {
    console.error("Failed to inject packet:", error);
    return NextResponse.json({ error: "Database transaction failed" }, { status: 500 });
  }
}
