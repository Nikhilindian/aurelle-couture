"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_PRODUCTS, MockProduct } from "@/data/mock-catalog";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
} from "lucide-react";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCH_TAGS = [
  "Banarasi Sarees",
  "Bridal Lehengas",
  "Mulberry Katan",
  "Kadwa Zari",
  "Anarkali Sets",
  "Dupattas",
  "New In",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live filter products
  const searchResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return MOCK_PRODUCTS.filter((product) => {
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchSub = product.subtitle.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchFabric = product.fabric.toLowerCase().includes(q);
      const matchCraft = product.craft.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchBadge = product.badge?.toLowerCase().includes(q);
      const matchColor = product.colors.some((c) =>
        c.name.toLowerCase().includes(q)
      );

      return (
        matchTitle ||
        matchSub ||
        matchCat ||
        matchFabric ||
        matchCraft ||
        matchDesc ||
        matchBadge ||
        matchColor
      );
    });
  }, [query]);

  if (!isOpen || !mounted) return null;

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/collections?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Atelier Catalog Search"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#181615]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-start justify-center pt-10 sm:pt-20 px-4 pb-12">
        <div className="relative w-full max-w-3xl bg-white shadow-2xl border border-aurelle-border overflow-hidden">
          {/* Search Header Bar */}
          <form
            onSubmit={handleSubmitSearch}
            className="flex items-center gap-3 p-4 sm:p-6 border-b border-aurelle-border bg-aurelle-ivory/60"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-aurelle-burgundy shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted sarees, bridal lehengas, pure silk..."
              className="flex-1 bg-transparent text-sm sm:text-base text-aurelle-ink placeholder:text-aurelle-muted font-sans outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-aurelle-muted hover:text-aurelle-ink uppercase tracking-wider font-semibold px-2"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-aurelle-charcoal hover:text-aurelle-burgundy transition-colors"
              aria-label="Close search dialog"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>

          {/* Quick Discover Pills */}
          <div className="p-4 sm:p-6 bg-white border-b border-aurelle-border/40">
            <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider text-aurelle-muted font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-aurelle-burgundy" />
              <span>Curated Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    query === tag
                      ? "bg-aurelle-burgundy text-white border-aurelle-burgundy shadow-xs"
                      : "bg-aurelle-sand/40 border-aurelle-border text-aurelle-charcoal hover:border-aurelle-burgundy hover:text-aurelle-burgundy"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-aurelle-border/60">
            {query.trim().length === 0 ? (
              <div className="py-12 text-center text-aurelle-muted space-y-2">
                <Sparkles className="w-8 h-8 text-aurelle-gold mx-auto stroke-1" />
                <p className="font-serif text-sm text-aurelle-charcoal">
                  Type any weave, craft, or silhouette to search our archive
                </p>
                <p className="text-[11px] font-sans text-aurelle-muted">
                  Discover heirloom Mulberry Silk, Kadwa Banarasi, and Dabka Embroidery.
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center text-aurelle-muted space-y-2">
                <p className="font-serif text-base text-aurelle-ink">
                  No creations found matching &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs font-sans text-aurelle-muted">
                  Try searching for &quot;Silk&quot;, &quot;Saree&quot;, &quot;Lehenga&quot;, or &quot;Anarkali&quot;.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 text-xs text-aurelle-muted">
                  <span>Found {searchResults.length} creations</span>
                  <Link
                    href={`/collections?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-aurelle-burgundy font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View all in catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-aurelle-border/60">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="py-3.5 flex items-center gap-4 hover:bg-aurelle-ivory/50 transition-colors px-2 -mx-2 group"
                    >
                      <div className="relative w-14 h-18 bg-aurelle-sand shrink-0 border border-aurelle-border overflow-hidden">
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm text-aurelle-ink group-hover:text-aurelle-burgundy transition-colors truncate">
                            {product.title}
                          </h4>
                          {product.badge && (
                            <Badge
                              variant={
                                product.badge === "New In"
                                  ? "burgundy"
                                  : product.badge === "Bestseller"
                                  ? "gold"
                                  : "default"
                              }
                              className="text-[9px] py-0 px-1.5"
                            >
                              {product.badge}
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-aurelle-muted truncate font-sans mt-0.5">
                          {product.craft} • {product.fabric}
                        </p>

                        <div className="flex items-baseline gap-2 mt-1">
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

                      <ArrowRight className="w-4 h-4 text-aurelle-muted group-hover:text-aurelle-burgundy group-hover:translate-x-1 transition-all shrink-0 mr-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
