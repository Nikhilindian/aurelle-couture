"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export interface TrackingStep {
  title: string;
  desc: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [phoneOrEmail, setPhoneOrEmail] = React.useState("");
  const [isSearched, setIsSearched] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Simulated live tracking result
  const [trackedOrder, setTrackedOrder] = React.useState<{
    orderNumber: string;
    placedAt: string;
    recipientName: string;
    city: string;
    status: string;
    courierName: string;
    awbNumber: string;
    estimatedDelivery: string;
    items: { title: string; fabric: string; color: string; pricePaise: number }[];
    steps: TrackingStep[];
  } | null>(null);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOrder = orderNumber.trim().toUpperCase();
    if (!cleanOrder) {
      setErrorMsg("Please enter your Order Number (e.g. AUR-2611-79E94D).");
      return;
    }

    // Generate realistic atelier tracking status
    const today = new Date();
    const placedDate = new Date(today);
    placedDate.setDate(today.getDate() - 2);

    const estDate = new Date(today);
    estDate.setDate(today.getDate() + 2);

    setTrackedOrder({
      orderNumber: cleanOrder,
      placedAt: placedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      recipientName: "Patron Recipient",
      city: "New Delhi / NCR",
      status: "In Transit via BlueDart Air Express",
      courierName: "BlueDart Air Express",
      awbNumber: "BLU-8849" + Math.floor(1000 + Math.random() * 9000),
      estimatedDelivery: estDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      items: [
        {
          title: "Gulbagh Crimson Katan Saree",
          fabric: "100% Pure Mulberry Silk • Kadwa Weave",
          color: "Crimson Red",
          pricePaise: 2850000,
        },
      ],
      steps: [
        {
          title: "Order Confirmed & Logged",
          desc: "Cash on Delivery booking authorized. Weave master assigned.",
          date: placedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ", 11:30 AM",
          isCompleted: true,
          isCurrent: false,
        },
        {
          title: "Artisan Quality & Silk Mark Inspection",
          desc: "Zari density verified against Varanasi handloom standards.",
          date: placedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ", 04:45 PM",
          isCompleted: true,
          isCurrent: false,
        },
        {
          title: "Atelier Velvet Packaging & Tamper Seal",
          desc: "Packed with heirloom muslin wrap in signature burgundy box.",
          date: "Yesterday, 02:15 PM",
          isCompleted: true,
          isCurrent: false,
        },
        {
          title: "Dispatched via Air Courier",
          desc: "En route to destination delivery hub via BlueDart Air.",
          date: "Today, 08:30 AM",
          isCompleted: false,
          isCurrent: true,
        },
        {
          title: "Out for Doorstep Handover",
          desc: "Courier associate will arrive with official COD receipt.",
          date: "Pending delivery scan",
          isCompleted: false,
          isCurrent: false,
        },
      ],
    });

    setIsSearched(true);
  };

  const handleUseDemoOrder = () => {
    setOrderNumber("AUR-2611-79E94D");
    setPhoneOrEmail("patron@aurelle.in");
  };

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
          <span className="text-aurelle-ink font-semibold">Track Atelier Order</span>
        </nav>

        {/* Header */}
        <div className="max-w-xl mx-auto text-center space-y-3 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block">
            Real-Time Courier &amp; Loom Status
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink">
            Track Your Creation
          </h1>
          <p className="text-xs sm:text-sm text-aurelle-muted leading-relaxed font-sans">
            Enter your Aurelle Order Reference to inspect real-time loom preparation, quality certification, and BlueDart Air dispatch milestones.
          </p>
        </div>

        {/* Tracking Lookup Box */}
        <div className="max-w-xl mx-auto bg-white border border-aurelle-border p-6 sm:p-8 shadow-sm mb-12">
          <form onSubmit={handleSearchOrder} className="space-y-4">
            <div>
              <label
                htmlFor="orderNumberInput"
                className="block text-xs uppercase tracking-wider font-semibold text-aurelle-charcoal mb-1"
              >
                Order Number
              </label>
              <Input
                id="orderNumberInput"
                placeholder="e.g., AUR-2611-79E94D"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label
                htmlFor="phoneEmailInput"
                className="block text-xs uppercase tracking-wider font-semibold text-aurelle-charcoal mb-1"
              >
                Phone or Email (Optional)
              </label>
              <Input
                id="phoneEmailInput"
                placeholder="Enter 10-digit phone or email"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="text-xs"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="burgundy"
              size="lg"
              className="w-full tracking-widest text-xs uppercase flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Dispatch Status</span>
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-4 pt-4 border-t border-aurelle-border/60 flex items-center justify-between text-[11px] text-aurelle-muted">
            <span>Don&apos;t have your order code handy?</span>
            <button
              type="button"
              onClick={handleUseDemoOrder}
              className="text-aurelle-burgundy font-semibold hover:underline cursor-pointer"
            >
              Fill Demo Reference
            </button>
          </div>
        </div>

        {/* Tracked Results View */}
        {isSearched && trackedOrder && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Summary Card */}
            <div className="bg-white border border-aurelle-border p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-aurelle-border">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-aurelle-muted block">
                    Order Reference
                  </span>
                  <span className="font-mono font-bold text-base text-aurelle-ink">
                    {trackedOrder.orderNumber}
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-aurelle-muted block">
                    Courier Partner
                  </span>
                  <span className="text-xs font-semibold text-aurelle-charcoal flex items-center gap-1 sm:justify-end">
                    <Truck className="w-3.5 h-3.5 text-aurelle-burgundy" />
                    <span>{trackedOrder.courierName}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-aurelle-muted block text-[11px]">Booking Date:</span>
                  <span className="font-medium text-aurelle-charcoal">{trackedOrder.placedAt}</span>
                </div>
                <div>
                  <span className="text-aurelle-muted block text-[11px]">Air Waybill (AWB):</span>
                  <span className="font-mono font-medium text-aurelle-charcoal">{trackedOrder.awbNumber}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-aurelle-muted block text-[11px]">Estimated Handover:</span>
                  <span className="font-semibold text-emerald-800">{trackedOrder.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="bg-white border border-aurelle-border p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-lg text-aurelle-ink pb-2 border-b border-aurelle-border flex items-center gap-2">
                <Clock className="w-4 h-4 text-aurelle-gold" />
                <span>Dispatch &amp; Loom Progress</span>
              </h3>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-aurelle-border">
                {trackedOrder.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        step.isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : step.isCurrent
                          ? "bg-aurelle-burgundy border-aurelle-burgundy ring-4 ring-aurelle-burgundy/20"
                          : "bg-white border-aurelle-border"
                      }`}
                    >
                      {step.isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>

                    {/* Step Text */}
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            step.isCurrent
                              ? "text-aurelle-burgundy"
                              : step.isCompleted
                              ? "text-aurelle-ink"
                              : "text-aurelle-muted"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-aurelle-muted font-sans">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-aurelle-muted leading-relaxed font-sans">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Concierge Assistance? */}
            <div className="p-4 bg-aurelle-sand/50 border border-aurelle-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-aurelle-charcoal">
                <HelpCircle className="w-4 h-4 text-aurelle-burgundy shrink-0" />
                <span>Need delivery reschedule or personalized fitting guidance?</span>
              </div>
              <a
                href="https://wa.me/919876543210?text=Hello%20Aurelle%20Concierge,%20inquiring%20about%20order"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-aurelle-burgundy font-semibold uppercase tracking-wider hover:underline shrink-0"
              >
                Contact Concierge →
              </a>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
