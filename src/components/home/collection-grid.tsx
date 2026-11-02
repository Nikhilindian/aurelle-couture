"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MOCK_COLLECTIONS } from "@/data/mock-catalog";
import { ArrowUpRight } from "lucide-react";

export function CollectionGrid() {
  const getCategoryParam = (slug: string) => {
    switch (slug) {
      case "banarasi-sarees":
        return "Sarees";
      case "bridal-lehengas":
        return "Lehengas";
      case "kurta-sets":
        return "Kurta Sets";
      case "chanderi-dupattas":
        return "Dupattas";
      default:
        return "all";
    }
  };

  return (
    <section id="collections" className="py-12 sm:py-20 bg-aurelle-ivory border-b border-aurelle-border">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4 text-left">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block mb-2">
              Curated Silhouettes
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-aurelle-ink font-normal">
              Signature Collections
            </h2>
          </div>
          <p className="text-xs text-aurelle-muted max-w-md leading-relaxed font-sans">
            Explore dedicated showcases curated for festive soirees, bridal grandeur, and timeless everyday poise.
          </p>
        </div>

        {/* 4-Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/collections?category=${encodeURIComponent(getCategoryParam(col.slug))}`}
              className="group relative block overflow-hidden bg-white border border-aurelle-border transition-all duration-300 hover:shadow-lg"
            >
              {/* Image Aspect Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-aurelle-sand">
                <Image
                  src={col.imageUrl}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Corner Piece Count */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/40 backdrop-blur-md px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] text-white tracking-widest uppercase border border-white/20">
                  {col.itemCount} Designs
                </div>

                {/* Bottom Overlay Details */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg sm:text-xl tracking-wide group-hover:text-aurelle-gold-light transition-colors">
                      {col.title}
                    </h3>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 group-hover:bg-aurelle-burgundy group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#D8D2CA] line-clamp-2 mt-1.5 leading-relaxed font-sans">
                    {col.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
