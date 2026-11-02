"use client";

import * as React from "react";

export interface CartItem {
  id: string; // format: `${productId}-${selectedColor}-${selectedSize}`
  productId: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  pricePaise: number; // strictly server validated
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  stockLimit: number;
}

export interface CouponDiscount {
  code: string;
  percent: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: {
    productId: string;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
  }) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalCount: number;
  subtotalPaise: number;
  freeShippingThresholdPaise: number;
  isFreeShipping: boolean;
  freeShippingProgress: number;
  appliedCoupon: CouponDiscount | null;
  discountPaise: number;
  finalTotalPaise: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  isServerVerified: boolean;
  isDatabaseConnected: boolean;
  isSyncing: boolean;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState<CouponDiscount | null>(null);
  const [subtotalPaise, setSubtotalPaise] = React.useState(0);
  const [discountPaise, setDiscountPaise] = React.useState(0);
  const [finalTotalPaise, setFinalTotalPaise] = React.useState(0);
  const [isFreeShipping, setIsFreeShipping] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isServerVerified, setIsServerVerified] = React.useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  // Sync state from server response
  const applyServerCartSummary = (data: any) => {
    setItems(data.items || []);
    setTotalCount(data.totalCount || 0);
    setSubtotalPaise(data.subtotalPaise || 0);
    setDiscountPaise(data.discountPaise || 0);
    setFinalTotalPaise(data.finalTotalPaise || 0);
    setIsFreeShipping(data.isFreeShipping || false);
    setIsDatabaseConnected(data.isDatabaseConnected || false);
    setIsServerVerified(true);

    if (data.appliedCoupon) {
      setAppliedCoupon({
        code: data.appliedCoupon.code,
        percent: data.appliedCoupon.discountValue,
      });
    } else {
      setAppliedCoupon(null);
    }
  };

  // Fetch initial cart from server on mount
  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsSyncing(true);
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            applyServerCartSummary(json.data);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch initial server cart:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (newItem: {
    productId: string;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
  }) => {
    try {
      setIsSyncing(true);
      // NOTICE: No price is sent from client! Server assigns authoritative price.
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newItem.productId,
          selectedColor: newItem.selectedColor,
          selectedSize: newItem.selectedSize,
          quantity: newItem.quantity,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          applyServerCartSummary(json.data);
          setIsOpen(true);
        }
      }
    } catch (err) {
      console.error("Failed to add item to server cart:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const currentItem = items.find((i) => i.id === id);
    if (!currentItem) return;

    const targetQty = currentItem.quantity + delta;
    try {
      setIsSyncing(true);
      if (targetQty <= 0) {
        await removeItem(id);
      } else {
        const res = await fetch("/api/cart/items", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: id,
            quantity: targetQty,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            applyServerCartSummary(json.data);
          }
        }
      }
    } catch (err) {
      console.error("Failed to update cart quantity on server:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          applyServerCartSummary(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to remove item from server cart:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCart = async () => {
    for (const item of items) {
      await removeItem(item.id);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const json = await res.json();
      if (json.summary) {
        applyServerCartSummary(json.summary);
      }
      return {
        success: Boolean(json.success),
        message: json.message || (json.success ? "Coupon applied" : "Failed"),
      };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error" };
    } finally {
      setIsSyncing(false);
    }
  };

  const removeCoupon = async () => {
    // Reset coupon by fetching fresh state without promo
    setAppliedCoupon(null);
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalPaise / 500000) * 100)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        subtotalPaise,
        freeShippingThresholdPaise: 500000,
        isFreeShipping,
        freeShippingProgress,
        appliedCoupon,
        discountPaise,
        finalTotalPaise,
        applyCoupon,
        removeCoupon,
        isServerVerified,
        isDatabaseConnected,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
