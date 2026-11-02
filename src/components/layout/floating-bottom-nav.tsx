"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";

export function FloatingBottomNav() {
  const pathname = usePathname();
  const { totalCount, isOpen: isCartOpen, openCart, closeCart } = useCart();
  const {
    wishlistCount,
    isWishlistOpen,
    openWishlist,
    closeWishlist,
  } = useWishlist();

  const isHome = pathname === "/";
  const isCollections = pathname.startsWith("/collections");

  const handleLinkClick = (e: React.MouseEvent, isCurrent: boolean) => {
    if (isCurrent) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleWishlistDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCartOpen) closeCart();
    if (isWishlistOpen) {
      closeWishlist();
    } else {
      openWishlist();
    }
  };

  const toggleCartDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlistOpen) closeWishlist();
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 inset-x-0 mx-auto w-[calc(100%-24px)] max-w-[390px] z-40 bg-white/98 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.14)] border border-neutral-200/90 py-1.5 px-2 transition-all duration-300"
    >
      <div className="grid grid-cols-4 items-center w-full h-[54px]">
        {/* 1. Home Tab */}
        <Link
          href="/"
          onClick={(e) => handleLinkClick(e, isHome)}
          className="w-full h-full flex flex-col items-center justify-center touch-manipulation cursor-pointer group"
          aria-label="Home"
        >
          <div
            className={`flex flex-col items-center justify-center transition-all pointer-events-none ${
              isHome
                ? "bg-[#EEF2F6] text-[#800020] rounded-full px-3.5 py-1.5 min-w-[70px]"
                : "text-neutral-500 group-hover:text-neutral-900"
            }`}
          >
            <Home
              className={`w-5 h-5 pointer-events-none transition-transform group-hover:scale-105 ${
                isHome ? "text-[#800020] fill-[#800020]/20" : ""
              }`}
            />
            <span
              className={`text-[11px] tracking-tight leading-none mt-1 pointer-events-none ${
                isHome ? "font-bold text-[#800020]" : "font-medium"
              }`}
            >
              Home
            </span>
          </div>
        </Link>

        {/* 2. Categories Tab */}
        <Link
          href="/collections"
          onClick={(e) => handleLinkClick(e, isCollections)}
          className="w-full h-full flex flex-col items-center justify-center touch-manipulation cursor-pointer group"
          aria-label="Categories"
        >
          <div
            className={`flex flex-col items-center justify-center transition-all pointer-events-none ${
              isCollections
                ? "bg-[#EEF2F6] text-[#800020] rounded-full px-3.5 py-1.5 min-w-[70px]"
                : "text-neutral-500 group-hover:text-neutral-900"
            }`}
          >
            <LayoutGrid
              className={`w-5 h-5 pointer-events-none transition-transform group-hover:scale-105 ${
                isCollections ? "text-[#800020] fill-[#800020]/20" : ""
              }`}
            />
            <span
              className={`text-[11px] tracking-tight leading-none mt-1 pointer-events-none ${
                isCollections ? "font-bold text-[#800020]" : "font-medium"
              }`}
            >
              Categories
            </span>
          </div>
        </Link>

        {/* 3. Saved Pieces (Wishlist Drawer Trigger) */}
        <button
          type="button"
          onClick={toggleWishlistDrawer}
          className="w-full h-full flex flex-col items-center justify-center touch-manipulation cursor-pointer group"
          aria-label={`Saved pieces with ${wishlistCount} items`}
        >
          <div
            className={`flex flex-col items-center justify-center transition-all pointer-events-none ${
              isWishlistOpen
                ? "bg-[#EEF2F6] text-[#800020] rounded-full px-3.5 py-1.5 min-w-[70px]"
                : "text-neutral-500 group-hover:text-neutral-900"
            }`}
          >
            <div className="relative pointer-events-none">
              <Heart
                className={`w-5 h-5 pointer-events-none transition-transform group-hover:scale-105 ${
                  wishlistCount > 0 || isWishlistOpen
                    ? "fill-[#800020] text-[#800020]"
                    : ""
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2.5 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-[#800020] text-[8px] font-bold text-white shadow-xs pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] tracking-tight leading-none mt-1 pointer-events-none ${
                isWishlistOpen ? "font-bold text-[#800020]" : "font-medium"
              }`}
            >
              Saved
            </span>
          </div>
        </button>

        {/* 4. Bag Tab (Cart Drawer Trigger) */}
        <button
          type="button"
          onClick={toggleCartDrawer}
          className="w-full h-full flex flex-col items-center justify-center touch-manipulation cursor-pointer group"
          aria-label={`Shopping bag with ${totalCount} items`}
        >
          <div
            className={`flex flex-col items-center justify-center transition-all pointer-events-none ${
              isCartOpen
                ? "bg-[#EEF2F6] text-[#800020] rounded-full px-3.5 py-1.5 min-w-[70px]"
                : "text-neutral-500 group-hover:text-neutral-900"
            }`}
          >
            <div className="relative pointer-events-none">
              <ShoppingBag
                className={`w-5 h-5 pointer-events-none transition-transform group-hover:scale-105 ${
                  totalCount > 0 || isCartOpen
                    ? "text-[#800020] fill-[#800020]/20"
                    : ""
                }`}
              />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-2.5 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-[#800020] text-[8px] font-bold text-white shadow-xs animate-pulse pointer-events-none">
                  {totalCount}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] tracking-tight leading-none mt-1 pointer-events-none ${
                isCartOpen ? "font-bold text-[#800020]" : "font-medium"
              }`}
            >
              Basket
            </span>
          </div>
        </button>
      </div>
    </nav>
  );
}
