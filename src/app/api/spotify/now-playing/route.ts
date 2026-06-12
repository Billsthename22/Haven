import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

async function refreshToken(userId: string, refreshToken: string, supabase: Awaited<ReturnType<typeof createClient>>) {
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
  const newExpiresAt = Date.now() + data.expires_in * 1000;

  await supabase.from("spotify_tokens").update({
    access_token: data.access_token,
    expires_at: newExpiresAt,
    ...(data.refresh_token ? { refresh_token: data.refresh_token } : {}),
  }).eq("user_id", userId);

  return data.access_token as string;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: tokenRow } = await supabase
    .from("spotify_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", user.id)
    .single();

  if (!tokenRow) {
    return NextResponse.json({ connected: false });
  }

  let accessToken: string = tokenRow.access_token;

  if (Date.now() >= tokenRow.expires_at - 60_000) {
    const refreshed = await refreshToken(user.id, tokenRow.refresh_token, supabase);
    if (!refreshed) return NextResponse.json({ connected: false });
    accessToken = refreshed;
  }

  const npRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await supabase.from("spotify_tokens").delete().eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
