import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "Unauthorized credentials" }, { status: 401 });
    }

    // Fetch the user's profile to know which circles they belong to
    const user = await prisma.profile.findUnique({
      where: { email: sessionEmail },
      include: {
        circles: { select: { id: true } }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Extract array of circle IDs the user is a member of
    const userCircleIds = user.circles.map((c) => c.id);

    // Fetch posts that are EITHER public (null) OR belong to the user's circles
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { circleId: null }, // Public Space posts
          { circleId: { in: userCircleIds } } // Joined Circles posts
        ]
      },
      orderBy: {
        createdAt: "desc" // Fresh drops at the top
      },
      include: {
        author: {
          select: { fullName: true }
        },
        circle: {
          select: { name: true }
        }
      }
    });

    // Format the data cleanly for your frontend mapping
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      authorName: post.author?.fullName || "Anonymous User",
      circleName: post.circle?.name || "Public Space",
      isPublic: !post.circleId,
      content: post.content,
      mediaUrl: post.mediaUrl,
      type: post.type,
      likesCount: post.likesCount,
      likedByUser: false, // We can wire up the true relationship flag next if needed
      createdAt: post.createdAt
    }));

    return NextResponse.json({ posts: formattedPosts }, { status: 200 });

  } catch (error) {
    console.error("Failed to load feed infrastructure:", error);
    return NextResponse.json({ error: "Failed to assemble feed" }, { status: 500 });
  }
}