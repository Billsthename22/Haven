import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

const SPOTIFY_REDIRECT_URI = "https://havenn-rosy.vercel.app/callback";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${base}/login`);
  }

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: "user-read-currently-playing user-read-playback-state",
    show_dialog: "false",
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
