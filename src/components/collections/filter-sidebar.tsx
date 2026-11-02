"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, RotateCcw, Check } from "lucide-react";

export interface FilterState {
  search: string;
  category: string;
  subCategory?: string;
  selectedColors: string[];
  selectedSizes: string[];
  priceRange: string;
  inStockOnly: boolean;
}

export interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalResults: number;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
  totalResults,
}: FilterSidebarProps) {
  const colorOptions = [
    { name: "Crimson Red", hex: "#7A1C20" },
    { name: "Emerald Green", hex: "#1A4329" },
    { name: "Royal Navy", hex: "#162544" },
    { name: "Deep Wine", hex: "#4A1521" },
    { name: "Mustard Gold", hex: "#D4A340" },
    { name: "Blush Pink", hex: "#D9A5B3" },
    { name: "Ivory Pearl", hex: "#F5F1E9" },
    { name: "Champagne Gold", hex: "#CDB38B" },
  ];

  const sizeOptions = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "Unstitched (6.5m with Blouse)",
    "Custom Tailored",
    "Free Size (2.5m x 1m)",
  ];

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under ₹20,000", value: "under-20k" },
    { label: "₹20,000 to ₹40,000", value: "20k-40k" },
    { label: "₹40,000 to ₹70,000", value: "40k-70k" },
    { label: "Above ₹70,000 (Bridal)", value: "above-70k" },
  ];

  const toggleColor = (colorName: string) => {
    const exists = filters.selectedColors.includes(colorName);
    const updated = exists
      ? filters.selectedColors.filter((c) => c !== colorName)
      : [...filters.selectedColors, colorName];
    onFilterChange({ ...filters, selectedColors: updated });
  };

  const toggleSize = (size: string) => {
    const exists = filters.selectedSizes.includes(size);
    const updated = exists
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onFilterChange({ ...filters, selectedSizes: updated });
  };

  const filterContent = (
    <div className="space-y-8 text-left">
      {/* 1. Search Filter */}
      <div className="space-y-2">
        <label
          htmlFor="catalog-search"
          className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal block"
        >
          Search Catalog
        </label>
        <div className="relative">
          <Input
            id="catalog-search"
            placeholder="Search silk, zari, anarkali..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="pl-9 text-xs h-10"
          />
          <Search className="w-4 h-4 text-aurelle-muted absolute left-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* 2. Availability Filter */}
      <div className="pt-4 border-t border-aurelle-border">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 accent-aurelle-burgundy rounded-none border-aurelle-border cursor-pointer"
          />
          <span className="text-xs uppercase tracking-wider text-aurelle-charcoal font-medium">
            In-Stock Ready to Dispatch
          </span>
        </label>
      </div>

      {/* 3. Price Tier */}
      <div className="pt-4 border-t border-aurelle-border space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal">
          Price Range (INR)
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-2.5 text-xs text-aurelle-charcoal cursor-pointer select-none"
            >
              <input
                type="radio"
                name="priceTier"
                checked={filters.priceRange === range.value}
                onChange={() =>
                  onFilterChange({ ...filters, priceRange: range.value })
                }
                className="w-3.5 h-3.5 accent-aurelle-burgundy cursor-pointer"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Color Swatches */}
      <div className="pt-4 border-t border-aurelle-border space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal">
          Color Palette
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {colorOptions.map((c) => {
            const isSelected = filters.selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleColor(c.name)}
                className={`flex items-center gap-2 px-2.5 py-1.5 text-[11px] border text-left transition-all ${
                  isSelected
                    ? "border-aurelle-burgundy bg-aurelle-sand font-semibold text-aurelle-ink"
                    : "border-aurelle-border bg-white text-aurelle-charcoal hover:border-aurelle-muted"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 flex items-center justify-center text-white"
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                <span className="truncate">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Size / Silhouette */}
      <div className="pt-4 border-t border-aurelle-border space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal">
          Size & Measurements
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => {
            const isSelected = filters.selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`text-[11px] px-2.5 py-1.5 border transition-all ${
                  isSelected
                    ? "bg-aurelle-ink text-white border-aurelle-ink font-semibold"
                    : "bg-white text-aurelle-charcoal border-aurelle-border hover:border-aurelle-muted"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Reset Filters Button */}
      <div className="pt-4 border-t border-aurelle-border">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full gap-2 border-aurelle-border text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 bg-white border border-aurelle-border p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-aurelle-border">
            <span className="text-xs font-serif text-aurelle-ink font-bold uppercase tracking-wider">
              Filter Catalog
            </span>
            <span className="text-[11px] text-aurelle-muted">
              {totalResults} items
            </span>
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer Sheet */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter Catalog"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-aurelle-border mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg text-aurelle-ink font-normal">
                    Filters
                  </span>
                  <span className="text-[11px] text-aurelle-muted font-medium">
                    ({totalResults} items)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-xs uppercase tracking-wider text-aurelle-burgundy hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center p-1.5 text-aurelle-ink hover:text-aurelle-burgundy"
                    aria-label="Close Filter Sheet"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {filterContent}
            </div>

            <div className="pt-4 mt-6 border-t border-aurelle-border sticky bottom-0 bg-white">
              <Button
                variant="burgundy"
                size="md"
                className="w-full text-xs uppercase tracking-widest font-semibold"
                onClick={onCloseMobile}
              >
                Apply Filters ({totalResults} Items)
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
