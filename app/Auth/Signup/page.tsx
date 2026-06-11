"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Shield, User, Mail, Lock, AlertCircle, CheckCircle, Smartphone, KeyRound, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const parseJsonResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return { error: `Server returned status ${response.status} instead of a valid JSON object.` };
    }

    return response.json();
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
  };

  // =========================================================================
  // THEME CONFIGURATION PIPELINE
  // =========================================================================
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalSuccess, setGlobalSuccess] = useState(false);

  // =========================================================================
  // OTP MODAL ARCHITECTURE STATE
  // =========================================================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpStep, setOtpStep] = useState<"channel_select" | "verification">("channel_select");
  const [verificationChannel, setVerificationChannel] = useState<"email" | "phone" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState<string[]>(new Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (otpStep === "verification" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [otpStep]);

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    const name = formData.fullName.trim();
    const email = formData.email.trim();
    
    if (!name) tempErrors.fullName = "Full name parameter required.";
    
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email) {
      tempErrors.email = "Email address required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Provide a valid routing email schema.";
    }

    if (!formData.password) {
      tempErrors.password = "Authentication string required.";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Security token must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Token mismatch. String arrays must match.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const cleanErrors = { ...prev };
        delete cleanErrors[name];
        return cleanErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalSuccess(false);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    const generatedUsername = formData.fullName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") 
      || `user_${Math.floor(Math.random() * 10000)}`;

    try {
      // MATCHED CASING: Capitalized 'Signup' path matching your exact route directory folder
      const response = await fetch("/api/auth/Signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: generatedUsername,
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        if (response.status === 409 && data.error) {
          if (data.error.toLowerCase().includes("email")) {
            setErrors({ email: data.error });
          } else if (data.error.toLowerCase().includes("username")) {
            setErrors({ fullName: "Try using different variations of your name to build a unique profile key." });
          } else {
            setErrors({ global: data.error });
          }
        } else {
          setErrors({ global: data.error || "Failed to establish validation handshake." });
        }
        return;
      }

      // Success Lifecycle Interception -> Engage Multi-factor confirmation framework
      setIsModalOpen(true);

    } catch (err) {
      console.error("Networking stack exception during authorization execution:", err);
      setErrors({ global: "Core execution failure. Verify system connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // OTP LIFECYCLE ROUTINES
  // =========================================================================
  const handleRequestOtp = async (channel: "email" | "phone") => {
    if (channel === "phone" && !phoneNumber.trim()) {
      setOtpError("Phone routing metadata cannot be empty.");
      return;
    }
    
    setOtpLoading(true);
    setOtpError("");
    setVerificationChannel(channel);

    try {
      const response = await fetch("/api/auth/requestotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          channel: channel,
          destination: channel === "email" ? formData.email : phoneNumber.trim()
        }),
      });

      if (!response.ok) {
        const data = await parseJsonResponse(response);
        throw new Error(data.error || "Failed to transmit secure challenge payload.");
      }

      setOtpStep("verification");
    } catch (err: unknown) {
      setOtpError(getErrorMessage(err, "Failed to transmit validation challenge token."));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/[^0-9]/g, "");
    if (!val) {
      const updatedCode = [...otpCode];
      updatedCode[index] = "";
      setOtpCode(updatedCode);
      return;
    }

    const updatedCode = [...otpCode];
    updatedCode[index] = val.substring(val.length - 1);
    setOtpCode(updatedCode);

    if (index < 5 && element.value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = otpCode.join("");
    
    if (finalCode.length < 6) {
      setOtpError("Complete security footprint validation required.");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: finalCode,
          channel: verificationChannel
        }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Token validation failure. Check string integrity.");
      }

      setOtpSuccess(true);
      setGlobalSuccess(true);
      setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
      
      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/Auth/Login");
      }, 2000);

    } catch (err: unknown) {
      setOtpError(getErrorMessage(err, "Invalid validation keys."));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {currentTheme.ambientGlows}
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <header className="lg:hidden relative z-10 px-6 pt-10 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${currentTheme.brandGradient} p-[2px] flex items-center justify-center shadow-lg`}>
            <div className="h-full w-full rounded-xl bg-zinc-950 flex items-center justify-center">
              <Image src="/logo2.png" alt="Safe Haven Logo" width={28} height={28} priority className="object-contain" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Safe Haven</h1>
        <p className="text-zinc-400 text-sm mt-2">Secure encrypted communities</p>
      </header>

      {/* LEFT SIDE (DESKTOP) */}
      <main className="hidden lg:flex flex-1 relative items-center">
        <div className="relative z-10 flex flex-col justify-center px-24">
          <div className="flex items-center gap-3 mb-8">
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${currentTheme.brandGradient} p-[2px] flex items-center justify-center shadow-lg ${currentTheme.shadowColor}`}>
              <div className="h-full w-full rounded-xl bg-zinc-950 flex items-center justify-center">
                <Image src="/logo2.png" alt="Safe Haven Logo" width={26} height={26} priority className="object-contain" />
              </div>
            </div>
            <span className="text-3xl font-bold tracking-tight">Safe Haven</span>
          </div>

          <h2 className="text-6xl font-bold leading-[1.05] max-w-xl">Create your space.<br />Build your haven.</h2>
          <p className="text-zinc-400 mt-6 max-w-lg leading-relaxed">
            Join encrypted communities where trust comes first. Share moments, connect deeply, and stay secure with your people.
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
          <div className="mt-10 text-xs text-zinc-500 tracking-widest uppercase">Built for privacy • Designed for trust</div>
        </div>
      </main>

      {/* RIGHT SIDE (FORM CARD) */}
      <section className="w-full lg:w-[520px] flex items-center justify-center px-6 py-10 lg:p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
            
            <div className="mb-8 text-center lg:text-left">
              <div className={`hidden lg:flex items-center gap-2 ${currentTheme.accentText.split(" ")[0]} mb-3`}>
                <Sparkles size={16} />
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

            {globalSuccess && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Secure cluster distribution completed! Forwarding parameters...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="text-xs text-zinc-400 flex items-center gap-2 font-medium"><User size={14} /> Full Name</label>
                <input id="fullName" type="text" name="fullName" disabled={isLoading} value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border ${errors.fullName ? "border-red-500/40 focus:border-red-500" : "border-white/10"} px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm disabled:opacity-50`} />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="text-xs text-zinc-400 flex items-center gap-2 font-medium"><Mail size={14} /> Email Address</label>
                <input id="email" type="text" name="email" disabled={isLoading} value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border ${errors.email ? "border-red-500/40 focus:border-red-500" : "border-white/10"} px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm disabled:opacity-50`} />
                {errors.email && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="text-xs text-zinc-400 flex items-center gap-2 font-medium"><Lock size={14} /> Password</label>
                <input id="password" type="password" name="password" disabled={isLoading} value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border ${errors.password ? "border-red-500/40 focus:border-red-500" : "border-white/10"} px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm disabled:opacity-50`} />
                {errors.password && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-xs text-zinc-400 flex items-center gap-2 font-medium"><Shield size={14} /> Confirm Password</label>
                <input id="confirmPassword" type="password" name="confirmPassword" disabled={isLoading} value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={`mt-1.5 w-full rounded-2xl bg-zinc-900/60 border ${errors.confirmPassword ? "border-red-500/40 focus:border-red-500" : "border-white/10"} px-4 py-3.5 text-white outline-none ${currentTheme.focusRing} ring-offset-zinc-950 transition duration-200 text-sm disabled:opacity-50`} />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={isLoading} className={`w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r ${currentTheme.buttonGradient} hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition duration-200 font-semibold shadow-lg ${currentTheme.btnShadowColor} active:scale-[0.98] text-sm flex items-center justify-center`}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Configuring Cluster...</span>
                  </div>
                ) : "Create Account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-zinc-500 text-xs tracking-widest select-none">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button type="button" disabled={isLoading} className="w-full rounded-2xl border border-white/10 py-3.5 hover:bg-white/5 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-2 text-sm font-medium">
              Continue with Google
            </button>

            <p className="text-center text-zinc-400 mt-6 text-sm">
              Already have an account?{" "}
              <Link href="/Auth/Login" className={`font-medium transition-colors ${currentTheme.accentText}`}>Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DYNAMIC OTP MODAL SYSTEM OVERLAY
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={() => !otpLoading && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-zinc-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl transition-all transform duration-300 border-t-white/20">
            <button onClick={() => setIsModalOpen(false)} disabled={otpLoading} className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition disabled:opacity-40">
              <X size={18} />
            </button>

            {otpError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccess && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>Identity signature matched. Cluster authorized!</span>
              </div>
            )}

            {otpStep === "channel_select" && (
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 text-emerald-400 mb-2 justify-center sm:justify-start">
                  <KeyRound size={18} />
                  <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Verification Engine</span>
                </div>
                <h3 className="text-xl font-bold">Secure Verification</h3>
                <p className="text-sm text-zinc-400 mt-1">Choose your preferred verification route:</p>

                <div className="mt-6 space-y-3">
                  <button onClick={() => handleRequestOtp("email")} disabled={otpLoading} className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition duration-200 flex items-center justify-between group disabled:opacity-50">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 group-hover:text-emerald-400 transition">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Verify via Registered Email</p>
                        <p className="text-xs text-zinc-400 mt-0.5 max-w-[240px] truncate">{formData.email || "your-email@route.com"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 font-bold group-hover:text-emerald-400 transition">&rarr;</span>
                  </button>

                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Verify via Mobile String</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Send validation token via text message.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <input type="tel" placeholder="+1 (555) 000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={otpLoading} className="flex-1 rounded-xl bg-zinc-950 border border-white/10 px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500/40 transition disabled:opacity-50" />
                      <button onClick={() => handleRequestOtp("phone")} disabled={otpLoading} className={`px-4 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} text-xs font-semibold hover:opacity-90 transition active:scale-95 disabled:opacity-50`}>
                        {otpLoading && verificationChannel === "phone" ? "..." : "Send"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {otpStep === "verification" && (
              <form onSubmit={handleVerifyOtpSubmit} className="text-center sm:text-left">
                <div className="flex items-center gap-2 text-emerald-400 mb-2 justify-center sm:justify-start">
                  <Shield size={18} />
                  <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Challenge Validation</span>
                </div>
                <h3 className="text-xl font-bold">Enter Secure Passcode</h3>
                <p className="text-sm text-zinc-400 mt-1">We dispatched a 6-digit verification code to your channel path.</p>

                <div className="mt-6 flex justify-between gap-2 dir-ltr">
                  {otpCode.map((digit, idx) => (
                    <input key={idx} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} ref={(el) => { if(el) inputRefs.current[idx] = el; }} value={digit} disabled={otpLoading || otpSuccess} onChange={(e) => handleOtpChange(e.target, idx)} onKeyDown={(e) => handleOtpKeyDown(e, idx)} className="w-12 h-14 text-center text-lg font-bold rounded-xl bg-zinc-950 border border-white/10 focus:border-emerald-500 text-white outline-none ring-1 ring-transparent focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50" />
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={() => setOtpStep("channel_select")} disabled={otpLoading || otpSuccess} className="w-full sm:w-1/3 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition text-xs font-medium disabled:opacity-50">Back</button>
                  <button type="submit" disabled={otpLoading || otpSuccess} className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} hover:opacity-90 text-xs font-semibold shadow-lg transition active:scale-[0.98] flex items-center justify-center disabled:opacity-50`}>
                    {otpLoading && verificationChannel !== "phone" ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : "Confirm Validation Footprint"}
                  </button>
                </div>

                <p className="text-center text-xs text-zinc-500 mt-4">
                  Did not receive token code?{" "}
                  <button type="button" onClick={() => handleRequestOtp(verificationChannel!)} disabled={otpLoading || otpSuccess} className="text-emerald-400 hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50">Re-dispatch stream</button>
                </p>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}