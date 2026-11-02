"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { CollectionHeader } from "@/components/collections/collection-header";
import {
  FilterSidebar,
  FilterState,
} from "@/components/collections/filter-sidebar";
import {
  SortDropdown,
  SortOption,
  MobileSortModal,
  SORT_OPTIONS,
} from "@/components/collections/sort-dropdown";
import { MOCK_PRODUCTS } from "@/data/mock-catalog";
import {
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  X,
  Zap,
} from "lucide-react";

export interface CollectionViewProps {
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: SortOption;
}

export function CollectionView({
  initialCategory = "all",
  initialSearch = "",
  initialSort = "featured",
}: CollectionViewProps) {
  const searchParams = useSearchParams();

  // Prefer URL search params if changed dynamically, else initial props
  const categoryParam = searchParams.get("category") || initialCategory;
  const searchParam = searchParams.get("search") || initialSearch;
  const sortParam = (searchParams.get("sort") as SortOption) || initialSort;

  const [filters, setFilters] = React.useState<FilterState>({
    search: searchParam,
    category: categoryParam,
    subCategory: "all",
    selectedColors: [],
    selectedSizes: [],
    priceRange: "all",
    inStockOnly: false,
  });

  const [sortOption, setSortOption] = React.useState<SortOption>(sortParam);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = React.useState(false);

  const ITEMS_PER_PAGE = 8;

  // React to searchParam changes when user clicks navigation links
  React.useEffect(() => {
    if (searchParams.get("category")) {
      const param = searchParams.get("category") || "all";
      setFilters((prev) => ({
        ...prev,
        category: param,
        subCategory: "all",
      }));
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Sync category changes with filter state
  const handleSelectCategory = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat, subCategory: "all" }));
    setCurrentPage(1);
  };

  const handleSelectSubCategory = (subCat: string) => {
    setFilters((prev) => ({ ...prev, subCategory: subCat }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      subCategory: "all",
      selectedColors: [],
      selectedSizes: [],
      priceRange: "all",
      inStockOnly: false,
    });
    setSortOption("featured");
    setCurrentPage(1);
  };

  // Filter products pipeline
  const filteredProducts = React.useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 0. Only show active (published) products to customers
      if (product.status && product.status !== "active") {
        return false;
      }

      // 1. Main Category
      if (filters.category && filters.category !== "all") {
        const catFilter = filters.category.toLowerCase();
        const matchesCatName = product.category.toLowerCase() === catFilter;
        const matchesCatSlug = product.categorySlug.toLowerCase() === catFilter;
        const matchesSubCat = !!product.subCategory && product.subCategory.toLowerCase() === catFilter;
        if (!matchesCatName && !matchesCatSlug && !matchesSubCat) return false;
      }

      // 1.5. Sub-Category
      if (filters.subCategory && filters.subCategory !== "all") {
        const subFilter = filters.subCategory.toLowerCase();
        const matchesSubCat = !!product.subCategory && product.subCategory.toLowerCase() === subFilter;
        const matchesCat = product.category.toLowerCase() === subFilter;
        if (!matchesSubCat && !matchesCat) return false;
      }

      // 2. Search text
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchesFabric = product.fabric.toLowerCase().includes(q);
        const matchesCraft = product.craft.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle && !matchesFabric && !matchesCraft && !matchesCategory) {
          return false;
        }
      }

      // 3. In-Stock only
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // 4. Price range
      if (filters.priceRange === "under-20k" && product.pricePaise >= 2000000) return false;
      if (
        filters.priceRange === "20k-40k" &&
        (product.pricePaise < 2000000 || product.pricePaise > 4000000)
      )
        return false;
      if (
        filters.priceRange === "40k-70k" &&
        (product.pricePaise < 4000000 || product.pricePaise > 7000000)
      )
        return false;
      if (filters.priceRange === "above-70k" && product.pricePaise <= 7000000) return false;

      // 5. Colors
      if (filters.selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some((c) =>
          filters.selectedColors.includes(c.name)
        );
        if (!hasMatchingColor) return false;
      }

      // 6. Sizes
      if (filters.selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some((s) =>
          filters.selectedSizes.includes(s)
        );
        if (!hasMatchingSize) return false;
      }

      return true;
    });
  }, [filters]);

  // Sort products pipeline
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "price-low":
        return list.sort((a, b) => a.pricePaise - b.pricePaise);
      case "price-high":
        return list.sort((a, b) => b.pricePaise - a.pricePaise);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "newest":
        return list.sort(
          (a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)
        );
      case "featured":
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const activeFacetCount =
    (filters.search ? 1 : 0) +
    (filters.subCategory && filters.subCategory !== "all" ? 1 : 0) +
    (filters.priceRange !== "all" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    filters.selectedColors.length +
    filters.selectedSizes.length;

  const hasActiveFacetFilters = activeFacetCount > 0;

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortOption)?.shortLabel || "Recommended";

  return (
    <div className="w-full bg-aurelle-ivory min-h-screen">
      {/* 1. Collection Editorial Banner & Tabs */}
      <CollectionHeader
        currentCategory={filters.category}
        onSelectCategory={handleSelectCategory}
        currentSubCategory={filters.subCategory}
        onSelectSubCategory={handleSelectSubCategory}
        totalCount={filteredProducts.length}
        searchQuery={filters.search}
        onSearchChange={(q) => {
          setFilters((prev) => ({ ...prev, search: q }));
          setCurrentPage(1);
        }}
      />

      {/* 2. Sleek E-Commerce Control Bar (Myntra / Ajio / Amazon style) */}
      {/* Mobile Sticky Filter/Sort Bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-aurelle-border shadow-2xs">
        <div className="grid grid-cols-2 divide-x divide-aurelle-border">
          {/* Sort Button */}
          <button
            type="button"
            onClick={() => setIsSortSheetOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-2 text-xs uppercase tracking-wider font-semibold text-aurelle-ink hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-aurelle-burgundy" />
            <span className="truncate">Sort: {currentSortLabel}</span>
          </button>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-2 text-xs uppercase tracking-wider font-semibold text-aurelle-ink hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-aurelle-burgundy" />
            <span>Filter</span>
            {activeFacetCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-aurelle-burgundy text-white text-[10px] font-bold flex items-center justify-center">
                {activeFacetCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Fast-Filter Horizontal Chips (Myntra & Flipkart style) */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 px-3 border-t border-neutral-100 bg-[#FCFBF8] scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* In-Stock Fast Toggle */}
          <button
            type="button"
            onClick={() => {
              setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-[11px] rounded-full whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1 ${
              filters.inStockOnly
                ? "bg-aurelle-burgundy text-white border-aurelle-burgundy font-semibold"
                : "bg-white text-aurelle-charcoal border-aurelle-border hover:border-aurelle-muted"
            }`}
          >
            <Zap className="w-3 h-3" />
            Ready to Ship
          </button>

          {/* Price Fast Toggles */}
          {[
            { label: "Under ₹20k", value: "under-20k" },
            { label: "₹20k - ₹40k", value: "20k-40k" },
            { label: "₹40k - ₹70k", value: "40k-70k" },
            { label: "Above ₹70k", value: "above-70k" },
          ].map((tier) => {
            const isSelected = filters.priceRange === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: isSelected ? "all" : tier.value,
                  }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-[11px] rounded-full whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-aurelle-burgundy text-white border-aurelle-burgundy font-semibold"
                    : "bg-white text-aurelle-charcoal border-aurelle-border hover:border-aurelle-muted"
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      <Container size="wide" className="py-4 sm:py-6">
        {/* Desktop Top Control Bar */}
        <div className="hidden lg:flex items-center justify-between pb-4 mb-4 border-b border-aurelle-border">
          <div className="text-xs uppercase tracking-wider text-aurelle-muted font-medium">
            Showing <strong className="text-aurelle-ink font-semibold">{paginatedProducts.length}</strong> of {sortedProducts.length} Creations
          </div>

          <div className="flex items-center gap-4">
            <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
          </div>
        </div>

        {/* Lightweight Active Filters Row (Zero bulky boxes!) */}
        {hasActiveFacetFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs animate-fadeIn">
            <span className="text-[11px] uppercase tracking-wider text-aurelle-muted font-semibold mr-1">
              Active Filters:
            </span>

            {/* Sub-Category pill */}
            {filters.subCategory && filters.subCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-aurelle-ink border border-aurelle-border text-[11px] shadow-2xs">
                {filters.subCategory}
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, subCategory: "all" }));
                    setCurrentPage(1);
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Search query pill */}
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-aurelle-ink border border-aurelle-border text-[11px] shadow-2xs">
                &ldquo;{filters.search}&rdquo;
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, search: "" }));
                    setCurrentPage(1);
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Price pill */}
            {filters.priceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-aurelle-ink border border-aurelle-border text-[11px] shadow-2xs">
                {filters.priceRange === "under-20k" && "Under ₹20,000"}
                {filters.priceRange === "20k-40k" && "₹20,000 - ₹40,000"}
                {filters.priceRange === "40k-70k" && "₹40,000 - ₹70,000"}
                {filters.priceRange === "above-70k" && "Above ₹70,000"}
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, priceRange: "all" }));
                    setCurrentPage(1);
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* In-stock pill */}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-aurelle-ink border border-aurelle-border text-[11px] shadow-2xs">
                Ready to Ship
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, inStockOnly: false }));
                    setCurrentPage(1);
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Colors */}
            {filters.selectedColors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-aurelle-ink border border-aurelle-border text-[11px] shadow-2xs"
              >
                {color}
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedColors: prev.selectedColors.filter((c) => c !== color),
                    }));
                    setCurrentPage(1);
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Sizes */}
            {filters.selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-aurelle-ink border border-aurelle-border text-[11px] shadow-2xs"
              >
                {size}
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedSizes: prev.selectedSizes.filter((s) => s !== size),
                    }));
                    setCurrentPage(1);
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Clear All text button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] uppercase tracking-wider text-aurelle-burgundy hover:underline font-semibold ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Catalog Flex Layout */}
        <div className="flex gap-10 items-start">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={(f) => {
              setFilters(f);
              setCurrentPage(1);
            }}
            onReset={handleResetFilters}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            totalResults={sortedProducts.length}
          />

          {/* Product Grid / Empty State */}
          <div className="flex-1 w-full">
            {paginatedProducts.length > 0 ? (
              <div className="space-y-12">
                {/* 2-Column Grid on Mobile, 3-Column on Desktop (The Souled Store Layout) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-aurelle-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-2 order-2 sm:order-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="gap-1.5 text-xs border-aurelle-border min-h-[40px] px-3.5"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="gap-1.5 text-xs border-aurelle-border min-h-[40px] px-3.5"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full order-1 sm:order-2">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[36px] h-9 px-2 text-xs font-semibold uppercase transition-all shrink-0 ${
                              isCurrent
                                ? "bg-aurelle-burgundy text-white shadow-xs"
                                : "bg-white text-aurelle-charcoal border border-aurelle-border hover:bg-aurelle-sand"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="py-20 px-6 text-center bg-white border border-aurelle-border space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 mx-auto rounded-full bg-aurelle-sand flex items-center justify-center text-aurelle-burgundy">
                  <PackageOpen className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-aurelle-ink">
                  No Drapes Match Your Criteria
                </h3>
                <p className="text-xs text-aurelle-muted leading-relaxed max-w-md mx-auto">
                  We could not find any creations matching your active combination of search query and filters. Try adjusting or clearing filters to view our full collection.
                </p>
                <div className="pt-2">
                  <Button
                    variant="burgundy"
                    size="md"
                    onClick={handleResetFilters}
                    className="gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Sort Slide-Up Modal (Myntra / Ajio style) */}
      <MobileSortModal
        isOpen={isSortSheetOpen}
        onClose={() => setIsSortSheetOpen(false)}
        currentSort={sortOption}
        onSortChange={(s) => {
          setSortOption(s);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
