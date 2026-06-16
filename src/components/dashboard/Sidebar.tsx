"use client";

import React from "react";
import {
  Home, Users, MessageCircle, Bell, Music, 
  Calendar, User, Settings, Lock, Flame, X
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;       // Controlled state for mobile drawer drawer open
  onClose: () => void;   // Callback function to close mobile drawer drawer
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const navigationGroups = [
    {
      section: "Main",
      items: [
        { icon: Home, label: "Dashboard" },
        { icon: Users, label: "Communities" },
        { icon: MessageCircle, label: "Messages" },
        { icon: Bell, label: "Notifications", badge: 3 },
      ],
    },
    {
      section: "Explore",
      items: [
        { icon: Music, label: "Music" },
        { icon: Calendar, label: "Events" },
        { icon: User, label: "Profile" },
        { icon: Settings, label: "Settings" },
      ],
    },
  ];

  return (
    <>
      {/* Dynamic CSS injecting smooth mobile transition rules */}
      <style>{`
        @media (max-width: 1024px) {
          .sh-sidebar-container {
            position: fixed !important;
            inset: 0 !important;
            z-index: 150 !important;
            pointer-events: ${isOpen ? "auto" : "none"};
          }
          .sh-sidebar-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(43, 37, 103, 0.4);
            backdrop-filter: blur(4px);
            opacity: ${isOpen ? 1 : 0};
            transition: opacity 0.24s ease-out;
          }
          .sh-sidebar {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            height: 100% !important;
            box-shadow: 20px 0 50px rgba(43, 37, 103, 0.15) !important;
            transform: ${isOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1) !important;
            display: flex !important;
          }
          .sh-mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* Root Responsive Container Node */}
      <div className="sh-sidebar-container" style={{ display: "contents" }}>
        {/* Mobile Backdrop Overlay element */}
        <div className="sh-sidebar-backdrop" onClick={onClose} style={{ display: "none" }} />

        <aside
          className="sh-sidebar"
          style={{
            width: 240, // Expanded slightly for easier mobile touch layouts
            flexShrink: 0,
            borderRight: "1px solid #e8e4ff",
            background: "#fff",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            zIndex: 45,
          }}
        >
          {/* Logo Section */}
          <div style={{ padding: "16px", borderBottom: "1px solid #f0eeff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "#7F77DD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lock size={15} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2d2870" }}>Safe Haven</div>
                <div style={{ fontSize: 10, color: "#9990dd", marginTop: 1 }}>Private groups</div>
              </div>
            </div>

            {/* Mobile close cross selector (Hidden on Desktop natively) */}
            <button
              className="sh-mobile-close-btn"
              onClick={onClose}
              style={{
                display: "none",
                background: "none",
                border: "none",
                padding: 4,
                color: "#666",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items Map Grid */}
          <nav
            style={{
              flex: 1,
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "auto",
            }}
          >
            {navigationGroups.map((group) => (
              <React.Fragment key={group.section}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: "#bbb",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "10px 10px 4px",
                  }}
                >
                  {group.section}
                </div>
                
                {group.items.map(({ icon: Icon, label, badge }: any) => {
                  const active = activeTab === label;
                  return (
                    <button
                      key={label}
                      className="sh-nav"
                      onClick={() => {
                        setActiveTab(label);
                        onClose(); // Automatically auto-collapses drawer layout on mobile click tap selector
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px", // Increased tap size targets for high PWA compliance accessibility
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s",
                        width: "100%",
                        background: active ? "#EEEDFE" : "transparent",
                        color: active ? "#534AB7" : "#666",
                        fontWeight: active ? 600 : 400,
                        fontSize: 14,
                      }}
                    >
                      <Icon size={16} color={active ? "#7F77DD" : "#aaa"} />
                      {label}
                      {badge && (
                        <span
                          style={{
                            marginLeft: "auto",
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "#D4537E",
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>

          {/* User Streak Progression Card Frame */}
          <div style={{ margin: "0 12px 16px", padding: "14px", borderRadius: 12, background: "#EEEDFE" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
              <Flame size={13} color="#EF9F27" />
              <span style={{ fontSize: 10, color: "#7F77DD", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Daily streak
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#3C3489", letterSpacing: "-1px", lineHeight: 1 }}>
              42 <span style={{ fontSize: 13, fontWeight: 600, color: "#7F77DD" }}>days</span>
            </div>
            <div style={{ marginTop: 8, height: 4, background: "#c8c2f4", borderRadius: 2 }}>
              <div style={{ width: "70%", height: "100%", background: "#534AB7", borderRadius: 2 }} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}