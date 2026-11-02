import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-aurelle-ivory min-h-screen py-10 sm:py-16 text-left">
      <Container size="default">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-aurelle-muted mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-aurelle-burgundy transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-aurelle-ink font-semibold">Our Maison Story</span>
        </nav>

        <div className="space-y-12 max-w-4xl">
          {/* Hero Story Block */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-aurelle-burgundy block">
              The Living Archive of Indian Weaves
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-aurelle-ink leading-tight">
              Honoring Ancestral Looms, <br />
              Draping Contemporary Royalty.
            </h1>
            <p className="text-sm sm:text-base text-aurelle-charcoal leading-relaxed font-sans max-w-2xl">
              Aurelle was founded with a singular conviction: that India&apos;s classical handloom treasures should not exist merely in museums or archived royal collections, but as living, breathing heirlooms worn for moments of celebration and heritage.
            </p>
          </div>

          {/* Visual Editorial Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-aurelle-sand border border-aurelle-border">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
              alt="Varanasi pit loom artisan master weaving kadwa zari"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 sm:p-8">
              <p className="text-xs sm:text-sm text-white/90 font-serif italic max-w-lg">
                &ldquo;Every warp and weft is a conversation across generations — pure mulberry silk spun by hand, woven thread by thread on Varanasi pit-looms.&rdquo;
              </p>
            </div>
          </div>

          {/* Three Pillars of Aurelle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-white border border-aurelle-border space-y-3">
              <div className="w-10 h-10 rounded-full bg-aurelle-sand/50 flex items-center justify-center text-aurelle-burgundy">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-aurelle-ink">
                Pure Mulberry Katan
              </h3>
              <p className="text-xs text-aurelle-muted leading-relaxed font-sans">
                We exclusively source certified Mulberry silk cocoons, naturally reeling the filament to preserve structural sheen and natural thermal breathability.
              </p>
            </div>

            <div className="p-6 bg-white border border-aurelle-border space-y-3">
              <div className="w-10 h-10 rounded-full bg-aurelle-sand/50 flex items-center justify-center text-aurelle-burgundy">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-aurelle-ink">
                Silk Mark Authenticity
              </h3>
              <p className="text-xs text-aurelle-muted leading-relaxed font-sans">
                Every saree, lehenga, and dupatta bears an official Silk Mark Organization of India certification hologram to safeguard patrons against synthetic imitations.
              </p>
            </div>

            <div className="p-6 bg-white border border-aurelle-border space-y-3">
              <div className="w-10 h-10 rounded-full bg-aurelle-sand/50 flex items-center justify-center text-aurelle-burgundy">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-aurelle-ink">
                Direct Weaver Patronage
              </h3>
              <p className="text-xs text-aurelle-muted leading-relaxed font-sans">
                By eliminating exploitative intermediary middlemen, 100% of fair artisan compensation is transferred directly to weaver families in Uttar Pradesh and Madhya Pradesh.
              </p>
            </div>
          </div>

          {/* Explore Collections CTA */}
          <div className="pt-8 border-t border-aurelle-border text-center space-y-4">
            <h2 className="font-serif text-2xl text-aurelle-ink">
              Discover Our Heirloom Weaves
            </h2>
            <Link href="/collections">
              <Button variant="burgundy" size="lg" className="tracking-widest text-xs uppercase px-8">
                Explore Current Collections
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
