"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json() as { error?: string; requiresVerification?: boolean };

      if (!response.ok) {
        if (data.requiresVerification) {
          setError("Please verify your email before logging in. Check your inbox for a verification link.");
        } else {
          setError(data.error || "Incorrect email or password. Please try again.");
        }
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#f7f7fb",
    border: "1px solid #e5e0ff",
    borderRadius: 10,
    padding: "11px 14px 11px 40px",
    color: "#111",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f2ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "32px 16px",
    }}>
      <style>{`
        .sh-input:focus { border-color: #7F77DD !important; box-shadow: 0 0 0 3px #7F77DD22 !important; background: #fff !important; }
        .sh-btn:hover { opacity: 0.9; }
        .sh-btn:active { transform: translateY(1px); }
        .sh-google:hover { background: #f4f2ff !important; }
        .sh-link { color: #7F77DD; text-decoration: none; font-weight: 600; }
        .sh-link:hover { text-decoration: underline; }
        .sh-forgot:hover { text-decoration: underline; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{
          background: "#fff",
          border: "0.5px solid #ede8ff",
          borderRadius: 20,
          padding: "36px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top accent */}
          <div style={{
            position: "absolute", top: 0, left: "25%", right: "25%",
            height: 2.5, background: "#7F77DD", borderRadius: "0 0 6px 6px",
          }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 60, height: 60, margin: "0 auto 18px",
              background: "#EEEDFE", border: "1px solid #c4b8f8",
              borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{ position: "absolute", top: 5, left: 5, width: 8, height: 8, borderTop: "1.5px solid #7F77DD", borderLeft: "1.5px solid #7F77DD" }} />
              <div style={{ position: "absolute", bottom: 5, right: 5, width: 8, height: 8, borderBottom: "1.5px solid #7F77DD", borderRight: "1.5px solid #7F77DD" }} />
              <div style={{ width: 32, height: 32, background: "#534AB7", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image src="/logo2.png" alt="Safe Haven" width={18} height={18} priority style={{ objectFit: "contain" }} />
              </div>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2d2870", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13, color: "#9990dd", margin: 0, fontWeight: 500 }}>
              Log in to your Safe Haven account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              background: "#FBEAF0", border: "1px solid #F4C0D1",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            }}>
              <AlertTriangle size={14} color="#D4537E" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#993556", lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={14} color="#c4b8f8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="sh-input"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Password
                </label>
                <Link href="/forgotpassword" className="sh-forgot" style={{ fontSize: 11, color: "#7F77DD", fontWeight: 500, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={14} color="#c4b8f8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="sh-input"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="sh-btn"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                width: "100%", padding: "12px 0",
                background: isLoading ? "#AFA9EC" : "#534AB7",
                color: "#fff", border: "none", borderRadius: 11,
                fontSize: 13, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s, transform 0.1s", marginTop: 4,
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 13, height: 13, border: "2px solid #ffffff55", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>
                  Log in <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f0eeff" }} />
            <span style={{ fontSize: 11, color: "#c4b8f8", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#f0eeff" }} />
          </div>

          {/* Google */}
          <button
            type="button"
            disabled={isLoading}
            className="sh-google"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "11px 0",
              background: "transparent", color: "#534AB7",
              border: "1px solid #c4b8f8", borderRadius: 11,
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #f0eeff", marginTop: 20, paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#1D9E75", fontWeight: 600 }}>
              <ShieldCheck size={13} color="#1D9E75" />
              Encrypted connection
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
              No account?{" "}
              <Link href="/signup" className="sh-link">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#9990dd", marginTop: 14, lineHeight: 1.5 }}>
          By logging in, you agree to our{" "}
          <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}