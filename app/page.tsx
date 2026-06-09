"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Lock } from "lucide-react";
import Image from "next/image";

type SplashState = "visible" | "fading" | "completed";

export default function AppEntry() {
  const [splashState, setSplashState] = useState<SplashState>("visible");

  useEffect(() => {
    const fadeDelay = 1600;
    const fadeDuration = 700;

    const fadeTimer = setTimeout(() => {
      setSplashState("fading");
    }, fadeDelay);

    const completeTimer = setTimeout(() => {
      setSplashState("completed");
    }, fadeDelay + fadeDuration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const showSplash = splashState !== "completed";
  const isFading = splashState === "fading";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center relative overflow-hidden antialiased select-none">

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[90px]" />
      </div>

      {/* SPLASH */}
      {showSplash && (
        <div
          className={`absolute flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isFading ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100"}`}
        >
          <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-[0_0_60px_rgba(16,185,129,0.35)]">
            <div className="h-full w-full rounded-[2.3rem] bg-neutral-950 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo2.png"
                alt="Safe Haven Logo"
                width={80}
                height={80}
                priority
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-300">
            Safe Haven
          </h1>

          <p className="text-zinc-500 text-[10px] font-bold mt-3 tracking-[0.4em] uppercase">
            Cryptographic Space
          </p>
        </div>
      )}

   {/* AUTH SCREEN */}
{splashState === "completed" && (
  <div className="w-full max-w-md px-6 animate-in fade-in duration-700 relative z-10">

    {/* Glass Card */}
    <div className="relative bg-neutral-900/40 border border-neutral-800 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 overflow-hidden">

      {/* subtle glow accent */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="text-center mb-10 relative">

        {/* Logo */}
        <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-lg shadow-emerald-900/20">
          <div className="h-full w-full rounded-xl bg-neutral-950 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo2.png"
              alt="Safe Haven Logo"
              width={42}
              height={42}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight mt-5 text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-300">
          Enter the Haven
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-400 text-xs mt-2 leading-relaxed max-w-[240px] mx-auto">
          A private cryptographic shelter for your community.
        </p>
      </div>

      {/* ACTIONS */}
      <div className="space-y-3 relative">

        {/* PRIMARY CTA */}
        <Link
          href="/Auth/Signup"
          className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-950/30 transition-all active:scale-[0.98]"
        >
          Create Account
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>

        {/* SECONDARY CTA */}
        <Link
          href="/Auth/Login"
          className="w-full flex items-center justify-center py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-200 text-sm font-medium transition-all active:scale-[0.98]"
        >
          Sign In
        </Link>
      </div>

      {/* FOOTER TRUST LINE */}
      <div className="mt-8 flex items-center justify-center gap-2 text-neutral-500 text-[11px]">
        <Lock size={12} className="text-neutral-600" />
        <span>End-to-end encrypted system</span>
      </div>

    </div>

    {/* TERMS */}
    <p className="text-center text-[10px] text-neutral-500 mt-6 leading-relaxed max-w-xs mx-auto">
      By continuing you agree to the{" "}
      <span className="underline hover:text-neutral-300 cursor-pointer transition-colors">
        Terms of Service
      </span>
      .
    </p>

  </div>
)}
    </div>
  );
}