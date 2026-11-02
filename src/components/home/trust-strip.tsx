"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Award, PackageCheck, Scissors, CalendarCheck } from "lucide-react";

export function TrustStrip() {
  const trustItems = [
    {
      icon: Award,
      title: "Silk Mark India Certified",
      description: "100% natural pure silk guarantee with government recognized seals.",
    },
    {
      icon: PackageCheck,
      title: "Complimentary Insured Shipping",
      description: "Air express delivery across 24,000+ PIN codes with tamper-proof packaging.",
    },
    {
      icon: Scissors,
      title: "Bespoke Blouse Tailoring",
      description: "Custom measurements, padded lining & necklines customized to your silhouette.",
    },
    {
      icon: CalendarCheck,
      title: "Private Bridal Video Styling",
      description: "One-on-one virtual consultations with our senior couture draper.",
    },
  ];

  return (
    <section className="py-12 bg-aurelle-cream/60 border-b border-aurelle-border">
      <Container size="wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 text-left p-2"
              >
                <div className="p-3 bg-white border border-aurelle-border text-aurelle-burgundy shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-aurelle-ink font-medium">
                    {item.title}
                  </h4>
                  <p className="text-xs text-aurelle-muted mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
