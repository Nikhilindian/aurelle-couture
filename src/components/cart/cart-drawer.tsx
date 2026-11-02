"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  X,
  ShoppingBag,
  Truck,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function CartDrawer() {
  const [mounted, setMounted] = React.useState(false);
  const {
    items,
    isOpen,
    closeCart,
    totalCount,
    subtotalPaise,
    isFreeShipping,
    freeShippingProgress,
    freeShippingThresholdPaise,
    appliedCoupon,
    discountPaise,
    finalTotalPaise,
    applyCoupon,
    removeCoupon,
    isDatabaseConnected,
    isServerVerified,
    isSyncing,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState("");
  const [promoFeedback, setPromoFeedback] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC key and lock body scroll
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeCart]);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyCoupon(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput("");
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-aurelle-border">
          {/* 1. Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-aurelle-border bg-aurelle-ivory/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-aurelle-burgundy shrink-0" />
                <h2 className="font-serif text-lg sm:text-xl text-aurelle-ink">
                  Shopping Bag ({totalCount})
                </h2>
                {isServerVerified && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium whitespace-nowrap">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 -mr-1 text-aurelle-ink hover:text-aurelle-burgundy transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close Shopping Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-4 pt-3 border-t border-aurelle-border/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-aurelle-charcoal font-medium">
                  <Truck className="w-3.5 h-3.5 text-aurelle-burgundy" />
                  {isFreeShipping
                    ? "Complimentary Express Shipping Unlocked!"
                    : `Add ${formatPrice(
                        freeShippingThresholdPaise - subtotalPaise
                      )} for Free Express Shipping`}
                </span>
                <span className="text-[11px] text-aurelle-muted font-semibold">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-aurelle-sand overflow-hidden">
                <div
                  className="h-full bg-aurelle-burgundy transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Scrollable Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-aurelle-border">
            {items.length > 0 ? (
              items.map((item) => (
                <CartItemRow key={item.id} item={item} compact />
              ))
            ) : (
              <div className="py-16 sm:py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-aurelle-sand flex items-center justify-center text-aurelle-muted">
                  <ShoppingBag className="w-8 h-8 text-aurelle-burgundy" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-aurelle-ink">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-aurelle-muted max-w-xs mx-auto leading-relaxed">
                  Discover our timeless handloom sarees, bespoke lehengas, and festive anarkalis.
                </p>
                <div className="pt-2">
                  <Link href="/collections" onClick={closeCart}>
                    <Button variant="burgundy" size="md">
                      Explore Haute Catalog
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. Drawer Footer Summary & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-aurelle-border bg-aurelle-ivory/60 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>
                        Promo <strong>{appliedCoupon.code}</strong> applied (-
                        {appliedCoupon.percent}%)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px] p-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. AURELLE10)"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoFeedback(null);
                      }}
                      className="flex-1 h-10 sm:h-9 px-3 border border-aurelle-border text-base sm:text-xs uppercase bg-white placeholder:normal-case placeholder:text-aurelle-muted/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurelle-burgundy"
                    />
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="px-3.5 h-10 sm:h-9 bg-aurelle-sand border border-aurelle-border text-aurelle-ink hover:bg-aurelle-cream text-xs uppercase tracking-wider font-semibold disabled:opacity-50 min-w-[70px] cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {!appliedCoupon && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-aurelle-muted">
                    <span>Try code:</span>
                    <button
                      type="button"
                      onClick={() => setPromoInput("AURELLE10")}
                      className="font-mono font-bold text-aurelle-burgundy hover:underline px-1 py-0.5 bg-aurelle-sand/50 rounded-xs border border-aurelle-border/60"
                    >
                      AURELLE10
                    </button>
                    <span>(10% off)</span>
                  </div>
                )}

                {promoFeedback && (
                  <div
                    className={`flex items-center gap-1 text-[11px] mt-1.5 ${
                      promoFeedback.success ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {promoFeedback.success ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>{promoFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* Subtotal Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-aurelle-muted">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-aurelle-charcoal">
                    {formatPrice(subtotalPaise)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Atelier Privilege Discount:</span>
                    <span>-{formatPrice(discountPaise)}</span>
                  </div>
                )}

                <div className="flex justify-between text-aurelle-muted">
                  <span>Standard Insured Shipping:</span>
                  <span className="text-aurelle-charcoal">
                    {isFreeShipping ? "Complimentary" : "₹250"}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-aurelle-ink pt-2 border-t border-aurelle-border">
                  <span>Estimated Total (INR):</span>
                  <span className="text-base text-aurelle-burgundy">
                    {formatPrice(finalTotalPaise)}
                  </span>
                </div>
              </div>

              {/* Server-Side Validation Notice */}
              <div className="p-2 bg-emerald-50/70 border border-emerald-200 text-[10px] text-emerald-900 leading-tight">
                <strong>Phase 10 Server Validation:</strong> All item prices, line totals, and coupon eligibility are calculated and locked on the server.
                {!isDatabaseConnected && (
                  <span className="block text-emerald-800/80 mt-0.5">
                    (Operating on scoped server session; connect Supabase in .env.local for cloud database tables).
                  </span>
                )}
              </div>

              {/* Checkout & View Bag CTAs */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button variant="burgundy" size="lg" className="w-full gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-xs text-aurelle-muted hover:text-aurelle-burgundy tracking-wider uppercase font-medium transition-colors"
                >
                  View Shopping Bag &amp; Notes
                </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-aurelle-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-aurelle-gold" />
                  <span>Pan-India Insured Dispatch • BlueDart Air</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
