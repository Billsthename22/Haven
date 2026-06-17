import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

type NotificationRow = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

// Helper function to authenticate users via your session setup
async function getCurrentUserId() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("auth_session")?.value;

  if (!sessionEmail) {
    return null;
  }

  const user = await prisma.profile.findUnique({
    where: { email: sessionEmail.toLowerCase().trim() },
    select: { id: true },
  });

  return user?.id ?? null;
}

/**
 * GET /api/notifications
 * Fetches all notifications for the logged-in user
 */
export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await prisma.$queryRaw<NotificationRow[]>`
      SELECT
        id,
        user_id AS "userId",
        title,
        message,
        read,
        created_at AS "createdAt"
      FROM notifications
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications
 * Marks notifications as read
 */
export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Bulk update all unread notifications to read
      await prisma.$executeRaw`
        UPDATE notifications
        SET read = true
        WHERE user_id = ${userId} AND read = false
      `;
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
    }

    await prisma.$executeRaw`
      UPDATE notifications
      SET read = true
      WHERE id = ${notificationId} AND user_id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update notification status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications
 * Clears/Deletes notification records
 */
export async function DELETE(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (notificationId) {
      // Delete a single notification
      await prisma.$executeRaw`
        DELETE FROM notifications
        WHERE id = ${notificationId} AND user_id = ${userId}
      `;
    } else {
      // Clear all notifications for the user if no query ID parameter is passed
      await prisma.$executeRaw`
        DELETE FROM notifications
        WHERE user_id = ${userId}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete notification(s):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
