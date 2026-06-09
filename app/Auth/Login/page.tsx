"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Lock, Shield } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  // Production form state management
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Auth pipeline execution logic goes here...
    console.log("Submitting login sequence for:", formData.email);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden relative">

      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-emerald-600/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-600/10 blur-[140px] rounded-full" />
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <header className="lg:hidden relative z-10 px-6 pt-10 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] flex items-center justify-center shadow-lg">
            <div className="h-full w-full rounded-xl bg-zinc-950 flex items-center justify-center">
              <Image
                src="/logo2.png"
                alt="Safe Haven Logo"
                width={28}
                height={28}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Safe Haven</h1>
        <p className="text-zinc-400 text-sm mt-2">Secure encrypted communities</p>
      </header>

      {/* LEFT SIDE (DESKTOP ONLY) */}
      <main className="hidden lg:flex flex-1 relative items-center">
        <div className="relative z-10 flex flex-col justify-center px-24">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <div className="h-full w-full rounded-xl bg-zinc-950 flex items-center justify-center">
                <Image
                  src="/logo2.png"
                  alt="Safe Haven Logo"
                  width={26}
                  height={26}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-3xl font-bold tracking-tight">Safe Haven</span>
          </div>

          <h2 className="text-6xl font-bold leading-[1.05] max-w-xl">
            Your space.<br />Secured.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-lg leading-relaxed">
            A private encrypted environment built for trusted communities.
            Share, connect, and communicate inside a secure digital haven.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-5 max-w-xl">
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition">
              <p className="text-sm text-zinc-400">Secure Circles</p>
              <p className="text-3xl font-bold mt-2">24</p>
            </div>
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition">
              <p className="text-sm text-zinc-400">Encrypted Messages</p>
              <p className="text-3xl font-bold mt-2">1.2K</p>
            </div>
          </div>

          <div className="mt-10 text-xs text-zinc-500 tracking-widest uppercase">
            Built for privacy • Designed for trust
          </div>
        </div>
      </main>

      {/* RIGHT SIDE (FORM CARD CONTAINER) */}
      <section className="w-full lg:w-[520px] flex items-center justify-center px-6 py-10 lg:p-6 relative z-10">
        <div className="w-full max-w-md">

          {/* Glass Card */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <div className="hidden lg:flex items-center gap-2 text-emerald-400 mb-3">
                <Sparkles size={16} />
                <span className="text-xs tracking-wide uppercase text-zinc-400">
                  Secure Access
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Sign in to Safe Haven
              </h2>
              <p className="text-zinc-400 mt-2 text-sm">
                Continue into your encrypted communities.
              </p>
            </div>

            {/* FORM PIPELINE */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL FIELD */}
              <div>
                <label htmlFor="email" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-sm"
                />
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label htmlFor="password" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Lock size={14} /> Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-sm"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition font-semibold shadow-lg shadow-emerald-900/20 active:scale-[0.98] text-sm"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* DIVIDER LAYOUT */}
            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-500 text-xs tracking-widest select-none">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* GOOGLE FEDERATION BUTTON */}
            <button 
              type="button" 
              className="w-full rounded-2xl border border-white/10 py-3.5 hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm font-medium"
            >
              Continue with Google
            </button>

            {/* INTER-ROUTING FOOTER */}
            <p className="text-center text-zinc-400 mt-6 text-sm">
              Don’t have an account?{" "}
              <Link
                href="/Auth/Signup"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}