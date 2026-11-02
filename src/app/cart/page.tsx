"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
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
    clearCart,
    isDatabaseConnected,
    isServerVerified,
    isSyncing,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState("");
  const [promoFeedback, setPromoFeedback] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyCoupon(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput("");
  };

  return (
    <div className="w-full bg-aurelle-ivory min-h-screen py-10 sm:py-14 text-left">
      <Container size="wide">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-aurelle-muted mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-aurelle-burgundy transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-aurelle-ink font-semibold">Shopping Bag</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-aurelle-border gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block">
                Your Atelier Selection
              </span>
              {isServerVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Server Verified Pricing</span>
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink font-normal">
              Shopping Bag ({totalCount})
            </h1>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs uppercase tracking-wider text-aurelle-muted hover:text-red-700 underline font-medium self-start sm:self-auto"
            >
              Empty Bag
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Line Items List */}
            <div className="lg:col-span-7 space-y-6">
              {/* Free Shipping Progress Box */}
              <div className="p-4 bg-white border border-aurelle-border shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-aurelle-charcoal font-semibold">
                    <Truck className="w-4 h-4 text-aurelle-burgundy" />
                    {isFreeShipping
                      ? "Complimentary Air Express Shipping Unlocked!"
                      : `Add ${formatPrice(
                          freeShippingThresholdPaise - subtotalPaise
                        )} more to enjoy Free Pan-India Delivery`}
                  </span>
                  <span className="text-aurelle-muted font-bold text-[11px]">
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

              {/* Items Card */}
              <div className="bg-white border border-aurelle-border p-4 sm:p-6 shadow-2xs divide-y divide-aurelle-border">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              {/* Trust Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
                <div className="p-3.5 sm:p-4 bg-white border border-aurelle-border flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-aurelle-gold shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-aurelle-ink uppercase tracking-wider">
                      Silk Mark India
                    </h4>
                    <p className="text-[11px] text-aurelle-muted">100% natural pure silk</p>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-white border border-aurelle-border flex items-center gap-3">
                  <Truck className="w-5 h-5 text-aurelle-gold shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-aurelle-ink uppercase tracking-wider">
                      Insured Dispatch
                    </h4>
                    <p className="text-[11px] text-aurelle-muted">BlueDart Air transit cover</p>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-white border border-aurelle-border flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-aurelle-gold shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-aurelle-ink uppercase tracking-wider">
                      Easy Exchange
                    </h4>
                    <p className="text-[11px] text-aurelle-muted">7-day hassle-free window</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-aurelle-border p-4 sm:p-6 md:p-8 shadow-2xs space-y-6 sticky top-24">
                <h3 className="font-serif text-lg sm:text-xl text-aurelle-ink pb-4 border-b border-aurelle-border">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-aurelle-charcoal block">
                    Have an Atelier Privilege Code?
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>
                          Code <strong>{appliedCoupon.code}</strong> applied (-
                          {appliedCoupon.percent}%)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-xs p-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try code: AURELLE10"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoFeedback(null);
                        }}
                        className="flex-1 h-10 px-3 border border-aurelle-border text-base sm:text-xs uppercase bg-white placeholder:normal-case placeholder:text-aurelle-muted/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurelle-burgundy"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={isSyncing}
                        className="shrink-0 h-10 px-4 cursor-pointer"
                      >
                        Apply
                      </Button>
                    </form>
                  )}

                  {!appliedCoupon && (
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-aurelle-muted">
                      <span>Available privilege:</span>
                      <button
                        type="button"
                        onClick={() => setPromoInput("AURELLE10")}
                        className="font-mono font-bold text-aurelle-burgundy hover:underline px-1.5 py-0.5 bg-aurelle-sand/50 rounded-xs border border-aurelle-border/60"
                      >
                        AURELLE10
                      </button>
                      <span>(10% off)</span>
                    </div>
                  )}

                  {promoFeedback && (
                    <div
                      className={`flex items-center gap-1.5 text-xs ${
                        promoFeedback.success ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {promoFeedback.success ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{promoFeedback.message}</span>
                    </div>
                  )}
                </div>

                {/* Price Calculations */}
                <div className="space-y-3 pt-4 border-t border-aurelle-border text-xs">
                  <div className="flex justify-between text-aurelle-charcoal">
                    <span>Subtotal ({totalCount} items):</span>
                    <span className="font-semibold">
                      {formatPrice(subtotalPaise)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Privilege Discount ({appliedCoupon.code}):</span>
                      <span>-{formatPrice(discountPaise)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-aurelle-charcoal">
                    <span>Standard Express Shipping:</span>
                    <span>{isFreeShipping ? "Complimentary" : "₹250"}</span>
                  </div>

                  <div className="flex justify-between text-aurelle-charcoal">
                    <span>GST (Estimated Included):</span>
                    <span>Included in drape price</span>
                  </div>

                  <div className="flex justify-between text-base font-semibold text-aurelle-ink pt-3 border-t border-aurelle-border">
                    <span>Estimated Total (INR):</span>
                    <span className="text-xl text-aurelle-burgundy font-serif">
                      {formatPrice(finalTotalPaise)}
                    </span>
                  </div>
                </div>

                {/* Phase 9 Server Security Notice */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Server-Backed Pricing Engine</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Client prices are rejected. Prices and stocks are computed server-side in integer paise.
                    {!isDatabaseConnected && (
                      <span className="block mt-1 text-emerald-900/70">
                        (Operating with scoped server token session; connect Supabase in .env.local for database persistence).
                      </span>
                    )}
                  </p>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2">
                  <Link href="/checkout" className="block w-full">
                    <Button
                      variant="burgundy"
                      size="lg"
                      className="w-full gap-2 min-h-[48px]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link href="/collections" className="block text-center pt-2">
                    <span className="text-xs uppercase tracking-wider text-aurelle-charcoal hover:text-aurelle-burgundy underline font-medium">
                      Continue Browsing Catalog
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Bag State */
          <div className="py-24 px-6 text-center bg-white border border-aurelle-border space-y-5 max-w-md mx-auto my-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-aurelle-sand flex items-center justify-center text-aurelle-burgundy">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl text-aurelle-ink">
              Your Bag is Currently Empty
            </h2>
            <p className="text-xs text-aurelle-muted leading-relaxed">
              Explore our exquisite creations handwoven by master weavers in Varanasi and Chanderi.
            </p>
            <div className="pt-2">
              <Link href="/collections">
                <Button variant="burgundy" size="md" className="gap-2">
                  <span>Explore Haute Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
