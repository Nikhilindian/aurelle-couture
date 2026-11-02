import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full bg-aurelle-ivory min-h-[75vh] flex items-center justify-center py-16 text-center">
      <Container size="default">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-aurelle-sand/60 border border-aurelle-border text-[10px] uppercase tracking-widest text-aurelle-burgundy font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-aurelle-gold" />
            <span>Archive Reference 404</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-aurelle-ink">
            Drape Not Found
          </h1>

          <p className="text-xs sm:text-sm text-aurelle-muted leading-relaxed font-sans">
            The creation or archive page you sought has either been archived into our private vaults or moved. Allow us to guide you back to our active loom collections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="burgundy" size="lg" className="w-full text-xs tracking-widest uppercase">
                Return to Atelier
              </Button>
            </Link>
            <Link href="/collections" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
