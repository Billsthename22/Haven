"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, User, Mail, Lock, AlertCircle, CheckCircle, X } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode] = useState<string[]>(new Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (showVerifyModal && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showVerifyModal]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
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
      // 1. Direct fetch targeting your internal secure API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setErrors({ global: data.error || "An unexpected error occurred during registration." });
        return;
      }

      // 2. Open built-in validation modal structure
      setShowVerifyModal(true);
    } catch (err) {
      setIsLoading(false);
      setErrors({ global: "An unexpected error occurred during registration." });
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
    if (e.key === "Backspace" && !otpCode[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join("");
    if (code.length < 6) { setOtpError("Enter the full 6-digit code."); return; }
    setOtpLoading(true);
    setOtpError("");

    try {
      // 3. Forward verification tokens straight to your server handler
      const response = await fetch("/api/auth/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          token: code,
        }),
      });

      const data = await response.json();
      setOtpLoading(false);

      if (!response.ok) {
        setOtpError(data.error || "Invalid or expired verification code.");
        return;
      }

      // 4. Success state management!
      setOtpSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);

    } catch (err) {
      setOtpLoading(false);
      setOtpError("Failed to verify code. Please try again.");
    }
  };

  const inputClass = (field: string) =>
    `mt-1.5 w-full rounded-2xl bg-zinc-900/60 border ${
      errors[field] ? "border-red-500/40" : "border-white/10"
    } px-4 py-3.5 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-sm disabled:opacity-50`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-emerald-600/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-600/10 blur-[140px] rounded-full" />
      </div>

      <header className="lg:hidden relative z-10 px-6 pt-10 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] flex items-center justify-center shadow-lg">
            <div className="h-full w-full rounded-xl bg-zinc-950 flex items-center justify-center">
              <Image src="/logo2.png" alt="Safe Haven" width={28} height={28} priority className="object-contain" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Safe Haven</h1>
        <p className="text-zinc-400 text-sm mt-2">Secure encrypted communities</p>
      </header>

      <main className="hidden lg:flex flex-1 relative items-center">
        <div className="relative z-10 flex flex-col justify-center px-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <div className="h-full w-full rounded-xl bg-zinc-950 flex items-center justify-center">
                <Image src="/logo2.png" alt="Safe Haven" width={26} height={26} priority className="object-contain" />
              </div>
            </div>
            <span className="text-3xl font-bold tracking-tight">Safe Haven</span>
          </div>
          <h2 className="text-6xl font-bold leading-[1.05] max-w-xl">
            Create your space.<br />Build your haven.
          </h2>
          <p className="text-zinc-400 mt-6 max-w-lg leading-relaxed">
            Join encrypted communities where trust comes first.
          </p>
          <div className="mt-14 grid grid-cols-2 gap-5 max-w-xl">
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition">
              <p className="text-sm text-zinc-400">Secure Circles</p>
              <p className="text-3xl font-bold mt-2">18K</p>
            </div>
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition">
              <p className="text-sm text-zinc-400">Active Users</p>
              <p className="text-3xl font-bold mt-2">3.4M</p>
            </div>
          </div>
          <div className="mt-10 text-xs text-zinc-500 tracking-widest uppercase">Built for privacy • Designed for trust</div>
        </div>
      </main>

      <section className="w-full lg:w-[520px] flex items-center justify-center px-6 py-10 lg:p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
            <div className="mb-8 text-center lg:text-left">
              <div className="hidden lg:flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-xs tracking-wide uppercase text-zinc-400">Join Safe Haven</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Account</h2>
              <p className="text-zinc-400 mt-2 text-sm">Start your journey inside a secure digital space.</p>
            </div>

            {errors.global && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{errors.global}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <User size={14} /> Full Name
                </label>
                <input id="fullName" type="text" name="fullName" disabled={isLoading} value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className={inputClass("fullName")} />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Mail size={14} /> Email Address
                </label>
                <input id="email" type="email" name="email" disabled={isLoading} value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={inputClass("email")} />
                {errors.email && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Lock size={14} /> Password
                </label>
                <input id="password" type="password" name="password" disabled={isLoading} value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={inputClass("password")} />
                {errors.password && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Shield size={14} /> Confirm Password
                </label>
                <input id="confirmPassword" type="password" name="confirmPassword" disabled={isLoading} value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={inputClass("confirmPassword")} />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition font-semibold shadow-lg shadow-emerald-900/20 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </>
                ) : "Create Account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-500 text-xs tracking-widest">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button type="button" disabled={isLoading} className="w-full rounded-2xl border border-white/10 py-3.5 hover:bg-white/5 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm font-medium">
              Continue with Google
            </button>

            <p className="text-center text-zinc-400 mt-6 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => !otpLoading && setShowVerifyModal(false)} />
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-zinc-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <button onClick={() => setShowVerifyModal(false)} disabled={otpLoading} className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition disabled:opacity-40">
              <X size={18} />
            </button>

            {otpError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccess ? (
              <div className="text-center py-4">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Account Verified!</h3>
                <p className="text-zinc-400 text-sm mt-2">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Shield size={18} />
                  <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Email Verification</span>
                </div>
                <h3 className="text-xl font-bold">Verify your email</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  We sent a 6-digit code to <span className="text-white">{formData.email}</span>. Enter it below.
                </p>

                <div className="mt-6 flex justify-between gap-2">
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
                      className="w-12 h-14 text-center text-lg font-bold rounded-xl bg-zinc-950 border border-white/10 focus:border-emerald-500 text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition disabled:opacity-50"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-90 text-sm font-semibold shadow-lg transition active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
                >
                  {otpLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : "Verify Email"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}