"use client";

import * as React from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 text-left font-sans select-none">
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white border border-aurelle-border shadow-2xl p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-aurelle-border/60">
            <div>
              <h4 className="font-serif text-sm text-aurelle-ink font-semibold">
                Atelier Concierge
              </h4>
              <p className="text-[10px] text-emerald-800 font-medium">
                ● Stylist Online (10 AM - 8 PM IST)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-aurelle-muted hover:text-aurelle-ink cursor-pointer"
              aria-label="Close concierge box"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-aurelle-charcoal mt-2.5 leading-relaxed">
            Namaste. Need assistance with drape measurements, customized blouse stitching, or wedding timelines?
          </p>

          <a
            href="https://wa.me/919876543210?text=Hello%20Aurelle%20Atelier,%20I%20would%20like%20guidance%20on%20a%20couture%20piece."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-center text-xs font-semibold uppercase tracking-wider rounded-sm shadow-xs transition-colors"
          >
            Chat with Stylist
          </a>
        </div>
      )}

      {/* Floating Circular FAB Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        aria-label="Open Atelier Concierge Chat"
        title="Chat with Stylist Concierge"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
