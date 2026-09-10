"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff, Smartphone, ShieldAlert, ShieldCheck } from "lucide-react";
import { requestPasswordResetOTP, resetUserPasswordWithOTP } from "@/app/actions/auth";

export default function PublicForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // OTP Session details
  const [resetSession, setResetSession] = useState<{
    userId: string;
    email: string;
    phone: string;
    otp: string;
  } | null>(null);

  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Request OTP for public user email or phone
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await requestPasswordResetOTP(identifier, false); // false = Public User Portal
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.success && res.userId) {
      setResetSession({
        userId: res.userId,
        email: res.email || "",
        phone: res.phone || "",
        otp: res.otp || "",
      });
      setStep(2);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetSession || enteredOtp.trim() !== resetSession.otp) {
      setError("Invalid 6-digit OTP code. Please check the code and try again.");
      return;
    }

    setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!resetSession?.userId) {
      setError("Session expired. Please request a new OTP code.");
      setStep(1);
      setLoading(false);
      return;
    }

    const res = await resetUserPasswordWithOTP(resetSession.userId, newPassword);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMessage(res.message || "Password successfully updated!");
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left - Visual Banner */}
      <div className="hidden lg:flex w-1/2 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
          alt="Architecture" 
          className="object-cover w-full h-full opacity-60"
        />
        <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative">
            <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
            <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
            <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
          </div>
          <div className="font-bold text-xl tracking-tight text-white">
            Acre<span className="text-primary">Desk</span>
          </div>
        </div>
      </div>

      {/* Right - Form Container */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-background">
        <div className="w-full max-w-sm mx-auto">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Reset Password</h2>
            <p className="text-sm text-muted-foreground">
              {step === 1 && "Enter your registered email or phone number to receive a verification OTP."}
              {step === 2 && `Enter the 6-digit OTP code sent to registered phone ${resetSession?.phone}.`}
              {step === 3 && "Create a new password for your AcreDesk account."}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage ? (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Password Updated!</h3>
                  <p className="text-xs text-emerald-300">{successMessage}</p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Sign In</span>
              </Link>
            </div>
          ) : (
            <>
              {/* STEP 1: Enter Identifier */}
              {step === 1 && (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email or Registered Phone
                    </label>
                    <input 
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="user@example.com or 9876543210"
                      className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{loading ? "Sending OTP..." : "Get OTP Verification Code"}</span>
                  </button>
                </form>
              )}

              {/* STEP 2: Verify OTP Code */}
              {step === 2 && resetSession && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  {/* Demo OTP Banner */}
                  <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>OTP Sent to {resetSession.phone || resetSession.email}</span>
                    </div>
                    <p className="text-slate-300">
                      Use Verification Code: <strong className="text-white text-sm tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded font-mono">{resetSession.otp}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      6-Digit OTP Code
                    </label>
                    <input 
                      type="text"
                      maxLength={6}
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-background border border-border rounded p-3.5 text-center text-lg font-mono tracking-widest text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setError(""); }}
                      className="w-1/3 bg-card border border-border hover:bg-muted text-muted-foreground py-3 rounded text-xs font-bold transition-colors"
                    >
                      Change Input
                    </button>
                    <button 
                      type="submit" 
                      className="w-2/3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify OTP</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Enter New Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password (Min 6 characters)
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-background border border-border rounded p-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{loading ? "Updating Password..." : "Set New Password"}</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
