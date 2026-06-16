"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Image from "next/image";

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
    }}>

      {/* PHASE 1: WELCOME LOADING SCREEN */}
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
            <div style={{ width: 44, height: 44, background: "#534AB7", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image src="/logo2.png" alt="Safe Haven" width={28} height={28} priority style={{ objectFit: "contain" }} />
            </div>
          </div>

          <h1 style={{ marginTop: 20, fontSize: 22, fontWeight: 600, color: "#3C3489", letterSpacing: "-0.5px" }}>
            Safe Haven
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.05em", color: "#9990dd", fontWeight: 500 }}>
              Opening your secure workspace...
            </span>
          </div>
        </div>
      )}

      {/* PHASE 2: LOGIN / SIGNUP CARD */}
      {splashState === "completed" && (
        <div style={{ width: "100%", maxWidth: 400, padding: "0 16px", zIndex: 10 }}>
          <div style={{
            background: "#fff",
            border: "0.5px solid #ede8ff",
            borderRadius: 18,
            padding: "32px 28px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top purple accent line */}
            <div style={{
              position: "absolute", top: 0, left: "25%", right: "25%",
              height: 2, background: "#7F77DD", borderRadius: "0 0 4px 4px",
            }} />

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, margin: "0 auto 16px",
                background: "#EEEDFE", border: "1px solid #c4b8f8",
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 4, left: 4, width: 7, height: 7, borderTop: "1.5px solid #7F77DD", borderLeft: "1.5px solid #7F77DD" }} />
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 7, height: 7, borderBottom: "1.5px solid #7F77DD", borderRight: "1.5px solid #7F77DD" }} />
                <div style={{ width: 30, height: 30, background: "#534AB7", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src="/logo2.png" alt="Safe Haven" width={18} height={18} priority style={{ objectFit: "contain" }} />
                </div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#3C3489", margin: "0 0 4px" }}>Welcome to Safe Haven</h2>
              <p style={{ fontSize: 13, color: "#7F77DD", margin: 0, fontWeight: 500 }}>
                Log in or create an account to get started
              </p>
            </div>

            {/* Call to Actions (Buttons) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/signup" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "11px 0", background: "#534AB7", color: "#fff",
                border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500,
                textDecoration: "none", cursor: "pointer",
              }}>
                Get started free
                <ArrowRight size={14} />
              </Link>
              <Link href="/login" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "11px 0", background: "transparent", color: "#534AB7",
                border: "1px solid #c4b8f8", borderRadius: 10, fontSize: 13, fontWeight: 500,
                textDecoration: "none", cursor: "pointer",
              }}>
                Log in to your account
              </Link>
            </div>

            {/* Security Status Footer */}
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: "1px solid #f0eeff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              fontSize: 12, color: "#1D9E75", fontWeight: 500,
            }}>
              <ShieldCheck size={14} color="#1D9E75" />
              Secure, encrypted connection
            </div>
          </div>

          {/* Terms and Privacy notice */}
          <p style={{
            textAlign: "center", fontSize: 11, color: "#9990dd",
            marginTop: 14, lineHeight: "1.4"
          }}>
            By continuing, you agree to our basic usage analytics and{" "}
            <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>
              Terms of Service
            </span>.
          </p>
        </div>
      )}
    </div>
  );
}