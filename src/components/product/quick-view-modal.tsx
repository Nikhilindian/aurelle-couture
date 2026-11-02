"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MockProduct } from "@/data/mock-catalog";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

export interface QuickViewModalProps {
  product: MockProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || "Standard");
      setSelectedSize(product.sizes[0] || "Standard");
      setSelectedImageIdx(0);
      setQuantity(1);
    }
  }, [product]);

  // Lock scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      selectedColor,
      selectedSize,
      quantity,
    });
    showToast({
      title: "Added to Bag",
      message: `${product.title} (${selectedSize}) is in your shopping bag.`,
      imageUrl: product.images[0]?.url,
      type: "success",
      action: {
        label: "View Bag",
        onClick: openCart,
      },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Product Quick View"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white shadow-2xl border border-aurelle-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-aurelle-ink hover:text-aurelle-burgundy transition-all shadow-xs"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Images Gallery */}
          <div className="bg-aurelle-sand flex flex-col justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-aurelle-border">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-aurelle-border/60">
              <Image
                src={product.images[selectedImageIdx]?.url || product.images[0].url}
                alt={product.images[selectedImageIdx]?.alt || product.title}
                fill
                className="object-cover object-center"
              />
              {product.badge && (
                <div className="absolute top-3 left-3">
                  <Badge variant="gold">{product.badge}</Badge>
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-14 h-18 border-2 transition-all shrink-0 ${
                      selectedImageIdx === idx
                        ? "border-aurelle-burgundy ring-1 ring-aurelle-burgundy"
                        : "border-aurelle-border/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Selectors */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-aurelle-muted">
                <span className="uppercase tracking-widest text-[11px] font-medium">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-aurelle-ink text-xs">
                    {product.rating}
                  </span>
                  <span>({product.reviewsCount})</span>
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-aurelle-ink leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs text-aurelle-muted mt-1 font-sans">
                  {product.subtitle}
                </p>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-sans text-xl font-bold text-aurelle-ink">
                    {formatPrice(product.pricePaise)}
                  </span>
                  {product.compareAtPaise && (
                    <span className="font-sans text-sm text-aurelle-muted line-through">
                      {formatPrice(product.compareAtPaise)}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Inclusive of Taxes
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-2 pt-2 border-t border-aurelle-border/60">
                <div className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal flex justify-between">
                  <span>Color:</span>
                  <span className="text-aurelle-burgundy">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === c.name
                          ? "border-aurelle-burgundy ring-2 ring-aurelle-burgundy/30 scale-105"
                          : "border-black/20 hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-4 h-4 text-white drop-shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal flex justify-between">
                  <span>Select Size:</span>
                  <span className="text-aurelle-burgundy">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs px-3 py-1.5 border transition-all ${
                        selectedSize === sz
                          ? "border-aurelle-burgundy bg-aurelle-burgundy text-white shadow-xs"
                          : "border-aurelle-border bg-white text-aurelle-charcoal hover:border-aurelle-burgundy"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Artisan Highlights */}
              <div className="bg-aurelle-ivory/60 p-3 rounded-none border border-aurelle-border/60 text-xs space-y-1">
                <div className="flex items-center gap-2 text-aurelle-charcoal">
                  <Sparkles className="w-3.5 h-3.5 text-aurelle-gold" />
                  <span><strong>Craft:</strong> {product.craft}</span>
                </div>
                <div className="flex items-center gap-2 text-aurelle-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-aurelle-gold" />
                  <span><strong>Fabric:</strong> {product.fabric}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-3 border-t border-aurelle-border/60">
              <div className="flex items-center gap-3">
                <Button
                  variant="burgundy"
                  size="lg"
                  className="flex-1 flex items-center justify-center gap-2 tracking-widest text-xs uppercase"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </Button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="p-3 border border-aurelle-border hover:border-aurelle-burgundy text-aurelle-ink hover:text-aurelle-burgundy transition-all"
                  aria-label={isWishlisted ? "Remove from saved pieces" : "Save piece"}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? "fill-aurelle-burgundy text-aurelle-burgundy" : ""
                    }`}
                  />
                </button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs uppercase tracking-widest text-aurelle-charcoal hover:text-aurelle-burgundy transition-colors py-1 underline underline-offset-4"
              >
                View Full Details & Artisan Narrative →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
