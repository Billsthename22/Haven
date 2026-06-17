import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://havenn-rosy.vercel.app";
}

function getSpotifyRedirectUri() {
  return process.env.SPOTIFY_REDIRECT_URI || `${getBaseUrl()}/api/spotify/callback`;
}

export async function GET(req: NextRequest) {
  const base = getBaseUrl();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${base}/dashboard?spotify_error=access_denied`);
  }

  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("auth_session")?.value;

  if (!sessionEmail) {
    return NextResponse.redirect(`${base}/login`);
  }

  const user = await prisma.profile.findUnique({
    where: { email: sessionEmail.toLowerCase().trim() },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.redirect(`${base}/login`);
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getSpotifyRedirectUri(),
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Spotify token exchange failed:", err);
    return NextResponse.redirect(`${base}/dashboard?spotify_error=token_exchange_failed`);
  }

  const tokens = await tokenRes.json();

  await prisma.spotifyToken.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });

  return NextResponse.redirect(`${base}/dashboard?spotify_connected=1`);
}
