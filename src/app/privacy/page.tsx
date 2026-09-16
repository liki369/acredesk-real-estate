/*
 * © 2026 AcreDesk™. All Rights Reserved.
 *
 * This source code and associated platform assets are the proprietary property of AcreDesk.
 * Unauthorized copying, scraping, modification, or distribution is strictly prohibited.
 */

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ShieldCheck, Lock, Eye, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | AcreDesk™",
  description: "Privacy policy, data protection standards, and security protocols of the AcreDesk real estate platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Data Protection &amp; Confidentiality
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective Date: March 1, 2026 &bull; Last Revised: September 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="prose dark:prose-invert max-w-none space-y-10 text-foreground">
          <div className="p-4 rounded-xl border border-border bg-card/40 flex items-start gap-3 text-sm">
            <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">
              At AcreDesk, we treat property owner confidentiality, buyer inquiries, and transaction telemetry with utmost security. This Privacy Policy details how we collect, use, and protect your personal data when you interact with our services.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">01.</span> Information We Collect
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information to facilitate property discovery, buyer-broker communications, and authenticated portal access:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Contact Inquiries:</strong> Name, phone number, email address, and specific interest details submitted via property contact or lead forms.</li>
              <li><strong className="text-foreground">Authentication Data:</strong> Login credentials, encrypted passwords, and session tokens for registered users and verified administrators.</li>
              <li><strong className="text-foreground">Platform Telemetry:</strong> Device types, browser signatures, and anonymized access logs to prevent malicious scraping and safeguard infrastructure.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">02.</span> How We Use Your Data
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg border border-border bg-card/30 space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Direct Communication
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connecting interested buyers with verified AcreDesk sales representatives regarding requested properties.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/30 space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Lead Management &amp; CRM
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enabling authorized brokers and administrators to follow up on client schedules, site visits, and transactions.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/30 space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Fraud &amp; Abuse Prevention
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Detecting and blocking unauthorized automated bots, scraping tools, and credential stuffing attacks.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/30 space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Service Reliability
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Optimizing mobile and desktop interfaces, database performance, and UI responsiveness.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 - No Sale */}
          <section className="space-y-3 p-6 rounded-xl border border-border bg-card/40">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span className="text-primary text-sm font-mono mr-2">03.</span>
              We Do Not Sell Your Personal Data
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AcreDesk does not sell, rent, license, or trade your personal data, customer contact lists, or deal correspondence to third-party data brokers, advertising aggregators, or marketing networks.
            </p>
          </section>

          {/* Section 4 - Storage and Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">04.</span> Data Security &amp; Storage
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We employ enterprise-grade security protocols, including TLS encryption in transit, row-level security policies (RLS) on PostgreSQL databases, and role-based access control (RBAC). Access to user contact details and lead notes is restricted strictly to authorized CRM administrators.
            </p>
          </section>

          {/* Section 5 - Rights & Contact */}
          <section className="p-6 rounded-xl border border-border bg-card/30 space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Your Rights &amp; Privacy Requests
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You may request access to, correction of, or permanent deletion of your contact records at any time by contacting our privacy compliance desk:
            </p>
            <div className="text-sm font-medium text-foreground">
              <p>AcreDesk Privacy Officer</p>
              <p className="text-muted-foreground">Email: <Link href="mailto:privacy@acredesk.com" className="text-primary underline">privacy@acredesk.com</Link></p>
              <p className="text-muted-foreground">General Help: <Link href="/contact" className="text-primary underline">AcreDesk Desk Support</Link></p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
