"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageCircle, Bell, Plus } from "lucide-react";

interface MobileNavProps {
  onOpenComposer: () => void;
}

export default function MobileNav({ onOpenComposer }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Communities", path: "/communities" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications", badge: 3 },
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
        {navItems.map(({ icon: Icon, label, path, badge }, idx) => {
          // Checks if the current path matches exactly or starts with the base path
          const active = pathname === path || pathname.startsWith(`${path}/`);
          
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

              <Link
                href={path}
                style={{
                  textDecoration: "none",
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
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}