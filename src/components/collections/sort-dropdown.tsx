"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";

export type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

export interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortDropdown({
  currentSort,
  onSortChange,
}: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-[11px] uppercase tracking-wider text-aurelle-muted font-medium hidden sm:inline-flex items-center gap-1.5"
      >
        <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="h-10 border border-aurelle-border bg-white px-3 py-1.5 text-xs text-aurelle-ink font-sans uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-burgundy cursor-pointer hover:border-aurelle-muted transition-colors"
      >
        <option value="featured">Featured Curations</option>
        <option value="newest">Newest Arrivals</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}
