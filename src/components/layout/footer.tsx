"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#161413] text-[#F3EFE6] border-t border-aurelle-charcoal/60 mt-auto">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#2A2624] py-8 sm:py-10">
        <Container size="wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="flex items-center gap-3 p-2">
              <Sparkles className="w-5 h-5 text-aurelle-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                  Artisanal Craft
                </h4>
                <p className="text-[11px] text-[#A69E96]">Handwoven authentic textiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <Truck className="w-5 h-5 text-aurelle-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                  Pan-India Delivery
                </h4>
                <p className="text-[11px] text-[#A69E96]">Express insured courier shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <RotateCcw className="w-5 h-5 text-aurelle-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                  Hassle-Free Returns
                </h4>
                <p className="text-[11px] text-[#A69E96]">7-day easy exchange support</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <ShieldCheck className="w-5 h-5 text-aurelle-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                  Secure Checkout
                </h4>
                <p className="text-[11px] text-[#A69E96]">UPI, Cards & COD available</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Content */}
      <div className="py-14">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand Intro & Newsletter */}
            <div className="md:col-span-5 space-y-5 text-left">
              <span className="font-serif text-2xl tracking-[0.25em] text-white block uppercase">
                A U R E L L E
              </span>
              <p className="text-xs text-[#A69E96] leading-relaxed max-w-sm">
                Curating timeless Indian luxury with hand-spun silks, zari embroideries, and refined silhouettes honoring multi-generational weaver communities.
              </p>

              {/* Newsletter subscription shell */}
              <div className="pt-2">
                <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-2">
                  The Aurelle Gazette
                </h5>
                <p className="text-[11px] text-[#8C847C] mb-3">
                  Subscribe for private capsule previews, bridal showcases, and cultural chronicles.
                </p>
                {subscribed ? (
                  <p className="text-xs text-green-400 font-medium">
                    Thank you for subscribing to Aurelle.
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#211E1C] border-[#38332F] text-white placeholder:text-[#7A726A] focus-visible:ring-aurelle-gold text-xs h-10"
                    />
                    <Button
                      type="submit"
                      variant="burgundy"
                      size="sm"
                      className="shrink-0 px-4 h-10"
                    >
                      Join
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Shop Categories */}
            <div className="md:col-span-2 space-y-3 text-left">
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white">
                Collections
              </h5>
              <ul className="text-xs space-y-2.5 text-[#A69E96]">
                <li><Link href="/collections?category=Sarees" className="hover:text-white transition-colors">Banarasi Sarees</Link></li>
                <li><Link href="/collections?category=Lehengas" className="hover:text-white transition-colors">Bridal Lehengas</Link></li>
                <li><Link href="/collections?category=Kurta+Sets" className="hover:text-white transition-colors">Anarkali &amp; Kurta Sets</Link></li>
                <li><Link href="/collections?category=Dupattas" className="hover:text-white transition-colors">Chanderi Silks &amp; Dupattas</Link></li>
                <li><Link href="/collections" className="hover:text-white transition-colors">Full Archive</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="md:col-span-2 space-y-3 text-left">
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white">
                Customer Care
              </h5>
              <ul className="text-xs space-y-2.5 text-[#A69E96]">
                <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link href="/returns-exchange" className="hover:text-white transition-colors">Returns &amp; Exchanges</Link></li>
                <li><Link href="/account" className="hover:text-white transition-colors">Patron Account</Link></li>
                <li><a href="mailto:concierge@aurelle.in" className="hover:text-white transition-colors">Concierge &amp; Contact</a></li>
              </ul>
            </div>

            {/* Legal / Policy */}
            <div className="md:col-span-3 space-y-3 text-left">
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white">
                Our Maison
              </h5>
              <ul className="text-xs space-y-2.5 text-[#A69E96]">
                <li><Link href="/about" className="hover:text-white transition-colors">The Brand Story</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Artisan Heritage</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li className="pt-2 text-[11px] text-[#7A726A]">
                  Concierge: <span className="text-[#C5A880]">concierge@aurelle.in</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar: Copyright, Payment Badges & Region */}
      <div className="border-t border-[#262220] py-6 text-[11px] text-[#857D75]">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} AURELLE Couture Private Limited. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase text-[#A69E96]">
              <span>UPI</span>
              <span>•</span>
              <span>RuPay</span>
              <span>•</span>
              <span>Cards</span>
              <span>•</span>
              <span>COD</span>
              <span>•</span>
              <span>NetBanking</span>
            </div>
            <p className="text-[#857D75]">Prices displayed in INR (₹)</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
