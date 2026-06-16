"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, User, LogOut } from "lucide-react";

interface HeaderProps {
  fullName?: string | null;
  email?: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

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

export default function Header({
  fullName,
  email,
  searchQuery,
  setSearchQuery,
  onProfileClick,
  onLogoutClick,
}: HeaderProps) {
  const displayName = fullName ?? email ?? "User";
  const initials = getInitials(displayName);
  const firstName = getFirstName(displayName);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if clicking outside of it completely
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(244, 242, 255, 0.95)",
        borderBottom: "1px solid #e8e4ff",
        backdropFilter: "blur(12px)",
        padding: "0 24px",
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#2d2870" }}>
          {getGreeting()}, {firstName}
        </span>
        <span className="sh-hdr-sub" style={{ color: "#9990dd", marginLeft: 8, fontSize: 13 }}>
          Here's what's new.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search Bar */}
        <div
          className="sh-search"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#fff",
            border: "1px solid #e5e0ff",
            borderRadius: 9,
            padding: "6px 12px",
            width: 220,
          }}
        >
          <Search size={13} color="#bbb" />
          <input
            placeholder="Search groups or posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#444",
              fontSize: 12,
              flex: 1,
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Interactive Dropdown Wrapper Container */}
        <div
          ref={dropdownRef}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{ position: "relative" }}
        >
          {/* User Profile Avatar Initials Element */}
          <div
            onClick={toggleDropdown}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#7F77DD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 11,
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(127,119,221,0.2)",
              userSelect: "none"
            }}
          >
            {initials}
          </div>

          {/* Contextual Dropdown Menu */}
          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "#ffffff",
                border: "1px solid #e8e4ff",
                borderRadius: 10,
                boxShadow: "0 10px 25px -5px rgba(127,119,221,0.15), 0 8px 10px -6px rgba(127,119,221,0.1)",
                width: 140,
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                zIndex: 50,
              }}
              onMouseEnter={() => setIsOpen(true)} 
            >
              <button
                onClick={() => {
                  if (onProfileClick) onProfileClick();
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  borderRadius: 6,
                  color: "#4a4587",
                  fontSize: 12,
                  fontWeight: 500,
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <User size={14} color="#7F77DD" />
                Profile
              </button>

              <button
                onClick={() => {
                  if (onLogoutClick) onLogoutClick();
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  borderRadius: 6,
                  color: "#ea4335",
                  fontSize: 12,
                  fontWeight: 500,
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <LogOut size={14} color="#ea4335" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}