"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, Trash2 } from "lucide-react";

export interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { updateQuantity, removeItem, closeCart } = useCart();

  const handleLinkClick = () => {
    if (compact) closeCart();
  };

  return (
    <div className="flex gap-4 py-4 border-b border-aurelle-border text-left">
      {/* Product Image Thumbnail */}
      <Link
        href={`/products/${item.slug}`}
        onClick={handleLinkClick}
        className="relative aspect-[3/4] w-20 sm:w-24 shrink-0 overflow-hidden bg-aurelle-sand border border-aurelle-border hover:opacity-90 transition-opacity"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="96px"
          className="object-cover object-center"
        />
      </Link>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.slug}`}
              onClick={handleLinkClick}
              className="font-serif text-sm sm:text-base text-aurelle-ink hover:text-aurelle-burgundy transition-colors leading-snug"
            >
              {item.title}
            </Link>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-aurelle-muted hover:text-red-700 p-2 -mr-1 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label={`Remove ${item.title} from bag`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Variant tags */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-aurelle-muted">
            <span className="flex items-center gap-1">
              <span>Color:</span>
              <strong className="text-aurelle-ink font-medium">
                {item.selectedColor}
              </strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>Size:</span>
              <strong className="text-aurelle-ink font-medium">
                {item.selectedSize}
              </strong>
            </span>
          </div>

          {/* Single Item Price */}
          <p className="text-xs text-aurelle-charcoal font-semibold mt-1">
            {formatPrice(item.pricePaise)} each
          </p>
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="flex items-center justify-between pt-2 mt-2">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-aurelle-border bg-white h-9 sm:h-8">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
              className="px-3 sm:px-2.5 h-full text-aurelle-charcoal hover:bg-aurelle-sand disabled:opacity-30 transition-colors flex items-center justify-center min-w-[34px] sm:min-w-[28px]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            </button>
            <span className="w-8 text-center font-sans text-xs font-semibold text-aurelle-ink">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, 1)}
              disabled={item.quantity >= item.stockLimit}
              className="px-3 sm:px-2.5 h-full text-aurelle-charcoal hover:bg-aurelle-sand disabled:opacity-30 transition-colors flex items-center justify-center min-w-[34px] sm:min-w-[28px]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            </button>
          </div>

          {/* Line Subtotal */}
          <div className="text-right">
            <span className="text-xs sm:text-sm font-semibold text-aurelle-ink">
              {formatPrice(item.pricePaise * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
