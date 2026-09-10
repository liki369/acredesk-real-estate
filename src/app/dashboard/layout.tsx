import DashboardLayout from "@/components/DashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealer Portal | AcreDesk",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
