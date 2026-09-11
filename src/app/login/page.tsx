"use client";

import { useState, useActionState, Suspense } from "react";
import { loginUser } from "@/app/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  
  // @ts-ignore
  const [state, formAction] = useActionState(loginUser, null);

  return (
    <div className="min-h-screen flex w-full">
      {/* Left - Image */}
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

      {/* Right - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-background">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Enter your credentials to access your portal.</p>
          
          {errorParam && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm">
              {errorParam}
            </div>
          )}
          
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction as unknown as string} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="w-full bg-background border border-border rounded p-3 pr-10 text-sm focus:outline-none focus:border-primary" 
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded mt-2 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-8">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex w-full bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
