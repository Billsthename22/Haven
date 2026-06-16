"use client";

import React, { useState } from "react";
import {
  Plus, Search, Users, Flame, ChevronRight,
  Link2, Home, MessageCircle, Bell, Music,
  Calendar, User, Settings, Lock, Zap,
  TrendingUp, Hash, X,
} from "lucide-react";

const communities = [
  { id: 1, name: "The Boys", members: 24, streak: 45, category: "Friends", initials: "TB", hue: "#10b981" },
  { id: 3, name: "Weekend Vibes", members: 31, streak: 60, category: "Lifestyle", initials: "WV", hue: "#8b5cf6" },
  { id: 4, name: "Football Club", members: 54, streak: 21, category: "Sports", initials: "FC", hue: "#e97316" },
];

const trending = [
  { name: "Movie Nights", emoji: "🎬", members: 102, tag: "Entertainment" },
  { name: "Lagos Foodies", emoji: "🍜", members: 87, tag: "Food" },
  { name: "Dev Circle NG", emoji: "💻", members: 143, tag: "Tech" },
  { name: "Sunday Runners", emoji: "🏃", members: 64, tag: "Sports" },
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
  { label: "Communities", value: "12" },
  { label: "Total members", value: "324" },
  { label: "Posts today", value: "89" },
  { label: "Best streak", value: "60d 🔥" },
];

const topicTags = [
  { label: "Sports", hue: "#e97316" },
  { label: "Music", hue: "#8b5cf6" },
  { label: "School", hue: "#0ea5e9" },
  { label: "Gaming", hue: "#10b981" },
  { label: "Food", hue: "#f59e0b" },
  { label: "Tech", hue: "#6366f1" },
  { label: "Fitness", hue: "#ef4444" },
  { label: "Travel", hue: "#14b8a6" },
];

function SectionLabel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: "#303030",
      textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: 12, ...style,
    }}>{children}</div>
  );
}

export default function CommunitiesDesktop() {
  const [activeTab, setActiveTab] = useState("Communities");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#efefef",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .com-nav-btn:hover  { background: #161616 !important; color: #ccc !important; }
        .com-card:hover     { border-color: #252525 !important; }
        .com-trend:hover    { background: #101010 !important; }
        .com-action-btn:hover { border-color: #252525 !important; color: #ddd !important; }
        input::placeholder  { color: #2e2e2e; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      <aside style={{
        width: 228, flexShrink: 0, borderRight: "1px solid #141414",
        background: "#0b0b0b", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #141414" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 4px #10b98118",
            }}>
              <Lock size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "#fff" }}>Safe Haven</div>
              <div style={{ fontSize: 10, color: "#383838", marginTop: 1 }}>encrypted circles</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#2a2a2a", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 10px 6px" }}>Main</div>
          {navItems.slice(0, 4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="com-nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#484848", fontWeight: active ? 500 : 400,
                fontSize: 13, position: "relative",
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

          <div style={{ fontSize: 9, fontWeight: 600, color: "#2a2a2a", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 10px 6px" }}>Explore</div>
          {navItems.slice(4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="com-nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#484848", fontWeight: active ? 500 : 400,
                fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
                <Icon size={15} color={active ? "#10b981" : "#383838"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ margin: "0 8px 14px", padding: "14px", borderRadius: 10, background: "#0f1a13", border: "1px solid #163020" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Streak active</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
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
          background: "rgba(8,8,8,0.97)", borderBottom: "1px solid #141414",
          backdropFilter: "blur(16px)", padding: "0 26px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>Communities</span>
            <span style={{ color: "#383838", marginLeft: 8, fontSize: 13 }}>Your spaces, your people</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, background: "#0f0f0f",
              border: "1px solid #1c1c1c", borderRadius: 8, padding: "6px 12px", width: 240,
            }}>
              <Search size={13} color="#383838" />
              <input placeholder="Search communities…" style={{
                background: "none", border: "none", outline: "none", color: "#aaa", fontSize: 12, flex: 1,
              }} />
              <span style={{ fontSize: 10, color: "#2a2a2a", border: "1px solid #1e1e1e", borderRadius: 4, padding: "1px 5px" }}>⌘K</span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
              background: "#10b981", color: "#fff", border: "none", borderRadius: 7,
              fontWeight: 600, fontSize: 12, cursor: "pointer",
            }}>
              <Plus size={13} /> New circle
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: 7, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 11, color: "#fff", cursor: "pointer",
              boxShadow: "0 0 0 2px #0b0b0b, 0 0 0 4px #10b98130",
            }}>EM</div>
          </div>
        </header>

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 26px 60px", display: "flex", gap: 22 }}>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>

            <div style={{
              background: "#0b0b0b", border: "1px solid #141414", borderRadius: 14,
              padding: "26px 28px", display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 24, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -50, left: -50, width: 220, height: 220, borderRadius: "50%",
                background: "radial-gradient(circle, #10b98110 0%, transparent 70%)", pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#0f1a13", border: "1px solid #163020", borderRadius: 5,
                  padding: "3px 9px", marginBottom: 12,
                  fontSize: 9, fontWeight: 700, color: "#10b981",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }} />
                  4 active circles
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>Build your circle</div>
                <div style={{ color: "#383838", marginTop: 8, fontSize: 13, lineHeight: 1.6, maxWidth: 380 }}>
                  Private encrypted spaces for friends, classmates, or anyone you want to stay close with.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
                    background: "#10b981", color: "#fff", border: "none", borderRadius: 7,
                    fontWeight: 600, fontSize: 12, cursor: "pointer",
                  }}>
                    <Plus size={13} /> Create community
                  </button>
                  <button style={{
                    padding: "9px 14px", background: "none",
                    border: "1px solid #1c1c1c", borderRadius: 7, color: "#555", fontSize: 12, cursor: "pointer",
                  }}>
                    Join with invite
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flexShrink: 0 }}>
                {stats.map(({ label, value }) => (
                  <div key={label} style={{
                    background: "#0e0e0e", border: "1px solid #171717",
                    borderRadius: 10, padding: "14px 16px", minWidth: 108,
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 10, color: "#383838", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "6px 13px", borderRadius: 6, border: "1px solid",
                  borderColor: activeCategory === cat ? "#10b981" : "#1a1a1a",
                  background: activeCategory === cat ? "#0f1a13" : "transparent",
                  color: activeCategory === cat ? "#10b981" : "#484848",
                  fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.12s",
                }}>{cat}</button>
              ))}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SectionLabel style={{ marginBottom: 0 }}>Your communities</SectionLabel>
                <button style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#10b981", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {communities.map((c) => (
                  <div key={c.id} className="com-card" style={{
                    background: "#0b0b0b", border: "1px solid #141414", borderRadius: 11,
                    overflow: "hidden", cursor: "pointer", transition: "border-color 0.12s",
                    position: "relative",
                  }}>
                    <div style={{ height: 3, background: c.hue + "70" }} />
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: c.hue + "18", border: "1px solid " + c.hue + "28",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: 13, color: c.hue,
                        }}>{c.initials}</div>
                        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#111", color: "#484848", border: "1px solid #1c1c1c" }}>{c.category}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#e0e0e0", marginBottom: 6 }}>{c.name}</div>
                      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#484848" }}>
                          <Users size={11} color="#484848" /> {c.members} members
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#e97316", fontWeight: 600 }}>
                          <Flame size={11} color="#e97316" /> {c.streak}d streak
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 7 }}>
                        <button style={{
                          flex: 1, padding: "8px", background: c.hue + "15",
                          border: "1px solid " + c.hue + "28", borderRadius: 7,
                          color: c.hue, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}>Open</button>
                        <button style={{
                          width: 32, height: 32, borderRadius: 7, background: "#0e0e0e",
                          border: "1px solid #1a1a1a", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#383838",
                        }}>
                          <Link2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ width: 248, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
                <TrendingUp size={12} color="#10b981" />
                <SectionLabel style={{ marginBottom: 0 }}>Trending</SectionLabel>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {trending.map((t, i) => (
                  <div key={i} className="com-trend" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.12s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, background: "#111",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                      }}>{t.emoji}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#d0d0d0" }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: "#383838", marginTop: 1 }}>{t.members} members</div>
                      </div>
                    </div>
                    <button style={{
                      padding: "4px 10px", background: "#0f1a13",
                      border: "1px solid #163020", borderRadius: 5,
                      color: "#10b981", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    }}>Join</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
                <Hash size={12} color="#383838" />
                <SectionLabel style={{ marginBottom: 0 }}>Browse by topic</SectionLabel>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {topicTags.map(({ label, hue }) => (
                  <button key={label} style={{
                    padding: "5px 10px", borderRadius: 5,
                    background: hue + "15", border: "1px solid " + hue + "28",
                    color: hue, fontSize: 11, fontWeight: 500, cursor: "pointer",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", marginBottom: 5 }}>Invite someone</div>
              <div style={{ fontSize: 12, color: "#383838", lineHeight: 1.65, marginBottom: 14 }}>
                Share a link and bring people into your circle in one tap.
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 0,
                background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 7, overflow: "hidden",
                marginBottom: 8,
              }}>
                <div style={{ flex: 1, padding: "8px 10px", fontSize: 11, color: "#303030", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  haven.app/invite/xk9f2z
                </div>
                <button style={{
                  padding: "8px 12px", background: "#10b981", border: "none",
                  color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <Link2 size={12} /> Copy
                </button>
              </div>
              <div style={{ fontSize: 10, color: "#2a2a2a" }}>Link expires in 7 days · 5 uses left</div>
            </div>

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Your activity</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {[
                  { label: "Circles joined", value: "4" },
                  { label: "Posts this wk", value: "12" },
                  { label: "Active hrs", value: "6.2" },
                  { label: "New members", value: "8" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#0e0e0e", borderRadius: 7, padding: "10px 11px", border: "1px solid #171717" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 10, color: "#383838", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
