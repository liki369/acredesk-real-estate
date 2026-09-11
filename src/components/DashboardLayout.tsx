"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building, 
  LogOut,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { logoutUser, logoutAdmin } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const homeHref = isAdmin ? "/admin/dashboard" : "/dashboard";

  const navigation = [
    { name: "CRM Dashboard", href: isAdmin ? "/admin/dashboard" : "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: isAdmin ? "/admin/inventory" : "/dashboard/inventory", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-5 border-b border-border justify-between">
            <Link href={homeHref} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
                <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
                <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
                <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
              </div>
              <div className="font-bold text-xl tracking-tight text-foreground">
                Acre<span className="text-primary">Desk</span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5">
              {/* Desktop/Sidebar Theme Toggle */}
              <ThemeToggle className="hidden lg:inline-flex" />

              <button 
                type="button"
                className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg" 
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="px-5 py-2.5 border-b border-border bg-red-500/10 flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Superadmin Console</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-border/60">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Website</span>
              </Link>
            </div>
          </nav>

          {/* Mobile Theme Switcher inside Drawer */}
          <div className="px-4 py-3 border-t border-border lg:hidden flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Appearance</span>
            <ThemeToggle showLabel={false} />
          </div>

          {/* User Section & Logout */}
          <div className="p-4 border-t border-border bg-card/50">
            <form action={isAdmin ? logoutAdmin : logoutUser}>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Topbar */}
        <div className="lg:hidden h-16 border-b border-border bg-card/85 backdrop-blur-md flex items-center px-4 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg border border-border bg-background focus:outline-none" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href={homeHref} className="font-bold text-lg text-foreground tracking-tight">
              Acre<span className="text-primary">Desk</span>
            </Link>
          </div>

          {/* Right side controls on mobile console topbar: Theme Toggle & Quick Logout */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Quick 1-tap mobile Sign Out button */}
            <form action={isAdmin ? logoutAdmin : logoutUser}>
              <button 
                type="submit" 
                title="Sign Out"
                aria-label="Sign Out"
                className="w-9 h-9 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors focus:outline-none active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
