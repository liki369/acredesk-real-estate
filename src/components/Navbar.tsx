"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { logoutUser } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="w-full border-b border-border p-4 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group select-none" 
        onClick={toggleTheme}
        title="Click to toggle Light/Dark Theme"
      >
        {/* Past Monogram Logo with Theme Toggle */}
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
          <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
          <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
          <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
        </div>
        <div className="font-bold text-xl tracking-tight text-foreground">
          Acre<span className="text-primary">Desk</span>
        </div>
      </div>
      
      <div className="flex gap-6 text-sm text-muted-foreground items-center">
        <Link href="/" className="hover:text-primary transition-colors font-medium">Homepage</Link>
        <Link href="/contact" className="hover:text-primary transition-colors font-medium">Contact</Link>
        <Link href="/saved" className="hover:text-primary transition-colors font-medium">Saved listings</Link>
        <div className="w-px h-4 bg-border mx-2"></div>
        {user ? (
          <>
            <button 
              onClick={() => logoutUser()} 
              className="hover:text-red-500 text-red-500/80 transition-colors font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-primary transition-colors font-medium">Sign In</Link>
            <Link href="/signup" className="hover:text-primary transition-colors font-medium text-white">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
