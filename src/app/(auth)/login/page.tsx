"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, AlertTriangle, ShieldCheck, Terminal } from "lucide-react";
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
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        requiresVerification?: boolean;
      };

      if (!response.ok) {
        if (data.requiresVerification) {
          setError("AUTH_FAILURE: Account unverified. Dispatching primary OTP matrix payload.");
        } else {
          setError(data.error || "CRITICAL: Access authorization rejected. Credentials invalid.");
        }
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login client breakdown:", err);
      setError("SYSTEM_ERR: Unexpected telemetry interface collapse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex flex-col lg:flex-row overflow-hidden relative antialiased font-mono">
      {/* Tactical Grid Overlay & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7F77DD]/10 blur-[140px] rounded-full" />
      </div>

      {/* Mobile Top HUD */}
      <header className="lg:hidden relative z-10 px-6 pt-10 pb-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 border border-[#7F77DD]/40 bg-zinc-900/50 flex items-center justify-center">
            <Image 
              src="/logo2.png" 
              alt="Safe Haven" 
              width={20} 
              height={20} 
              style={{ height: "auto" }}
              priority 
              className="object-contain filter brightness-125" 
            />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white">Safe Haven</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">SECURE_CORE_v1.0</p>
          </div>
        </div>
        <div className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-400 tracking-wider">
          STATUS: READY
        </div>
      </header>

      {/* Left Column: Tactical Cinematic Display Panel */}
      <main className="hidden lg:flex flex-1 relative items-center border-r border-zinc-900 bg-gradient-to-b from-zinc-950 to-[#0d0d0f]">
        <div className="relative z-10 flex flex-col justify-center px-20 w-full max-w-3xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 border border-[#7F77DD] bg-[#7F77DD]/5 flex items-center justify-center shadow-[0_0_15px_rgba(127,119,221,0.15)]">
              <Image 
                src="/logo2.png" 
                alt="Safe Haven" 
                width={22} 
                height={22} 
                style={{ height: "auto" }}
                priority 
                className="object-contain filter brightness-125" 
              />
            </div>
            <div>
              <span className="text-md font-bold tracking-[0.25em] uppercase text-white">Safe Haven</span>
              <div className="text-[9px] text-[#7F77DD] tracking-widest uppercase mt-0.5 font-bold">SECURE NODE OPERATOR</div>
            </div>
          </div>
          
          <h2 className="text-5xl font-black tracking-tight text-white uppercase leading-none">
            AUTHENTICATE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-[#7F77DD] to-zinc-500">
              OPERATOR_ACCESS
            </span>
          </h2>
          <p className="text-zinc-400 mt-6 max-w-md text-xs leading-relaxed font-sans">
            Initializing encrypted session link sequence. Connection tunneling protocols mapped through standard architecture routines. 
          </p>

          {/* Telemetry Status Grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            <div className="border border-zinc-800 bg-zinc-950/40 p-5 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#7F77DD]" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#7F77DD]" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">ACTIVE_SECURE_CIRCLES</p>
              <p className="text-2xl font-bold mt-1 text-white tracking-tight">24<span className="text-xs text-[#7F77DD] ml-1">▲</span></p>
            </div>
            <div className="border border-zinc-800 bg-zinc-950/40 p-5 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#7F77DD]" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#7F77DD]" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">ENCRYPTED_PACKETS_TX</p>
              <p className="text-2xl font-bold mt-1 text-white tracking-tight">1.2K<span className="text-[10px] text-zinc-600 font-normal ml-1">/SEC</span></p>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-2 text-[10px] text-zinc-500 tracking-wider uppercase">
            <Terminal size={12} className="text-[#7F77DD]" /> SYSTEM CORE OVERWATCH // SYSTEM LEVEL PROVISIONED
          </div>
        </div>
      </main>

      {/* Right Column: High-Tech Login Interface Module */}
      <section className="w-full lg:w-[560px] flex items-center justify-center px-4 py-8 lg:p-12 relative z-10 bg-zinc-950/20">
        <div className="w-full max-w-sm">
          {/* Glassmorphic Tactical Core Frame */}
          <div className="border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-6 sm:p-8 relative shadow-2xl">
            
            {/* Structural Geometric Tech Accents */}
            <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-[#7F77DD]" />
            <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-[#7F77DD]" />
            <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-[#7F77DD]" />
            <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-[#7F77DD]" />

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-[#7F77DD]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#7F77DD]">GATEWAY_AUTHENTICATION</span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">Console Login</h2>
              <p className="text-zinc-500 mt-1 text-xs font-sans">Verify authorization sequence to establish local interface.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2 border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs text-red-400">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-[10px] tracking-wider text-zinc-400 flex items-center gap-2 uppercase font-bold">
                  <Mail size={12} className="text-zinc-600" /> Operator Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="IDENTITY@CORE.SECURE"
                  className="mt-2 w-full rounded-none bg-zinc-900/40 border border-zinc-800 px-4 py-3 text-white outline-none focus:border-[#7F77DD] focus:bg-zinc-950/60 transition text-xs placeholder-zinc-700 disabled:opacity-50 font-mono tracking-wide"
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[10px] tracking-wider text-zinc-400 flex items-center gap-2 uppercase font-bold">
                    <Lock size={12} className="text-zinc-600" /> Access Cypher
                  </label>
                  <Link 
                    href="/forgotpassword" 
                    className="text-[10px] text-[#7F77DD] hover:text-[#938ce4] transition-colors uppercase font-bold tracking-wide"
                  >
                    Forgot Cypher?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-none bg-zinc-900/40 border border-zinc-800 px-4 py-3 text-white outline-none focus:border-[#7F77DD] focus:bg-zinc-950/60 transition text-xs disabled:opacity-50 font-mono tracking-wide"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-none bg-[#7F77DD] hover:bg-[#6c63cf] disabled:bg-zinc-900 disabled:text-zinc-600 text-white transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(127,119,221,0.15)] active:translate-y-[1px]"
              >
                {isLoading ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-none border border-white border-t-transparent" />
                    RUNNING_AUTH_SEQ...
                  </>
                ) : "EXECUTE_SIGN_IN"}
              </button>
            </form>

            {/* Sub-Actions / Alternatives Partition */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-zinc-900" />
              <span className="text-zinc-600 text-[9px] tracking-widest select-none font-bold">ALT_PATH</span>
              <div className="flex-1 h-[1px] bg-zinc-900" />
            </div>

            <button
              type="button"
              disabled={isLoading}
              className="w-full rounded-none border border-zinc-800 py-3 text-xs tracking-wider uppercase hover:bg-zinc-900/50 hover:border-zinc-700 transition flex items-center justify-center gap-2 text-zinc-300 disabled:opacity-50"
            >
              Federate via Google Provider
            </button>

            <p className="text-center text-zinc-500 mt-6 text-xs font-sans">
              Missing node clearance?{" "}
              <Link href="/signup" className="text-[#7F77DD] hover:text-[#938ce4] font-bold transition-colors font-mono uppercase tracking-wide">
                Register Node
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}