"use client";

import React, { useState } from "react";
import {
  Search, Bell, MessageCircle, MoreHorizontal,
  Edit3, Home, Users, User, Music, Calendar,
  Settings, Lock, Phone, Video, Send, Smile,
  Paperclip, Mic, Check, CheckCheck, ImageIcon,
} from "lucide-react";

const onlineUsers = [
  { id: 1, name: "Sarah", initials: "S", hue: "#0ea5e9" },
  { id: 2, name: "David", initials: "D", hue: "#10b981" },
  { id: 3, name: "Anna", initials: "A", hue: "#8b5cf6" },
  { id: 4, name: "Mike", initials: "M", hue: "#e97316" },
  { id: 5, name: "Emma", initials: "E", hue: "#f59e0b" },
  { id: 6, name: "James", initials: "J", hue: "#6366f1" },
];

const conversations = [
  { id: 1, name: "Sarah Johnson", initials: "SJ", hue: "#0ea5e9", message: "Hey, are you free later? ❤️", time: "2m", unread: 3, online: true },
  { id: 2, name: "David Parker", initials: "DP", hue: "#10b981", message: "Sent a photo 📸", time: "10m", unread: 0, online: false },
  { id: 3, name: "Anna Williams", initials: "AW", hue: "#8b5cf6", message: "Typing…", time: "15m", unread: 1, online: true, typing: true },
  { id: 4, name: "Michael Scott", initials: "MS", hue: "#e97316", message: "That sounds great 😂", time: "1h", unread: 0, online: false },
  { id: 5, name: "Emma Stone", initials: "ES", hue: "#f59e0b", message: "Let's catch up tomorrow!", time: "2h", unread: 2, online: true },
  { id: 6, name: "The Boys", initials: "TB", hue: "#10b981", message: "David: Movie night? 🍿", time: "3h", unread: 0, online: false, isGroup: true },
];

type Message = { id: number; sender: string; text: string; time: string; seen?: boolean };
const chatMessages: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "other", text: "Hey 👋", time: "10:20 AM" },
    { id: 2, sender: "me", text: "Heyyy ❤️", time: "10:21 AM", seen: true },
    { id: 3, sender: "other", text: "Are you free later?", time: "10:22 AM" },
    { id: 4, sender: "me", text: "Yeah! What did you have in mind? 😊", time: "10:23 AM", seen: true },
    { id: 5, sender: "other", text: "Maybe grab food? There's a new place on VI", time: "10:24 AM" },
    { id: 6, sender: "me", text: "That sounds perfect, I'm in 🍜", time: "10:25 AM", seen: false },
  ],
  2: [
    { id: 1, sender: "other", text: "Check this out 📸", time: "9:00 AM" },
    { id: 2, sender: "me", text: "Wow that's fire 🔥", time: "9:02 AM", seen: true },
  ],
};

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

function SectionLabel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: "#2a2a2a",
      textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: 10, ...style,
    }}>{children}</div>
  );
}

export default function MessagesDesktop() {
  const [activeTab, setActiveTab] = useState("Messages");
  const [activeConv, setActiveConv] = useState(1);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>(chatMessages);

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.message.toLowerCase().includes(search.toLowerCase())
  );

  const active = conversations.find(c => c.id === activeConv);
  const thread = messages[activeConv] || [];

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] || []), {
        id: Date.now(), sender: "me", text: newMessage, time: "Now", seen: false,
      }],
    }));
    setNewMessage("");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#efefef",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        input::placeholder, textarea::placeholder { color: #252525; }
        .nav-btn:hover  { background: #161616 !important; color: #ccc !important; }
        .conv-row:hover { background: #0f0f0f !important; }
        .conv-row:hover .conv-more { opacity: 1 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .typing-text { animation: pulse 1.6s ease-in-out infinite; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        .dot1{animation:bounce 1.2s infinite 0s}
        .dot2{animation:bounce 1.2s infinite 0.2s}
        .dot3{animation:bounce 1.2s infinite 0.4s}
      `}</style>

      <aside style={{
        width: 228, flexShrink: 0, borderRight: "1px solid #141414",
        background: "#0b0b0b", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
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
              <button key={label} className="nav-btn" onClick={() => setActiveTab(label)} style={{
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
                {label === "Messages" && (
                  <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: "#ef444460", fontSize: 9, fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>6</div>
                )}
              </button>
            );
          })}
          <div style={{ fontSize: 9, fontWeight: 600, color: "#2a2a2a", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 10px 6px" }}>Explore</div>
          {navItems.slice(4).map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="nav-btn" onClick={() => setActiveTab(label)} style={{
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
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Streak active</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
            <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>days 🔥</span>
          </div>
          <div style={{ marginTop: 8, height: 3, background: "#132010", borderRadius: 2 }}>
            <div style={{ width: "70%", height: "100%", background: "#10b981", borderRadius: 2 }} />
          </div>
        </div>
      </aside>

      <div style={{
        width: 300, flexShrink: 0, borderRight: "1px solid #141414",
        background: "#0a0a0a", display: "flex", flexDirection: "column",
        height: "100vh", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #141414", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: "-0.3px" }}>Messages</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{
                position: "relative", width: 30, height: 30, borderRadius: 7,
                background: "#0f0f0f", border: "1px solid #1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#484848",
              }}>
                <Bell size={13} />
                <div style={{ position: "absolute", top: 6, right: 6, width: 4, height: 4, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #0a0a0a" }} />
              </button>
              <button style={{
                width: 30, height: 30, borderRadius: 7, background: "#10b981",
                border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Edit3 size={13} color="#fff" />
              </button>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 8,
            padding: "7px 10px",
          }}>
            <Search size={12} color="#2e2e2e" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{
              flex: 1, background: "none", border: "none", outline: "none", color: "#ccc", fontSize: 12,
            }} />
          </div>
        </div>

        <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #0f0f0f", flexShrink: 0 }}>
          <SectionLabel>Online now</SectionLabel>
          <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
            {onlineUsers.map(u => (
              <div key={u.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 44, cursor: "pointer" }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: u.hue + "22", border: "1.5px solid " + u.hue + "40",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: u.hue,
                  }}>{u.initials}</div>
                  <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#10b981", border: "2px solid #0a0a0a" }} />
                </div>
                <span style={{ fontSize: 9, color: "#383838", fontWeight: 500 }}>{u.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          <SectionLabel style={{ padding: "6px 8px 4px", marginBottom: 4 }}>Recent chats</SectionLabel>
          {filtered.map(c => (
            <button key={c.id} className="conv-row" onClick={() => setActiveConv(c.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 8px", borderRadius: 9, border: "none",
              background: activeConv === c.id ? "#131313" : "transparent",
              cursor: "pointer", textAlign: "left", transition: "background 0.12s",
              position: "relative",
            }}>
              {activeConv === c.id && (
                <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 28, borderRadius: 2, background: "#10b981" }} />
              )}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: c.hue + "20", border: "1.5px solid " + c.hue + "35",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 12, color: c.hue,
                }}>{c.initials}</div>
                {c.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#10b981", border: "2px solid #0a0a0a" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                  <span style={{ fontWeight: c.unread > 0 ? 600 : 500, fontSize: 13, color: c.unread > 0 ? "#fff" : "#b0b0b0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{c.name}</span>
                  <span style={{ fontSize: 9, color: c.unread > 0 ? "#10b981" : "#2a2a2a", fontWeight: c.unread > 0 ? 600 : 400, flexShrink: 0 }}>{c.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className={c.typing ? "typing-text" : ""} style={{
                    fontSize: 11, color: c.typing ? "#10b981" : "#303030",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "82%",
                  }}>{c.message}</span>
                  {c.unread > 0 && (
                    <div style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff", padding: "0 4px", flexShrink: 0 }}>{c.unread}</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh" }}>

        {active && (
          <div style={{
            height: 56, flexShrink: 0, borderBottom: "1px solid #141414",
            background: "rgba(8,8,8,0.97)", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: active.hue + "22", border: "1.5px solid " + active.hue + "40",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, color: active.hue,
                }}>{active.initials}</div>
                {active.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#10b981", border: "2px solid #080808" }} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{active.name}</div>
                <div style={{ fontSize: 10, color: active.online ? "#10b981" : "#303030", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                  {active.online && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }} />}
                  {active.online ? "Online now" : "Last seen 1h ago"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ icon: Phone, sz: 15 }, { icon: Video, sz: 16 }, { icon: MoreHorizontal, sz: 16 }].map(({ icon: Icon, sz }, i) => (
                <button key={i} style={{
                  width: 32, height: 32, borderRadius: 7, background: "none", border: "none",
                  cursor: "pointer", color: "#383838", display: "flex", alignItems: "center", justifyContent: "center",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#888"}
                  onMouseLeave={e => e.currentTarget.style.color = "#383838"}
                >
                  <Icon size={sz} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px", background: "#080808", borderBottom: "1px solid #0f0f0f", fontSize: 9, color: "#1e1e1e" }}>
          <Lock size={8} color="#1e1e1e" /> Messages are end-to-end encrypted
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px", display: "flex", flexDirection: "column", gap: 0 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#141414" }} />
            <span style={{ fontSize: 9, color: "#222", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today</span>
            <div style={{ flex: 1, height: 1, background: "#141414" }} />
          </div>

          {thread.map((msg, i) => {
            const isMe = msg.sender === "me";
            const nextSame = i < thread.length - 1 && thread[i + 1].sender === msg.sender;
            const prevSame = i > 0 && thread[i - 1].sender === msg.sender;
            return (
              <div key={msg.id} style={{
                display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: nextSame ? 3 : 10,
                alignItems: "flex-end", gap: 8,
              }}>
                {!isMe && (
                  <div style={{ width: 26, flexShrink: 0 }}>
                    {!nextSame && (
                      <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: (active?.hue || "#0ea5e9") + "22",
                        border: "1px solid " + (active?.hue || "#0ea5e9") + "30",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 10, color: active?.hue || "#0ea5e9",
                      }}>{active?.initials?.[0] || "S"}</div>
                    )}
                  </div>
                )}
                <div style={{ maxWidth: "65%" }}>
                  <div style={{
                    padding: "9px 13px",
                    background: isMe ? "#10b981" : "#0f0f0f",
                    border: isMe ? "none" : "1px solid #1a1a1a",
                    borderRadius: isMe
                      ? `11px 11px ${prevSame ? "11px" : "3px"} 11px`
                      : `11px 11px 11px ${prevSame ? "11px" : "3px"}`,
                  }}>
                    <p style={{ fontSize: 13, lineHeight: 1.55, color: isMe ? "#fff" : "#d0d0d0", wordBreak: "break-word" }}>{msg.text}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 4 }}>
                      <span style={{ fontSize: 8, color: isMe ? "rgba(255,255,255,0.45)" : "#252525" }}>{msg.time}</span>
                      {isMe && (msg.seen
                        ? <CheckCheck size={10} color="rgba(255,255,255,0.55)" />
                        : <Check size={10} color="rgba(255,255,255,0.35)" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: (active?.hue || "#0ea5e9") + "22",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 10, color: active?.hue || "#0ea5e9",
            }}>{active?.initials?.[0] || "S"}</div>
            <div style={{ padding: "10px 14px", background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "11px 11px 11px 3px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} className={`dot${i + 1}`} style={{ width: 5, height: 5, borderRadius: "50%", background: "#2e2e2e" }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 18px", background: "#080808", borderTop: "1px solid #141414", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <button style={{ width: 34, height: 34, borderRadius: 8, background: "#0f0f0f", border: "1px solid #1a1a1a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#303030", flexShrink: 0 }}>
              <Paperclip size={14} />
            </button>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 8, background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 10, padding: "9px 12px" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#252525", flexShrink: 0, lineHeight: 1 }}>
                <Smile size={15} />
              </button>
              <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Message ${active?.name?.split(" ")[0] || "…"}…`}
                rows={1}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#ddd", fontSize: 13, resize: "none", lineHeight: 1.5, maxHeight: 80, overflowY: "auto" }}
              />
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#252525", flexShrink: 0, lineHeight: 1 }}>
                <ImageIcon size={14} />
              </button>
            </div>
            <button onClick={sendMessage} style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: newMessage.trim() ? "#10b981" : "#0f0f0f",
              border: newMessage.trim() ? "none" : "1px solid #1a1a1a",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: newMessage.trim() ? "#fff" : "#303030", transition: "all 0.15s",
            }}>
              {newMessage.trim() ? <Send size={14} /> : <Mic size={14} />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
