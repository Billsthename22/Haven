import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

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

async function refreshToken(userId: string, refreshToken: string) {
  // FIXED: Changed to the official Spotify Accounts token endpoint
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await prisma.spotifyToken.update({
    where: { userId },
    data: {
      accessToken: data.access_token,
      expiresAt: expiresAt.toISOString(), // FIXED: Convert to ISO string for seamless PostgreSQL storage
      ...(data.refresh_token ? { refreshToken: data.refresh_token } : {}),
    },
  });

  return data.access_token as string;
}

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenRow = await prisma.spotifyToken.findUnique({
    where: { userId },
  });

  if (!tokenRow) {
    return NextResponse.json({ connected: false });
  }

  let accessToken = tokenRow.accessToken;

  // If the token expires within 60 seconds, refresh it
  if (Date.now() >= tokenRow.expiresAt.getTime() - 60_000) {
    const refreshed = await refreshToken(userId, tokenRow.refreshToken);
    if (!refreshed) return NextResponse.json({ connected: false });
    accessToken = refreshed;
  }

  // FIXED: Changed to the official Spotify Web API player endpoint
  const npRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 204 or 205 means the request was successful but nothing is currently playing
  if (npRes.status === 204 || npRes.status === 205) {
    return NextResponse.json({ connected: true, playing: false });
  }

  if (!npRes.ok) {
    return NextResponse.json({ connected: true, playing: false });
  }

  const data = await npRes.json();

  if (!data?.item) {
    return NextResponse.json({ connected: true, playing: false });
  }

  return NextResponse.json({
    connected: true,
    playing: true,
    track: {
      name: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url ?? null,
      progressMs: data.progress_ms,
      durationMs: data.item.duration_ms,
      isPlaying: data.is_playing,
      spotifyUrl: data.item.external_urls.spotify,
    },
  });
}

export async function DELETE() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // FIXED: Changed from deleteMany to a specific delete targeting the unique userId relation
    await prisma.spotifyToken.delete({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete token:", error);
    return NextResponse.json({ error: "Could not unlink account" }, { status: 500 });
  }
}

