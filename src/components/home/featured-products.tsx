"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { MockProduct } from "@/data/mock-catalog";
import { ArrowRight } from "lucide-react";

export interface FeaturedProductsProps {
  id?: string;
  badge: string;
  title: string;
  subtitle: string;
  products: MockProduct[];
  viewAllHref?: string;
}

export function FeaturedProducts({
  id,
  badge,
  title,
  subtitle,
  products,
  viewAllHref = "/collections",
}: FeaturedProductsProps) {
  return (
    <section id={id} className="py-20 bg-aurelle-sand/40 border-b border-aurelle-border">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-2">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-aurelle-ink font-normal">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-aurelle-muted max-w-sm hidden sm:block font-sans">
              {subtitle}
            </p>
            <Link href={viewAllHref}>
              <Button variant="outline" size="sm" className="gap-2">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Grid (2-Column Mobile, 4-Column Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
