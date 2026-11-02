"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BrandStory() {
  return (
    <section className="py-12 sm:py-24 bg-white border-b border-aurelle-border overflow-hidden">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex">
              <Badge variant="gold">The Aurelle Atelier & Heritage</Badge>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-aurelle-ink font-normal leading-tight">
              Honoring Century-Old Weaving Guilds of Varanasi
            </h2>

            <p className="text-xs sm:text-sm text-aurelle-charcoal leading-relaxed font-sans">
              Founded on the belief that true luxury is slow, patient, and deeply rooted in culture, Aurelle works directly with master weaver families across Uttar Pradesh and Madhya Pradesh.
            </p>

            <p className="text-xs sm:text-sm text-aurelle-muted leading-relaxed font-sans">
              Each drape is woven on hand-operated pit looms taking anywhere from 18 to 45 days. We do not mass-manufacture or cut corners; our threads are 100% natural mulberry silk and electroplated zari tested for generational longevity.
            </p>

            {/* Atelier Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-aurelle-border">
              <div>
                <h4 className="font-serif text-base sm:text-lg text-aurelle-ink font-medium">
                  Artisan First
                </h4>
                <p className="text-[11px] text-aurelle-muted mt-1 leading-normal">
                  Fair trade ethical wages and healthcare pensions for over 120 artisan households.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-base sm:text-lg text-aurelle-ink font-medium">
                  Silk Mark Certified
                </h4>
                <p className="text-[11px] text-aurelle-muted mt-1 leading-normal">
                  Authenticity tested purity certificate accompanied with every single drape.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="#brand-story">
                <Button variant="outline" size="md">
                  Read Our Full Chronicle
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden bg-aurelle-sand border border-aurelle-border shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
                alt="Master weaver crafting intricate zari brocade on handloom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            {/* Floating Luxury Stamp */}
            <div className="absolute -bottom-6 -left-4 sm:left-6 bg-aurelle-ink text-white p-5 border border-aurelle-gold/40 shadow-xl max-w-xs text-left hidden sm:block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-aurelle-gold block mb-1">
                Preserving Craft
              </span>
              <p className="font-serif text-sm italic text-white/90">
                “A handloom saree is not an outfit; it is the living breath of our civilization.”
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
