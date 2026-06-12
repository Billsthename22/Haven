"use client";

import React, { useState, useEffect } from "react";
import {
  Bell, Search, Plus, Users, MessageCircle, Home, Music,
  Calendar, Flame, Clock, Settings, User, Image as ImageIcon,
  Video, UserPlus, ChevronRight, Heart, Share2, Lock,
  Mic, MoreHorizontal, TrendingUp,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import SpotifyWidget from "@/src/components/dashboard/SpotifyWidget";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    fontSize: "11px", fontWeight: 600, color: "#484848",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px"
  }}>
    {children}
  </h2>
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string | null | undefined) {
  if (!name) return "??";
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("");
}

function getFirstName(name: string | null | undefined) {
  if (!name) return "there";
  return name.trim().split(/\s+/)[0];
}

const communities = [
  { name: "The Boys", members: 24, streak: 45, initials: "TB", hue: "#10b981" },
  { name: "Babcock Crew", members: 18, streak: 27, initials: "BC", hue: "#0ea5e9" },
  { name: "Weekend Vibes", members: 31, streak: 60, initials: "WV", hue: "#8b5cf6" },
];

const posts = [
  { user: "David", initials: "D", color: "#10b981", community: "The Boys", content: "Movie night this weekend? 🍿 Who's in?", likes: 24, comments: 12, time: "2h ago", liked: false },
  { user: "Tolu", initials: "T", color: "#8b5cf6", community: "Babcock Crew", content: "Just uploaded all the graduation photos 📸", likes: 42, comments: 18, time: "5h ago", liked: true },
];

const navItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Users, label: "Communities" },
  { icon: MessageCircle, label: "Messages" },
  { icon: Bell, label: "Notifications" },
  { icon: Music, label: "Music" },
  { icon: Calendar, label: "Events" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

const quickActions = [
  { icon: Plus, label: "Post", accent: "#10b981" },
  { icon: ImageIcon, label: "Photo", accent: "#0ea5e9" },
  { icon: Video, label: "Video", accent: "#8b5cf6" },
  { icon: Mic, label: "Audio", accent: "#e97316" },
  { icon: Users, label: "Circle", accent: "#10b981" },
  { icon: UserPlus, label: "Invite", accent: "#0ea5e9" },
];

const onlineUsers = [
  { name: "David", status: "Listening to music", color: "#10b981" },
  { name: "Sarah", status: "Active now", color: "#0ea5e9" },
  { name: "Tolu", status: "Listening to music", color: "#8b5cf6" },
];

const upcoming = [
  { icon: Calendar, label: "Movie Night", sub: "Sat · 8:00 PM · The Boys", color: "#10b981" },
  { icon: TrendingUp, label: "Football Watch Party", sub: "Sun · 4:00 PM", color: "#0ea5e9" },
  { icon: Clock, label: "Study Circle", sub: "Mon · 7:00 PM · Babcock Crew", color: "#8b5cf6" },
];

const weekStats = [
  { label: "Posts", value: "12" },
  { label: "Reactions", value: "84" },
  { label: "Active hrs", value: "6.2" },
  { label: "New friends", value: "3" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({ 0: false, 1: true });
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const toggleLike = (i: number) => setLikedPosts(prev => ({ ...prev, [i]: !prev[i] }));

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? null;
  const initials = getInitials(displayName);
  const firstName = getFirstName(displayName);

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#efefef",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sh-sidebar      { display: flex !important; }
        .sh-right        { display: flex !important; }
        .sh-mobile-bar   { display: none !important; }
        .sh-search-box   { display: flex !important; }
        .sh-hdr-sub      { display: inline !important; }
        .sh-wrapper      { flex-direction: row !important; padding: 28px 28px 60px !important; }
        .sh-hero         { flex-direction: row !important; align-items: center !important; }
        .sh-hero-num     { font-size: 52px !important; }
        .sh-actions-row  { display: grid !important; grid-template-columns: repeat(6,1fr) !important; overflow-x: visible !important; }
        .sh-circles-row  { display: grid !important; grid-template-columns: repeat(3,1fr) !important; overflow-x: visible !important; }
        .sh-mob-only     { display: none !important; }

        @media (max-width: 1024px) {
          .sh-sidebar     { display: none !important; }
          .sh-right       { display: none !important; }
          .sh-mobile-bar  { display: flex !important; }
          .sh-search-box  { display: none !important; }
          .sh-hdr-sub     { display: none !important; }
          .sh-wrapper     { flex-direction: column !important; padding: 16px 16px 100px !important; }
          .sh-hero        { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; padding: 22px !important; }
          .sh-hero-num    { font-size: 40px !important; }
          .sh-mob-only    { display: flex !important; }
          header          { padding: 0 16px !important; }
          .sh-actions-row { display: flex !important; overflow-x: auto !important; scrollbar-width: none; gap: 8px !important; padding-bottom: 4px; }
          .sh-actions-row::-webkit-scrollbar { display: none; }
          .sh-actions-row > * { min-width: 80px !important; flex-shrink: 0 !important; }
          .sh-circles-row { display: flex !important; overflow-x: auto !important; scrollbar-width: none; gap: 10px !important; padding-bottom: 4px; }
          .sh-circles-row::-webkit-scrollbar { display: none; }
          .sh-circles-row > * { min-width: 150px !important; flex-shrink: 0 !important; }
        }

        .sh-nav-btn:hover    { background: #161616 !important; color: #ccc !important; }
        .sh-action-btn:hover { border-color: #2a2a2a !important; color: #ddd !important; }
        .sh-post-card:hover  { border-color: #242424 !important; }
        .sh-circle-card:hover { border-color: #272727 !important; }
      `}</style>

      <aside className="sh-sidebar" style={{
        width: 228, flexShrink: 0, borderRight: "1px solid #141414",
        background: "#0b0b0b", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #141414" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px #10b98118" }}>
              <Lock size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "#fff" }}>Safe Haven</div>
              <div style={{ fontSize: 10, color: "#383838", marginTop: 1, letterSpacing: "0.02em" }}>encrypted circles</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#303030", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 10px 6px" }}>Main</div>
          {navItems.slice(0, 4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="sh-nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#484848", fontWeight: active ? 500 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
                <Icon size={15} color={active ? "#10b981" : "#383838"} />
                {label}
                {label === "Notifications" && (
                  <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: "#10b981", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
                )}
              </button>
            );
          })}

          <div style={{ fontSize: 9, fontWeight: 600, color: "#303030", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 10px 6px" }}>Explore</div>
          {navItems.slice(4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="sh-nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#484848", fontWeight: active ? 500 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
                <Icon size={15} color={active ? "#10b981" : "#383838"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ margin: "0 8px 14px", padding: "14px", borderRadius: 10, background: "#0f1a13", border: "1px solid #163020" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Streak active</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
            <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>days 🔥</span>
          </div>
          <div style={{ marginTop: 10, height: 3, background: "#132010", borderRadius: 2 }}>
            <div style={{ width: "70%", height: "100%", background: "#10b981", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 9, color: "#2a4030" }}>0</span>
            <span style={{ fontSize: 9, color: "#10b981" }}>Top 5%</span>
          </div>
        </div>

      </aside>

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(8,8,8,0.96)", borderBottom: "1px solid #141414",
          backdropFilter: "blur(16px)", padding: "0 26px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="sh-mobile-bar" style={{
              width: 32, height: 32, borderRadius: 7, background: "#111", border: "1px solid #1c1c1c",
              cursor: "pointer", alignItems: "center", justifyContent: "center", color: "#666",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1.5 3.5h11M1.5 7h11M1.5 10.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>
                {getGreeting()}{user ? `, ${firstName}` : ""}
              </span>
              <span className="sh-hdr-sub" style={{ color: "#383838", marginLeft: 8, fontSize: 13 }}>
                What&apos;s happening in your circles?
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="sh-search-box" style={{
              display: "flex", alignItems: "center", gap: 8, background: "#0f0f0f",
              border: "1px solid #1c1c1c", borderRadius: 8, padding: "6px 12px", width: 240,
            }}>
              <Search size={13} color="#383838" />
              <input placeholder="Search circles, posts, people…" style={{
                background: "none", border: "none", outline: "none", color: "#aaa", fontSize: 12, flex: 1,
              }} />
              <span style={{ fontSize: 10, color: "#2a2a2a", border: "1px solid #1e1e1e", borderRadius: 4, padding: "1px 5px" }}>⌘K</span>
            </div>
            <button className="sh-mobile-bar" style={{
              width: 32, height: 32, borderRadius: 7, background: "#111", border: "1px solid #1c1c1c",
              cursor: "pointer", alignItems: "center", justifyContent: "center", color: "#666",
            }}>
              <Search size={14} />
            </button>
            <button style={{
              position: "relative", width: 32, height: 32, borderRadius: 7,
              background: "#0f0f0f", border: "1px solid #1c1c1c", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={14} color="#666" />
              <div style={{ position: "absolute", top: 6, right: 6, width: 5, height: 5, borderRadius: "50%", background: "#10b981", outline: "2px solid #080808" }} />
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: 7, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 11, color: "#fff", cursor: "pointer",
              boxShadow: "0 0 0 2px #0b0b0b, 0 0 0 4px #10b98130",
              letterSpacing: "-0.5px",
            }}>
              {initials}
            </div>
          </div>
        </header>

        <div className="sh-wrapper" style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 28px 60px", display: "flex", gap: 22 }}>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 26 }}>

            <div className="sh-hero" style={{
              background: "#0b0b0b", border: "1px solid #141414", borderRadius: 14,
              padding: "26px 30px", display: "flex", justifyContent: "space-between",
              gap: 20, overflow: "hidden", position: "relative",
            }}>
              <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #10b98112 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#0f1a13", border: "1px solid #163020",
                  borderRadius: 5, padding: "3px 9px", marginBottom: 12,
                  fontSize: 9, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }} />
                  Streak active
                </div>
                <div className="sh-hero-num" style={{ fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: "-2.5px", lineHeight: 1 }}>42 days</div>
                <div style={{ color: "#383838", marginTop: 8, fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>Your circles are active. Keep the momentum going.</div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                    <Plus size={13} /> New post
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: "none", border: "1px solid #1c1c1c", borderRadius: 7, color: "#555", fontSize: 12, cursor: "pointer" }}>
                    Invite to circle
                  </button>
                </div>
              </div>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#141414" strokeWidth="6" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div style={{ position: "absolute", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>70%</div>
                  <div style={{ fontSize: 9, color: "#383838", marginTop: 2 }}>to goal</div>
                </div>
              </div>
            </div>

            <div>
              <SectionLabel>Quick actions</SectionLabel>
              <div className="sh-actions-row" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
                {quickActions.map(({ icon: Icon, label, accent }, i) => (
                  <button key={i} className="sh-action-btn" style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    padding: "14px 6px", background: "#0b0b0b", border: "1px solid #141414",
                    borderRadius: 10, cursor: "pointer", color: "#484848", fontSize: 11, fontWeight: 500, transition: "all 0.12s",
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={16} color={accent} />
                    </div>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionLabel>Your circles</SectionLabel>
                <button style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#10b981", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="sh-circles-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {communities.map((c) => (
                  <div key={c.name} className="sh-circle-card" style={{
                    background: "#0b0b0b", border: "1px solid #141414", borderRadius: 11,
                    padding: "16px", cursor: "pointer", transition: "border-color 0.12s", position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.hue + "60", borderRadius: "11px 11px 0 0" }} />
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: c.hue + "18", border: "1px solid " + c.hue + "28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: c.hue, marginBottom: 12 }}>{c.initials}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#e0e0e0", marginBottom: 3 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#383838", marginBottom: 12 }}>{c.members} members</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#e97316", fontWeight: 600 }}>
                        <Flame size={11} color="#e97316" /> {c.streak}d
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: c.hue + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ChevronRight size={11} color={c.hue} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Recent activity</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {posts.map((post, i) => (
                  <div key={i} className="sh-post-card" style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "18px 20px", transition: "border-color 0.12s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <div style={{ position: "relative" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: post.color + "20", border: "1.5px solid " + post.color + "40", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: post.color }}>{post.initials}</div>
                        <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#10b981", border: "2px solid #0b0b0b" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#e8e8e8" }}>{post.user}</span>
                          <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "#121212", color: "#484848", border: "1px solid #1e1e1e" }}>{post.community}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#303030", marginTop: 2 }}>{post.time}</div>
                      </div>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2a2a2a", padding: 4 }}>
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                    <p style={{ color: "#b0b0b0", lineHeight: 1.65, marginBottom: 14, fontSize: 14 }}>{post.content}</p>
                    <div style={{ aspectRatio: "16/9", borderRadius: 8, background: "#0e0e0e", border: "1px solid #161616", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                      <ImageIcon size={24} color="#212121" />
                      <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.6)", fontSize: 10, color: "#666", padding: "3px 8px", borderRadius: 4 }}>
                        <ImageIcon size={9} color="#666" /> Photo
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => toggleLike(i)} style={{
                          display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 6, border: "1px solid",
                          borderColor: likedPosts[i] ? "#f43f5e30" : "#141414", background: likedPosts[i] ? "#f43f5e10" : "transparent",
                          cursor: "pointer", color: likedPosts[i] ? "#f43f5e" : "#444", fontSize: 12, fontWeight: 500, transition: "all 0.12s",
                        }}>
                          <Heart size={13} fill={likedPosts[i] ? "#f43f5e" : "none"} strokeWidth={likedPosts[i] ? 0 : 2} />
                          {post.likes + (likedPosts[i] && !post.liked ? 1 : 0)}
                        </button>
                        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 6, border: "1px solid #141414", background: "transparent", cursor: "pointer", color: "#444", fontSize: 12, fontWeight: 500 }}>
                          <MessageCircle size={13} /> {post.comments}
                        </button>
                      </div>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 6, border: "1px solid #141414", background: "transparent", cursor: "pointer", color: "#444", fontSize: 12 }}>
                        <Share2 size={13} /> Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sh-right" style={{ width: 248, flexShrink: 0, flexDirection: "column", gap: 14 }}>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Online now</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {onlineUsers.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < onlineUsers.length - 1 ? "1px solid #0f0f0f" : "none" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: f.color }}>{f.name[0]}</div>
                      <div style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: "#10b981", border: "2px solid #0b0b0b" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#d8d8d8" }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: "#383838", marginTop: 1 }}>{f.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SpotifyWidget />

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Upcoming</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {upcoming.map(({ icon: Icon, label, sub, color }, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={13} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{label}</div>
                      <div style={{ fontSize: 10, color: "#383838", marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>This Week</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 8px" }}>
                {weekStats.map((stat, i) => (
                  <div key={i} style={{ background: "#0e0e0e", padding: "10px", borderRadius: 8, border: "1px solid #121212" }}>
                    <div style={{ fontSize: 10, color: "#383838", marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="sh-mobile-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 64,
        background: "rgba(11,11,11,0.85)", borderTop: "1px solid #141414",
        backdropFilter: "blur(20px)", zIndex: 50, display: "none",
        alignItems: "center", justifyContent: "space-around", padding: "0 10px",
      }}>
        {navItems.slice(0, 5).map(({ icon: Icon, label }) => {
          const active = activeTab === label;
          return (
            <button key={label} onClick={() => setActiveTab(label)} style={{
              background: "none", border: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, color: active ? "#10b981" : "#484848", cursor: "pointer",
            }}>
              <Icon size={18} />
              <span style={{ fontSize: "9px", fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
