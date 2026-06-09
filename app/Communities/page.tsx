"use client";
 
import { useState } from "react";
import {
  Plus, Search, Users, Flame, ChevronRight,
  Link2, Home, MessageCircle, Bell, Music,
  Calendar, User, Settings, Lock, Zap,
  TrendingUp, Hash, X, Menu,
} from "lucide-react";
 
const communities = [
  { id: 1, name: "The Boys", members: 24, streak: 45, category: "Friends", initials: "TB", hue: "#10b981" },
  { id: 2, name: "Babcock Crew", members: 18, streak: 27, category: "School", initials: "BC", hue: "#0ea5e9" },
  { id: 3, name: "Weekend Vibes", members: 31, streak: 60, category: "Lifestyle", initials: "WV", hue: "#8b5cf6" },
  { id: 4, name: "Football Club", members: 54, streak: 21, category: "Sports", initials: "FC", hue: "#e97316" },
];
 
const trending = [
  { name: "Movie Nights", emoji: "🎬", members: 102 },
  { name: "Lagos Foodies", emoji: "🍜", members: 87 },
  { name: "Dev Circle NG", emoji: "💻", members: 143 },
  { name: "Sunday Runners", emoji: "🏃", members: 64 },
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
 
const categories = ["All", "Friends", "School", "Gaming", "Sports", "Lifestyle", "Work"];
 
const stats = [
  { label: "Circles", value: "12" },
  { label: "Members", value: "324" },
  { label: "Posts today", value: "89" },
  { label: "Best streak", value: "60d 🔥" },
];
 
// Bottom nav tabs (mobile)
const bottomNav = [
  { icon: Home, label: "Home" },
  { icon: Users, label: "Communities" },
  { icon: MessageCircle, label: "Messages" },
  { icon: Bell, label: "Alerts" },
  { icon: User, label: "Profile" },
];
 
export default function CommunitiesPageMobile() {
  const [activeTab, setActiveTab] = useState("Communities");
  const [activeCategory, setActiveCategory] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
 
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#f5f5f5",
      fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
      maxWidth: 430, margin: "0 auto", position: "relative",
    }}>
 
      {/* ── Drawer overlay ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            zIndex: 100, maxWidth: 430, margin: "0 auto",
          }}
        />
      )}
 
      {/* ── Slide-in drawer ── */}
      <div style={{
        position: "fixed", top: 0, left: drawerOpen ? 0 : -280,
        width: 260, height: "100%", background: "#0d0d0d",
        borderRight: "1px solid #1a1a1a", zIndex: 110,
        transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        maxWidth: 260,
      }}>
        {/* Drawer header */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lock size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Safe Haven</div>
              <div style={{ fontSize: 10, color: "#444" }}>encrypted circles</div>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#444", padding: 4 }}>
            <X size={18} />
          </button>
        </div>
 
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} onClick={() => { setActiveTab(label); setDrawerOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: active ? "#141414" : "transparent",
                color: active ? "#fff" : "#555", fontWeight: active ? 500 : 400,
                fontSize: 13, textAlign: "left", position: "relative",
              }}>
                {active && <div style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: 3, height: 18, borderRadius: 2, background: "#10b981",
                }} />}
                <Icon size={16} color={active ? "#10b981" : "#444"} />
                {label}
              </button>
            );
          })}
        </nav>
 
        <div style={{ margin: "0 8px 16px", padding: "12px 14px", borderRadius: 10, background: "#111", border: "1px solid #1c1c1c" }}>
          <div style={{ fontSize: 10, color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Global streak</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", marginTop: 2 }}>42 days 🔥</div>
          <div style={{ fontSize: 10, color: "#10b981", marginTop: 2 }}>Top 5% of all havens</div>
        </div>
      </div>
 
      {/* ── Top bar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.97)", borderBottom: "1px solid #1a1a1a",
        backdropFilter: "blur(12px)", padding: "0 16px", height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setDrawerOpen(true)} style={{
            background: "none", border: "none", cursor: "pointer", color: "#888",
            display: "flex", alignItems: "center", padding: 4,
          }}>
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Communities</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSearchOpen(s => !s)} style={{
            width: 34, height: 34, borderRadius: 8, background: "#111",
            border: "1px solid #1f1f1f", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#888",
          }}>
            <Search size={15} />
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            background: "#10b981", color: "#fff", border: "none", borderRadius: 8,
            fontWeight: 600, fontSize: 12, cursor: "pointer",
          }}>
            <Plus size={13} /> New
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#10b981",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 11, color: "#fff", cursor: "pointer",
          }}>EM</div>
        </div>
      </header>
 
      {/* Search bar (collapsible) */}
      {searchOpen && (
        <div style={{ padding: "10px 16px", background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, background: "#111",
            border: "1px solid #1f1f1f", borderRadius: 8, padding: "8px 12px",
          }}>
            <Search size={14} color="#444" />
            <input autoFocus placeholder="Search communities..." style={{
              background: "none", border: "none", outline: "none",
              color: "#ccc", fontSize: 13, flex: 1,
            }} />
          </div>
        </div>
      )}
 
      {/* ── Scrollable content ── */}
      <div style={{ padding: "16px 16px 90px", display: "flex", flexDirection: "column", gap: 20 }}>
 
        {/* Hero card */}
        <div style={{
          background: "#0d0d0d", border: "1px solid #1a1a1a",
          borderRadius: 14, padding: "20px",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#0f1f16", border: "1px solid #1a3326",
            borderRadius: 6, padding: "3px 10px", marginBottom: 10,
            fontSize: 10, fontWeight: 600, color: "#10b981",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            <Zap size={10} fill="#10b981" strokeWidth={0} /> 4 active circles
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 6 }}>Build your circle</div>
          <div style={{ color: "#555", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
            Private spaces for friends, classmates, or anyone you want close.
          </div>
 
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {stats.map(({ label, value }) => (
              <div key={label} style={{
                background: "#111", border: "1px solid #1c1c1c",
                borderRadius: 8, padding: "10px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>{value}</div>
                <div style={{ fontSize: 9, color: "#444", marginTop: 2, lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>
 
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8,
              fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>
              <Plus size={14} /> Create community
            </button>
            <button style={{
              padding: "10px 14px", background: "none",
              border: "1px solid #222", borderRadius: 8,
              color: "#888", fontSize: 13, cursor: "pointer",
            }}>
              Join
            </button>
          </div>
        </div>
 
        {/* Category chips */}
        <div style={{ overflowX: "auto", marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
          <div style={{ display: "flex", gap: 6, width: "max-content" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: "6px 14px", borderRadius: 6, border: "1px solid",
                borderColor: activeCategory === cat ? "#10b981" : "#1f1f1f",
                background: activeCategory === cat ? "#0f1f16" : "transparent",
                color: activeCategory === cat ? "#10b981" : "#555",
                fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
 
        {/* Your communities */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your communities</div>
            <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#10b981", background: "none", border: "none", cursor: "pointer" }}>
              See all <ChevronRight size={13} />
            </button>
          </div>
 
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {communities.map((c) => (
              <div key={c.id} style={{
                background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12,
                overflow: "hidden", display: "flex", alignItems: "center",
              }}>
                {/* Left accent bar */}
                <div style={{ width: 4, alignSelf: "stretch", background: c.hue + "99", flexShrink: 0 }} />
 
                <div style={{ flex: 1, padding: "14px 14px", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: c.hue + "22", border: "1px solid " + c.hue + "33",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: c.hue,
                  }}>{c.initials}</div>
 
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "#e0e0e0" }}>{c.name}</span>
                      <span style={{
                        fontSize: 9, padding: "2px 6px", borderRadius: 3,
                        background: "#151515", color: "#555", border: "1px solid #222", whiteSpace: "nowrap",
                      }}>{c.category}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#555" }}>
                        <Users size={11} /> {c.members}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#e97316", fontWeight: 500 }}>
                        <Flame size={11} color="#e97316" /> {c.streak}d
                      </span>
                    </div>
                  </div>
 
                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button style={{
                      padding: "7px 14px", background: c.hue + "18",
                      border: "1px solid " + c.hue + "33", borderRadius: 7,
                      color: c.hue, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>Open</button>
                    <button style={{
                      width: 32, height: 32, borderRadius: 7, background: "#111",
                      border: "1px solid #1f1f1f", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#444",
                    }}>
                      <Link2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Trending */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <TrendingUp size={13} color="#10b981" />
            <div style={{ fontSize: 11, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Trending circles</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {trending.map((t, i) => (
              <div key={i} style={{
                background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12,
                padding: "14px",
              }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{t.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#d0d0d0", marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#444", marginBottom: 12 }}>{t.members} members</div>
                <button style={{
                  width: "100%", padding: "7px", background: "#0f1f16",
                  border: "1px solid #1a3326", borderRadius: 6,
                  color: "#10b981", fontSize: 12, fontWeight: 500, cursor: "pointer",
                }}>Join</button>
              </div>
            ))}
          </div>
        </div>
 
        {/* Topic tags */}
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Hash size={13} color="#444" />
            <div style={{ fontSize: 11, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Browse by topic</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { label: "Sports", hue: "#e97316" },
              { label: "Music", hue: "#8b5cf6" },
              { label: "School", hue: "#0ea5e9" },
              { label: "Gaming", hue: "#10b981" },
              { label: "Food", hue: "#f59e0b" },
              { label: "Tech", hue: "#6366f1" },
              { label: "Fitness", hue: "#ef4444" },
              { label: "Travel", hue: "#14b8a6" },
            ].map(({ label, hue }) => (
              <button key={label} style={{
                padding: "6px 12px", borderRadius: 5,
                background: hue + "18", border: "1px solid " + hue + "33",
                color: hue, fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}>{label}</button>
            ))}
          </div>
        </div>
 
        {/* Invite */}
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", marginBottom: 4 }}>Invite someone</div>
          <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6, marginBottom: 12 }}>
            Share a link and bring people into your circle instantly.
          </div>
          <button style={{
            width: "100%", padding: "10px", background: "#111",
            border: "1px solid #1f1f1f", borderRadius: 8,
            color: "#888", fontSize: 13, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
            <Link2 size={14} /> Copy invite link
          </button>
        </div>
      </div>
 
      {/* ── Bottom nav ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(10,10,10,0.97)", borderTop: "1px solid #1a1a1a",
        backdropFilter: "blur(12px)",
        display: "flex", zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {bottomNav.map(({ icon: Icon, label }) => {
          const active = label === "Communities" || activeTab === label;
          const isActive = label === "Communities";
          return (
            <button key={label} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, padding: "10px 0 8px", background: "none", border: "none",
              cursor: "pointer", color: isActive ? "#10b981" : "#444",
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              transition: "color 0.15s",
            }}>
              <Icon size={20} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
 