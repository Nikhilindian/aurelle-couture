import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Truck, ShieldCheck, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function ShippingPolicyPage() {
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
          <span className="text-aurelle-ink font-semibold">Shipping &amp; Dispatch Policy</span>
        </nav>

        <div className="max-w-3xl space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-1">
              Atelier Logistics
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink">
              Shipping &amp; Delivery Standards
            </h1>
            <p className="text-xs text-aurelle-muted mt-2 font-sans">
              Last updated: Autumn Edit 2026 • Verified Pan-India Air Transit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-white border border-aurelle-border">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal block">
                Pan-India Air
              </span>
              <p className="text-xs text-aurelle-muted">
                BlueDart Express air courier on all domestic orders.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal block">
                Transit Insurance
              </span>
              <p className="text-xs text-aurelle-muted">
                100% insured against loss, transit damage, or weather.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal block">
                Complimentary Shipping
              </span>
              <p className="text-xs text-aurelle-muted">
                Free shipping on all orders exceeding ₹5,000.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-aurelle-charcoal leading-relaxed font-sans divide-y divide-aurelle-border/60">
            <div className="pt-6 first:pt-0 space-y-2">
              <h2 className="font-serif text-lg text-aurelle-ink">
                1. Dispatch Timelines by Silhouette
              </h2>
              <p>
                Each creation at Aurelle is individually inspected at our Varanasi or Delhi atelier prior to packaging:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-aurelle-charcoal">
                <li>
                  <strong>Unstitched Sarees &amp; Ready-to-Ship Kurtas:</strong> Dispatched within 24 to 48 hours of order confirmation.
                </li>
                <li>
                  <strong>Pre-Ordered Weaves &amp; Dupattas:</strong> Loom completion and finishing takes 7 to 10 working days.
                </li>
                <li>
                  <strong>Bespoke Bridal Lehengas &amp; Made-to-Measure Blouses:</strong> Require 3 to 4 weeks for artisan zardozi hand embroidery and personalized fitting.
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-serif text-lg text-aurelle-ink">
                2. Shipping Charges &amp; Cash on Delivery (COD)
              </h2>
              <p>
                Orders totaling <strong>₹5,000 or above</strong> qualify for complimentary express air dispatch throughout India. For orders below this threshold, a nominal handling and air courier fee of <strong>₹250</strong> is applied at checkout.
              </p>
              <p>
                <strong>Cash on Delivery (COD)</strong> is available across all serviceable Indian postal PIN codes with zero additional transaction surcharges.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-serif text-lg text-aurelle-ink">
                3. Signature Tamper-Evident Packaging
              </h2>
              <p>
                All silk sarees and couture ensembles are wrapped in pure breathable cotton muslin cloth to safeguard delicate silver and gold zari, enclosed inside a rigid luxury Aurelle presentation box, and sealed in tamper-evident security air bags.
              </p>
              <p className="text-aurelle-burgundy font-medium">
                Important: If the outer security tape appears cut, compromised, or resealed upon delivery, please refuse receipt and contact our concierge immediately.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
