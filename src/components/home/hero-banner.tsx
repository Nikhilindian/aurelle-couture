"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#181615] text-white">
      {/* Background Editorial Image with Luxury Gradients */}
      <div className="absolute inset-0 z-0 opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out">
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
          alt="Aurelle Handcrafted Autumn Couture Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181615]/90 via-[#181615]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181615] via-transparent to-black/30" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="min-h-[70vh] sm:min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center py-12 sm:py-20 max-w-2xl">
          <div className="space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex">
              <Badge variant="gold" className="tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[10px]">
                The Autumn Royalty Edit • 2026
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-wide text-[#FDFBF7] leading-[1.15] sm:leading-[1.1]">
              Heirloom Silks, <br />
              <span className="italic font-light text-aurelle-gold-light">
                Eternal Grace.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#C9C3BA] leading-relaxed max-w-xl font-sans tracking-wide">
              Hand-spun mulberry weaves, real silver kadwa zari, and couture silhouettes born on ancestral looms in Varanasi. Made for the moments that transcend time.
            </p>

            {/* Editorial CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="#new-arrivals">
                <Button
                  variant="burgundy"
                  size="lg"
                  className="w-full sm:w-auto tracking-[0.2em] px-6 sm:px-8"
                >
                  Explore New Arrivals
                </Button>
              </Link>
              <Link href="#collections">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/60 text-white hover:bg-white hover:text-aurelle-ink tracking-[0.2em] px-6 sm:px-8"
                >
                  View Collections
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-6 max-w-md">
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-aurelle-gold">
                  100%
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9E978F] block">
                  Pure Silk Mark
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-aurelle-gold">
                  24+
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9E978F] block">
                  Days Per Loom
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-aurelle-gold">
                  Pan-India
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9E978F] block">
                  Insured Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
