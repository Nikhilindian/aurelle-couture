"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function WishlistDrawer() {
  const [mounted, setMounted] = React.useState(false);
  const {
    isWishlistOpen,
    closeWishlist,
    wishlistProducts,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addItem, openCart } = useCart();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWishlist();
    };
    if (isWishlistOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isWishlistOpen, closeWishlist]);

  if (!isWishlistOpen || !mounted) return null;

  const totalWishlistValuationPaise = wishlistProducts.reduce(
    (sum, p) => sum + p.pricePaise,
    0
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-aurelle-border">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-aurelle-border bg-aurelle-ivory/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-aurelle-burgundy fill-aurelle-burgundy" />
              <h2 className="font-serif text-lg sm:text-xl text-aurelle-ink">
                Saved Creations ({wishlistProducts.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeWishlist}
              className="p-2 text-aurelle-charcoal hover:text-aurelle-burgundy transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close Wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-aurelle-border/60">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-aurelle-sand/50 flex items-center justify-center text-aurelle-muted">
                  <Heart className="w-8 h-8 stroke-1 text-aurelle-muted" />
                </div>
                <h3 className="font-serif text-lg text-aurelle-ink">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-aurelle-muted max-w-xs font-sans leading-relaxed">
                  Explore our handcrafted weaves and save your favorite heirloom pieces to review whenever you wish.
                </p>
                <Link href="/collections" onClick={closeWishlist}>
                  <Button variant="burgundy" size="sm" className="mt-2 tracking-widest text-xs">
                    Explore Collections
                  </Button>
                </Link>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center justify-between group"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeWishlist}
                    className="relative w-16 h-20 bg-aurelle-sand shrink-0 border border-aurelle-border/80 overflow-hidden"
                  >
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 pr-2">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeWishlist}
                    >
                      <h4 className="font-serif text-sm text-aurelle-ink hover:text-aurelle-burgundy transition-colors truncate">
                        {product.title}
                      </h4>
                    </Link>
                    <p className="text-[11px] text-aurelle-muted truncate mt-0.5 font-sans">
                      {product.fabric}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-aurelle-ink">
                        {formatPrice(product.pricePaise)}
                      </span>
                      {product.compareAtPaise && (
                        <span className="text-[10px] text-aurelle-muted line-through">
                          {formatPrice(product.compareAtPaise)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0 items-end">
                    <Button
                      variant="burgundy"
                      size="sm"
                      className="text-[10px] tracking-wider py-1 px-2.5 h-8 flex items-center gap-1"
                      onClick={() => {
                        addItem({
                          productId: product.id,
                          selectedColor: product.colors[0]?.name || "Standard",
                          selectedSize: product.sizes[0] || "Standard",
                          quantity: 1,
                        });
                        closeWishlist();
                        openCart();
                      }}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-[11px] text-aurelle-muted hover:text-red-700 flex items-center gap-1 px-1 py-0.5 transition-colors"
                      title="Remove from saved pieces"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-aurelle-border bg-aurelle-ivory/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-aurelle-charcoal">
                <span>Total Curation Value:</span>
                <span className="font-semibold text-sm text-aurelle-ink">
                  {formatPrice(totalWishlistValuationPaise)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs tracking-wider"
                  onClick={clearWishlist}
                >
                  Clear All
                </Button>
                <Link
                  href="/collections"
                  onClick={closeWishlist}
                  className="w-full"
                >
                  <Button
                    variant="burgundy"
                    size="sm"
                    className="w-full text-xs tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>Browse More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
