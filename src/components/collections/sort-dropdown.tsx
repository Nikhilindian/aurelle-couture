"use client";

import * as React from "react";
import { ArrowUpDown, Check, ChevronDown, X } from "lucide-react";

export type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

export interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

export const SORT_OPTIONS: { value: SortOption; label: string; shortLabel: string }[] = [
  { value: "featured", label: "Recommended", shortLabel: "Recommended" },
  { value: "newest", label: "What's New", shortLabel: "Newest" },
  { value: "price-low", label: "Price: Low to High", shortLabel: "Price ↑" },
  { value: "price-high", label: "Price: High to Low", shortLabel: "Price ↓" },
  { value: "rating", label: "Customer Rating", shortLabel: "Rating" },
];

export function SortDropdown({
  currentSort,
  onSortChange,
  className = "",
}: SortDropdownProps) {
  const currentItem = SORT_OPTIONS.find((s) => s.value === currentSort) || SORT_OPTIONS[0];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center gap-2 bg-white border border-aurelle-border/80 px-3.5 py-2 rounded-lg text-xs text-aurelle-ink hover:border-aurelle-burgundy transition-colors shadow-2xs">
        <ArrowUpDown className="w-3.5 h-3.5 text-aurelle-burgundy shrink-0" />
        <span className="text-[11px] text-aurelle-muted uppercase tracking-wider hidden md:inline">
          Sort by:
        </span>
        <span className="font-semibold">{currentItem.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-aurelle-muted ml-1" />

        {/* Native select overlay for accessible desktop interaction */}
        <select
          id="sort-select"
          value={currentSort}
          aria-label="Sort products by"
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Mobile Bottom Sheet for Sorting (Myntra / Ajio style)
 */
export function MobileSortModal({
  isOpen,
  onClose,
  currentSort,
  onSortChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-up Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl z-10 overflow-hidden animate-slideUp">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-aurelle-border/60">
          <span className="text-xs uppercase tracking-widest font-bold text-aurelle-charcoal">
            Sort By
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-aurelle-charcoal hover:bg-neutral-100"
            aria-label="Close sort menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Radio Options List */}
        <div className="p-3 divide-y divide-neutral-100">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSortChange(opt.value);
                  onClose();
                }}
                className={`w-full flex items-center justify-between py-3.5 px-4 text-left text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-lg ${
                  isSelected
                    ? "font-bold text-aurelle-burgundy bg-aurelle-sand/40"
                    : "text-aurelle-ink hover:bg-neutral-50 font-medium"
                }`}
              >
                <span>{opt.label}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-aurelle-burgundy bg-aurelle-burgundy text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
