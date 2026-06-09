"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Shield, User, Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  // =========================================================================
  // THEME CONFIGURATION PIPELINE (Future-proofed for appearance engine)
  // =========================================================================
  // Right now, this maps to your standard emerald green aesthetic.
  // Later, you can swap this static object out for state: const [theme, setTheme] = ...
  const currentTheme = {
    ambientGlows: (
      <>
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-emerald-600/20 blur-[160px] rounded-full transition-all duration-500" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-600/10 blur-[140px] rounded-full transition-all duration-500" />
      </>
    ),
    brandGradient: "from-emerald-500 via-teal-500 to-cyan-500",
    buttonGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentText: "text-emerald-400 hover:text-emerald-300",
    focusRing: "focus:border-emerald-500 focus:ring-emerald-500/20",
    shadowColor: "shadow-emerald-900/30",
    btnShadowColor: "shadow-emerald-900/20",
  };

  // Production form state management
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    
    // Auth pipeline creation execution...
    console.log("Submitting registration for:", formData.email);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden relative">

      {/* Ambient Background Engine */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {currentTheme.ambientGlows}
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <header className="lg:hidden relative z-10 px-6 pt-10 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${currentTheme.brandGradient} p-[2px] flex items-center justify-center shadow-lg`}>
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
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${currentTheme.brandGradient} p-[2px] flex items-center justify-center shadow-lg ${currentTheme.shadowColor}`}>
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
            Create your space.<br />Build your haven.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-lg leading-relaxed">
            Join encrypted communities where trust comes first.
            Share moments, connect deeply, and stay secure with your people.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-5 max-w-xl">
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition duration-300">
              <p className="text-sm text-zinc-400">Secure Circles</p>
              <p className="text-3xl font-bold mt-2">18K</p>
            </div>
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition duration-300">
              <p className="text-sm text-zinc-400">Active Users</p>
              <p className="text-3xl font-bold mt-2">3.4M</p>
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
              <div className={`hidden lg:flex items-center gap-2 ${currentTheme.accentText.split(" ")[0]} mb-3`}>
                <Sparkles size={16} />
                <span className="text-xs tracking-wide uppercase text-zinc-400">
                  Join Safe Haven
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Create Account
              </h2>
              <p className="text-zinc-400 mt-2 text-sm">
                Start your journey inside a secure digital space.
              </p>
            </div>

            {/* FORM PIPELINE */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* FULL NAME */}
              <div>
                <label htmlFor="fullName" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <User size={14} /> Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm`}
                />
              </div>

              {/* EMAIL */}
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
                  className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm`}
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Lock size={14} /> Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm`}
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label htmlFor="confirmPassword" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                  <Shield size={14} /> Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm`}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r ${currentTheme.buttonGradient} hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition duration-200 font-semibold shadow-lg ${currentTheme.btnShadowColor} active:scale-[0.98] text-sm`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* DIVIDER LAYOUT */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-500 text-xs tracking-widest select-none">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* GOOGLE FEDERATION BUTTON */}
            <button 
              type="button" 
              className="w-full rounded-2xl border border-white/10 py-3.5 hover:bg-white/5 transition duration-200 flex items-center justify-center gap-2 text-sm font-medium"
            >
              Continue with Google
            </button>

            {/* INTER-ROUTING FOOTER */}
            <p className="text-center text-zinc-400 mt-6 text-sm">
              Already have an account?{" "}
              <Link
                href="/Auth/Login"
                className={`font-medium transition-colors ${currentTheme.accentText}`}
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}