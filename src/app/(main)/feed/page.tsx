"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell, Search, Plus, Users, MessageCircle, Home, Music,
  Calendar, Flame, Settings, User, Image as ImageIcon,
  Video, UserPlus, Heart, Lock, Mic, X, Globe, BarChart3,
  Share2, MessageSquare, Bookmark, Filter, SlidersHorizontal
} from "lucide-react";
import SpotifyWidget from "@/src/components/dashboard/SpotifyWidget";

// CLEAN SECTION LABELS
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    fontSize: "11px", fontWeight: 600, color: "#666666",
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

export default function FeedPage() {
  // Navigation & Authentication States
  const [activeTab, setActiveTab] = useState("Feed");
  const [feedFilter, setFeedFilter] = useState<"all" | "public" | "private">("all");
  const [userProfile, setUserProfile] = useState<{ id: string; fullName: string; email: string } | null>(null);
  
  // Content Pipeline States
  const [circles, setCircles] = useState<any[]>([]);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  // Interactive UI Action States
  const [searchQuery, setSearchQuery] = useState("");
  const [composerType, setComposerType] = useState<"text" | "photo" | "video" | "audio">("text");
  
  // Form Submission Payloads
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCircleId, setNewPostCircleId] = useState("public"); 

  // Gallery/File Attachment Reference States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Capture Engine Pipeline Streams
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch Sync
  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setUserProfile(data.profile);
      });

    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((data) => {
        setCircles(data.circles || []);
        setOnlineUsers(data.onlineUsers || []);
        setEvents(data.events || []);
      })
      .catch((err) => console.error("Error loading layout meta:", err));

    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        setFeedPosts(data.posts || []);
      })
      .catch((err) => console.error("Error loading activity updates:", err));
  }, []);

  // Handle local device gallery picking
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    const preview = URL.createObjectURL(file);
    setMediaPreviewUrl(preview);
  };

  const clearFileStaging = () => {
    setSelectedFile(null);
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (composerType === "audio") setComposerType("text");
  };

  // Live Audio Capturing Core Hook Implementation
  const toggleAudioRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice-note.webm", { type: "audio/webm" });
        
        setSelectedFile(audioFile);
        if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
        setMediaPreviewUrl(URL.createObjectURL(audioBlob));
        
        // Turn off microphone hardware capture light immediately
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setComposerType("audio");
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone hardware access rejected:", err);
      alert("Could not access microphone hardware. Please verify app system dashboard permissions.");
    }
  };

  const handleLikeToggle = async (postId: string, currentLikedState: boolean) => {
    setFeedPosts(prev => prev.map(p => p.id === postId ? {
      ...p, 
      likedByUser: !currentLikedState, 
      likesCount: currentLikedState ? p.likesCount - 1 : p.likesCount + 1
    } : p));

    await fetch(`/api/posts/${postId}/like`, {
      method: currentLikedState ? "DELETE" : "POST"
    });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedFile) return;

    try {
      const isPublicSpace = newPostCircleId === "public";
      
      // Pack multi-part payloads inside native browser FormData structure
      const formData = new FormData();
      formData.append("content", newPostContent);
      formData.append("circleId", isPublicSpace ? "" : newPostCircleId);
      formData.append("isPublic", String(isPublicSpace));
      formData.append("type", composerType);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        // Notice: 'Content-Type' header is intentionally omitted here 
        // to let the browser assign boundary keys dynamically.
        body: formData
      });

      if (response.ok) {
        const freshPost = await response.json();
        setFeedPosts(prev => [freshPost.post, ...prev]);
        setNewPostContent("");
        setNewPostCircleId("public");
        setComposerType("text");
        clearFileStaging();
      }
    } catch (err) {
      console.error("Failed to share your post:", err);
    }
  };

  const displayName = userProfile?.fullName ?? userProfile?.email ?? "User";
  const initials = getInitials(displayName);
  const firstName = getFirstName(displayName);

  // Multi-tier structural filtering pipelines
  const filteredPosts = feedPosts.filter(p => {
    const matchesSearch = p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.circleName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (feedFilter === "public") return p.isPublic || !p.circleId;
    if (feedFilter === "private") return !p.isPublic && p.circleId;
    return true;
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#efefef",
      display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sh-sidebar      { display: flex !important; }
        .sh-right        { display: flex !important; }
        .sh-search-box   { display: flex !important; }
        .sh-hdr-sub      { display: inline !important; }
        .sh-wrapper      { flex-direction: row !important; padding: 28px 28px 60px !important; }
        .sh-composer-btn { color: #555; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; transition: color 0.1s; }
        .sh-composer-btn:hover { color: #10b981; }
        .sh-composer-btn.active { color: #10b981; }
        .sh-filter-tab { background: transparent; border: none; color: #555; font-size: 12px; font-weight: 600; padding: 6px 12px; cursor: pointer; border-radius: 6px; transition: all 0.15s; }
        .sh-filter-tab:hover { color: #ccc; background: #111; }
        .sh-filter-tab.active { color: #fff; background: #141414; }

        @keyframes recordingPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @media (max-width: 1024px) {
          .sh-sidebar     { display: none !important; }
          .sh-right       { display: none !important; }
          .sh-search-box  { display: none !important; }
          .sh-hdr-sub     { display: none !important; }
          .sh-wrapper     { flex-direction: column !important; padding: 16px 16px 100px !important; }
        }

        .sh-nav-btn:hover    { background: #161616 !important; color: #ccc !important; }
        .sh-post-card:hover  { border-color: #242424 !important; }
        .sh-feed-action      { display: flex; align-items: center; gap: 6px; background: transparent; border: none; color: #555; cursor: pointer; font-size: 12px; font-weight: 500; transition: color 0.1s; }
        .sh-feed-action:hover { color: #b0b0b0; }
      `}</style>

      {/* SIDEBAR BLOCK COMPONENT */}
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
              <div style={{ fontSize: 10, color: "#555555", marginTop: 1, letterSpacing: "0.02em" }}>Private Networks</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#444444", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 10px 6px" }}>Main Space</div>
          
          <button className="sh-nav-btn" onClick={() => setActiveTab("Feed")} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
            border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
            background: activeTab === "Feed" ? "#131313" : "transparent",
            color: activeTab === "Feed" ? "#fff" : "#666666", fontWeight: activeTab === "Feed" ? 500 : 400, fontSize: 13, position: "relative",
          }}>
            {activeTab === "Feed" && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
            <Home size={15} color={activeTab === "Feed" ? "#10b981" : "#444444"} />
            Home Stream
          </button>

          <button className="sh-nav-btn" onClick={() => setActiveTab("Dashboard")} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
            border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
            background: activeTab === "Dashboard" ? "#131313" : "transparent",
            color: activeTab === "Dashboard" ? "#fff" : "#666666", fontWeight: activeTab === "Dashboard" ? 500 : 400, fontSize: 13, position: "relative",
          }}>
            {activeTab === "Dashboard" && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
            <BarChart3 size={15} color={activeTab === "Dashboard" ? "#10b981" : "#444444"} />
            Personal Studio
          </button>

          {[
            { icon: Users, label: "Communities" },
            { icon: MessageCircle, label: "Messages" },
            { icon: Bell, label: "Notifications" }
          ].map(({ icon: Icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} className="sh-nav-btn" onClick={() => setActiveTab(label)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7,
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                background: active ? "#131313" : "transparent",
                color: active ? "#fff" : "#666666", fontWeight: active ? 500 : 400, fontSize: 13, position: "relative",
              }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: 2, background: "#10b981" }} />}
                <Icon size={15} color={active ? "#10b981" : "#444444"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ margin: "0 8px 14px", padding: "14px", borderRadius: 10, background: "#0f1a13", border: "1px solid #163020" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Daily Streak</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>42</span>
            <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>days 🔥</span>
          </div>
        </div>
      </aside>

      {/* CORE WORKSPACE PORTAL */}
      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(8,8,8,0.96)", borderBottom: "1px solid #141414",
          backdropFilter: "blur(16px)", padding: "0 26px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>
              Home Stream
            </span>
            <span className="sh-hdr-sub" style={{ color: "#555555", marginLeft: 8, fontSize: 13 }}>
              Catch up on recent updates across your secure communication lines.
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="sh-search-box" style={{
              display: "flex", alignItems: "center", gap: 8, background: "#0f0f0f",
              border: "1px solid #1c1c1c", borderRadius: 8, padding: "6px 12px", width: 240,
            }}>
              <Search size={13} color="#444444" />
              <input 
                placeholder="Filter stream updates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: "#aaa", fontSize: 12, flex: 1 }} 
              />
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 7, background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 11, color: "#fff", cursor: "pointer",
            }}>
              {initials}
            </div>
          </div>
        </header>

        <div className="sh-wrapper" style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 28px 60px", display: "flex", gap: 22 }}>
          
          {/* MIDDLE COLUMN - CONTENT STREAM INTERACTION */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* COMPOSER MODULE STAGING ENGINE */}
            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px 20px" }}>
              <form onSubmit={handleCreatePost}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "#10b98115", border: "1px solid #10b98125", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#10b981", flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={isRecording ? "Recording your voice memo track note..." : `Share something secure with the world, ${firstName}...`}
                      disabled={isRecording}
                      style={{ width: "100%", background: "none", border: "none", outline: "none", color: isRecording ? "#666" : "#efefef", fontSize: 14, resize: "none", minHeight: 64, fontFamily: "inherit", padding: "6px 0" }}
                    />
                    
                    {mediaPreviewUrl && (
                      <div style={{ position: "relative", marginTop: 10, display: "block", borderRadius: 8, overflow: "hidden", border: "1px solid #1c1c1c", background: "#050505", padding: composerType === "audio" ? "12px" : "0" }}>
                        {composerType === "audio" ? (
                          <audio src={mediaPreviewUrl} controls style={{ width: "100%", height: "40px", display: "block" }} />
                        ) : (
                          <img src={mediaPreviewUrl} alt="Upload Staging Preview" style={{ maxHeight: 180, maxWidth: "100%", objectFit: "cover", display: "block" }} />
                        )}
                        <button type="button" onClick={clearFileStaging} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                          <X size={12} color="#fff" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #141414", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" style={{ display: "none" }} />
                    
                    <button type="button" disabled={isRecording} className={`sh-composer-btn ${composerType === "photo" ? "active" : ""}`} onClick={() => { setComposerType("photo"); fileInputRef.current?.click(); }}>
                      <ImageIcon size={14} /> <span style={{ fontSize: 11 }}>Photo</span>
                    </button>
                    <button type="button" disabled={isRecording} className={`sh-composer-btn ${composerType === "video" ? "active" : ""}`} onClick={() => { setComposerType("video"); fileInputRef.current?.click(); }}>
                      <Video size={14} /> <span style={{ fontSize: 11 }}>Video</span>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`sh-composer-btn ${composerType === "audio" ? "active" : ""}`} 
                      onClick={toggleAudioRecording}
                      style={{ color: isRecording ? "#ef4444" : undefined }}
                    >
                      <Mic size={14} style={{ animation: isRecording ? "recordingPulse 1.4s infinite ease-in-out" : "none" }} /> 
                      <span style={{ fontSize: 11, fontWeight: isRecording ? 600 : 500 }}>
                        {isRecording ? "Stop Recording" : "Audio"}
                      </span>
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={newPostCircleId} onChange={(e) => setNewPostCircleId(e.target.value)} style={{ background: "#0f0f0f", border: "1px solid #1c1c1c", color: "#888", borderRadius: 6, padding: "5px 8px", fontSize: 11, outline: "none" }}>
                      <option value="public">🌍 Open Network</option>
                      {circles.map(c => <option key={c.id} value={c.id}>🔒 {c.name}</option>)}
                    </select>
                    <button type="submit" disabled={isRecording || (!newPostContent.trim() && !selectedFile)} style={{ background: (newPostContent.trim() || selectedFile) && !isRecording ? "#10b981" : "#14291e", color: (newPostContent.trim() || selectedFile) && !isRecording ? "#fff" : "#446652", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: (newPostContent.trim() || selectedFile) && !isRecording ? "pointer" : "default", transition: "all 0.15s" }}>
                      Publish
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* PIPELINE ACTIVITY CONTROLS BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 2px" }}>
              <div style={{ display: "flex", gap: 4, background: "#0b0b0b", border: "1px solid #141414", padding: 3, borderRadius: 8 }}>
                <button className={`sh-filter-tab ${feedFilter === "all" ? "active" : ""}`} onClick={() => setFeedFilter("all")}>All Feeds</button>
                <button className={`sh-filter-tab ${feedFilter === "public" ? "active" : ""}`} onClick={() => setFeedFilter("public")}>Public Spaces</button>
                <button className={`sh-filter-tab ${feedFilter === "private" ? "active" : ""}`} onClick={() => setFeedFilter("private")}>Private Circles</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#444" }}>
                <SlidersHorizontal size={13} />
                <span style={{ fontSize: 11, fontWeight: 500, color: "#555" }}>Sorted by Recent</span>
              </div>
            </div>

            {/* TIMELINE POST CARDS ITERATION */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredPosts.length === 0 ? (
                <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "40px 20px", textAlign: "center", color: "#555" }}>
                  No contextual matches found in this feed view channel.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="sh-post-card" style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "18px 20px", transition: "border-color 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: "#10b98120", border: "1.5px solid #10b98140", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#10b981" }}>
                        {getInitials(post.authorName)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#e8e8e8" }}>{post.authorName}</span>
                          {post.isPublic || !post.circleName ? (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "#0ea5e912", color: "#0ea5e9", border: "1px solid #0ea5e925", fontWeight: 500 }}>
                              <Globe size={11} /> Public Space
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "#10b98112", color: "#10b981", border: "1px solid #10b98125", fontWeight: 500 }}>
                              🔒 {post.circleName}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: "#444444", marginTop: 2 }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    {post.content && <p style={{ color: "#b0b0b0", lineHeight: 1.65, marginBottom: 14, fontSize: 14 }}>{post.content}</p>}

                    {post.mediaUrl && (
                      <div style={{ overflow: "hidden", borderRadius: 8, border: "1px solid #141414", marginBottom: 14, maxHeight: 320, background: "#050505", padding: post.type === "audio" ? "12px" : "0" }}>
                        {post.type === "audio" ? (
                          <audio src={post.mediaUrl} controls style={{ width: "100%" }} />
                        ) : (
                          <img src={post.mediaUrl} alt="Post Attachment Graphic" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        )}
                      </div>
                    )}

                    {/* ENHANCED INTERACTIVE FOOTER LAYOUT */}
                    <div style={{ borderTop: "1px solid #121212", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button 
                          onClick={() => handleLikeToggle(post.id, post.likedByUser)} 
                          style={{
                            display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
                            cursor: "pointer", color: post.likedByUser ? "#f43f5e" : "#555", fontSize: 12, fontWeight: 500, transition: "color 0.1s"
                          }}
                        >
                          <Heart size={14} fill={post.likedByUser ? "#f43f5e" : "none"} />
                          <span>{post.likesCount}</span>
                        </button>
                        
                        <button className="sh-feed-action">
                          <MessageSquare size={14} />
                          <span>{post.commentsCount || 0}</span>
                        </button>

                        <button className="sh-feed-action">
                          <Share2 size={14} />
                        </button>
                      </div>

                      <button className="sh-feed-action">
                        <Bookmark size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL CONTINUOUS MONITOR SIDEBAR */}
          <div className="sh-right" style={{ width: 248, flexShrink: 0, flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Online Friends</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {onlineUsers.length === 0 ? (
                  <div style={{ fontSize: 11, color: "#444", padding: "8px 0" }}>No connections logged on.</div>
                ) : (
                  onlineUsers.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                      <div style={{ position: "relative" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#10b98118", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#10b981" }}>
                          {f.name ? f.name[0].toUpperCase() : "?"}
                        </div>
                        <div style={{ position: "absolute", bottom: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#10b981", border: "2px solid #0b0b0b" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#d8d8d8" }}>{f.name}</div>
                        <div style={{ fontSize: 10, color: "#555555", marginTop: 1 }}>{f.customStatus || "Active now"}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <SpotifyWidget />

            <div style={{ background: "#0b0b0b", border: "1px solid #141414", borderRadius: 12, padding: "16px" }}>
              <SectionLabel>Upcoming Events</SectionLabel>
              <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
                {events.length === 0 ? (
                  <div style={{ fontSize: 11, color: "#444" }}>No meetings booked.</div>
                ) : (
                  events.map((evt, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#10b98115", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Calendar size={13} color="#10b981" />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{evt.title}</div>
                        <div style={{ fontSize: 10, color: "#555555", marginTop: 2 }}>{new Date(evt.scheduledAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}