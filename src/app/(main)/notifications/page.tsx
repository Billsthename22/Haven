"use client";

import React, { useState } from "react";
import {
  Bell, MessageCircle, Heart, UserPlus, Users,
  Home, Settings, User, Music, Calendar, Lock,
  CheckCheck, X, Zap, ArrowUpRight, TrendingUp, Flame,
} from "lucide-react";

// ── Color palette (matches dashboard system) ──────────────────────────────
const GROUP_COLORS = [
  { dot: "#7F77DD", bg: "#EEEDFE", text: "#534AB7" },
  { dot: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
  { dot: "#D4537E", bg: "#FBEAF0", text: "#993556" },
  { dot: "#EF9F27", bg: "#FAEEDA", text: "#854F0B" },
  { dot: "#378ADD", bg: "#E6F1FB", text: "#185FA5" },
];

const allNotifications = [
  { id: 1, type: "message", read: false, title: "New message", text: "John sent you a message in The Boys", time: "2m ago", avatar: "JO", colorIdx: 4, action: "Reply" },
  { id: 2, type: "like", read: false, title: "Post liked", text: 'Sarah liked your post — "Movie night this weekend? 🍿"', time: "10m ago", avatar: "SJ", colorIdx: 2, action: null },
  { id: 3, type: "friend", read: false, title: "Friend request", text: "David Parker wants to connect with you", time: "1h ago", avatar: "DP", colorIdx: 1, action: "Accept", actionSecondary: "Decline" },
  { id: 4, type: "community", read: true, title: "New members", text: "3 new people joined Babcock Crew", time: "3h ago", avatar: "BC", colorIdx: 0, action: "View" },
  { id: 5, type: "streak", read: true, title: "Streak milestone", text: "You're on a 42-day streak! You're in the top 5% of all havens 🔥", time: "5h ago", avatar: "🔥", colorIdx: 3, action: null },
  { id: 6, type: "message", read: true, title: "New message", text: "Tolu replied to your post in Babcock Crew", time: "Yesterday", avatar: "TO", colorIdx: 0, action: "View" },
  { id: 7, type: "like", read: true, title: "Reacted to your post", text: "Emma and 4 others reacted to your graduation photo", time: "Yesterday", avatar: "ES", colorIdx: 3, action: null },
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

const filters = ["All", "Unread", "Messages", "Reactions", "People"];

const TYPE_ICONS: Record<string, typeof Bell> = {
  message: MessageCircle, like: Heart, friend: UserPlus, community: Users, streak: Zap,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
      {children}
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(allNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    if (activeFilter === "Messages") return n.type === "message";
    if (activeFilter === "Reactions") return n.type === "like";
    if (activeFilter === "People") return n.type === "friend";
    return true;
  });

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const grouped = { new: filtered.filter(n => !n.read), earlier: filtered.filter(n => n.read) };

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f2ff", color: "#111",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; }
        .nav-btn:hover { background: #f0effe !important; color: #534AB7 !important; }
        .notif-row:hover { border-color: #c4b8f8 !important; }
        .notif-row:hover .notif-dismiss { opacity: 1 !important; }
        .filter-btn:hover { border-color: #7F77DD !important; color: #534AB7 !important; }
        .sh-group:hover { background: #ede9fe !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0, borderRight: "1px solid #ede8ff",
        background: "#fff", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", zIndex: 50,
      }}>
        <div style={{ padding: "20px 20px", borderBottom: "1px solid #ede8ff", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#3C3489" }}>Safe Haven</div>
            <div style={{ fontSize: 10, color: "#9990dd", marginTop: 1 }}>private networks</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 10px 8px" }}>Main</div>
          {navItems.slice(0, 4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                background: active ? "#EEEDFE" : "transparent",
                color: active ? "#534AB7" : "#888", fontWeight: active ? 600 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, borderRadius: "0 3px 3px 0", background: "#534AB7" }} />}
                <Icon size={16} color={active ? "#534AB7" : "#bbb"} />
                {label}
                {label === "Notifications" && unreadCount > 0 && (
                  <div style={{ marginLeft: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "#534AB7", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{unreadCount}</div>
                )}
                {label === "Messages" && (
                  <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: 9, background: "#FBEAF0", fontSize: 9, fontWeight: 700, color: "#993556", display: "flex", alignItems: "center", justifyContent: "center" }}>6</div>
                )}
              </button>
            );
          })}
          <div style={{ fontSize: 9, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.15em", padding: "16px 10px 8px" }}>Explore</div>
          {navItems.slice(4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                background: active ? "#EEEDFE" : "transparent",
                color: active ? "#534AB7" : "#888", fontWeight: active ? 600 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, borderRadius: "0 3px 3px 0", background: "#534AB7" }} />}
                <Icon size={16} color={active ? "#534AB7" : "#bbb"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "14px 20px", borderTop: "1px solid #ede8ff", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EEEDFE", border: "1px solid #c4b8f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#534AB7" }}>EM</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#3C3489", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Emioluwa G.</div>
            <div style={{ fontSize: 10, color: "#9990dd" }}>Active</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "#fff", borderBottom: "1px solid #ede8ff",
          padding: "0 32px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#3C3489" }}>Notifications</span>
            {unreadCount > 0 && (
              <div style={{ background: "#EEEDFE", border: "1px solid #c4b8f8", color: "#534AB7", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 5 }}>
                {unreadCount} unread
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
              background: "#EEEDFE", border: "1px solid #c4b8f8", borderRadius: 8,
              color: "#534AB7", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, padding: "32px", maxWidth: 1300, width: "100%", margin: "0 auto", flex: 1 }}>

          <main style={{ minWidth: 0 }}>
            <div style={{ display: "flex", gap: 7, marginBottom: 24, flexWrap: "wrap" }}>
              {filters.map(f => (
                <button key={f} className="filter-btn" onClick={() => setActiveFilter(f)} style={{
                  padding: "6px 14px", borderRadius: 99, border: "1px solid",
                  borderColor: activeFilter === f ? "#7F77DD" : "#ede8ff",
                  background: activeFilter === f ? "#EEEDFE" : "transparent",
                  color: activeFilter === f ? "#534AB7" : "#9990dd",
                  fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.12s",
                }}>{f}</button>
              ))}
            </div>

            {grouped.new.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <SectionLabel>New</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grouped.new.map(n => <NotifRow key={n.id} n={n} onDismiss={dismiss} onRead={markRead} />)}
                </div>
              </div>
            )}

            {grouped.earlier.length > 0 && (
              <div>
                <SectionLabel>Earlier</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grouped.earlier.map(n => <NotifRow key={n.id} n={n} onDismiss={dismiss} onRead={markRead} />)}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 24px", border: "1px dashed #ede8ff", borderRadius: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#EEEDFE", border: "1px solid #c4b8f8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Bell size={18} color="#7F77DD" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#534AB7", marginBottom: 4 }}>All clear</div>
                <div style={{ fontSize: 12, color: "#9990dd" }}>No notifications matching "{activeFilter}".</div>
              </div>
            )}
          </main>

          {/* ── RIGHT PANEL ── */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Streak card */}
            <div style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75" }} />
                <span style={{ fontSize: 10, color: "#1D9E75", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Streak active</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: "#3C3489", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
                <span style={{ fontSize: 13, color: "#EF9F27", fontWeight: 600 }}>day streak</span>
                <Flame size={15} color="#EF9F27" />
              </div>
              <p style={{ fontSize: 11, color: "#9990dd", marginTop: 7, lineHeight: 1.55 }}>You're outperforming 95% of all active users.</p>
              <div style={{ marginTop: 12, height: 4, background: "#EEEDFE", borderRadius: 2 }}>
                <div style={{ width: "72%", height: "100%", background: "#7F77DD", borderRadius: 2 }} />
              </div>
            </div>

            {/* Stats card */}
            <div style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em" }}>Overview</span>
                <TrendingUp size={13} color="#bbb" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Unread", value: `${unreadCount}`, color: "#534AB7" },
                  { label: "Total", value: `${notifications.length}`, color: "#3C3489" },
                  { label: "Node cluster", value: "Babcock", color: "#7F77DD" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? "1px solid #f4f2ff" : "none" }}>
                    <span style={{ color: "#9990dd" }}>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                      {s.value} {i === 2 && <ArrowUpRight size={11} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Groups mini list */}
            <div style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "18px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Your groups</div>
              {["The Boys", "Babcock Crew", "Movie Club"].map((g, i) => {
                const col = GROUP_COLORS[i % GROUP_COLORS.length];
                return (
                  <div key={g} className="sh-group" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.12s" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot }} />
                    <span style={{ fontSize: 12, color: "#3C3489", flex: 1 }}>{g}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

type Notif = typeof allNotifications[0];
function NotifRow({ n, onDismiss, onRead }: { n: Notif; onDismiss: (id: number) => void; onRead: (id: number) => void }) {
  const col = GROUP_COLORS[n.colorIdx % GROUP_COLORS.length];
  const Icon = TYPE_ICONS[n.type] || Bell;
  const isEmoji = n.avatar.length <= 2 && !/[A-Z]/.test(n.avatar[1] || "");

  return (
    <div
      className="notif-row"
      onClick={() => onRead(n.id)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "14px", borderRadius: 12,
        background: "#fff",
        border: "1px solid",
        borderColor: n.read ? "#ede8ff" : "#c4b8f8",
        cursor: "pointer", transition: "all 0.15s",
        position: "relative",
      }}
    >
      {!n.read && (
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "12px 0 0 12px", background: "#7F77DD" }} />
      )}

      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: col.bg, border: `1px solid ${col.dot}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: isEmoji ? 18 : 12, color: col.text,
        }}>{n.avatar}</div>
        <div style={{
          position: "absolute", bottom: -3, right: -3,
          width: 17, height: 17, borderRadius: 5,
          background: "#fff", border: "1px solid #ede8ff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={10} color={col.dot} />
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
          <span style={{ fontWeight: n.read ? 500 : 600, fontSize: 13, color: n.read ? "#888" : "#3C3489" }}>{n.title}</span>
          <span style={{ fontSize: 10, color: "#bbb", flexShrink: 0 }}>{n.time}</span>
        </div>
        <p style={{ fontSize: 12, color: n.read ? "#aaa" : "#555", lineHeight: 1.6, marginBottom: n.action ? 10 : 0 }}>
          {n.text}
        </p>
        {n.action && (
          <div style={{ display: "flex", gap: 7 }}>
            <button
              onClick={e => { e.stopPropagation(); onRead(n.id); }}
              style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #c4b8f8", background: "#EEEDFE", color: "#534AB7", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
            >{n.action}</button>
            {n.actionSecondary && (
              <button
                onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
                style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #ede8ff", background: "transparent", color: "#aaa", fontSize: 11, cursor: "pointer" }}
              >{n.actionSecondary}</button>
            )}
          </div>
        )}
      </div>

      <button
        className="notif-dismiss"
        onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
        style={{
          opacity: 0, transition: "opacity 0.12s", flexShrink: 0,
          width: 24, height: 24, borderRadius: 6, background: "#EEEDFE",
          border: "none", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#9990dd",
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
}