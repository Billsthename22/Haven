import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("auth_session")?.value;

    if (!sessionEmail) {
      return NextResponse.json({ error: "Unauthorized credentials" }, { status: 401 });
    }

    // 1. Validate user early
    const user = await prisma.profile.findUnique({ where: { email: sessionEmail } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Parse FormData boundary payload
    const formData = await req.formData();
    
    const content = formData.get("content") as string;
    const circleId = formData.get("circleId") as string;
    const isPublic = formData.get("isPublic") === "true";
    const type = (formData.get("type") as string) || "text"; // text, photo, video, audio
    
    const file = formData.get("file") as File | null;

    // Guardrails
    if (!content && !file) {
      return NextResponse.json({ error: "Incomplete write payload parameters" }, { status: 400 });
    }

    if (!isPublic && !circleId) {
      return NextResponse.json({ error: "Target circle ID missing for private post" }, { status: 400 });
    }

    let resolvedMediaUrl: string | null = null;

    // 3. Process local file storage engine pipeline
    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Standardize file extraction matching the type
        const fileExt = file.name.split(".").pop() || "webm";
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        // Define destination path pointing to your Next.js local project public folder
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        
        // Ensure directory exists structural fallback
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Write file raw buffer array onto local storage disk partition
        const filePath = path.join(uploadDir, uniqueFileName);
        await fs.writeFile(filePath, buffer);

        // Publicly accessible URL route pointing backwards to local development server routing
        resolvedMediaUrl = `/uploads/${uniqueFileName}`;
      } catch (uploadErr) {
        console.error("Local disk write engine pipeline failure:", uploadErr);
        return NextResponse.json({ error: "Failed to save file system attachment" }, { status: 500 });
      }
    }

    // 4. Write data cleanly via Prisma
    const createdPost = await prisma.post.create({
      data: {
        content: content || "",
        mediaUrl: resolvedMediaUrl,
        type: type,
        authorId: user.id,
        circleId: isPublic ? null : circleId,
      },
      include: {
        author: { select: { fullName: true } },
        circle: { select: { name: true } }
      }
    });

    return NextResponse.json({
      post: {
        id: createdPost.id,
        authorName: createdPost.author?.fullName || "Anonymous User",
        circleName: createdPost.circle?.name || "Public Space",
        isPublic: !createdPost.circleId,
        content: createdPost.content,
        mediaUrl: createdPost.mediaUrl,
        type: createdPost.type,
        likedByUser: false,
        likesCount: 0,
        createdAt: createdPost.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Database broadcast failed:", error);
    return NextResponse.json({ error: "Database broadcast failed" }, { status: 500 });
  }
}