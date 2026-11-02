import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function TermsOfServicePage() {
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
          <span className="text-aurelle-ink font-semibold">Terms of Service</span>
        </nav>

        <div className="max-w-3xl space-y-6 text-xs text-aurelle-charcoal leading-relaxed font-sans">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-1">
              Legal Framework
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink">
              Terms &amp; Conditions of Sale
            </h1>
            <p className="text-xs text-aurelle-muted mt-2">
              Governing purchases on aurelle.in • Jurisdiction: New Delhi, India
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-aurelle-border">
            <h2 className="font-serif text-base text-aurelle-ink">1. Pure Handloom Variation Notice</h2>
            <p>
              Due to the authentic handmade nature of pit-loom Varanasi weaving, subtle nuances in zari slub, thread density, and hand-dye saturation are hallmarks of genuine artisan craftsmanship rather than defects.
            </p>

            <h2 className="font-serif text-base text-aurelle-ink pt-2">2. Pricing &amp; Currency</h2>
            <p>
              All prices displayed on this storefront are in Indian Rupees (INR) and are computed in integer paise standards. Prices are inclusive of applicable Goods and Services Tax (GST).
            </p>

            <h2 className="font-serif text-base text-aurelle-ink pt-2">3. Intellectual Property</h2>
            <p>
              All textile designs, photography, artisan chronicles, and trademarks displayed on this domain are the exclusive intellectual property of AURELLE Couture Private Limited or our accredited weaver cooperatives. Unauthorized reproduction is strictly prohibited.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
