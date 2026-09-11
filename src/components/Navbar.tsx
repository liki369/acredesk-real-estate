"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutUser } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, LogOut, Home, Phone, Heart, User } from "lucide-react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen to auth state changes to update navbar automatically
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-border sticky top-0 z-50 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo strictly as a link to home */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group select-none"
          title="AcreDesk - Homepage"
        >
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
            <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
            <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
            <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
          </div>
          <div className="font-bold text-xl tracking-tight text-foreground">
            Acre<span className="text-primary">Desk</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-5 text-sm text-muted-foreground items-center">
          <Link href="/" className="hover:text-primary transition-colors font-medium">Homepage</Link>
          <Link href="/contact" className="hover:text-primary transition-colors font-medium">Contact</Link>
          <Link href="/saved" className="hover:text-primary transition-colors font-medium">Saved listings</Link>
          
          <div className="w-px h-4 bg-border mx-1"></div>
          
          {/* Dedicated Theme Toggle */}
          <ThemeToggle />

          <div className="w-px h-4 bg-border mx-1"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground max-w-[140px] truncate" title={user.email}>
                {user.email}
              </span>
              <button 
                onClick={() => logoutUser()} 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
                title="Log out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link 
                href="/login" 
                className="hover:text-primary transition-colors font-medium text-xs px-2.5 py-1.5"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Separate Theme Toggle Icon for Mobile Header */}
          <ThemeToggle />

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-lg border border-border bg-card/80 hover:bg-muted text-foreground flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="space-y-1">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4 text-primary" />
              <span>Homepage</span>
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>Contact</span>
            </Link>
            <Link 
              href="/saved" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Heart className="w-4 h-4 text-primary" />
              <span>Saved listings</span>
            </Link>
          </div>

          <div className="border-t border-border pt-3">
            {user ? (
              <div className="space-y-3">
                <div className="px-3 py-2 bg-card border border-border rounded-lg flex items-center gap-2.5 text-xs text-muted-foreground">
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/70">Logged in as</p>
                    <p className="font-semibold text-foreground truncate">{user.email}</p>
                  </div>
                </div>
                
                {/* Mobile Log Out Option */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 transition-colors active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
