"use client";

import React from "react";
import { Home, Users, MessageCircle, Bell, Plus } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenComposer: () => void;
}

export default function MobileNav({
  activeTab,
  setActiveTab,
  onOpenComposer,
}: MobileNavProps) {
  const navItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Users, label: "Communities" },
    { icon: MessageCircle, label: "Messages" },
    { icon: Bell, label: "Notifications", badge: 3 },
  ];

  return (
    <>
      {/* Dynamic Injector style to switch display and handle safe areas */}
      <style>{`
        .sh-mobile-nav { display: none !important; }
        @media (max-width: 1024px) {
          .sh-mobile-nav { display: flex !important; }
          body { padding-bottom: 64px; } /* Prevent nav from covering layout content */
        }
      `}</style>

      <div
        className="sh-mobile-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid #ede8ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 10px pb-safe", // Native iOS notch padding system support
          zIndex: 90,
          boxShadow: "0 -4px 20px rgba(83,74,183,0.05)"
        }}
      >
        {navItems.map(({ icon: Icon, label, badge }, idx) => {
          const active = activeTab === label;
          
          return (
            <React.Fragment key={label}>
              {/* Insert the action launcher right in the center slot */}
              {idx === 2 && (
                <button
                  type="button"
                  onClick={onOpenComposer}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#7F77DD",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(127,119,221,0.4)",
                    cursor: "pointer",
                    transform: "translateY(-4px)"
                  }}
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(label)}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  cursor: "pointer",
                  color: active ? "#534AB7" : "#aaa",
                  position: "relative",
                  flex: 1,
                  height: "100%"
                }}
              >
                <Icon size={18} color={active ? "#7F77DD" : "#aaa"} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
                
                {badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: 6,
                      right: "22%",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#D4537E",
                      fontSize: 8,
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
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}