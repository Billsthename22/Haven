"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Music, Play, Pause, ExternalLink, Unlink } from "lucide-react";

type Track = {
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  spotifyUrl: string;
};

type NowPlayingState =
  | { status: "loading" }
  | { status: "disconnected" }
  | { status: "idle" }
  | { status: "playing"; track: Track };

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const WidgetHeader = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <div style={{ fontSize: "11px", fontWeight: 600, color: "#484848", textTransform: "uppercase", letterSpacing: "0.08em" }}>On the aux</div>
    {children}
  </div>
);

export default function SpotifyWidget() {
  const [state, setState] = useState<NowPlayingState>({ status: "loading" });
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  const clearPoll = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/now-playing");
      const data = await res.json();

      if (!data.connected) {
        setState({ status: "disconnected" });
        clearTick();
        return;
      }

      if (!data.playing) {
        setState({ status: "idle" });
        clearTick();
        return;
      }

      setState({ status: "playing", track: data.track });
      setProgress(data.track.progressMs);

      clearTick();
      if (data.track.isPlaying) {
        tickRef.current = setInterval(() => {
          setProgress((p) => Math.min(p + 1000, data.track.durationMs));
        }, 1000);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying();
    pollRef.current = setInterval(fetchNowPlaying, 30_000);
    return () => { clearTick(); clearPoll(); };
  }, [fetchNowPlaying]);

  const handleDisconnect = async () => {
    await fetch("/api/spotify/now-playing", { method: "DELETE" });
    setState({ status: "disconnected" });
    clearTick();
    clearPoll();
  };

  if (state.status === "loading") {
    return (
      <div data-spotesc style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: 16 }}>
        <WidgetHeader />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#141414", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, background: "#141414", borderRadius: 4, width: "70%", marginBottom: 6 }} />
            <div style={{ height: 10, background: "#0e0e0e", borderRadius: 4, width: "45%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "disconnected") {
    return (
      <div data-spotesc style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: 16 }}>
        <WidgetHeader />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: "#1DB95418",
            border: "1px solid #1DB95428",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ccc", marginBottom: 3 }}>Link your Spotify</div>
            <div style={{ fontSize: 10, color: "#383838", marginBottom: 10 }}>Share what you&apos;re listening to</div>
            <a
              href="/api/spotify/connect"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "7px 14px", borderRadius: 7,
                background: "#1DB954", color: "#000",
                fontSize: 11, fontWeight: 700, textDecoration: "none",
                transition: "opacity 0.12s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Connect Spotify
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "idle") {
    return (
      <div data-spotesc style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: 16 }}>
        <WidgetHeader>
          <button onClick={handleDisconnect} title="Disconnect Spotify" style={{ background: "none", border: "none", cursor: "pointer", color: "#2a2a2a", padding: 2 }}>
            <Unlink size={11} />
          </button>
        </WidgetHeader>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#1DB95418", border: "1px solid #1DB95428", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Music size={18} color="#1DB954" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>Nothing playing</div>
            <div style={{ fontSize: 10, color: "#303030", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              Spotify connected
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { track } = state;
  const pct = track.durationMs > 0 ? (progress / track.durationMs) * 100 : 0;

  return (
    <div data-spotesc style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: 16 }}>
      <WidgetHeader>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {track.isPlaying && (
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 2.5, background: "#1DB954", borderRadius: 1,
                  animation: `eq-bar ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                  height: `${40 + i * 25}%`,
                }} />
              ))}
            </div>
          )}
          <button onClick={handleDisconnect} title="Disconnect Spotify" style={{ background: "none", border: "none", cursor: "pointer", color: "#2a2a2a", padding: 2 }}>
            <Unlink size={11} />
          </button>
        </div>
      </WidgetHeader>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        {track.albumArt ? (
          <img src={track.albumArt} alt={track.album} style={{ width: 44, height: 44, borderRadius: 6, flexShrink: 0, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#1DB95418", border: "1px solid #1DB95428", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Music size={18} color="#1DB954" />
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
          >
            <div style={{ fontWeight: 600, fontSize: 13, color: "#e0e0e0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track.name}
            </div>
            <ExternalLink size={9} color="#383838" style={{ flexShrink: 0 }} />
          </a>
          <div style={{ fontSize: 11, color: "#484848", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {track.artist}
          </div>
          <div style={{ fontSize: 10, color: track.isPlaying ? "#1DB954" : "#383838", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            {track.isPlaying ? <Play size={9} fill="#1DB954" strokeWidth={0} /> : <Pause size={9} color="#383838" />}
            {track.isPlaying ? "Now playing" : "Paused"}
          </div>
        </div>
      </div>

      <div style={{ height: 2, background: "#141414", borderRadius: 1, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#1DB954", borderRadius: 1, transition: "width 1s linear" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontSize: 9, color: "#2a2a2a" }}>{fmt(progress)}</span>
        <span style={{ fontSize: 9, color: "#2a2a2a" }}>{fmt(track.durationMs)}</span>
      </div>

      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
