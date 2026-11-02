import * as React from "react";
import { HeroBanner } from "@/components/home/hero-banner";
import { TrustStrip } from "@/components/home/trust-strip";
import { CollectionGrid } from "@/components/home/collection-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BrandStory } from "@/components/home/brand-story";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { MOCK_PRODUCTS } from "@/data/mock-catalog";

export default function HomePage() {
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNewArrival);
  const bestsellers = MOCK_PRODUCTS.filter((p) => p.isBestseller);

  return (
    <main className="w-full">
      {/* 1. Editorial Luxury Hero */}
      <HeroBanner />

      {/* 2. Craft & Trust Value Strip */}
      <TrustStrip />

      {/* 3. Signature Collections Grid */}
      <CollectionGrid />

      {/* 4. New Arrivals Preview */}
      <FeaturedProducts
        id="new-arrivals"
        badge="Fresh From The Looms"
        title="The New Arrivals"
        subtitle="Recently completed weaves in pure katan, tissue silk, and hand-cut zardozi."
        products={newArrivals}
        viewAllHref="#collections"
      />

      {/* 5. The Atelier & Artisan Story */}
      <BrandStory />

      {/* 6. Signature Bestsellers */}
      <FeaturedProducts
        id="bestsellers"
        badge="Iconic Silhouettes"
        title="Patron Favorites"
        subtitle="Timeless heritage pieces cherished across festive celebrations and weddings."
        products={bestsellers}
        viewAllHref="#collections"
      />

      {/* 7. The Aurelle Circle Newsletter & VIP Club */}
      <NewsletterSection />
    </main>
  );
}
