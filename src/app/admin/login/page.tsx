"use client";

import { useState, useActionState, Suspense } from "react";
import { loginAdmin } from "@/app/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  
  // @ts-ignore
  const [state, formAction] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Left - Visual Banner */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative border-r border-border flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-emerald-500/5 z-0" />
        
        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center relative shadow-lg shadow-primary/30">
            <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
            <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
            <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
          </div>
          <div className="font-bold text-2xl tracking-tight text-white">
            Acre<span className="text-primary">Desk</span>
          </div>
        </div>

        {/* Middle Feature Hero */}
        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Restricted Admin Console
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Centralized Real Estate CRM & Deal Management
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Manage your land plots, villas, and commercial properties. Track client lead stages from enquiry to closing.
          </p>
        </div>

        {/* Bottom Notice */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-primary" />
          <span>Encrypted 256-bit SSL Admin Protocol</span>
        </div>
      </div>

      {/* Right - Form Container */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-card/40">
        <div className="w-full max-w-md mx-auto">
          {/* Top back button for mobile */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public User Homepage</span>
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
              CRM Portal Sign In
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Sign in to CRM Dashboard</h2>
            <p className="text-sm text-muted-foreground">Enter your dealer or administrator credentials to log in.</p>
          </div>

          {errorParam === "AccessDenied" && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-xs font-medium leading-relaxed">
              <strong>Access Denied:</strong> Public user emails cannot log into the CRM Dashboard. Please use your registered CRM Admin account.
            </div>
          )}
          
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-xs font-medium leading-relaxed">
              {state.error}
            </div>
          )}

          <form action={formAction as unknown as string} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">CRM Admin Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="admin@acredesk.com"
                className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <Link href="/admin/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl p-3 pr-10 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" 
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 mt-2 text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to CRM Dashboard</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/60 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have a CRM Admin account?{" "}
              <Link href="/admin/signup" className="text-primary font-semibold hover:underline">
                Create Admin Account
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Are you a buyer or client?{" "}
              <Link href="/login" className="text-slate-400 hover:text-white underline">
                Go to Public User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex w-full bg-background" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
