"use client";
/**
 * © 2026 AcreDesk™. All Rights Reserved.
 *
 * Dual-Auth Portal Modal for Buyer Client & Superadmin CRM Access.
 */

import React from "react";
import Link from "next/link";
import { X, User, ShieldCheck, ArrowRight, Lock, KeyRound } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 text-foreground overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            Secure Unified Authentication
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sign In to AcreDesk
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Select your account type to access verified property deals or admin management tools.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* User / Buyer Portal */}
          <div className="rounded-xl border border-border bg-background/60 hover:border-primary/50 transition-all p-5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Buyer / Client Portal</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Browse verified listings, save plots, manage personal inquiries, and chat with desk sales.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Sign In as Client</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>Create New Account</span>
              </Link>
            </div>
          </div>

          {/* Admin CRM Console */}
          <div className="rounded-xl border border-border bg-background/60 hover:border-red-500/40 transition-all p-5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  Restricted
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Superadmin CRM</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Superadmin & agent dashboard for inventory control, lead tracking, and deal closings.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href="/admin/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-500 transition-colors shadow-sm shadow-red-600/20"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin Portal Login</span>
              </Link>
              <Link
                href="/admin/signup"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>Register as Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} AcreDesk&trade; Platform</span>
          <Link href="/terms" onClick={onClose} className="hover:text-primary transition-colors">
            Terms &amp; Security Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
