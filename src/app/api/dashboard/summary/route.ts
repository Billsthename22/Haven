import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Locate the core user context
    const user = await prisma.profile.findUnique({
      where: { email: sessionEmail },
    });

    if (!user) return NextResponse.json({ error: "User mismatch" }, { status: 404 });

    // 2. Fetch all required system state collections concurrently
    const [circles, posts, onlineUsers, events] = await Promise.all([
      // Groups user belongs to
      prisma.circle.findMany({
        where: { members: { some: { id: user.id } } },
        select: { id: true, name: true, memberCount: true, streakDays: true }
      }),
      // Posts from user's groups
      prisma.post.findMany({
        where: {
          OR: [
            { isPublic: true },
            { circle: { members: { some: { id: user.id } } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { fullName: true } },
          circle: { select: { name: true } },
          likes: { where: { profileId: user.id } } // Track if current user liked it
        }
      }),
      // Other active members
      prisma.profile.findMany({
        where: { isOnline: true, id: { not: user.id } },
        select: { fullName: true, customStatus: true },
        take: 5
      }),
      // Synchronized community calendar events
      prisma.event.findMany({
        where: { scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: "asc" },
        take: 3
      })
    ]);

    // 3. Format feed payload to match the tactical UI's expectations
    const structuredPosts = posts.map(p => ({
      id: p.id,
      authorName: p.author.fullName,
      circleName: p.circle?.name || "Public Space",
      isPublic: p.isPublic,
      content: p.content,
      mediaUrl: p.mediaUrl,
      type: p.type,
      likedByUser: p.likes.length > 0,
      likesCount: p.likesCount,
      createdAt: p.createdAt
    }));

    // 4. Aggregate analytical matrix
    const totalPostsCount = await prisma.post.count({ where: { authorId: user.id } });
    const totalReactionsCount = await prisma.like.count({ where: { profileId: user.id } });
    const connectedNodesCount = await prisma.profile.count({
      where: { circles: { some: { members: { some: { id: user.id } } } }, id: { not: user.id } }
    });

    return NextResponse.json({
      circles,
      posts: structuredPosts,
      onlineUsers: onlineUsers.map(u => ({ name: u.fullName, customStatus: u.customStatus })),
      events,
      stats: {
        postsCount: totalPostsCount,
        reactionsCount: totalReactionsCount,
        activeHours: user.activeHours || 0,
        friendsCount: connectedNodesCount
      }
    });

  } catch (error) {
    console.error("Dashboard database transaction crash:", error);
    return NextResponse.json({ error: "Failed to compile stream dashboard summary" }, { status: 500 });
  }
}
