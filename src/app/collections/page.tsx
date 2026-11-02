import * as React from "react";
import type { Metadata } from "next";
import { CollectionView } from "@/components/collections/collection-view";
import { SortOption } from "@/components/collections/sort-dropdown";

export const metadata: Metadata = {
  title: "Haute Collections | AURELLE Luxury Indian Fashion",
  description:
    "Explore our complete catalog of handwoven Banarasi sarees, bridal lehengas, festive anarkalis, and artisanal silk dupattas.",
};

interface CollectionsPageProps {
  searchParams?: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const initialCategory = searchParams?.category || "all";
  const initialSearch = searchParams?.search || "";
  const initialSort = (searchParams?.sort as SortOption) || "featured";

  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-aurelle-ivory">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-aurelle-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-aurelle-muted">
              Loading Haute Catalog...
            </p>
          </div>
        </div>
      }
    >
      <CollectionView
        initialCategory={initialCategory}
        initialSearch={initialSearch}
        initialSort={initialSort}
      />
    </React.Suspense>
  );
}
