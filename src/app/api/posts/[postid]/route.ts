import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";

interface Params {
  params: Promise<{ postid: string }>;
}

// REGISTER LIKE
export async function POST(req: Request, { params }: Params) {
  try {
    const { postid: postId } = await params; // Extracted safely from lowercase folder context
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.profile.findUnique({ where: { email: sessionEmail } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Validate that the post exists before attempting transaction
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) return NextResponse.json({ error: "Target post not found" }, { status: 404 });

    // Atomic transaction: Create like relationship and increment tracking metrics counter
    await prisma.$transaction([
      prisma.like.create({
        data: { profileId: user.id, postId: postId }
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      })
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    // Handle unique constraint violation gracefully (user already liked it)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Already liked" }, { status: 409 });
    }
    return NextResponse.json({ error: "Action dropped" }, { status: 500 });
  }
}

// REMOVE LIKE
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { postid: postId } = await params;
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.profile.findUnique({ where: { email: sessionEmail } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.delete({
        where: {
          profileId_postId: { profileId: user.id, postId: postId }
        }
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      })
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Action dropped" }, { status: 500 });
  }
}