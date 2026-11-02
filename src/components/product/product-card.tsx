"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MockProduct } from "@/data/mock-catalog";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import { Heart, Star, Eye, ShoppingBag, Check } from "lucide-react";

export interface ProductCardProps {
  product: MockProduct;
}

function getShortSize(size: string): string {
  if (size.includes("Unstitched")) return "Free Size";
  if (size.includes("Free Size")) return "Free Size";
  if (size.includes("Custom")) return "Custom";
  return size;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);
  const [activeColorIdx, setActiveColorIdx] = React.useState(0);
  const [isMobileSizeOpen, setIsMobileSizeOpen] = React.useState(false);
  const [isAddingToBag, setIsAddingToBag] = React.useState(false);
  const [addedSize, setAddedSize] = React.useState<string | null>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product.id);

  // Discount percentage calculation (TSS signature)
  const discountPercent =
    product.compareAtPaise && product.compareAtPaise > product.pricePaise
      ? Math.round(
          ((product.compareAtPaise - product.pricePaise) /
            product.compareAtPaise) *
            100
        )
      : 0;

  // Alternate image on hover or when color is switched
  const displayImage =
    activeColorIdx > 0 && product.images[activeColorIdx]
      ? product.images[activeColorIdx]
      : isHovered && product.images[1]
      ? product.images[1]
      : product.images[0];

  const handleQuickAddSize = async (
    e: React.MouseEvent,
    selectedSize: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToBag(true);
    setAddedSize(selectedSize);

    try {
      await addItem({
        productId: product.id,
        selectedColor:
          product.colors[activeColorIdx]?.name ||
          product.colors[0]?.name ||
          "Default",
        selectedSize,
        quantity: 1,
      });

      showToast({
        title: "Added to Shopping Bag",
        message: `${product.title} (${getShortSize(selectedSize)}) added successfully.`,
        imageUrl: displayImage.url,
        type: "success",
        action: {
          label: "View Bag",
          onClick: openCart,
        },
      });

      setTimeout(() => setAddedSize(null), 1800);
    } catch {
      setAddedSize(null);
    } finally {
      setIsAddingToBag(false);
    }
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white border border-aurelle-border/70 hover:border-aurelle-gold/60 transition-all duration-300 hover:shadow-xl text-left rounded-xs overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsMobileSizeOpen(false);
        }}
      >
        {/* 1. Tall Editorial Image Stage (TSS 3:4 Aspect Ratio) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full relative"
          >
            <Image
              src={displayImage.url}
              alt={displayImage.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Top-Left Badges (Discount & Heritage Tags) */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col items-start gap-1 z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="bg-emerald-800 text-white font-sans text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 tracking-wider uppercase rounded-xs shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
            {product.badge && (
              <span className="bg-[#1A1817]/90 text-[#E2D3BE] font-sans text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.5 tracking-wider uppercase border border-aurelle-gold/40 shadow-xs">
                {product.badge}
              </span>
            )}
            {product.stockCount <= 3 && product.inStock && (
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-900 bg-amber-100/95 px-1.5 py-0.5 border border-amber-300 font-semibold shadow-xs">
                Only {product.stockCount} Left
              </span>
            )}
          </div>

          {/* Top-Right Floating Wishlist Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-aurelle-ink hover:text-aurelle-burgundy shadow-sm z-10 transition-transform active:scale-90 hover:scale-110 flex items-center justify-center cursor-pointer min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px]"
            aria-label={
              isWishlisted
                ? "Remove from saved pieces"
                : "Save piece to wishlist"
            }
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isWishlisted
                  ? "fill-aurelle-burgundy text-aurelle-burgundy"
                  : "text-aurelle-charcoal"
              }`}
            />
          </button>

          {/* Bottom-Left Overlaid Rating Badge (TSS signature look) */}
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-semibold text-aurelle-charcoal flex items-center gap-1 shadow-sm border border-black/5 z-10 pointer-events-none">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-500 text-amber-500" />
            <span>{product.rating}</span>
            <span className="text-aurelle-muted/40">|</span>
            <span className="text-aurelle-muted font-normal text-[8px] sm:text-[9px]">
              {product.reviewsCount}
            </span>
          </div>

          {/* Desktop Slide-up Quick Size Bar (The Souled Store hallmark) */}
          <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 border-t border-aurelle-border hidden sm:block">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[9px] uppercase font-bold tracking-wider text-aurelle-ink">
                Quick Add Size
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="text-[9px] text-aurelle-burgundy hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>Quick View</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  disabled={isAddingToBag}
                  onClick={(e) => handleQuickAddSize(e, size)}
                  className={`flex-1 min-w-[32px] py-1 px-1.5 text-[9px] font-semibold uppercase tracking-wider border transition-all text-center rounded-xs cursor-pointer active:scale-95 ${
                    addedSize === size
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "border-aurelle-border bg-white text-aurelle-ink hover:border-aurelle-burgundy hover:bg-aurelle-burgundy hover:text-white"
                  }`}
                  title={`Add size ${size} to bag`}
                >
                  {addedSize === size ? "✓ Added" : getShortSize(size)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Product Meta Details (Clean D2C Hierarchy) */}
        <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            {/* Category / Atelier Tag */}
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-aurelle-muted font-medium line-clamp-1">
              {product.category} • {product.craft.split(" ")[0]}
            </p>

            {/* Title */}
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-serif text-xs sm:text-sm md:text-base font-medium text-aurelle-ink group-hover:text-aurelle-burgundy transition-colors leading-snug line-clamp-1 sm:line-clamp-2">
                {product.title}
              </h3>
            </Link>

            {/* Fabric Subtitle */}
            <p className="text-[10px] sm:text-xs text-aurelle-muted font-sans line-clamp-1">
              {product.fabric}
            </p>
          </div>

          {/* Pricing Row (TSS Price + MRP + % Off) */}
          <div className="space-y-2 pt-1 border-t border-aurelle-border/50">
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="font-sans text-xs sm:text-sm md:text-base font-bold text-aurelle-ink">
                {formatPrice(product.pricePaise)}
              </span>
              {product.compareAtPaise && (
                <span className="font-sans text-[10px] sm:text-xs text-aurelle-muted line-through">
                  {formatPrice(product.compareAtPaise)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="font-sans text-[10px] sm:text-xs font-bold text-emerald-700">
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* Bottom Row: Color Swatches & Mobile Quick Add */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {/* Color Preview Swatches */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveColorIdx(idx);
                    }}
                    title={`${color.name} - Click to preview`}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer ${
                      activeColorIdx === idx
                        ? "ring-2 ring-aurelle-burgundy scale-110 border-white"
                        : "border-black/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              {/* Mobile Quick Add Size Toggle */}
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileSizeOpen(!isMobileSizeOpen);
                  }}
                  className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-xs transition-colors flex items-center gap-1 ${
                    isMobileSizeOpen
                      ? "bg-aurelle-burgundy text-white border-aurelle-burgundy"
                      : "bg-stone-50 text-aurelle-ink border-aurelle-border"
                  }`}
                >
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span>{isMobileSizeOpen ? "Close" : "+ Add"}</span>
                </button>
              </div>
            </div>

            {/* Mobile Size Selection Drawer (Shows on mobile when + Add is tapped) */}
            {isMobileSizeOpen && (
              <div className="sm:hidden pt-2 border-t border-dashed border-aurelle-border space-y-1.5 animate-fadeIn">
                <p className="text-[9px] uppercase font-bold text-aurelle-muted tracking-wider">
                  Select Size to Add:
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={isAddingToBag}
                      onClick={(e) => handleQuickAddSize(e, size)}
                      className={`flex-1 min-w-[28px] py-1 px-1 text-[9px] font-semibold uppercase tracking-wider border rounded-xs transition-all ${
                        addedSize === size
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "border-aurelle-border bg-white text-aurelle-ink hover:bg-aurelle-burgundy hover:text-white"
                      }`}
                    >
                      {addedSize === size ? "✓" : getShortSize(size)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
