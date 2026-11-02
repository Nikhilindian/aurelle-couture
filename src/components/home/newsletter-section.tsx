"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MailCheck } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-14 sm:py-24 bg-[#1E1B19] text-[#FDFBF7] relative overflow-hidden">
      {/* Subtle background ornamentation */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center">
        <div className="space-y-4 sm:space-y-6 max-w-xl mx-auto">
          <Badge variant="gold" className="bg-[#2C2723] text-aurelle-gold-light border-aurelle-gold/40 text-[9px] sm:text-[10px]">
            Exclusive Atelier Invitations
          </Badge>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white font-normal leading-tight">
            The Aurelle Circle
          </h2>

          <p className="text-xs sm:text-sm text-[#BDB5AC] leading-relaxed font-sans">
            Become an esteemed patron of Aurelle. Receive private previews of limited-run festive capsules, bridal styling monographs, and priority access to festive releases.
          </p>

          {submitted ? (
            <div className="p-6 bg-[#2B2724] border border-aurelle-gold/40 text-center space-y-2">
              <div className="inline-flex p-2 rounded-full bg-emerald-950/80 text-emerald-400 mb-1">
                <MailCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg text-white">
                Welcome to The Aurelle Circle
              </h4>
              <p className="text-xs text-[#A69E96]">
                An invitation token has been dispatched. Enjoy 10% complimentary courtesy on your inaugural order.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#2B2623] border-[#443E38] text-white placeholder:text-[#827A72] focus-visible:ring-aurelle-gold h-12"
                />
                <Button
                  type="submit"
                  variant="burgundy"
                  size="lg"
                  className="shrink-0 tracking-[0.2em] h-12 px-8"
                >
                  Request Invite
                </Button>
              </div>
              <p className="text-[11px] text-[#7A726A] text-left sm:text-center">
                We value your discretion. No promotional spam; unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
