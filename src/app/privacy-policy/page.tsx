import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-aurelle-ivory min-h-screen py-10 sm:py-16 text-left">
      <Container size="default">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-aurelle-muted mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-aurelle-burgundy transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-aurelle-ink font-semibold">Privacy Policy</span>
        </nav>

        <div className="max-w-3xl space-y-6 text-xs text-aurelle-charcoal leading-relaxed font-sans">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-1">
              Data Governance &amp; Patron Trust
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink">
              Privacy &amp; Data Protection Policy
            </h1>
            <p className="text-xs text-aurelle-muted mt-2">
              In accordance with the Digital Personal Data Protection (DPDP) Act 2023 of India.
            </p>
          </div>

          <div className="p-4 bg-white border border-aurelle-border space-y-2">
            <h3 className="font-serif text-sm font-semibold text-aurelle-ink">
              Core Privacy Commitment
            </h3>
            <p>
              Aurelle Couture Private Limited respects your discretion. We collect only the information necessary to fulfill your couture orders, authenticate delivery, and provide bespoke concierge service. We never sell, lease, or monetize patron information to third-party ad networks.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-aurelle-border">
            <h2 className="font-serif text-base text-aurelle-ink">1. Information Collected</h2>
            <p>
              When placing an order or registering an account, we record your name, delivery address, contact telephone, and email. For customized orders, blouse stitch measurements submitted by you are stored securely in your private customer vault.
            </p>

            <h2 className="font-serif text-base text-aurelle-ink pt-2">2. Payment &amp; Card Security</h2>
            <p>
              We operate on an authoritative server architecture. No debit/credit card numbers or CVVs are processed or stored on our servers. For Cash on Delivery orders, transactions are settled upon handover with official courier receipts.
            </p>

            <h2 className="font-serif text-base text-aurelle-ink pt-2">3. Data Retention &amp; Rights</h2>
            <p>
              You maintain the absolute right to inspect, correct, or request deletion of your account profile and saved shipping addresses at any time via your account portal or by emailing <span className="text-aurelle-burgundy font-semibold">privacy@aurelle.in</span>.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
