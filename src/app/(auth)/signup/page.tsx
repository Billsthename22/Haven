"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, User, Mail, Lock, AlertCircle, CheckCircle, X, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode] = useState<string[]>(new Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (showVerifyModal && inputRefs.current[0]) inputRefs.current[0].focus();
  }, [showVerifyModal]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address.";
    if (!formData.password) errs.password = "Password is required.";
    else if (formData.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const e = { ...prev }; delete e[name]; return e; });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: formData.fullName, email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      setIsLoading(false);
      if (!response.ok) { setErrors({ global: data.error || "An unexpected error occurred." }); return; }
      setShowVerifyModal(true);
    } catch {
      setIsLoading(false);
      setErrors({ global: "An unexpected error occurred. Please try again." });
    }
  };

  const handleOtpChange = (el: HTMLInputElement, idx: number) => {
    const val = el.value.replace(/[^0-9]/g, "");
    const updated = [...otpCode];
    updated[idx] = val.slice(-1);
    setOtpCode(updated);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otpCode[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join("");
    if (code.length < 6) { setOtpError("Enter the full 6-digit code."); return; }
    setOtpLoading(true);
    setOtpError("");
    try {
      const response = await fetch("/api/auth/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, token: code }),
      });
      const data = await response.json();
      setOtpLoading(false);
      if (!response.ok) { setOtpError(data.error || "Invalid or expired code."); return; }
      setOtpSuccess(true);
      setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 1500);
    } catch {
      setOtpLoading(false);
      setOtpError("Failed to verify code. Please try again.");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: errors[field] ? "#FBEAF0" : "#f7f7fb",
    border: `1px solid ${errors[field] ? "#F4C0D1" : "#e5e0ff"}`,
    borderRadius: 10,
    padding: "11px 14px 11px 40px",
    color: "#111",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

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
        .sh-btn-primary:hover { opacity: 0.9; }
        .sh-btn-primary:active { transform: translateY(1px); }
        .sh-btn-google:hover { background: #f4f2ff !important; }
        .sh-link { color: #7F77DD; text-decoration: none; font-weight: 600; }
        .sh-link:hover { text-decoration: underline; }
        .sh-otp-input:focus { border-color: #7F77DD !important; box-shadow: 0 0 0 3px #7F77DD22 !important; background: #fff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
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

          {/* Logo + heading */}
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

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "#EEEDFE", color: "#534AB7",
                fontSize: 11, fontWeight: 600, padding: "4px 10px",
                borderRadius: 20, letterSpacing: "0.03em",
              }}>
                <Sparkles size={10} /> Join Safe Haven
              </span>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2d2870", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
              Create your account
            </h2>
            <p style={{ fontSize: 13, color: "#9990dd", margin: 0, fontWeight: 500 }}>
              Your secure, private space starts here
            </p>
          </div>

          {/* Global error */}
          {errors.global && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              background: "#FBEAF0", border: "1px solid #F4C0D1",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            }}>
              <AlertCircle size={14} color="#D4537E" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#993556", lineHeight: 1.5 }}>{errors.global}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Full name */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Full name
              </label>
              <div style={{ position: "relative" }}>
                <User size={14} color="#c4b8f8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input id="fullName" type="text" name="fullName" required placeholder="Jane Smith"
                  value={formData.fullName} onChange={handleInputChange} disabled={isLoading}
                  className="sh-input" style={inputStyle("fullName")} />
              </div>
              {errors.fullName && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
                  <AlertCircle size={11} color="#D4537E" />
                  <span style={{ fontSize: 11, color: "#993556" }}>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={14} color="#c4b8f8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input id="email" type="email" name="email" required placeholder="you@example.com"
                  value={formData.email} onChange={handleInputChange} disabled={isLoading}
                  className="sh-input" style={inputStyle("email")} />
              </div>
              {errors.email && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
                  <AlertCircle size={11} color="#D4537E" />
                  <span style={{ fontSize: 11, color: "#993556" }}>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={14} color="#c4b8f8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input id="password" type="password" name="password" required placeholder="Min. 8 characters"
                  value={formData.password} onChange={handleInputChange} disabled={isLoading}
                  className="sh-input" style={inputStyle("password")} />
              </div>
              {errors.password && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
                  <AlertCircle size={11} color="#D4537E" />
                  <span style={{ fontSize: 11, color: "#993556" }}>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#9990dd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Confirm password
              </label>
              <div style={{ position: "relative" }}>
                <Shield size={14} color="#c4b8f8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input id="confirmPassword" type="password" name="confirmPassword" required placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleInputChange} disabled={isLoading}
                  className="sh-input" style={inputStyle("confirmPassword")} />
              </div>
              {errors.confirmPassword && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
                  <AlertCircle size={11} color="#D4537E" />
                  <span style={{ fontSize: 11, color: "#993556" }}>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="sh-btn-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                width: "100%", padding: "12px 0", marginTop: 4,
                background: isLoading ? "#AFA9EC" : "#534AB7",
                color: "#fff", border: "none", borderRadius: 11,
                fontSize: 13, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s, transform 0.1s",
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 13, height: 13, border: "2px solid #ffffff55", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Creating account...
                </>
              ) : (
                <>Create account <ArrowRight size={14} /></>
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
            className="sh-btn-google"
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
              Have an account?{" "}
              <Link href="/login" className="sh-link">Log in</Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#9990dd", marginTop: 14, lineHeight: 1.5 }}>
          By signing up, you agree to our{" "}
          <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#7F77DD", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>

      {/* OTP Modal */}
      {showVerifyModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(60,52,137,0.25)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400,
            padding: "32px 28px", position: "relative",
            border: "0.5px solid #ede8ff",
            boxShadow: "0 20px 60px rgba(83,74,183,0.18)",
          }}>
            {/* Close */}
            {!otpSuccess && (
              <button
                onClick={() => !otpLoading && setShowVerifyModal(false)}
                disabled={otpLoading}
                style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex", alignItems: "center" }}
              >
                <X size={17} />
              </button>
            )}

            {otpSuccess ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 56, height: 56, background: "#E1F5EE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle size={28} color="#1D9E75" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2d2870", marginBottom: 8 }}>Email verified!</h3>
                <p style={{ fontSize: 13, color: "#9990dd" }}>Taking you to your dashboard...</p>
              </div>
            ) : (
              <>
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 2.5, background: "#7F77DD", borderRadius: "0 0 6px 6px" }} />

                <div style={{ marginBottom: 20 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#EEEDFE", color: "#534AB7", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, marginBottom: 12 }}>
                    <Shield size={10} /> Email verification
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2d2870", marginBottom: 6 }}>Check your inbox</h3>
                  <p style={{ fontSize: 13, color: "#9990dd", lineHeight: 1.5 }}>
                    We sent a 6-digit code to <strong style={{ color: "#2d2870" }}>{formData.email}</strong>. Enter it below.
                  </p>
                </div>

                {otpError && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#FBEAF0", border: "1px solid #F4C0D1", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                    <AlertCircle size={14} color="#D4537E" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#993556" }}>{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 20 }}>
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        ref={(el) => { if (el) inputRefs.current[idx] = el; }}
                        value={digit}
                        disabled={otpLoading}
                        onChange={(e) => handleOtpChange(e.target, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="sh-otp-input"
                        style={{
                          width: 48, height: 54, textAlign: "center",
                          fontSize: 20, fontWeight: 700, color: "#2d2870",
                          background: digit ? "#EEEDFE" : "#f7f7fb",
                          border: `1px solid ${digit ? "#c4b8f8" : "#e5e0ff"}`,
                          borderRadius: 10, outline: "none",
                          fontFamily: "inherit", transition: "all 0.15s",
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="sh-btn-primary"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      width: "100%", padding: "12px 0",
                      background: otpLoading ? "#AFA9EC" : "#534AB7",
                      color: "#fff", border: "none", borderRadius: 11,
                      fontSize: 13, fontWeight: 600, cursor: otpLoading ? "not-allowed" : "pointer",
                      transition: "opacity 0.15s",
                    }}
                  >
                    {otpLoading ? (
                      <>
                        <div style={{ width: 13, height: 13, border: "2px solid #ffffff55", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Verifying...
                      </>
                    ) : "Verify email"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}