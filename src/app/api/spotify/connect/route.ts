import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://havenn-rosy.vercel.app";
}

function getSpotifyRedirectUri() {
  return process.env.SPOTIFY_REDIRECT_URI || `${getBaseUrl()}/api/spotify/callback`;
}

export async function GET() {
  const base = getBaseUrl();
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("auth_session")?.value;

  if (!sessionEmail) {
    return NextResponse.redirect(`${base}/login`);
  }

  try {
    const user = await prisma.profile.findUnique({
      where: { email: sessionEmail.toLowerCase().trim() },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.redirect(`${base}/login`);
    }

    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      response_type: "code",
      redirect_uri: getSpotifyRedirectUri(),
      scope: "user-read-currently-playing user-read-playback-state",
      show_dialog: "false",
    });

    return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);

  } catch (error) {
    console.error("Database auth error:", error);
    // Fallback error fallback structure
    return NextResponse.redirect(`${base}/login?error=server_error`);
  }
}
