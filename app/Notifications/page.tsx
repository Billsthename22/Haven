"use client";
 
import { useState } from "react";
import {
  Bell, MessageCircle, Heart, UserPlus, Users,
  Home, Settings, User, Music, Calendar, Lock,
  Check, CheckCheck, X, Zap, ArrowUpRight, TrendingUp,
} from "lucide-react";
 
// ── Data ─────────────────────────────────────────────
const allNotifications = [
  {
    id: 1, type: "message", read: false,
    title: "New message",
    text: "John sent you a message in The Boys",
    time: "2m ago", avatar: "JO", hue: "#0ea5e9",
    action: "Reply",
  },
  {
    id: 2, type: "like", read: false,
    title: "Post liked",
    text: "Sarah liked your post — \"Movie night this weekend? 🍿\"",
    time: "10m ago", avatar: "SJ", hue: "#f43f5e",
    action: null,
  },
  {
    id: 3, type: "friend", read: false,
    title: "Friend request",
    text: "David Parker wants to connect with you",
    time: "1h ago", avatar: "DP", hue: "#10b981",
    action: "Accept",
    actionSecondary: "Decline",
  },
  {
    id: 4, type: "community", read: true,
    title: "New members",
    text: "3 new people joined Babcock Crew",
    time: "3h ago", avatar: "BC", hue: "#8b5cf6",
    action: "View",
  },
  {
    id: 5, type: "streak", read: true,
    title: "Streak milestone",
    text: "You're on a 42-day streak! You're in the top 5% of all havens 🔥",
    time: "5h ago", avatar: "🔥", hue: "#e97316",
    action: null,
  },
  {
    id: 6, type: "message", read: true,
    title: "New message",
    text: "Tolu replied to your post in Babcock Crew",
    time: "Yesterday", avatar: "TO", hue: "#8b5cf6",
    action: "View",
  },
  {
    id: 7, type: "like", read: true,
    title: "Reacted to your post",
    text: "Emma and 4 others reacted to your graduation photo",
    time: "Yesterday", avatar: "ES", hue: "#f59e0b",
    action: null,
  },
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
 
const typeIcon = (type: "message" | "like" | "friend" | "community" | "streak", hue: string) => {
  const map: Record<"message" | "like" | "friend" | "community" | "streak", typeof MessageCircle> = {
    message: MessageCircle,
    like: Heart,
    friend: UserPlus,
    community: Users,
    streak: Zap,
  };
  const Icon = map[type] || Bell;
  return <Icon size={14} color={hue} />;
};
 
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: "#6a6a6a",
      textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: 12, padding: "0 2px",
    }}>{children}</div>
  );
}
 
// ── Component ────────────────────────────────────────
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
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
 
  const grouped = {
    new: filtered.filter(n => !n.read),
    earlier: filtered.filter(n => n.read),
  };
 
  return (
    <div style={{
      minHeight: "100vh", background: "#050505", color: "#efefef",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; }
        .nav-btn:hover { background: #121212 !important; color: #fff !important; }
        .nav-btn:hover svg { color: #10b981 !important; }
        .notif-row:hover { background: #0c0c0c !important; border-color: #1a1a1a !important; }
        .notif-row:hover .notif-dismiss { opacity: 1 !important; }
        .filter-btn:hover { border-color: #333 !important; color: #fff !important; }
        .panel-card:hover { border-color: #1a1a1a !important; background: #090909 !important; }
      `}</style>
 
      {/* ── Left Sidebar ── */}
      <aside style={{
        width: 240, flexShrink: 0, borderRight: "1px solid #121212",
        background: "#080808", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", zIndex: 50,
      }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #121212" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px 2px rgba(16,185,129,0.15)",
            }}>
              <Lock size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "#fff" }}>Safe Haven</div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>encrypted networks</div>
            </div>
          </div>
        </div>
 
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 10px 8px" }}>Main Matrix</div>
          {navItems.slice(0, 4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                background: active ? "#0f1a13" : "transparent",
                color: active ? "#10b981" : "#888", fontWeight: active ? 600 : 400,
                fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, borderRadius: "0 4px 4px 0", background: "#10b981" }} />}
                <Icon size={16} color={active ? "#10b981" : "#444"} style={{ transition: "color 0.15s" }} />
                {label}
                {label === "Notifications" && unreadCount > 0 && (
                  <div style={{ marginLeft: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "#10b981", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{unreadCount}</div>
                )}
                {label === "Messages" && (
                  <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: 9, background: "rgba(239,68,68,0.15)", fontSize: 9, fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>6</div>
                )}
              </button>
            );
          })}
          <div style={{ fontSize: 9, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.15em", padding: "16px 10px 8px" }}>Explore Modules</div>
          {navItems.slice(4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                background: active ? "#0f1a13" : "transparent",
                color: active ? "#10b981" : "#888", fontWeight: active ? 600 : 400,
                fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, borderRadius: "0 4px 4px 0", background: "#10b981" }} />}
                <Icon size={16} color={active ? "#10b981" : "#444"} style={{ transition: "color 0.15s" }} />
                {label}
              </button>
            );
          })}
        </nav>
 
        <div style={{ padding: "16px 20px", borderTop: "1px solid #121212", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "#111", border: "1px solid #222",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#666"
          }}>EM</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>Emioluwa G.</div>
            <div style={{ fontSize: 10, color: "#444", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>Node Client Active</div>
          </div>
        </div>
      </aside>
 
      {/* ── Main Viewport Wrapper ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(5,5,5,0.85)", borderBottom: "1px solid #121212",
          backdropFilter: "blur(20px)", padding: "0 40px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.2px" }}>Notifications</span>
            {unreadCount > 0 && (
              <div style={{
                padding: "2px 8px", borderRadius: 4, background: "#0f1a13",
                border: "1px solid #163020", fontSize: 10, fontWeight: 600, color: "#10b981",
              }}>{unreadCount} unresolved</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                background: "#0c0c0c", border: "1px solid #1c1c1c", borderRadius: 6,
                color: "#10b981", fontSize: 12, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s"
              }}>
                <CheckCheck size={13} /> Clear Dashboard
              </button>
            )}
          </div>
        </header>
 
        {/* Dual Column Layout Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 320px", 
          gap: "40px",
          padding: "40px",
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          flex: 1
        }}>
          
          {/* Main Feed Column */}
          <main style={{ minWidth: 0 }}>
            {/* Filter Pills Layout */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
              {filters.map(f => (
                <button key={f} className="filter-btn" onClick={() => setActiveFilter(f)} style={{
                  padding: "6px 14px", borderRadius: 99, border: "1px solid",
                  borderColor: activeFilter === f ? "#10b981" : "#161616",
                  background: activeFilter === f ? "#0f1a13" : "transparent",
                  color: activeFilter === f ? "#10b981" : "#666",
                  fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.12s",
                }}>{f}</button>
              ))}
            </div>
 
            {/* Split Feed Sections */}
            {grouped.new.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <SectionLabel>Active Queue</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grouped.new.map(n => (
                    <NotifRow key={n.id} n={n} onDismiss={dismiss} onRead={markRead} />
                  ))}
                </div>
              </div>
            )}
 
            {grouped.earlier.length > 0 && (
              <div>
                <SectionLabel>Archived History</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grouped.earlier.map(n => (
                    <NotifRow key={n.id} n={n} onDismiss={dismiss} onRead={markRead} />
                  ))}
                </div>
              </div>
            )}
 
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 24px", border: "1px dashed #141414", borderRadius: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: "#080808",
                  border: "1px solid #141414", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px",
                }}>
                  <Bell size={18} color="#444" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#888", marginBottom: 4 }}>System Cleared</div>
                <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>No data entries discovered matching "{activeFilter}".</div>
              </div>
            )}
          </main>
 
          {/* Right Sidebar - System Overview & Stats Container */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionLabel>Overview</SectionLabel>
            
            {/* Hot-migrated Streak Card */}
            <div style={{ 
              padding: "20px", borderRadius: 12, background: "#0a0a0a", 
              border: "1px solid #121212", position: "relative", overflow: "hidden" 
            }} className="panel-card">
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sync Activity High</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
                <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>Day Burn 🔥</span>
              </div>
              <p style={{ fontSize: 11, color: "#555", marginTop: 8, lineHeight: 1.5 }}>You're currently outperforming 95% of active network layers.</p>
              <div style={{ marginTop: 14, height: 4, background: "#121212", borderRadius: 2 }}>
                <div style={{ width: "72%", height: "100%", background: "#10b981", borderRadius: 2 }} />
              </div>
            </div>
 
            {/* Quick Summary Insights */}
            <div style={{ 
              padding: "20px", borderRadius: 12, background: "#070707", 
              border: "1px solid #121212" 
            }} className="panel-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#aaa" }}>Telemetry Matrix</span>
                <TrendingUp size={14} color="#444" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#555" }}>Unread Alerts</span>
                  <span style={{ color: unreadCount > 0 ? "#10b981" : "#555", fontWeight: 600 }}>{unreadCount} lines</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#555" }}>Total Cached</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{notifications.length} blocks</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px solid #121212", paddingTop: 12 }}>
                  <span style={{ color: "#555" }}>Node Cluster</span>
                  <span style={{ color: "#8b5cf6", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                    Babcock <ArrowUpRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
 
// ── Notification row ─────────────────────────────────
function NotifRow({ n, onDismiss, onRead }) {
  const isEmoji = n.avatar?.length <= 2 && !/[A-Z]/.test(n.avatar?.[1] || "");
 
  return (
    <div
      className="notif-row"
      onClick={() => onRead(n.id)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "16px", borderRadius: 12,
        background: n.read ? "transparent" : "#090909",
        border: "1px solid",
        borderColor: n.read ? "#0c0c0c" : "#121212",
        cursor: "pointer", transition: "all 0.15s ease",
        position: "relative",
      }}
    >
      {/* Dynamic Unread Dot Indicator */}
      {!n.read && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 3, borderRadius: "12px 0 0 12px", background: "#10b981",
        }} />
      )}
 
      {/* Avatar Hex + Sub-indicator Badge */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: isEmoji ? "#161003" : n.hue + "12",
          border: "1px solid " + (isEmoji ? "#2b1e06" : n.hue + "25"),
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: isEmoji ? 18 : 13,
          color: n.hue,
        }}>{n.avatar}</div>
        <div style={{
          position: "absolute", bottom: -3, right: -3,
          width: 18, height: 18, borderRadius: 5,
          background: "#050505", border: "1px solid #121212",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {typeIcon(n.type, n.hue)}
        </div>
      </div>
 
      {/* Main Row Content Layer */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: n.read ? 500 : 600, fontSize: 13.5, color: n.read ? "#777" : "#eee" }}>
            {n.title}
          </span>
          <span style={{ fontSize: 11, color: "#444", flexShrink: 0 }}>{n.time}</span>
        </div>
        <p style={{ fontSize: 12.5, color: n.read ? "#444" : "#999", lineHeight: 1.6, marginBottom: n.action ? 12 : 0 }}>
          {n.text}
        </p>
 
        {/* Adaptive Operational Callbacks */}
        {n.action && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={e => { e.stopPropagation(); onRead(n.id); }}
              style={{
                padding: "6px 14px", borderRadius: 6, border: "1px solid",
                borderColor: n.hue + "30", background: n.hue + "10",
                color: n.hue, fontSize: 11, fontWeight: 600, cursor: "pointer",
                transition: "all 0.12s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = n.hue + "20"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = n.hue + "10"; }}
            >{n.action}</button>
            {n.actionSecondary && (
              <button
                onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
                style={{
                  padding: "6px 14px", borderRadius: 6, border: "1px solid #1a1a1a",
                  background: "transparent", color: "#666",
                  fontSize: 11, fontWeight: 500, cursor: "pointer",
                  transition: "all 0.12s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#666"; }}
              >{n.actionSecondary}</button>
            )}
          </div>
        )}
      </div>
 
      {/* Context Action Triggers */}
      <button
        className="notif-dismiss"
        onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
        style={{
          opacity: 0, transition: "opacity 0.12s, background 0.12s", flexShrink: 0,
          width: 26, height: 26, borderRadius: 6, background: "#121212",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#555",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#ef4444"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#121212"; e.currentTarget.style.color = "#555"; }}
      >
        <X size={12} />
      </button>
    </div>
  );
}