"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  PackageCheck,
  Printer,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Banknote,
  FileText,
} from "lucide-react";

interface OrderReceiptData {
  id: string;
  publicOrderNumber: string;
  createdAt: string;
  currency: string;
  subtotalPaise: number;
  shippingPaise: number;
  discountPaise: number;
  totalPaise: number;
  paymentMethod: "COD";
  paymentStatus: "pending";
  fulfillmentStatus: "unfulfilled";
  shippingAddress: {
    recipientName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderNotes?: string;
  couponCode: string | null;
  items: Array<{
    productId: string;
    title: string;
    sku: string;
    color: string;
    size: string;
    pricePaise: number;
    quantity: number;
    subtotalPaise: number;
    image: string;
  }>;
  isDatabaseConnected: boolean;
}

export default function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [order, setOrder] = React.useState<OrderReceiptData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUnauthorized, setIsUnauthorized] = React.useState(false);

  React.useEffect(() => {
    async function fetchReceipt() {
      try {
        const query = token ? `?token=${encodeURIComponent(token)}` : "";
        const res = await fetch(`/api/checkout/order/${orderId}${query}`);
        const data = await res.json();

        if (res.status === 404 || !data.success) {
          setIsUnauthorized(true);
        } else {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Receipt fetch error:", err);
        setIsUnauthorized(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReceipt();
  }, [orderId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aurelle-cream/30 py-20">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-10 h-10 border-2 border-aurelle-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-aurelle-ink text-lg">
              Retrieving your sealed acquisition receipt...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  // Security Protection: Never expose someone else's order
  if (isUnauthorized || !order) {
    return (
      <div className="min-h-screen bg-aurelle-cream/30 py-20">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white p-8 md:p-10 border border-aurelle-border shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-2xl text-aurelle-ink">
                Protected Order Receipt
              </h1>
              <p className="text-xs text-aurelle-muted leading-relaxed">
                Order details are strictly confidential and protected by session ownership. If you placed this order, please ensure you access the link from the confirmation session or sign in to your registered account.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/account"
                className="w-full py-3 bg-aurelle-burgundy text-aurelle-cream text-xs uppercase tracking-luxury hover:bg-aurelle-gold hover:text-aurelle-ink transition-colors font-medium text-center"
              >
                Sign In to Account
              </Link>
              <Link
                href="/"
                className="w-full py-3 border border-aurelle-border text-aurelle-ink text-xs uppercase tracking-luxury hover:bg-aurelle-cream/30 transition-colors text-center"
              >
                Return to Atelier Home
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-aurelle-cream/30 py-6 sm:py-10 md:py-16 print:bg-white print:py-0">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Header Banner */}
          <div className="bg-white border border-aurelle-border p-5 sm:p-8 md:p-10 text-center shadow-sm space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-aurelle-gold uppercase font-semibold">
                Acquisition Confirmed
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-aurelle-ink">
                Thank You, {order.shippingAddress.recipientName.split(" ")[0]}
              </h1>
              <p className="text-xs text-aurelle-muted leading-relaxed">
                Your bespoke heirloom has been reserved in our Varanasi atelier. A confirmation notice has been dispatched to{" "}
                <strong className="text-aurelle-ink break-all">{order.shippingAddress.email}</strong>.
              </p>
            </div>

            {/* Opaque Order Identifiers */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
              <div className="px-3 py-1.5 bg-aurelle-cream/40 border border-aurelle-border text-aurelle-ink">
                <span className="text-aurelle-muted mr-1">Order:</span>
                <span className="font-mono font-semibold text-aurelle-burgundy">
                  {order.publicOrderNumber}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-aurelle-cream/40 border border-aurelle-border text-aurelle-ink">
                <span className="text-aurelle-muted mr-1">Date:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                <span>Payment: Cash on Delivery</span>
              </div>
            </div>

            {/* Action Buttons (Hidden on Print) */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-aurelle-border bg-white text-xs text-aurelle-ink hover:border-aurelle-gold transition-colors font-medium tracking-wider uppercase min-h-[40px]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <Link
                href="/account"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-aurelle-burgundy text-aurelle-cream text-xs hover:bg-aurelle-gold hover:text-aurelle-ink transition-colors font-medium tracking-luxury uppercase min-h-[40px]"
              >
                <span>View in Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Delivery & Payment Logistics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Shipping Address Snapshot */}
            <div className="bg-white p-4 sm:p-6 border border-aurelle-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-aurelle-border pb-3">
                <MapPin className="w-4 h-4 text-aurelle-gold" />
                <h3 className="font-serif text-base text-aurelle-ink">Delivery Address</h3>
              </div>
              <div className="text-xs text-aurelle-ink space-y-1">
                <p className="font-semibold text-sm">{order.shippingAddress.recipientName}</p>
                <p className="text-aurelle-muted">{order.shippingAddress.phone}</p>
                <p className="text-aurelle-muted">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-aurelle-muted">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-aurelle-muted">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </p>
                <p className="text-aurelle-muted font-medium">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment & Dispatch Status */}
            <div className="bg-white p-4 sm:p-6 border border-aurelle-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-aurelle-border pb-3">
                <Banknote className="w-4 h-4 text-aurelle-gold" />
                <h3 className="font-serif text-base text-aurelle-ink">Payment & Delivery Status</h3>
              </div>
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-aurelle-muted">Payment Mode:</span>
                  <span className="font-medium text-aurelle-ink">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aurelle-muted">Payment Status:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-semibold text-[10px] uppercase tracking-wider">
                    To Collect on Delivery
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aurelle-muted">Estimated Delivery:</span>
                  <span className="font-medium text-aurelle-ink">4–6 Business Days</span>
                </div>
                <div className="p-2.5 bg-aurelle-cream/30 border border-aurelle-border text-[11px] text-aurelle-muted mt-2">
                  <span className="font-medium text-aurelle-ink block mb-0.5">Atelier Inspection Seal:</span>
                  Please check the wax seal on arrival. You may pay with cash or direct UPI on delivery.
                </div>
              </div>
            </div>
          </div>

          {/* Optional Atelier Notes */}
          {order.orderNotes && (
            <div className="bg-white p-4 sm:p-6 border border-aurelle-border shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-aurelle-burgundy text-xs font-semibold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Customer Instructions & Notes</span>
              </div>
              <p className="text-xs text-aurelle-ink bg-aurelle-cream/20 p-3 border border-aurelle-border/60 italic leading-relaxed">
                &ldquo;{order.orderNotes}&rdquo;
              </p>
            </div>
          )}

          {/* Ordered Items Table */}
          <div className="bg-white p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-sm space-y-6">
            <h3 className="font-serif text-lg sm:text-xl text-aurelle-ink border-b border-aurelle-border pb-3">
              Acquisition Details ({order.items.length} {order.items.length === 1 ? "Item" : "Items"})
            </h3>

            <div className="divide-y divide-aurelle-border/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex gap-3 sm:gap-4 text-xs">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-18 sm:w-16 sm:h-20 object-cover bg-aurelle-cream/40 border border-aurelle-border shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-serif text-sm font-semibold text-aurelle-ink">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-aurelle-muted">
                      SKU: <span className="font-mono">{item.sku}</span>
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-aurelle-muted">
                      <span>Color: {item.color}</span>
                      <span>•</span>
                      <span>Size: {item.size}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-aurelle-muted">
                        Qty: {item.quantity} × {formatPrice(item.pricePaise)}
                      </span>
                      <span className="font-medium text-aurelle-ink font-mono text-sm">
                        {formatPrice(item.subtotalPaise)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-aurelle-border space-y-2 text-xs">
              <div className="flex justify-between text-aurelle-muted">
                <span>Subtotal (Authoritative):</span>
                <span className="text-aurelle-ink font-mono font-medium">
                  {formatPrice(order.subtotalPaise)}
                </span>
              </div>

              {order.discountPaise > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>
                    Privilege Code Discount {order.couponCode ? `(${order.couponCode})` : ""}:
                  </span>
                  <span className="font-mono">-{formatPrice(order.discountPaise)}</span>
                </div>
              )}

              <div className="flex justify-between text-aurelle-muted">
                <span>Insured Couture Courier Delivery:</span>
                <span className="text-aurelle-ink font-mono font-medium">
                  {order.shippingPaise === 0 ? "FREE" : formatPrice(order.shippingPaise)}
                </span>
              </div>

              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Taxes & GST (12%):</span>
                <span>Included in Product MRP</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-base font-semibold text-aurelle-ink pt-3 border-t border-aurelle-border gap-1">
                <span>Total Amount to Pay on Delivery:</span>
                <span className="text-xl sm:text-2xl text-aurelle-burgundy font-serif">
                  {formatPrice(order.totalPaise)}
                </span>
              </div>
            </div>

            {/* Server Trust Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium">
                  Authoritative Transaction Integrity Verified
                </span>
              </div>
              <span className="text-[10px] text-emerald-800">
                {order.isDatabaseConnected
                  ? "Synced to PostgreSQL"
                  : "Protected in Scoped Session Store"}
              </span>
            </div>
          </div>

          {/* Bottom Return CTA */}
          <div className="text-center pt-4 print:hidden">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-aurelle-ink text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink text-xs uppercase tracking-luxury transition-colors font-medium"
            >
              <span>Explore More Heirlooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
