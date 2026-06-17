"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search, Bell, MessageCircle, MoreHorizontal,
  Edit3, Home, Users, User, Music, Calendar,
  Settings, Lock, Phone, Video, Send, Smile,
  Paperclip, Mic, Check, CheckCheck, ImageIcon,
  ArrowLeft, Flame, X
} from "lucide-react";
import MobileNav from "@/src/components/dashboard/MobileNav";

type Conversation = {
  id: string;
  name: string;
  initials: string;
  hue: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
};

type Message = {
  id: string;
  sender: "me" | "other";
  text: string;
  time: string;
  seen?: boolean;
};

type DirectoryUser = {
  id: string;
  name: string;
  initials: string;
  handle: string;
  online: boolean;
};

const GROUP_COLORS = [
  { dot: "#7F77DD", bg: "#EEEDFE", text: "#534AB7" },
  { dot: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
  { dot: "#D4537E", bg: "#FBEAF0", text: "#993556" },
  { dot: "#EF9F27", bg: "#FAEEDA", text: "#854F0B" },
  { dot: "#378ADD", bg: "#E6F1FB", text: "#185FA5" },
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

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("Messages");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [currentUserId] = useState<string>("replace-with-actual-user-id");
  
  // Search Modal Layer State
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [directoryUsers, setDirectoryUsers] = useState<DirectoryUser[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Load initial active chat groups/rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
          if (data.length > 0 && !activeConv) setActiveConv(data[0].id);
        }
      } catch (err) { console.error(err); }
    }
    fetchRooms();
  }, []);

  // Sync Global System Directory when modal overlay initializes
  useEffect(() => {
    if (!showSearchModal) return;
    
    async function loadSystemDirectory() {
      try {
        const res = await fetch("/api/users"); 
        if (res.ok) {
          const liveUsers = await res.json();
          // Filter out yourself from the search results index automatically
          setDirectoryUsers(liveUsers.filter((u: DirectoryUser) => u.id !== currentUserId));
        }
      } catch (err) {
        console.error("Failed to sync global platform identity index:", err);
      }
    }
    
    loadSystemDirectory();
  }, [showSearchModal, currentUserId]);

  useEffect(() => {
    if (!activeConv) return;
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeConv}`);
        if (res.ok) setMessages(await res.json());
      } catch (err) { console.error(err); }
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [activeConv]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv) return;
    const text = newMessage;
    setNewMessage("");
    const tempId = Math.random().toString();
    setMessages(prev => [...prev, { id: tempId, sender: "me", text, time: "Now", seen: false }]);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConv, text, senderId: currentUserId }),
      });
      if (res.ok) {
        const update = await fetch(`/api/messages?conversationId=${activeConv}`);
        if (update.ok) setMessages(await update.json());
      }
    } catch (err) { console.error(err); }
  };

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.message.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDirectory = directoryUsers.filter(u =>
    u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.handle.toLowerCase().includes(userQuery.toLowerCase())
  );

  const active = conversations.find(c => c.id === activeConv);

  const openConv = (id: string) => {
    setActiveConv(id);
    setMobileView("chat");
  };

  const handleSelectUser = async (user: DirectoryUser) => {
    // 1. Check if an active open thread window already matches selected participant name
    const matchesRoom = conversations.find(c => c.name.toLowerCase() === user.name.toLowerCase());
    
    if (matchesRoom) {
      openConv(matchesRoom.id);
      setUserQuery("");
      setShowSearchModal(false);
      return;
    }

    try {
      // 2. Fall back to active backend route handler to check db / initialize a brand new conversation
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          recipientId: user.id
        }),
      });

      if (res.ok) {
        const activeChannel = await res.json();
        
        // Sync new chat thread layout properties into sidebar viewport collection list state array
        setConversations(prev => {
          if (prev.some(c => c.id === activeChannel.id)) return prev;
          return [activeChannel, ...prev];
        });
        
        openConv(activeChannel.id);
      } else {
        console.error("Backend ecosystem refused room generation handshake context parameters.");
      }
    } catch (err) {
      console.error("Error executing network thread registration context request:", err);
    }
    
    // Clear overlay state structures
    setUserQuery("");
    setShowSearchModal(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f2ff", color: "#111",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e0ff; border-radius: 4px; }
        .sh-nav:hover { background: #EEEDFE !important; color: #534AB7 !important; }
        .sh-conv:hover { background: #EEEDFE !important; }
        .sh-icon-btn:hover { background: #EEEDFE !important; }
        .sh-send:hover { opacity: 0.88; }
        .sh-modal-row:hover { background: #f4f2ff !important; }
        textarea::placeholder, input::placeholder { color: #c4b8f8; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .typing-text { animation: pulse 1.6s ease-in-out infinite; color: #7F77DD !important; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
        .dot1{animation:bounce 1.2s infinite 0s}
        .dot2{animation:bounce 1.2s infinite 0.2s}
        .dot3{animation:bounce 1.2s infinite 0.4s}
        
        @media (max-width: 768px) {
          .sh-sidebar { display: none !important; }
          .sh-convlist { 
            width: 100% !important; 
            border-right: none !important; 
            display: ${mobileView === "list" ? "flex" : "none"} !important; 
            height: calc(100vh - 64px) !important; 
          }
          .sh-chatpane { display: ${mobileView === "chat" ? "flex" : "none"} !important; }
          .sh-back { display: flex !important; }
          .sh-mobile-dock-wrapper { display: ${mobileView === "list" ? "block" : "none"} !important; }
        }
        @media (min-width: 769px) {
          .sh-convlist { display: flex !important; }
          .sh-chatpane { display: flex !important; }
          .sh-back { display: none !important; }
          .sh-mobile-dock-wrapper { display: none !important; }
        }
      `}</style>

      {/* ── SIDEBAR (DESKTOP) ── */}
      <aside className="sh-sidebar" style={{
        width: 220, flexShrink: 0, borderRight: "1px solid #ede8ff",
        background: "#fff", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #ede8ff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#2d2870", letterSpacing: "-0.3px" }}>Safe Haven</div>
              <div style={{ fontSize: 10, color: "#9990dd", marginTop: 1 }}>encrypted circles</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#c4b8f8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 10px 6px" }}>Main</div>
          {navItems.slice(0, 4).map(({ icon: Icon, label }) => {
            const isActive = activeTab === label;
            return (
              <button key={label} className="sh-nav" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: isActive ? "#EEEDFE" : "transparent",
                color: isActive ? "#534AB7" : "#9990dd",
                fontWeight: isActive ? 600 : 400, fontSize: 13, position: "relative",
              }}>
                {isActive && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 16, borderRadius: 2, background: "#7F77DD" }} />}
                <Icon size={15} color={isActive ? "#7F77DD" : "#c4b8f8"} />
                {label}
                {label === "Messages" && (
                  <div style={{ marginLeft: "auto", minWidth: 16, height: 16, borderRadius: 8, background: "#FBEAF0", fontSize: 9, fontWeight: 700, color: "#993556", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>6</div>
                )}
                {label === "Notifications" && (
                  <div style={{ marginLeft: "auto", minWidth: 16, height: 16, borderRadius: 8, background: "#E1F5EE", fontSize: 9, fontWeight: 700, color: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>3</div>
                )}
              </button>
            );
          })}
          <div style={{ fontSize: 9, fontWeight: 600, color: "#c4b8f8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 10px 6px" }}>Explore</div>
          {navItems.slice(4).map(({ icon: Icon, label }) => {
            const isActive = activeTab === label;
            return (
              <button key={label} className="sh-nav" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: isActive ? "#EEEDFE" : "transparent",
                color: isActive ? "#534AB7" : "#9990dd",
                fontWeight: isActive ? 600 : 400, fontSize: 13, position: "relative",
              }}>
                {isActive && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 16, borderRadius: 2, background: "#7F77DD" }} />}
                <Icon size={15} color={isActive ? "#7F77DD" : "#c4b8f8"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ margin: "0 8px 14px", padding: "14px", borderRadius: 12, background: "#FAEEDA", border: "1px solid #f5d99a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <Flame size={11} color="#EF9F27" />
            <span style={{ fontSize: 9, color: "#854F0B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Streak active</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#854F0B", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
            <span style={{ fontSize: 12, color: "#EF9F27", fontWeight: 600 }}>days 🔥</span>
          </div>
          <div style={{ marginTop: 8, height: 3, background: "#f5d99a", borderRadius: 2 }}>
            <div style={{ width: "70%", height: "100%", background: "#EF9F27", borderRadius: 2 }} />
          </div>
        </div>
      </aside>

      {/* ── CONVERSATION LIST ── */}
      <div className="sh-convlist" style={{
        width: 300, flexShrink: 0, borderRight: "1px solid #ede8ff",
        background: "#fff", flexDirection: "column",
        height: "100vh", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #ede8ff", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#2d2870", letterSpacing: "-0.3px" }}>Messages</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="sh-icon-btn" style={{ width: 30, height: 30, borderRadius: 8, background: "#f4f2ff", border: "1px solid #ede8ff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9990dd", position: "relative" }}>
                <Bell size={13} />
                <div style={{ position: "absolute", top: 6, right: 6, width: 4, height: 4, borderRadius: "50%", background: "#D4537E", border: "1.5px solid #fff" }} />
              </button>
              <button onClick={() => setShowSearchModal(true)} className="sh-icon-btn" style={{ width: 30, height: 30, borderRadius: 8, background: "#534AB7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Edit3 size={13} color="#fff" />
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f4f2ff", border: "1px solid #ede8ff", borderRadius: 9, padding: "7px 10px" }}>
            <Search size={12} color="#c4b8f8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#2d2870", fontSize: 12, fontFamily: "inherit" }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 8px 8px" }}>Recent chats</div>
          {filtered.map((c, i) => {
            const col = GROUP_COLORS[i % GROUP_COLORS.length];
            return (
              <button key={c.id} className="sh-conv" onClick={() => openConv(c.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 8px", borderRadius: 10, border: "none",
                background: activeConv === c.id ? "#EEEDFE" : "transparent",
                cursor: "pointer", textAlign: "left", transition: "background 0.12s", position: "relative",
              }}>
                {activeConv === c.id && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 28, borderRadius: 2, background: "#7F77DD" }} />}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: col.bg, border: `1.5px solid ${col.dot}35`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: col.text }}>
                    {c.initials || "…"}
                  </div>
                  {c.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: "#1D9E75", border: "2px solid #fff" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontWeight: c.unread > 0 ? 600 : 500, fontSize: 13, color: c.unread > 0 ? "#2d2870" : "#9990dd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{c.name}</span>
                    <span style={{ fontSize: 9, color: c.unread > 0 ? "#7F77DD" : "#c4b8f8", fontWeight: c.unread > 0 ? 600 : 400, flexShrink: 0 }}>{c.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className={c.typing ? "typing-text" : ""} style={{ fontSize: 11, color: "#9990dd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "82%" }}>{c.message}</span>
                    {c.unread > 0 && (
                      <div style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff", padding: "0 4px", flexShrink: 0 }}>{c.unread}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE NAVIGATION DOCK INTEGRATION ── */}
      <div className="sh-mobile-dock-wrapper">
        <MobileNav onOpenComposer={() => setShowSearchModal(true)} />
      </div>

      {/* ── CHAT PANE ── */}
      <main className="sh-chatpane" style={{ flex: 1, minWidth: 0, flexDirection: "column", height: "100vh", background: "#f4f2ff" }}>
        {active ? (
          <div style={{
            height: 56, flexShrink: 0, borderBottom: "1px solid #ede8ff",
            background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="sh-back sh-icon-btn" onClick={() => setMobileView("list")} style={{ width: 30, height: 30, borderRadius: 8, background: "#f4f2ff", border: "1px solid #ede8ff", display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#7F77DD", marginRight: 2 }}>
                <ArrowLeft size={15} />
              </button>
              <div style={{ position: "relative" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: GROUP_COLORS[0].bg, border: `1.5px solid ${GROUP_COLORS[0].dot}40`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: GROUP_COLORS[0].text }}>
                  {active.initials || "…"}
                </div>
                {active.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", border: "2px solid #fff" }} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#2d2870" }}>{active.name}</div>
                <div style={{ fontSize: 10, color: active.online ? "#1D9E75" : "#c4b8f8", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                  {active.online && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#1D9E75" }} />}
                  {active.online ? "Online now" : "Last seen recently"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ icon: Phone, sz: 15 }, { icon: Video, sz: 16 }, { icon: MoreHorizontal, sz: 16 }].map(({ icon: Icon, sz }, i) => (
                <button key={i} className="sh-icon-btn" style={{ width: 32, height: 32, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "#9990dd", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s" }}>
                  <Icon size={sz} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: 56, flexShrink: 0, borderBottom: "1px solid #ede8ff", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", padding: "0 20px" }}>
            <span style={{ fontSize: 13, color: "#9990dd" }}>Select a conversation</span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "5px", background: "#EEEDFE", borderBottom: "1px solid #e5e0ff", fontSize: 9, color: "#7F77DD", fontWeight: 500 }}>
          <Lock size={8} color="#7F77DD" /> Messages are end-to-end encrypted
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#ede8ff" }} />
            <span style={{ fontSize: 9, color: "#c4b8f8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today</span>
            <div style={{ flex: 1, height: 1, background: "#ede8ff" }} />
          </div>

          {messages.map((msg, i) => {
            const isMe = msg.sender === "me";
            const nextSame = i < messages.length - 1 && messages[i + 1].sender === msg.sender;
            const prevSame = i > 0 && messages[i - 1].sender === msg.sender;
            return (
              <div key={msg.id} style={{
                display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: nextSame ? 3 : 10, alignItems: "flex-end", gap: 8,
              }}>
                {!isMe && (
                  <div style={{ width: 26, flexShrink: 0 }}>
                    {!nextSame && (
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: GROUP_COLORS[0].bg, border: `1px solid ${GROUP_COLORS[0].dot}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: GROUP_COLORS[0].text }}>
                        {active?.initials?.[0] || "S"}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ maxWidth: "65%" }}>
                  <div style={{
                    padding: "9px 13px",
                    background: isMe ? "#534AB7" : "#fff",
                    border: isMe ? "none" : "1px solid #ede8ff",
                    borderRadius: isMe
                      ? `11px 11px ${prevSame ? "11px" : "3px"} 11px`
                      : `11px 11px 11px ${prevSame ? "11px" : "3px"}`,
                    boxShadow: isMe ? "0 2px 8px rgba(83,74,183,0.2)" : "0 1px 4px rgba(127,119,221,0.06)",
                  }}>
                    <p style={{ fontSize: 13, lineHeight: 1.55, color: isMe ? "#fff" : "#2d2870", wordBreak: "break-word" }}>{msg.text}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 4 }}>
                      <span style={{ fontSize: 8, color: isMe ? "rgba(255,255,255,0.5)" : "#c4b8f8" }}>{msg.time}</span>
                      {isMe && (msg.seen
                        ? <CheckCheck size={10} color="rgba(255,255,255,0.6)" />
                        : <Check size={10} color="rgba(255,255,255,0.4)" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #ede8ff", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <button className="sh-icon-btn" style={{ width: 34, height: 34, borderRadius: 9, background: "#f4f2ff", border: "1px solid #ede8ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9990dd", flexShrink: 0, transition: "background 0.12s" }}>
              <Paperclip size={14} />
            </button>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 8, background: "#f4f2ff", border: "1px solid #ede8ff", borderRadius: 10, padding: "9px 12px" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b8f8", flexShrink: 0, lineHeight: 1 }}>
                <Smile size={15} />
              </button>
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Message ${active?.name?.split(" ")[0] || "…"}…`}
                rows={1}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#2d2870", fontSize: 13, resize: "none", lineHeight: 1.5, maxHeight: 80, overflowY: "auto", fontFamily: "inherit" }}
              />
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b8f8", flexShrink: 0, lineHeight: 1 }}>
                <ImageIcon size={14} />
              </button>
            </div>
            <button onClick={sendMessage} className="sh-send" style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: newMessage.trim() ? "#534AB7" : "#f4f2ff",
              border: newMessage.trim() ? "none" : "1px solid #ede8ff",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: newMessage.trim() ? "#fff" : "#9990dd", transition: "all 0.15s",
              boxShadow: newMessage.trim() ? "0 2px 8px rgba(83,74,183,0.25)" : "none",
            }}>
              {newMessage.trim() ? <Send size={14} /> : <Mic size={14} />}
            </button>
          </div>
        </div>
      </main>

      {/* ── NEW CHAT / DIRECTORY SEARCH MODAL OVERLAY ── */}
      {showSearchModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(45, 40, 112, 0.35)", backdropFilter: "blur(4px)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16
        }} onClick={() => setShowSearchModal(false)}>
          <div style={{
            background: "#fff", width: "100%", maxWidth: 460, borderRadius: 16,
            boxShadow: "0 20px 25px -5px rgba(83, 74, 183, 0.15), 0 10px 10px -5px rgba(83, 74, 183, 0.04)",
            display: "flex", flexDirection: "column", maxHeight: "80vh", overflow: "hidden"
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #ede8ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2d2870", letterSpacing: "-0.3px" }}>Start a connection</h3>
                <p style={{ fontSize: 11, color: "#9990dd", marginTop: 2 }}>Search directory channels globally</p>
              </div>
              <button onClick={() => setShowSearchModal(false)} className="sh-icon-btn" style={{ width: 28, height: 28, borderRadius: 6, background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9990dd" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "12px 20px", borderBottom: "1px solid #ede8ff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#f4f2ff", border: "1px solid #ede8ff", borderRadius: 10, padding: "8px 12px" }}>
                <Search size={14} color="#c4b8f8" />
                <input 
                  autoFocus
                  value={userQuery} 
                  onChange={e => setUserQuery(e.target.value)} 
                  placeholder="Search name or @handle…" 
                  style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#2d2870", fontSize: 13, fontFamily: "inherit" }} 
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
              {filteredDirectory.length > 0 ? (
                filteredDirectory.map((user) => (
                  <div 
                    key={user.id} 
                    className="sh-modal-row"
                    onClick={() => handleSelectUser(user)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                      borderRadius: 10, cursor: "pointer", transition: "background 0.1s"
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#534AB7" }}>
                        {user.initials || "…"}
                      </div>
                      {user.online && (
                        <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", border: "1.5px solid #fff" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#2d2870" }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: "#9990dd", marginTop: 1 }}>{user.handle || `@${user.name.toLowerCase().replace(/\s+/g, "")}`}</div>
                    </div>
                    <span style={{ fontSize: 10, color: "#7F77DD", fontWeight: 500, padding: "4px 8px", background: "#EEEDFE", borderRadius: 6 }}>Message</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#9990dd" }}>
                  <Users size={24} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                  <p style={{ fontSize: 12 }}>No system identity references found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
