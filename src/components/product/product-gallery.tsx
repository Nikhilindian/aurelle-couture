"use client";

import * as React from "react";
import Image from "next/image";
import { ProductImage } from "@/data/mock-catalog";
import { ZoomIn, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomCoords, setZoomCoords] = React.useState({ x: 50, y: 50 });
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);

  // If product has only 1 image, duplicate with a detail view or safe fallback
  const galleryImages =
    images.length > 1
      ? images
      : [
          images[0],
          {
            url: images[0]?.url || "",
            alt: `${title} - Fabric detail texture`,
          },
        ];

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  // Mouse move handler for weave zoom lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomCoords({ x, y });
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 text-left">
        {/* Thumbnail Strip (Vertical on md+, Horizontal on mobile) */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0 scrollbar-none">
          {galleryImages.map((img, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={`${img.url}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-[3/4] w-16 sm:w-20 md:w-24 overflow-hidden border transition-all cursor-pointer ${
                  isSelected
                    ? "border-aurelle-burgundy ring-1 ring-aurelle-burgundy shadow-xs"
                    : "border-aurelle-border opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1} of ${title}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>

        {/* Main Feature Image Stage with Magnification Lens */}
        <div
          className="relative aspect-[3/4] flex-1 overflow-hidden bg-aurelle-sand border border-aurelle-border shadow-2xs group cursor-crosshair select-none"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsFullscreenOpen(true)}
          title="Hover to magnify weave; Click to view full resolution"
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-200 ease-out"
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    transform: "scale(2.2)",
                  }
                : { transform: "scale(1)" }
            }
          />

          {/* Zari Weave Magnifier Guide Tag */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-wider text-white border border-white/20 flex items-center gap-1.5 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3 h-3 text-aurelle-gold" />
            <span className="hidden sm:inline">Inspect Weave (2.2x)</span>
            <span className="sm:hidden">Zoom</span>
          </div>

          {/* Counter Badge */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-widest text-white border border-white/20 pointer-events-none">
            {selectedIndex + 1} / {galleryImages.length}
          </div>

          {/* Authenticity Watermark */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase tracking-widest text-aurelle-charcoal border border-aurelle-border/60 pointer-events-none flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-aurelle-burgundy" />
            <span>Pure Handloom Archive</span>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Inspection Dialog */}
      {isFullscreenOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#161413]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-lg text-[#FDFBF7]">{title}</h3>
              <p className="text-xs text-[#C9C3BA] font-sans">
                High-Resolution Weave &amp; Embroidery Inspection
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 my-4 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Previous / Next buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex(
                      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                    )
                  }
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((prev) => (prev + 1) % galleryImages.length)
                  }
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="text-center text-xs text-[#9E978F] border-t border-white/10 pt-4">
            Image {selectedIndex + 1} of {galleryImages.length} • Certified Pure Silk Mark
          </div>
        </div>
      )}
    </>
  );
}
