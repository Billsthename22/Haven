"use client";

import React, { useState, useEffect } from "react";
import {
  Bell, Search, Plus, Users, MessageCircle, Home, Music,
  Calendar, Clock, Settings, User, Image as ImageIcon,
  Video, UserPlus, Lock, Mic, LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Communities", href: "/communities" },
  { icon: MessageCircle, label: "Messages", href: "/messaging" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Music, label: "Music", href: "/music" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const quickActions = [
  { icon: Plus, label: "Post", accent: "#10b981" },
  { icon: ImageIcon, label: "Photo", accent: "#0ea5e9" },
  { icon: Video, label: "Video", accent: "#8b5cf6" },
  { icon: Mic, label: "Audio", accent: "#e97316" },
  { icon: Users, label: "Circle", accent: "#10b981" },
  { icon: UserPlus, label: "Invite", accent: "#0ea5e9" },
];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

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
        }

        .sh-nav-btn:hover    { background: #161616 !important; color: #ccc !important; }
        .sh-action-btn:hover { border-color: #2a2a2a !important; color: #ddd !important; }
        .sh-post-card:hover  { border-color: #242424 !important; }
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

        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#303030", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 10px 6px" }}>Main</div>
          {navItems.slice(0, 4).map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link key={label} href={href} className="sh-nav-btn" style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                textDecoration: "none", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#484848", fontWeight: active ? 500 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
                <Icon size={15} color={active ? "#10b981" : "#383838"} />
                {label}
                {label === "Notifications" && (
                  <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: "#10b981", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
                )}
              </Link>
            );
          })}

          <div style={{ fontSize: 9, fontWeight: 600, color: "#303030", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 10px 6px" }}>Explore</div>
          {navItems.slice(4).map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link key={label} href={href} className="sh-nav-btn" style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                textDecoration: "none", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#484848", fontWeight: active ? 500 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
                <Icon size={15} color={active ? "#10b981" : "#383838"} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid #141414" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: "#fff", flexShrink: 0, letterSpacing: "-0.5px" }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#d0d0d0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName ?? "—"}</div>
              <div style={{ fontSize: 10, color: "#303030", marginTop: 1 }}>Online</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sh-nav-btn" style={{
            width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
            border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
            background: "transparent", color: "#484848", fontSize: 13,
          }}>
            <LogOut size={15} color="#383838" />
            Sign out
          </button>
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
            <Link href="/notifications" style={{
              position: "relative", width: 32, height: 32, borderRadius: 7,
              background: "#0f0f0f", border: "1px solid #1c1c1c", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={14} color="#666" />
              <div style={{ position: "absolute", top: 6, right: 6, width: 5, height: 5, borderRadius: "50%", background: "#10b981", outline: "2px solid #080808" }} />
            </Link>
            <Link href="/profile" style={{
              width: 32, height: 32, borderRadius: 7, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 11, color: "#fff", cursor: "pointer",
              boxShadow: "0 0 0 2px #0b0b0b, 0 0 0 4px #10b98130",
              letterSpacing: "-0.5px", textDecoration: "none",
            }}>
              {initials}
            </Link>
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
                <div style={{ fontSize: 13, color: "#484848", marginBottom: 10 }}>Welcome back, {firstName}.</div>
                <div className="sh-hero-num" style={{ fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: "-2.5px", lineHeight: 1 }}>Your Haven</div>
                <div style={{ color: "#383838", marginTop: 8, fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>Start by creating a circle or joining one.</div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <Link href="/communities" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer", textDecoration: "none" }}>
                    <Plus size={13} /> New circle
                  </Link>
                  <Link href="/communities" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: "none", border: "1px solid #1c1c1c", borderRadius: 7, color: "#555", fontSize: 12, cursor: "pointer", textDecoration: "none" }}>
                    Explore circles
                  </Link>
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
                <Link href="/communities" style={{ fontSize: 11, color: "#10b981", textDecoration: "none", fontWeight: 500 }}>See all</Link>
              </div>
              <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#111", border: "1px solid #1c1c1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={18} color="#2a2a2a" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#484848" }}>No circles yet</div>
                <div style={{ fontSize: 11, color: "#2a2a2a", textAlign: "center", maxWidth: 220 }}>Create or join a circle to see it here.</div>
                <Link href="/communities" style={{ marginTop: 4, fontSize: 11, color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Browse circles →</Link>
              </div>
            </div>

            <div>
              <SectionLabel>Recent activity</SectionLabel>
              <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#111", border: "1px solid #1c1c1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={18} color="#2a2a2a" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#484848" }}>Nothing here yet</div>
                <div style={{ fontSize: 11, color: "#2a2a2a", textAlign: "center", maxWidth: 220 }}>Activity from your circles will show up here.</div>
              </div>
            </div>
          </div>

          <div className="sh-right" style={{ width: 248, flexShrink: 0, flexDirection: "column", gap: 14 }}>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Online now</SectionLabel>
              <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#2a2a2a", textAlign: "center" }}>No one online yet</div>
              </div>
            </div>

            <SpotifyWidget />

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Upcoming</SectionLabel>
              <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#2a2a2a", textAlign: "center" }}>No events scheduled</div>
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
        {navItems.slice(0, 5).map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link key={label} href={href} style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, color: active ? "#10b981" : "#484848",
              textDecoration: "none",
            }}>
              <Icon size={18} />
              <span style={{ fontSize: "9px", fontWeight: active ? 600 : 400 }}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
