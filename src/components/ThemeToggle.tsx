"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    // Return placeholder with same dimensions to avoid layout shift during SSR hydration
    return (
      <button
        type="button"
        disabled
        className={`w-9 h-9 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground opacity-50 ${className}`}
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/80 hover:bg-muted text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95 ${
        showLabel ? "px-3 py-2 text-xs font-medium w-full" : "w-9 h-9"
      } ${className}`}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
      {showLabel && (
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      )}
    </button>
  );
}
