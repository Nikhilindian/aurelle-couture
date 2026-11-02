"use client";

import * as React from "react";
import { MapPin, ChevronDown, Sparkles } from "lucide-react";
import { useLocation } from "@/context/location-context";

export function LocationBar() {
  const { location, openLocationModal } = useLocation();

  return (
    <div className="w-full bg-[#FAF8F5] border-b border-aurelle-border/70 text-aurelle-charcoal text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={openLocationModal}
          className="w-full flex items-center justify-between py-2 sm:py-2.5 text-left group hover:text-aurelle-ink transition-colors cursor-pointer select-none focus:outline-none"
          aria-label="Choose delivery location"
        >
          {/* Left: Location Pin Icon & Label */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-aurelle-sand/70 flex items-center justify-center shrink-0 text-aurelle-burgundy group-hover:bg-aurelle-burgundy group-hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5" />
            </div>

            {location ? (
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[11px] sm:text-xs text-aurelle-muted uppercase tracking-wider hidden xs:inline">
                  Deliver to:
                </span>
                <span className="text-xs font-semibold text-aurelle-ink truncate">
                  {location.area ? `${location.area}, ` : ""}
                  {location.city} - {location.pincode}
                </span>
                {location.isCurrentLocation && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                    <Sparkles className="w-2.5 h-2.5" /> GPS
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs sm:text-[13px] font-normal text-aurelle-charcoal group-hover:text-aurelle-burgundy transition-colors truncate">
                Enable location for a better experience
              </span>
            )}
          </div>

          {/* Right: Chevron Indicator */}
          <div className="flex items-center gap-1 shrink-0 text-aurelle-muted group-hover:text-aurelle-ink transition-colors pl-2">
            <span className="text-[11px] uppercase tracking-wider hidden md:inline font-medium">
              {location ? "Change" : "Select"}
            </span>
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
