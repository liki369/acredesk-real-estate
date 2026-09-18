"use client";
/**
 * © 2026 AcreDesk™. All Rights Reserved.
 *
 * Persistent Mobile Bottom Navigation Bar.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, PhoneCall, User, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/AuthModal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Hide on dashboard or admin pages
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isContact = pathname === "/contact";

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border px-3 py-2 flex items-center justify-around shadow-2xl transition-colors">
        {/* Home */}
        <Link
          href="/"
          onClick={() => {
            if (isHome) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            isHome ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? "text-primary" : "text-muted-foreground"}`} />
          <span>Home</span>
        </Link>

        {/* Listings */}
        <button
          type="button"
          onClick={() => {
            if (isHome) {
              const el = document.getElementById("featured-listings");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                return;
              }
            }
            window.location.href = "/#featured-listings";
          }}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <span>Listings</span>
        </button>

        {/* Contact Desk */}
        <Link
          href="/contact"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            isContact ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PhoneCall className={`w-5 h-5 ${isContact ? "text-primary" : "text-muted-foreground"}`} />
          <span>Contact</span>
        </Link>

        {/* Account / Sign In */}
        {user ? (
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium text-primary hover:text-primary transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
              {user.email?.slice(0, 1).toUpperCase()}
            </div>
            <span>Portal</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
            <span>Account</span>
          </button>
        )}
      </nav>

      {/* Auth Modal Triggerable from Mobile Bottom Nav */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
