"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Lock, Scale } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const isConsole = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin/dashboard") || pathname?.startsWith("/admin/inventory");

  if (isConsole) {
    return null;
  }
  return (
    <footer className="w-full border-t border-border bg-card/60 text-foreground transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group select-none">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
                <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute top-1.5 left-1.5 border-r-0 border-b-0" />
                <div className="w-4 h-4 border-[2.5px] border-background rounded-[3px] absolute bottom-1.5 right-1.5 border-l-0 border-t-0" />
                <div className="w-1.5 h-1.5 bg-background absolute rounded-[1px]" />
              </div>
              <div className="font-bold text-xl tracking-tight text-foreground">
                Acre<span className="text-primary">Desk</span>
                <span className="text-[10px] align-super text-muted-foreground ml-1 font-mono font-normal">TM</span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Every plot and property, held on one desk. A centralized real estate platform uniting verified plot inventory, direct deal management, and title diligence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Title Diligence
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary font-medium">
                <Lock className="w-3.5 h-3.5" />
                Proprietary Architecture
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Browse Listings</Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-primary transition-colors">Saved Listings</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact Sales Desk</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  <span>CRM Admin Portal</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">Restricted</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-primary" />
              Legal & Compliance
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors font-medium text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms#intellectual-property" className="hover:text-primary transition-colors">
                  Intellectual Property
                </Link>
              </li>
              <li>
                <Link href="/terms#prohibited-conduct" className="hover:text-primary transition-colors">
                  Anti-Scraping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Formal Copyright */}
        <div className="border-t border-border pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              &copy; {new Date().getFullYear()} AcreDesk&trade;. All Rights Reserved.
            </p>
            <p className="text-[11px] text-muted-foreground">
              AcreDesk&trade; and the monogram mark are proprietary trademarks.
            </p>
          </div>

          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
            All content, database structures, UI components, images, source code, and design architecture on AcreDesk are protected under statutory copyright, trademark, and unfair competition laws. Unauthorized copying, crawling, automated scraping, reproduction, framing, or reverse engineering of any code or listing data is strictly prohibited and subject to civil and criminal prosecution.
          </p>
        </div>
      </div>
    </footer>
  );
}
