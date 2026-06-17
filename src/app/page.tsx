"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type SplashState = "visible" | "fading" | "completed";

export default function HomePage() {
  const [splashState, setSplashState] = useState<SplashState>("visible");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashState("fading"), 1600);
    const completeTimer = setTimeout(() => setSplashState("completed"), 2200);
    return () => { clearTimeout(fadeTimer); clearTimeout(completeTimer); };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f2ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
      padding: "32px 16px",
    }}>
      <style>{`
        .sh-btn-primary { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: 12px 0; background: #534AB7; color: #EEEDFE; border: none; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; margin-bottom: 10px; transition: opacity 0.15s; }
        .sh-btn-primary:hover { opacity: 0.9; }
        .sh-btn-secondary { display: flex; align-items: center; justify-content: center; width: 100%; padding: 12px 0; background: transparent; color: #534AB7; border: 1px solid #c4b8f8; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.15s; }
        .sh-btn-secondary:hover { background: #f4f2ff; }
        .sh-feature-pill { flex: 1; background: #EEEDFE; border-radius: 10px; padding: 10px 8px; text-align: center; }
        .sh-help:hover { color: #7F77DD; }
      `}</style>

      {/* PHASE 1: SPLASH */}
      {splashState !== "completed" && (
        <div style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          opacity: splashState === "fading" ? 0 : 1,
          transform: splashState === "fading" ? "scale(0.95)" : "scale(1)",
          zIndex: 20,
        }}>
          {/* Logo tile */}
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: "#EEEDFE", border: "1.5px solid #c4b8f8",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 4, left: 4, width: 8, height: 8, borderTop: "1.5px solid #7F77DD", borderLeft: "1.5px solid #7F77DD" }} />
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 8, height: 8, borderBottom: "1.5px solid #7F77DD", borderRight: "1.5px solid #7F77DD" }} />
            <div style={{ width: 44, height: 44, background: "#534AB7", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#EEEDFE" }}>
              🛡
            </div>
          </div>
          <h1 style={{ marginTop: 20, fontSize: 22, fontWeight: 700, color: "#3C3489", letterSpacing: "-0.5px" }}>
            Safe Haven
          </h1>
          <span style={{ fontSize: 11, letterSpacing: "0.05em", color: "#9990dd", fontWeight: 500, marginTop: 6 }}>
            Opening your secure workspace...
          </span>
        </div>
      )}

      {/* PHASE 2: CARD */}
      {splashState === "completed" && (
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{
            background: "#fff",
            border: "0.5px solid #ede8ff",
            borderRadius: 20,
            padding: "36px 32px 28px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: "25%", right: "25%",
              height: 2.5, background: "#7F77DD", borderRadius: "0 0 6px 6px",
            }} />

            {/* Logo */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 60, height: 60, margin: "0 auto 18px",
                background: "#EEEDFE", border: "1px solid #c4b8f8",
                borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 5, left: 5, width: 8, height: 8, borderTop: "1.5px solid #7F77DD", borderLeft: "1.5px solid #7F77DD" }} />
                <div style={{ position: "absolute", bottom: 5, right: 5, width: 8, height: 8, borderBottom: "1.5px solid #7F77DD", borderRight: "1.5px solid #7F77DD" }} />
                <div style={{ width: 32, height: 32, background: "#534AB7", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: "#EEEDFE" }}>
                  🛡
                  {/* Replace with: <Image src="/logo2.png" alt="Safe Haven" width={18} height={18} priority style={{ objectFit: "contain" }} /> */}
                </div>
              </div>

              {/* Badge */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#E1F5EE", color: "#0F6E56",
                  fontSize: 11, fontWeight: 600, padding: "4px 10px",
                  borderRadius: 20, letterSpacing: "0.03em",
                }}>
                  ✓ Your private circle
                </span>
              </div>

              <h2 style={{ fontSize: 21, fontWeight: 700, color: "#2d2870", marginBottom: 6, letterSpacing: "-0.5px" }}>
                Safe Haven
              </h2>
              <p style={{ fontSize: 13, color: "#9990dd", fontWeight: 500, marginBottom: 26, lineHeight: 1.5 }}>
                Your secure, private space to connect<br />with people who matter.
              </p>
            </div>

            {/* Feature pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[
                { icon: "🔒", label: "Private" },
                { icon: "👥", label: "Circles" },
                { icon: "🔥", label: "Streaks" },
                { icon: "🎵", label: "Spotify" },
              ].map((f) => (
                <div key={f.label} className="sh-feature-pill">
                  <div style={{ fontSize: 15, marginBottom: 4 }}>{f.icon}</div>
                  <div style={{ fontSize: 10, color: "#534AB7", fontWeight: 600 }}>{f.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <Link href="/signup" className="sh-btn-primary">
              Get started free →
            </Link>
            <Link href="/login" className="sh-btn-secondary">
              Log in to your account
            </Link>

            {/* Divider + footer */}
            <div style={{ borderTop: "1px solid #f0eeff", margin: "20px 0 16px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#1D9E75", fontWeight: 600 }}>
                🔐 Encrypted connection
              </span>
              <span className="sh-help" style={{ fontSize: 11, color: "#9990dd", fontWeight: 500, cursor: "pointer", transition: "color 0.15s" }}>
                Need help?
              </span>
            </div>
          </div>

          {/* Terms */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#9990dd", marginTop: 14, lineHeight: 1.5 }}>
            By continuing, you agree to our{" "}
            <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      )}
    </div>
  );
}