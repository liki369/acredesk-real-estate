"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { logoutUser, logoutAdmin } from "@/app/actions/auth";

export default function DashboardLayout({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "CRM Dashboard", href: isAdmin ? "/admin/dashboard" : "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: isAdmin ? "/admin/inventory" : "/dashboard/inventory", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden" 
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
          <div className="h-16 flex items-center px-6 border-b border-border justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
                <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
                <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
                <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
              </div>
              <div className="font-bold text-xl tracking-tight text-white">
                Acre<span className="text-primary">Desk</span>
              </div>
            </Link>
            <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {isAdmin && (
            <div className="px-6 py-3 border-b border-border bg-red-500/10">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Superadmin Level</span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-white"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section & Logout */}
          <div className="p-4 border-t border-border">
            <form action={isAdmin ? logoutAdmin : logoutUser}>
              <button 
                type="submit" 
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Topbar */}
        <div className="lg:hidden h-16 border-b border-border bg-card flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="text-muted-foreground hover:text-white" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-lg text-white">
              Acre<span className="text-primary">Desk</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
