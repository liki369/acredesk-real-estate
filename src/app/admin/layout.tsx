"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Do not wrap login/signup/forgot-password pages inside the Dashboard Layout
  if (pathname === "/admin/login" || pathname === "/admin/signup" || pathname === "/admin/forgot-password") {
    return <>{children}</>;
  }

  return <DashboardLayout isAdmin={true}>{children}</DashboardLayout>;
}
