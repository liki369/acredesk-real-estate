/*
 * © 2026 AcreDesk™. All Rights Reserved.
 *
 * This source code and associated platform assets are the proprietary property of AcreDesk.
 * Unauthorized copying, scraping, modification, or distribution is strictly prohibited.
 */

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ShieldCheck, Lock, AlertTriangle, Scale, FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service | AcreDesk™",
  description: "Terms of Service, Intellectual Property policies, and user agreements for the AcreDesk real estate platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Breadcrumb / Top label */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5" />
            Legal Notice & Binding Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective Date: March 1, 2026 &bull; Last Revised: September 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="prose dark:prose-invert max-w-none space-y-10 text-foreground">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 flex items-start gap-3 text-sm">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">
              Please read these Terms of Service carefully before utilizing AcreDesk (&ldquo;the Platform&rdquo;). By accessing or using our websites, software, APIs, database directories, or associated services, you agree to be bound by all provisions herein. If you disagree, you must immediately terminate use.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">01.</span> Acceptance and Scope of Agreement
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Agreement constitutes a legally binding contract between you (whether an individual user, agent, broker, enterprise partner, or legal entity) and AcreDesk (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Accessing, browsing, creating an account, querying listings, submitting inquiries, or interacting with any endpoint confirms your unqualified assent to these Terms.
            </p>
          </section>

          {/* Section 2 - Intellectual Property */}
          <section id="intellectual-property" className="space-y-4 p-6 rounded-xl border border-border bg-card/40">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Lock className="w-4 h-4" />
              <h2 className="text-xl font-bold text-foreground">
                <span className="text-primary text-sm font-mono mr-2">02.</span>
                Intellectual Property Ownership &amp; Copyright Notice
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The entire platform &mdash; including but not limited to all source code, software architecture, databases, user interfaces, visual design systems, icons, graphics, algorithms, CRM features, workflows, and text &mdash; is the exclusive proprietary property of AcreDesk and is protected by international copyright laws, trademark legislation, and trade secret protections.
            </p>
            <div className="p-3.5 rounded-lg bg-background border border-border text-xs font-mono text-foreground space-y-1">
              <p className="font-bold text-primary">&copy; 2026 AcreDesk&trade;. All Rights Reserved.</p>
              <p className="text-muted-foreground">
                AcreDesk&trade;, the AcreDesk logo monogram, and all associated service marks are trademarks of the Company. You may not display, alter, or reproduce our trademarks without express prior written consent.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nothing in these Terms or on the Platform grants you any transfer of ownership, assignment of copyright, or license beyond the strictly revocable access detailed below.
            </p>
          </section>

          {/* Section 3 - Anti-Scraping & Reverse Engineering */}
          <section id="prohibited-conduct" className="space-y-4 p-6 rounded-xl border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-2 text-red-500 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="text-xl font-bold text-foreground">
                <span className="text-red-500 text-sm font-mono mr-2">03.</span>
                Prohibited Conduct: Anti-Scraping &amp; Anti-Cloning Policy
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To safeguard property seller confidentiality, broker trust, and our proprietary indexing algorithms, you are expressly prohibited from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Automated Scraping:</strong> Deploying bots, spiders, scrapers, crawlers, harvest scripts, or automated extraction tools against any page, API, or data feed on AcreDesk.</li>
              <li><strong className="text-foreground">Reverse Engineering:</strong> Decompiling, disassembling, reverse engineering, or attempting to discover source code or database schemas.</li>
              <li><strong className="text-foreground">AI Training &amp; Ingestion:</strong> Ingesting platform content, property descriptions, or imagery into generative AI models, large language models (LLMs), or competitive datasets.</li>
              <li><strong className="text-foreground">Framing &amp; Mirroring:</strong> Framing, mirroring, or republishing AcreDesk or any portion thereof without written authorization.</li>
              <li><strong className="text-foreground">Circumventing Security:</strong> Bypassing rate limits, authentication tokens, robot exclusion protocols, or proxy protections.</li>
            </ul>
          </section>

          {/* Section 4 - Limited License */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">04.</span> Limited User License
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subject to continuous compliance with these Terms, AcreDesk grants you a revocable, non-exclusive, non-transferable, limited license to view property listings, submit legitimate customer inquiries, and utilize CRM portal tools solely for bona fide real estate transactions. Any unauthorized commercial exploitation, resale, or sublicensing immediately terminates this license.
            </p>
          </section>

          {/* Section 5 - Accounts and Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">05.</span> Account Authentication &amp; Responsibilities
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users registered on the Platform are responsible for safeguarding their login credentials. Any activity executed under your credentials is your legal responsibility. You agree to notify AcreDesk immediately upon suspecting any breach or unauthorized access. AcreDesk reserves the right to terminate accounts that violate community rules or breach security policies.
            </p>
          </section>

          {/* Section 6 - Listings and Disclaimers */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">06.</span> Listing Accuracy &amp; Diligence Disclaimer
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              While AcreDesk strives for verified documentation and accurate plot listings, all properties, dimensions, boundary coordinates, and pricing details are subject to on-ground verification, municipal approvals, and independent legal title search. AcreDesk provides the Platform on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind.
            </p>
          </section>

          {/* Section 7 - Enforceability & Legal Remedies */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary text-sm font-mono">07.</span> Enforceability, Injunctive Relief &amp; Damages
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Any infringement of AcreDesk intellectual property causes immediate, irreparable damage for which monetary relief is inadequate. AcreDesk shall be entitled to seek immediate injunctive and equitable relief in any court of competent jurisdiction, alongside statutory copyright damages, attorney&rsquo;s fees, and full compensation for commercial misappropriation.
            </p>
          </section>

          {/* Section 8 - Contact */}
          <section className="p-6 rounded-xl border border-border bg-card/30 space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Legal Inquiries &amp; Notices
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For intellectual property claims, DMCA notices, licensing inquiries, or legal correspondence, please contact:
            </p>
            <div className="text-sm font-medium text-foreground">
              <p>AcreDesk Legal &amp; Compliance</p>
              <p className="text-muted-foreground">Email: <Link href="mailto:legal@acredesk.com" className="text-primary underline">legal@acredesk.com</Link></p>
              <p className="text-muted-foreground">Platform Support: <Link href="/contact" className="text-primary underline">Contact Sales &amp; Admin Desk</Link></p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
