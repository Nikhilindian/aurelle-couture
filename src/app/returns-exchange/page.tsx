import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { RotateCcw, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function ReturnsExchangePage() {
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
          <span className="text-aurelle-ink font-semibold">Returns &amp; Heirloom Exchange</span>
        </nav>

        <div className="max-w-3xl space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-1">
              Patron Guarantee
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink">
              Returns &amp; Exchanges Policy
            </h1>
            <p className="text-xs text-aurelle-muted mt-2 font-sans">
              7-Day Complimentary Exchange Window • Complimentary Reverse Air Pickup
            </p>
          </div>

          <div className="p-5 bg-white border border-aurelle-border space-y-2">
            <h3 className="font-serif text-base text-aurelle-ink">
              Our 7-Day Exchange Promise
            </h3>
            <p className="text-xs text-aurelle-charcoal leading-relaxed">
              We want your festive drape to be an effortless heirloom experience. If you are not completely enchanted by your unstitched saree or standard kurta set, we offer a complimentary 7-day exchange window with reverse air courier collection from your doorstep.
            </p>
          </div>

          <div className="space-y-6 text-xs text-aurelle-charcoal leading-relaxed font-sans divide-y divide-aurelle-border/60">
            <div className="pt-6 first:pt-0 space-y-2">
              <h2 className="font-serif text-lg text-aurelle-ink">
                1. Eligible Categories for Exchange
              </h2>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong>Unstitched Banarasi Sarees &amp; Dupattas:</strong> Eligible for full exchange or store credit provided the blouse piece has not been cut or stitched, and the Silk Mark holographic tag remains attached.
                </li>
                <li>
                  <strong>Standard Kurta Sets (XS to XL):</strong> Eligible for size exchange or variant swap within 7 days of delivery.
                </li>
                <li>
                  <strong>Custom Tailored Blouses &amp; Bespoke Lehengas:</strong> Due to individual measurement customisation, made-to-measure pieces cannot be returned for cash refund, but are eligible for 1 complimentary alteration by our master tailor.
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-serif text-lg text-aurelle-ink">
                2. Reverse Air Courier Collection
              </h2>
              <p>
                To initiate an exchange, please contact our concierge at <span className="font-semibold text-aurelle-burgundy">concierge@aurelle.in</span> or WhatsApp with your order reference. Our team will schedule an insured BlueDart reverse pickup within 24 hours.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-serif text-lg text-aurelle-ink">
                3. Refund Processing
              </h2>
              <p>
                Upon receipt of the returned piece at our atelier and verification by our craft inspector, your refund or store credit voucher will be issued within 3 business days. For Cash on Delivery orders, refunds are credited directly to your verified bank account via IMPS/NEFT.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
