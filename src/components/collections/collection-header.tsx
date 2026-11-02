"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Search, Mic, MicOff, X, Sparkles } from "lucide-react";

export interface CategoryIconItem {
  id: string;
  label: string;
  value: string;
  imageUrl: string;
  badge?: string;
}

export interface CollectionHeaderProps {
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  totalCount: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const CATEGORY_ITEMS: CategoryIconItem[] = [
  {
    id: "cat-all",
    label: "All",
    value: "all",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
    badge: "All",
  },
  {
    id: "cat-clothing",
    label: "Clothing",
    value: "Clothing",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
    badge: "Couture",
  },
  {
    id: "cat-jewellery",
    label: "Jewellery",
    value: "Jewellery",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
    badge: "Heirloom",
  },
  {
    id: "cat-kids",
    label: "Kids",
    value: "Kids",
    imageUrl:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=300&q=80",
    badge: "Festive",
  },
];

export function CollectionHeader({
  currentCategory,
  onSelectCategory,
  totalCount,
  searchQuery = "",
  onSearchChange,
}: CollectionHeaderProps) {
  const [isListening, setIsListening] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Voice Search handler using Web Speech API
  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onSearchChange && transcript) {
          onSearchChange(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-[#181615] text-white pt-6 pb-6 sm:pt-10 sm:pb-8 border-b border-aurelle-charcoal relative overflow-hidden">
      {/* Subtle luxury gold grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <Container size="wide" className="relative z-10 space-y-4 sm:space-y-6">
        {/* Editorial Heading */}
        <div className="text-center space-y-1 sm:space-y-2">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-aurelle-gold font-semibold block">
            The Aurelle Haute Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-white font-normal tracking-wide">
            Handcrafted Indian Couture
          </h1>
          <p className="text-[11px] sm:text-xs text-[#C9C3BA] max-w-lg mx-auto">
            Woven by master weavers on ancestral pit looms • {totalCount} authentic creations
          </p>
        </div>

        {/* 1. Top Search Bar (Quick-Commerce Style like Image 1) */}
        <div className="max-w-xl mx-auto px-1 sm:px-0">
          <div className="relative flex items-center bg-white text-aurelle-ink rounded-full shadow-lg border border-aurelle-gold/30 px-3.5 py-2 sm:py-2.5 transition-all focus-within:ring-2 focus-within:ring-aurelle-gold">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-aurelle-muted shrink-0 mr-2" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search in Couture (e.g. Sarees, Lehengas, Zari...)"
              className="flex-1 bg-transparent text-xs sm:text-sm text-aurelle-ink placeholder:text-aurelle-muted/70 outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange && onSearchChange("");
                  inputRef.current?.focus();
                }}
                className="p-1 text-aurelle-muted hover:text-aurelle-ink transition-colors mr-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-aurelle-muted hover:text-aurelle-burgundy hover:bg-stone-100"
              }`}
              title={isListening ? "Listening..." : "Search by voice"}
              aria-label="Voice search"
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4 text-aurelle-burgundy" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Category Icon Rail (4 Categories: All, Clothing, Jewellery, Kids) */}
        <div className="pt-2">
          {/* Symmetrical 4-item grid on mobile and desktop */}
          <div className="grid grid-cols-4 max-w-sm sm:max-w-md mx-auto gap-2 sm:gap-4 py-2 px-1">
            {CATEGORY_ITEMS.map((item) => {
              const isActive =
                currentCategory.toLowerCase() === item.value.toLowerCase() ||
                (item.value === "all" && (currentCategory === "all" || !currentCategory));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCategory(item.value)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none cursor-pointer"
                >
                  {/* Category Image Avatar */}
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 p-0.5 ${
                      isActive
                        ? "border-aurelle-gold ring-2 ring-aurelle-gold/60 shadow-[0_0_15px_rgba(197,168,128,0.4)] scale-105"
                        : "border-white/20 group-hover:border-aurelle-gold/60 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      fill
                      sizes="64px"
                      className="object-cover rounded-[14px]"
                    />
                    {/* Badge Overlay */}
                    {item.badge && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] uppercase tracking-wider text-aurelle-gold text-center py-0.5 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Category Label */}
                  <span
                    className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-medium transition-colors ${
                      isActive
                        ? "text-aurelle-gold font-bold"
                        : "text-[#D8D2CA] group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <div className="w-4 h-0.5 bg-aurelle-gold rounded-full -mt-0.5 animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
