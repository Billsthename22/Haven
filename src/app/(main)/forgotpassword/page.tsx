"use client";

import React, { useState } from "react";
import { ArrowLeft, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: "20px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card-shadow { box-shadow: 0 20px 60px rgba(83,74,183,0.1); }
        .input-focus:focus { border-color: #7F77DD !important; outline: none !important; box-shadow: 0 0 0 3px #7F77DD22 !important; }
        .btn-hover:hover { opacity: 0.9; }
        .link-hover:hover { text-decoration: underline !important; color: #534AB7 !important; }
      `}</style>

      <div
        className="card-shadow"
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 440,
          padding: "40px 32px",
          border: "1px solid #ede8ff",
        }}
      >
        {!isSubmitted ? (
          /* ── REQUEST FORM SCREEN ── */
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#EEEDFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <KeyRound size={22} color="#534AB7" />
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2d2870", letterSpacing: "-0.5px" }}>
              Forgot password?
            </h1>
            <p style={{ color: "#7F77DD", fontSize: 14, marginTop: 8, marginBottom: 28, lineHeight: 1.5 }}>
              No worries. Enter your email address and we will send you a secure link to reset your password.
            </p>

            {error && (
              <div
                style={{
                  background: "#FBEAF0",
                  border: "1px solid #F4C0D1",
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: "#993556",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 20,
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "#9990dd",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      color: "#aaa",
                    }}
                  >
                    <Mail size={16} />
                  </span>
                  <input
                    className="input-focus"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      background: "#f7f7f8",
                      border: "1px solid #e5e5e5",
                      borderRadius: 10,
                      padding: "12px 14px 12px 40px",
                      color: "#111",
                      fontSize: 14,
                      transition: "all 0.15s",
                    }}
                  />
                </div>
              </div>

              <button
                className="btn-hover"
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#7F77DD",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "opacity 0.15s",
                  marginBottom: 24,
                }}
              >
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>

            <div style={{ textAlign: "center" }}>
              <Link
                href="/login"
                className="link-hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#7F77DD",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          /* ── SUCCESS SCREEN ── */
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#E1F5EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <CheckCircle2 size={24} color="#0F6E56" />
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2d2870", letterSpacing: "-0.5px" }}>
              Check your email
            </h1>
            <p style={{ color: "#7F77DD", fontSize: 14, marginTop: 8, marginBottom: 28, lineHeight: 1.5 }}>
              We have sent a password reset link to <strong style={{ color: "#3C3489" }}>{email}</strong>. 
              Please follow the instructions in the email to secure your account.
            </p>

            <button
              className="btn-hover"
              onClick={() => setIsSubmitted(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "#f4f2ff",
                color: "#7F77DD",
                border: "1px solid #e5e0ff",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "background 0.15s",
                marginBottom: 24,
              }}
            >
              Resend email
            </button>

            <div>
              <Link
                href="/login"
                className="link-hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#7F77DD",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}