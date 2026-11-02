"use client";

import * as React from "react";
import { MockProduct, MOCK_PRODUCTS } from "@/data/mock-catalog";
import { useToast } from "@/context/toast-context";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: MockProduct[];
  wishlistCount: number;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: MockProduct) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "aurelle_patron_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { showToast } = useToast();

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }
    } catch (e) {
      console.warn("Unable to read wishlist from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn("Unable to save wishlist to localStorage:", e);
    }
  }, [wishlistIds, isLoaded]);

  const isInWishlist = React.useCallback(
    (id: string) => wishlistIds.includes(id),
    [wishlistIds]
  );

  const toggleWishlist = React.useCallback(
    (product: MockProduct) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          showToast({
            title: "Removed from Wishlist",
            message: `${product.title} has been removed from your saved pieces.`,
            type: "info",
          });
          return prev.filter((id) => id !== product.id);
        } else {
          showToast({
            title: "Added to Wishlist",
            message: `${product.title} saved to your bespoke curation.`,
            imageUrl: product.images[0]?.url,
            type: "success",
            action: {
              label: "View Wishlist",
              onClick: () => setIsWishlistOpen(true),
            },
          });
          return [...prev, product.id];
        }
      });
    },
    [showToast]
  );

  const removeFromWishlist = React.useCallback(
    (id: string) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      setWishlistIds((prev) => prev.filter((item) => item !== id));
      if (product) {
        showToast({
          title: "Removed from Wishlist",
          message: `${product.title} removed from saved pieces.`,
          type: "info",
        });
      }
    },
    [showToast]
  );

  const clearWishlist = React.useCallback(() => {
    setWishlistIds([]);
    showToast({
      title: "Wishlist Cleared",
      message: "All saved pieces have been removed.",
      type: "info",
    });
  }, [showToast]);

  const wishlistProducts = React.useMemo(() => {
    return wishlistIds
      .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
      .filter((p): p is MockProduct => Boolean(p));
  }, [wishlistIds]);

  const openWishlist = React.useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = React.useCallback(() => setIsWishlistOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
