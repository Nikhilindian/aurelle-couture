"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { SearchModal } from "@/components/layout/search-modal";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export function Header() {
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { totalCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "All Collections", href: "/collections" },
    { label: "Sarees", href: "/collections?category=Sarees" },
    { label: "Lehengas", href: "/collections?category=Lehengas" },
    { label: "Kurta Sets", href: "/collections?category=Kurta+Sets" },
    { label: "Dupattas", href: "/collections?category=Dupattas" },
    { label: "Track Order", href: "/track-order" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-aurelle-border transition-colors">
      {/* Top Announcement Strip */}
      <div className="bg-aurelle-ink text-aurelle-ivory py-1.5 sm:py-2 px-2 sm:px-4 text-center text-[10px] sm:text-[11px] font-sans tracking-wider sm:tracking-widest uppercase border-b border-aurelle-charcoal">
        <p className="truncate">
          Complimentary Express Shipping Across India | Handcrafted Festive Couture
        </p>
      </div>

      {/* Main Navigation Bar */}
      <Container size="wide">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Mobile Menu Button & Desktop Links */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-aurelle-ink hover:text-aurelle-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-burgundy"
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-widest text-aurelle-charcoal hover:text-aurelle-burgundy font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo / Wordmark */}
          <div className="text-center px-1">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-burgundy py-1"
            >
              <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.2em] sm:tracking-[0.25em] text-aurelle-ink font-normal uppercase block whitespace-nowrap">
                A U R E L L E
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.28em] sm:tracking-[0.35em] text-aurelle-muted uppercase block">
                Couture • India
              </span>
            </Link>
          </div>

          {/* Right: Secondary Links & Action Icons */}
          <div className="flex items-center gap-1 sm:gap-4 md:gap-6">
            <nav className="hidden lg:flex items-center gap-8 mr-2" aria-label="Secondary Navigation">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-widest text-aurelle-charcoal hover:text-aurelle-burgundy font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-aurelle-ink hover:text-aurelle-burgundy transition-colors focus-visible:ring-2 focus-visible:ring-aurelle-burgundy cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="hidden sm:inline-flex items-center gap-1.5 p-2 min-h-[44px] text-aurelle-ink hover:text-aurelle-burgundy transition-colors focus-visible:ring-2 focus-visible:ring-aurelle-burgundy"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-aurelle-burgundy">
                  {user.displayName.split(" ")[0]}
                </span>
              )}
            </Link>

            {/* Wishlist Trigger Button */}
            <button
              type="button"
              onClick={openWishlist}
              className="relative hidden sm:inline-flex p-2 min-h-[44px] min-w-[44px] items-center justify-center text-aurelle-ink hover:text-aurelle-burgundy transition-colors focus-visible:ring-2 focus-visible:ring-aurelle-burgundy cursor-pointer"
              aria-label={`Wishlist with ${wishlistCount} saved items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-aurelle-burgundy text-aurelle-burgundy" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-aurelle-burgundy text-[9px] font-bold text-white shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Interactive Cart Drawer Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-aurelle-ink hover:text-aurelle-burgundy transition-colors focus-visible:ring-2 focus-visible:ring-aurelle-burgundy"
              aria-label={`Shopping bag with ${totalCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-aurelle-burgundy text-[9px] font-bold text-white shadow-2xs">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer Shell (Portaled to document.body to prevent containing-block clipping) */}
      {isMobileMenuOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content: Solid pure white background with explicit full-viewport height */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white text-aurelle-ink p-5 sm:p-6 shadow-2xl flex flex-col justify-between border-r border-aurelle-border z-10 h-full min-h-screen h-[100dvh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-aurelle-border">
                <span className="font-serif text-lg tracking-widest text-aurelle-ink font-semibold uppercase">
                  A U R E L L E
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-aurelle-ink hover:text-aurelle-burgundy transition-colors"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="mt-4 space-y-1" aria-label="Mobile Drawer Navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 min-h-[48px] text-xs uppercase tracking-widest text-aurelle-ink hover:text-aurelle-burgundy font-medium border-b border-aurelle-border/40 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-aurelle-muted" />
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="w-full flex items-center justify-between py-3.5 min-h-[48px] text-xs uppercase tracking-widest text-aurelle-ink hover:text-aurelle-burgundy font-medium border-b border-aurelle-border/40 text-left transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-aurelle-burgundy text-aurelle-burgundy" : "text-aurelle-muted"}`} />
                    Saved Pieces ({wishlistCount})
                  </span>
                  <ChevronRight className="w-4 h-4 text-aurelle-muted" />
                </button>
                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3.5 min-h-[48px] text-xs uppercase tracking-widest text-aurelle-ink hover:text-aurelle-burgundy font-medium border-b border-aurelle-border/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-aurelle-muted" />
                    Shopping Bag ({totalCount})
                  </span>
                  <ChevronRight className="w-4 h-4 text-aurelle-muted" />
                </Link>
              </nav>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-5 border-t border-aurelle-border space-y-3 bg-white mt-6">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 text-xs tracking-wider uppercase text-aurelle-charcoal hover:text-aurelle-burgundy font-semibold transition-colors"
              >
                <User className="w-4 h-4 text-aurelle-burgundy" />
                <span>{user ? `Account: ${user.displayName}` : "Patron Sign In"}</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[11px] text-aurelle-muted hover:text-aurelle-burgundy transition-colors"
              >
                Atelier Vault Console →
              </Link>
              <div className="text-[11px] text-aurelle-muted">
                Currency: <strong className="text-aurelle-ink font-semibold">INR (₹)</strong>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Instant Live Search Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
