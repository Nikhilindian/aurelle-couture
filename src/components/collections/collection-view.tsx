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
} from "@/components/collections/sort-dropdown";
import { MOCK_PRODUCTS } from "@/data/mock-catalog";
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
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

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    (filters.subCategory && filters.subCategory !== "all") ||
    filters.selectedColors.length > 0 ||
    filters.selectedSizes.length > 0 ||
    filters.priceRange !== "all" ||
    filters.inStockOnly;

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

      {/* 2. Main Catalog Body with Sidebar and Grid */}
      <Container size="wide" className="py-12">
        {/* Top Control Bar: Mobile Filter Trigger & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-6 mb-8 border-b border-aurelle-border gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden gap-2 text-xs border-aurelle-border"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-aurelle-burgundy" />
              Filter Catalog ({filteredProducts.length})
            </Button>

            <span className="text-xs uppercase tracking-wider text-aurelle-muted font-medium hidden sm:inline-block">
              Showing{" "}
              <strong className="text-aurelle-ink font-semibold">
                {paginatedProducts.length}
              </strong>{" "}
              of {sortedProducts.length} Creations
            </span>
          </div>

          {/* Sort Selector */}
          <SortDropdown
            currentSort={sortOption}
            onSortChange={(s) => {
              setSortOption(s);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-white border border-aurelle-border text-xs">
            <span className="text-[11px] uppercase tracking-wider text-aurelle-muted font-semibold mr-1">
              Active Filters:
            </span>
            {filters.category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]">
                Category: {filters.category}
              </span>
            )}
            {filters.subCategory && filters.subCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]">
                Sub-Category: {filters.subCategory}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]">
                Search: &ldquo;{filters.search}&rdquo;
              </span>
            )}
            {filters.priceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]">
                Price Filter Active
              </span>
            )}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]">
                In-Stock Only
              </span>
            )}
            {filters.selectedColors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]"
              >
                Color: {color}
              </span>
            ))}
            {filters.selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-aurelle-cream text-aurelle-ink border border-aurelle-border text-[11px]"
              >
                Size: {size}
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] uppercase tracking-wider text-aurelle-burgundy hover:underline font-semibold ml-2"
            >
              Reset All
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
    </div>
  );
}
