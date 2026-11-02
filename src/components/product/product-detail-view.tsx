"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { SizeGuideModal } from "@/components/product/size-guide-modal";
import { PincodeChecker } from "@/components/product/pincode-checker";
import { ProductCard } from "@/components/product/product-card";
import { ProductReviews } from "@/components/product/product-reviews";
import { MockProduct } from "@/data/mock-catalog";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Plus,
  Minus,
  ChevronDown,
  ShoppingBag,
  RotateCcw,
  Check,
  Heart,
} from "lucide-react";

export interface ProductDetailViewProps {
  product: MockProduct;
  relatedProducts: MockProduct[];
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0] || "");
  const [quantity, setQuantity] = React.useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);
  const [isJustAdded, setIsJustAdded] = React.useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Accordion open states
  const [openSection, setOpenSection] = React.useState<string | null>("fabric");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const maxQuantity = product.inStock ? Math.min(product.stockCount, 5) : 1;

  const handleDecreaseQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((q) => Math.min(maxQuantity, q + 1));
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      selectedColor: selectedColor || "Standard",
      selectedSize: selectedSize || "Standard",
      quantity,
    });
    setIsJustAdded(true);
    showToast({
      title: "Added to Shopping Bag",
      message: `${product.title} (${selectedSize}) is in your bag.`,
      imageUrl: product.images[0]?.url,
      type: "success",
      action: {
        label: "View Bag",
        onClick: openCart,
      },
    });
    setTimeout(() => setIsJustAdded(false), 2000);
  };

  return (
    <div className="w-full bg-aurelle-ivory min-h-screen py-8 md:py-12">
      <Container size="wide">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-aurelle-muted mb-6 sm:mb-8 overflow-x-auto scrollbar-none whitespace-nowrap py-1"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-aurelle-burgundy transition-colors shrink-0">
            Home
          </Link>
          <span className="shrink-0">/</span>
          <Link href="/collections" className="hover:text-aurelle-burgundy transition-colors shrink-0">
            Collections
          </Link>
          <span className="shrink-0">/</span>
          <Link
            href={`/collections?category=${encodeURIComponent(product.category)}`}
            className="hover:text-aurelle-burgundy transition-colors shrink-0"
          >
            {product.category}
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-aurelle-ink font-semibold truncate max-w-xs shrink-0">
            {product.title}
          </span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Right Column: Product Purchasing & Attributes */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Header: Badges & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.badge && (
                  <Badge
                    variant={
                      product.badge === "New In"
                        ? "burgundy"
                        : product.badge === "Bestseller"
                        ? "gold"
                        : "default"
                    }
                  >
                    {product.badge}
                  </Badge>
                )}
                <span className="text-[11px] uppercase tracking-widest text-aurelle-muted font-medium">
                  {product.craft}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl text-aurelle-ink font-normal leading-tight">
                {product.title}
              </h1>

              <p className="text-xs text-aurelle-muted font-sans mt-1.5">
                {product.subtitle}
              </p>

              {/* Rating stars */}
              <div className="flex items-center gap-2 mt-3 text-xs text-aurelle-muted">
                <div className="flex items-center text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-aurelle-ink">{product.rating}</span>
                <span>•</span>
                <span>{product.reviewsCount} Patron Reviews</span>
              </div>
            </div>

            {/* Pricing Section (Paise-calculated in INR) */}
            <div className="pt-4 border-t border-aurelle-border">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="font-sans text-2xl sm:text-3xl font-semibold text-aurelle-ink">
                  {formatPrice(product.pricePaise)}
                </span>
                {product.compareAtPaise && (
                  <>
                    <span className="font-sans text-sm sm:text-base text-aurelle-muted line-through">
                      {formatPrice(product.compareAtPaise)}
                    </span>
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Save {formatPrice(product.compareAtPaise - product.pricePaise)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-aurelle-muted mt-1">
                Inclusive of all taxes & insurance • Standard delivery complimentary
              </p>
            </div>

            {/* Stock Availability Indicator */}
            <div className="flex items-center gap-2 text-xs">
              {product.inStock ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                  <span className="text-emerald-800 font-semibold uppercase tracking-wider text-[11px]">
                    In Stock
                  </span>
                  <span className="text-aurelle-muted text-[11px]">
                    ({product.stockCount} pieces remaining in atelier)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                  <span className="text-amber-800 font-semibold uppercase tracking-wider text-[11px]">
                    Made-To-Order
                  </span>
                  <span className="text-aurelle-muted text-[11px]">
                    (3-4 weeks artisan tailoring)
                  </span>
                </>
              )}
            </div>

            {/* Color Swatch Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider font-semibold text-aurelle-charcoal">
                    Selected Color:
                  </span>
                  <span className="text-aurelle-burgundy font-medium">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-aurelle-burgundy ring-2 ring-aurelle-burgundy/30 scale-110"
                            : "border-aurelle-border hover:scale-105"
                        }`}
                        title={c.name}
                        aria-label={`Select color ${c.name}`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Variant Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider font-semibold text-aurelle-charcoal">
                    Select Silhouette / Size:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-aurelle-burgundy hover:underline uppercase tracking-wider text-[11px] font-semibold p-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-[42px] min-w-[42px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold border transition-all flex items-center justify-center ${
                          isSelected
                            ? "bg-aurelle-ink text-white border-aurelle-ink shadow-2xs"
                            : "bg-white text-aurelle-charcoal border-aurelle-border hover:border-aurelle-muted"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Active Add-To-Bag Action */}
            <div className="space-y-3 pt-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center justify-between sm:justify-center border border-aurelle-border bg-white h-12 px-2 sm:px-0">
                  <span className="text-xs text-aurelle-muted uppercase font-semibold sm:hidden px-2">Quantity</span>
                  <div className="flex items-center h-full">
                    <button
                      type="button"
                      onClick={handleDecreaseQty}
                      disabled={quantity <= 1}
                      className="px-4 sm:px-3.5 h-full text-aurelle-charcoal hover:bg-aurelle-sand disabled:opacity-30 transition-colors flex items-center justify-center min-w-[40px]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="w-10 text-center font-sans text-xs font-semibold text-aurelle-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseQty}
                      disabled={quantity >= maxQuantity}
                      className="px-4 sm:px-3.5 h-full text-aurelle-charcoal hover:bg-aurelle-sand disabled:opacity-30 transition-colors flex items-center justify-center min-w-[40px]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button & Wishlist Button */}
                <div className="flex-1 flex items-center gap-2">
                  <Button
                    variant="burgundy"
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 gap-2 shadow-sm text-xs sm:text-sm font-semibold"
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • {formatPrice(product.pricePaise * quantity)}</span>
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="h-12 w-12 border border-aurelle-border hover:border-aurelle-burgundy bg-white text-aurelle-ink hover:text-aurelle-burgundy transition-all flex items-center justify-center shrink-0"
                    aria-label={isWishlisted ? "Remove from saved pieces" : "Save piece to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? "fill-aurelle-burgundy text-aurelle-burgundy" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-aurelle-muted italic text-center sm:text-left">
                Demo catalog pricing. Seamless client-side persistent cart active.
              </p>
            </div>

            {/* Pincode Estimator */}
            <PincodeChecker />

            {/* Collapsible Accordions: Craft, Care, Shipping */}
            <div className="border-t border-aurelle-border divide-y divide-aurelle-border pt-4">
              {/* 1. Craft & Fabric Details */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection("fabric")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-aurelle-ink"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-aurelle-gold" /> Craftsmanship & Fabric Story
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === "fabric" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "fabric" && (
                  <div className="pt-3 text-xs text-aurelle-muted space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-aurelle-charcoal pt-1">
                      {product.details.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Care & Preservation */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection("care")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-aurelle-ink"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-aurelle-gold" /> Care & Preservation
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "care" && (
                  <div className="pt-3 text-xs text-aurelle-muted space-y-2 leading-relaxed">
                    <p>
                      Pure handloom silks require thoughtful heirloom care. Store wrapped in pure unbleached cotton muslin cloth. Avoid direct contact with synthetic perfumes or moisture.
                    </p>
                    <p className="font-semibold text-aurelle-charcoal">
                      Care instruction: Strictly Professional Dry Clean Only.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Shipping & Returns */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection("shipping")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-aurelle-ink"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-aurelle-gold" /> Insured Shipping & Easy Exchange
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "shipping" && (
                  <div className="pt-3 text-xs text-aurelle-muted space-y-2 leading-relaxed">
                    <p>
                      Each order is dispatched in tamper-evident sealed couture boxes via BlueDart Air Express.
                    </p>
                    <p>
                      We offer a 7-day hassle-free exchange window for unstitched sarees and standard-size kurtas in pristine original condition with security tags intact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patron Reviews & Fit Feedback */}
        <ProductReviews
          productTitle={product.title}
          initialRating={product.rating}
          reviewsCount={product.reviewsCount}
        />

        {/* Related Creations Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-aurelle-border">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-1">
                  Complementary Creations
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-aurelle-ink">
                  You May Also Admire
                </h3>
              </div>
              <Link
                href={`/collections?category=${encodeURIComponent(product.category)}`}
                className="text-xs uppercase tracking-wider text-aurelle-burgundy hover:underline font-semibold"
              >
                View More in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}
