"use client";
 
import React, { useState, useEffect, useRef } from "react";
import {
<<<<<<< HEAD
  Bell, Search, Plus, Users, MessageCircle, Home, Music,
  Calendar, Flame, Clock, Settings, User, Image as ImageIcon,
  Video, UserPlus, ChevronRight, Heart, Share2, Lock,
  Mic, MoreHorizontal, TrendingUp, LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
=======
  Plus, Users, Flame, Calendar, Image as ImageIcon,
  Video, UserPlus, Heart, Mic, X, Globe
} from "lucide-react";
>>>>>>> f674a15 (new refined ui)
import SpotifyWidget from "@/src/components/dashboard/SpotifyWidget";
 
// Imported isolated components
import Header from "@/src/components/dashboard/Header";
import Sidebar from "@/src/components/dashboard/Sidebar";
import MobileNav from "@/src/components/dashboard/MobileNav"; // ✅ Fixed explicit module mapping
 
const GROUP_COLORS = [
  { dot: "#7F77DD", bg: "#EEEDFE", text: "#534AB7" },
  { dot: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
  { dot: "#D4537E", bg: "#FBEAF0", text: "#993556" },
  { dot: "#EF9F27", bg: "#FAEEDA", text: "#854F0B" },
  { dot: "#378ADD", bg: "#E6F1FB", text: "#185FA5" },
];
 
export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userProfile, setUserProfile] = useState<{ id: string; fullName: string; email: string } | null>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Responsive layout state hooks
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [composerType, setComposerType] = useState<"text" | "photo" | "video" | "audio">("text");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCircleId, setNewPostCircleId] = useState("public");
  const [newCircleName, setNewCircleName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCircleId, setInviteCircleId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUserProfile(data.profile); });
 
    fetch("/api/dashboard/summary")
      .then(res => res.json())
      .then(data => {
        setCircles(data.circles || []);
        setOnlineUsers(data.onlineUsers || []);
        setEvents(data.events || []);
        setUserStats(data.stats || { postsCount: 0, reactionsCount: 0, activeHours: 0, friendsCount: 0 });
      })
      .catch(err => console.error("Dashboard load error:", err));
 
    fetch("/api/feed")
      .then(res => res.json())
      .then(data => setFeedPosts(data.posts || []))
      .catch(err => console.error("Feed load error:", err));
  }, []);
<<<<<<< HEAD

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleLike = (i: number) => setLikedPosts(prev => ({ ...prev, [i]: !prev[i] }));

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? null;
  const initials = getInitials(displayName);
  const firstName = getFirstName(displayName);

=======
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaPreviewUrl(URL.createObjectURL(file));
  };
 
  const clearFileStaging = () => {
    setSelectedFile(null);
    if (mediaPreviewUrl) { URL.revokeObjectURL(mediaPreviewUrl); setMediaPreviewUrl(null); }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
 
  const handleLikeToggle = async (postId: string, liked: boolean) => {
    setFeedPosts(prev => prev.map(p => p.id === postId
      ? { ...p, likedByUser: !liked, likesCount: liked ? p.likesCount - 1 : p.likesCount + 1 }
      : p));
    await fetch(`/api/posts/${postId}/like`, { method: liked ? "DELETE" : "POST" });
  };
 
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const isPublic = newPostCircleId === "public";
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent, mediaUrl: mediaPreviewUrl || null, circleId: isPublic ? null : newPostCircleId, isPublic, type: composerType })
      });
      if (res.ok) {
        const { post } = await res.json();
        setFeedPosts(prev => [post, ...prev]);
        setIsComposerOpen(false);
        setNewPostContent("");
        setNewPostCircleId("public");
        clearFileStaging();
      }
    } catch (err) { console.error("Post failed:", err); }
  };
 
  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;
    try {
      const res = await fetch("/api/circles", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCircleName })
      });
      if (res.ok) {
        const { circle } = await res.json();
        setCircles(prev => [...prev, circle]);
        setIsCircleModalOpen(false);
        setNewCircleName("");
      }
    } catch (err) { console.error("Circle creation failed:", err); }
  };
 
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteCircleId) return;
    try {
      const res = await fetch("/api/circles/invite", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, circleId: inviteCircleId })
      });
      if (res.ok) { setIsInviteModalOpen(false); setInviteEmail(""); setInviteCircleId(""); alert("Invite sent!"); }
    } catch (err) { console.error("Invite failed:", err); }
  };
 
  function getInitials(name: string | null | undefined) {
    if (!name) return "??";
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("");
  }
 
  const filteredPosts = feedPosts.filter(p =>
    p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.circleName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const openComposer = (type: typeof composerType) => {
    setComposerType(type);
    clearFileStaging();
    setNewPostCircleId("public");
    setIsComposerOpen(true);
  };
 
  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#f7f7f8", border: "1px solid #e5e5e5",
    borderRadius: 10, padding: "10px 14px", color: "#111", fontSize: 13,
    outline: "none", fontFamily: "inherit",
  };
 
>>>>>>> f674a15 (new refined ui)
  return (
    <div style={{
      minHeight: "100vh", background: "#f4f2ff",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px", color: "#111",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sh-right     { display: flex !important; }
        .sh-hdr-sub   { display: inline !important; }
        .sh-search    { display: flex !important; }
 
        @media (max-width: 1024px) {
          .sh-right    { display: none !important; }
          .sh-hdr-sub  { display: none !important; }
          .sh-search   { display: none !important; }
          .sh-grid-body { padding: 12px 12px 76px !important; gap: 12px !important; }
          .sh-hero-band { flex-direction: column; align-items: flex-start !important; gap: 16px !important; }
          .sh-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .sh-groups-grid { grid-template-columns: 1fr !important; }
        }
 
        .sh-nav:hover { background: #f0effe !important; }
        .sh-action:hover { opacity: 0.85; }
        .sh-post:hover { border-color: #c4b8f8 !important; }
        .sh-group:hover { background: #ede9fe !important; }
        textarea:focus, input:focus, select:focus { border-color: #7F77DD !important; outline: none !important; box-shadow: 0 0 0 3px #7F77DD22 !important; }
        .sh-modal-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(60,52,137,0.25); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; }
        .sh-modal { background: #fff; border-radius: 18px; width: 100%; overflow: hidden; box-shadow: 0 20px 60px rgba(83,74,183,0.18); }
        .sh-modal-header { padding: 16px 20px; border-bottom: 1px solid #ede8ff; display: flex; justify-content: space-between; align-items: center; }
        .sh-modal-body { padding: 20px; }
        .upload-zone { border: 2px dashed #c4b8f8; border-radius: 12px; padding: 32px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; background: #f8f6ff; transition: border-color 0.15s; margin-bottom: 14px; }
        .upload-zone:hover { border-color: #7F77DD; }
        .sh-pill { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; padding: 2px 7px; border-radius: 20px; font-weight: 500; }
        .stat-up { font-size: 10px; font-weight: 500; margin-top: 2px; }
      `}</style>
<<<<<<< HEAD

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

        <div style={{ padding: "0 8px 14px" }}>
          <button onClick={handleLogout} className="sh-nav-btn" style={{
            width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
            border: "none", cursor: "pointer", transition: "all 0.12s",
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
=======
 
      {/* ── RESPONSIVE HYBRID SIDEBAR DRAWER ── */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
 
      {/* ── MAIN SCREEN SYSTEM ── */}
      <main style={{ flex: 1, overflowY: "auto", minWidth: 0, display: "flex", flexDirection: "column" }}>
 
        {/* REUSABLE HEADER MODULE */}
        <Header 
          fullName={userProfile?.fullName}
          email={userProfile?.email}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAvatarClick={() => setIsSidebarOpen(true)}
        />
 
        {/* Main Content Body Layout */}
        <div className="sh-grid-body" style={{ flex: 1, display: "flex", maxWidth: 1100, margin: "0 auto", width: "100%", padding: "24px 24px 60px", gap: 20 }}>
 
          {/* ── Left column ── */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
 
            {/* Hero band */}
            <div className="sh-hero-band" style={{ background: "#EEEDFE", borderRadius: 16, padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
              <div>
                <div style={{ fontSize: 42, fontWeight: 800, color: "#3C3489", letterSpacing: "-2px", lineHeight: 1 }}>42 days</div>
                <div style={{ color: "#7F77DD", marginTop: 6, fontSize: 13 }}>Current streak — keep it going!</div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button onClick={() => openComposer("text")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                    <Plus size={13} /> Create post
>>>>>>> f674a15 (new refined ui)
                  </button>
                  <button onClick={() => setIsInviteModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: "#F4C0D1", color: "#993556", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                    <UserPlus size={13} /> Invite friends
                  </button>
                </div>
              </div>
              {/* Mini bar chart */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#9990dd", marginBottom: 6 }}>This week</div>
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 52 }}>
                  {[30, 55, 45, 80, 60, 90, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, minWidth: 10, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i >= 3 ? "#534AB7" : "#AFA9EC" }} />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#9990dd", marginTop: 4 }}>posts per day</div>
              </div>
            </div>
 
            {/* Stat cards */}
            <div className="sh-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
              {[
                { label: "Posts", value: userStats?.postsCount ?? 0, color: "#534AB7", bg: "#EEEDFE", sub: "+12 this week", subColor: "#7F77DD" },
                { label: "Reactions", value: userStats?.reactionsCount ?? 0, color: "#993556", bg: "#FBEAF0", sub: "+34 today", subColor: "#D4537E" },
                { label: "Friends", value: userStats?.friendsCount ?? 0, color: "#0F6E56", bg: "#E1F5EE", sub: "3 online now", subColor: "#1D9E75" },
                { label: "Hours online", value: userStats?.activeHours ?? 0, color: "#854F0B", bg: "#FAEEDA", sub: "all time", subColor: "#EF9F27" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: s.subColor, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
                  <div className="stat-up" style={{ color: s.subColor }}>{s.sub}</div>
                </div>
              ))}
            </div>
 
            {/* Quick actions */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Quick actions</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { icon: Plus, label: "Text", type: "text" as const, bg: "#E1F5EE", color: "#0F6E56" },
                  { icon: ImageIcon, label: "Photo", type: "photo" as const, bg: "#E6F1FB", color: "#185FA5" },
                  { icon: Video, label: "Video", type: "video" as const, bg: "#EEEDFE", color: "#534AB7" },
                  { icon: Mic, label: "Audio", type: "audio" as const, bg: "#FAEEDA", color: "#854F0B" },
                ].map((act, i) => (
                  <button key={i} className="sh-action" onClick={() => openComposer(act.type)} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                    background: act.bg, border: "none", borderRadius: 9,
                    color: act.color, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "opacity 0.12s",
                  }}>
                    <act.icon size={14} /> {act.label}
                  </button>
                ))}
                <button className="sh-action" onClick={() => setIsCircleModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#FBEAF0", border: "none", borderRadius: 9, color: "#993556", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <Users size={14} /> New group
                </button>
                <button className="sh-action" onClick={() => setIsInviteModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#f4f2ff", border: "1px solid #e5e0ff", borderRadius: 9, color: "#7F77DD", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <UserPlus size={14} /> Invite
                </button>
              </div>
            </div>
 
            {/* Your groups */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Your private groups</div>
              <div className="sh-groups-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                {circles.map((c, i) => {
                  const col = GROUP_COLORS[i % GROUP_COLORS.length];
                  return (
                    <div key={c.id} className="sh-group" style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 12, padding: "14px", cursor: "pointer", transition: "background 0.12s", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: col.dot }} />
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: col.text, marginBottom: 10, marginTop: 4 }}>
                        {getInitials(c.name)}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#2d2870", marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>{c.memberCount} members</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#EF9F27", fontWeight: 600 }}>
                        <Flame size={11} color="#EF9F27" /> {c.streakDays || 0}d streak
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
 
            {/* Feed */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Recent posts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredPosts.map((post, i) => {
                  const col = GROUP_COLORS[i % GROUP_COLORS.length];
                  return (
                    <div key={post.id} className="sh-post" style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "16px 18px", transition: "border-color 0.12s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: col.text, flexShrink: 0 }}>
                          {getInitials(post.authorName)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#2d2870" }}>{post.authorName}</span>
                            {post.isPublic || !post.circleName ? (
                              <span className="sh-pill" style={{ background: "#E6F1FB", color: "#185FA5" }}>
                                <Globe size={9} /> Public
                              </span>
                            ) : (
                              <span className="sh-pill" style={{ background: col.bg, color: col.text }}>{post.circleName}</span>
                            )}
                          </div>
                          <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
 
                      <p style={{ color: "#555", lineHeight: 1.65, marginBottom: 12, fontSize: 14 }}>{post.content}</p>
 
                      {post.mediaUrl && (
                        <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 12, border: "1px solid #ede8ff" }}>
                          {post.type === "video" ? (
                            <video src={post.mediaUrl} controls style={{ width: "100%", maxHeight: 360, display: "block" }} />
                          ) : post.type === "audio" ? (
                            <audio src={post.mediaUrl} controls style={{ width: "100%", padding: "10px" }} />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.mediaUrl} alt="Shared media" style={{ width: "100%", objectFit: "cover" }} />
                          )}
                        </div>
                      )}
 
                      <button onClick={() => handleLikeToggle(post.id, post.likedByUser)} style={{
                        display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7,
                        border: `1px solid ${post.likedByUser ? "#F4C0D1" : "#ede8ff"}`,
                        background: post.likedByUser ? "#FBEAF0" : "transparent",
                        cursor: "pointer", color: post.likedByUser ? "#D4537E" : "#aaa", fontSize: 12, fontWeight: 500,
                      }}>
                        <Heart size={13} fill={post.likedByUser ? "#D4537E" : "none"} />
                        {post.likesCount}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
          {/* ── Right sidebar ── */}
          <div className="sh-right" style={{ width: 240, flexShrink: 0, flexDirection: "column", gap: 16 }}>
 
            {/* Online friends */}
            <div style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Online now</div>
              {onlineUsers.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: i < onlineUsers.length - 1 ? "1px solid #f4f2ff" : "none" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: GROUP_COLORS[i % GROUP_COLORS.length].bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: GROUP_COLORS[i % GROUP_COLORS.length].text }}>
                      {f.name ? f.name[0].toUpperCase() : "?"}
                    </div>
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", border: "1.5px solid #fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#2d2870" }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: "#bbb" }}>{f.customStatus || "Active now"}</div>
                  </div>
                </div>
              ))}
            </div>
 
            <SpotifyWidget />
 
            {/* Upcoming events */}
            <div style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Upcoming events</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {events.map((evt, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Calendar size={13} color="#534AB7" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#2d2870" }}>{evt.title}</div>
                      <div style={{ fontSize: 10, color: "#bbb", marginTop: 1 }}>{new Date(evt.scheduledAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Groups list */}
            <div style={{ background: "#fff", border: "1px solid #ede8ff", borderRadius: 14, padding: "16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9990dd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Your groups</div>
              {circles.map((c, i) => {
                const col = GROUP_COLORS[i % GROUP_COLORS.length];
                return (
                  <div key={c.id} className="sh-group" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.12s" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#2d2870", flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 10, color: "#bbb" }}>{c.memberCount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
 
      {/* PWA MOBILE BOTTOM BAR NAVIGATION SYSTEM */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenComposer={() => openComposer("text")} 
      />
 
      {/* ── MODAL: CREATE POST ────────────────────────────────────────────── */}
      {isComposerOpen && (
        <div className="sh-modal-overlay">
          <div className="sh-modal" style={{ maxWidth: 500 }}>
            <div className="sh-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {composerType === "photo" && <div style={{ width: 28, height: 28, borderRadius: 7, background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={14} color="#185FA5" /></div>}
                {composerType === "video" && <div style={{ width: 28, height: 28, borderRadius: 7, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center" }}><Video size={14} color="#534AB7" /></div>}
                {composerType === "audio" && <div style={{ width: 28, height: 28, borderRadius: 7, background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center" }}><Mic size={14} color="#854F0B" /></div>}
                {composerType === "text" && <div style={{ width: 28, height: 28, borderRadius: 7, background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} color="#0F6E56" /></div>}
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2870" }}>
                  {composerType === "photo" ? "Share a photo" : composerType === "video" ? "Share a video" : composerType === "audio" ? "Share audio" : "Create a post"}
                </h3>
              </div>
              <button onClick={() => { setIsComposerOpen(false); clearFileStaging(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex", alignItems: "center" }}>
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="sh-modal-body">
                <textarea
                  placeholder={composerType === "photo" ? "Say something about this photo..." : composerType === "video" ? "Say something about this video..." : composerType === "audio" ? "Describe this voice note..." : "What's on your mind?"}
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  style={{ ...inputStyle, minHeight: 100, resize: "none", marginBottom: 14, padding: "12px" }}
                />
                
                {composerType !== "text" && !mediaPreviewUrl && (
                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <Plus size={20} color="#7F77DD" />
                    <span style={{ fontSize: 13, color: "#534AB7", fontWeight: 500 }}>Select your file</span>
                    <span style={{ fontSize: 11, color: "#aaa" }}>Supports Images, Videos, or Audio clips</span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept={composerType === "photo" ? "image/*" : composerType === "video" ? "video/*" : composerType === "audio" ? "audio/*" : "*/*"} 
                  style={{ display: "none" }} 
                />

                {mediaPreviewUrl && (
                  <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #ede8ff", marginBottom: 14, background: "#000" }}>
                    {composerType === "video" ? (
                      <video src={mediaPreviewUrl} controls style={{ width: "100%", maxHeight: 240, display: "block" }} />
                    ) : composerType === "audio" ? (
                      <audio src={mediaPreviewUrl} controls style={{ width: "100%", padding: 10 }} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaPreviewUrl} alt="Staged content preview" style={{ width: "100%", maxHeight: 240, objectFit: "contain", display: "block" }} />
                    )}
                    <button type="button" onClick={clearFileStaging} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}>
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 10, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Post destination</label>
                    <select value={newPostCircleId} onChange={e => setNewPostCircleId(e.target.value)} style={inputStyle}>
                      <option value="public">🌍 Public Feed</option>
                      {circles.map(c => <option key={c.id} value={c.id}>🔒 {c.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ alignSelf: "flex-end", height: 38, padding: "0 22px", background: "#7F77DD", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Share Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* ── MODAL: CREATE CIRCLE ── */}
      {isCircleModalOpen && (
        <div className="sh-modal-overlay">
          <div className="sh-modal" style={{ maxWidth: 400 }}>
            <div className="sh-modal-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2870" }}>Create Private Group</h3>
              <button onClick={() => setIsCircleModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><X size={17} /></button>
            </div>
            <form onSubmit={handleCreateCircle}>
              <div className="sh-modal-body">
                <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, marginBottom: 6 }}>Group Name</label>
                <input type="text" placeholder="e.g., Close Friends, Study Crew" value={newCircleName} onChange={e => setNewCircleName(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />
                <button type="submit" style={{ width: "100%", padding: "10px", background: "#7F77DD", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* ── MODAL: INVITE FRIENDS ── */}
      {isInviteModalOpen && (
        <div className="sh-modal-overlay">
          <div className="sh-modal" style={{ maxWidth: 400 }}>
            <div className="sh-modal-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2870" }}>Invite Friends</h3>
              <button onClick={() => setIsInviteModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><X size={17} /></button>
            </div>
            <form onSubmit={handleSendInvite}>
              <div className="sh-modal-body">
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, marginBottom: 6 }}>Friend's Email</label>
                  <input type="email" placeholder="name@domain.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, marginBottom: 6 }}>Select Destination Group</label>
                  <select value={inviteCircleId} onChange={e => setInviteCircleId(e.target.value)} style={inputStyle}>
                    <option value="">-- Choose a group --</option>
                    {circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px", background: "#7F77DD", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
