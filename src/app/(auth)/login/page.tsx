"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/src/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
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

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

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
            Your space.<br />Secured.
          </h2>
          <p className="text-zinc-400 mt-6 max-w-lg leading-relaxed">
            A private encrypted environment built for trusted communities.
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

      <section className="w-full lg:w-[520px] flex items-center justify-center px-6 py-10 lg:p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">

            <div className="mb-8 text-center lg:text-left">
              <div className="hidden lg:flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-xs tracking-wide uppercase text-zinc-400">Secure Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Sign in to Safe Haven</h2>
              <p className="text-zinc-400 mt-2 text-sm">Continue into your encrypted communities.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                    <Lock size={14} /> Password
                  </label>
                  <span className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
                    Forgot password?
                  </span>
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
                  className="mt-2 w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition font-semibold shadow-lg shadow-emerald-900/20 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </>
                ) : "Sign In"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-500 text-xs tracking-widest select-none">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              type="button"
              className="w-full rounded-2xl border border-white/10 py-3.5 hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm font-medium"
            >
              Continue with Google
            </button>

            <p className="text-center text-zinc-400 mt-6 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
