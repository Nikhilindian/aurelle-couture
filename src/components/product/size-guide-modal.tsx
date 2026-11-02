"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, Ruler } from "lucide-react";

export interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  category,
}: SizeGuideModalProps) {
  const [unit, setUnit] = React.useState<"inches" | "cm">("inches");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const measurements = [
    { size: "XS", bustIn: "32", waistIn: "26", hipIn: "36", bustCm: "81", waistCm: "66", hipCm: "91" },
    { size: "S", bustIn: "34", waistIn: "28", hipIn: "38", bustCm: "86", waistCm: "71", hipCm: "96" },
    { size: "M", bustIn: "36", waistIn: "30", hipIn: "40", bustCm: "91", waistCm: "76", hipCm: "101" },
    { size: "L", bustIn: "38", waistIn: "32", hipIn: "42", bustCm: "96", waistCm: "81", hipCm: "106" },
    { size: "XL", bustIn: "40", waistIn: "34", hipIn: "44", bustCm: "101", waistCm: "86", hipCm: "111" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Aurelle Couture Size Guide"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white p-4 sm:p-8 shadow-2xl border border-aurelle-border z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-aurelle-border">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-aurelle-burgundy shrink-0" />
            <h3 className="font-serif text-xl sm:text-2xl text-aurelle-ink font-normal">
              Maison Size & Fit Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-1.5 text-aurelle-ink hover:text-aurelle-burgundy transition-colors"
            aria-label="Close Size Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 my-4 sm:my-6">
          <p className="text-xs text-aurelle-muted">
            Garment Category: <strong className="text-aurelle-ink uppercase">{category}</strong>
          </p>
          <div className="inline-flex border border-aurelle-border p-0.5 bg-aurelle-sand">
            <button
              type="button"
              onClick={() => setUnit("inches")}
              className={`px-3 py-1.5 min-h-[36px] text-xs uppercase tracking-wider font-semibold transition-all ${
                unit === "inches"
                  ? "bg-aurelle-ink text-white shadow-xs"
                  : "text-aurelle-charcoal hover:text-aurelle-ink"
              }`}
            >
              Inches (&quot;)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1.5 min-h-[36px] text-xs uppercase tracking-wider font-semibold transition-all ${
                unit === "cm"
                  ? "bg-aurelle-ink text-white shadow-xs"
                  : "text-aurelle-charcoal hover:text-aurelle-ink"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto border border-aurelle-border">
          <table className="w-full text-xs text-left">
            <thead className="bg-aurelle-sand uppercase tracking-wider text-[11px] text-aurelle-charcoal border-b border-aurelle-border">
              <tr>
                <th className="py-2.5 px-3 sm:px-4 font-semibold">Size</th>
                <th className="py-2.5 px-3 sm:px-4 font-semibold">Bust ({unit})</th>
                <th className="py-2.5 px-3 sm:px-4 font-semibold">Waist ({unit})</th>
                <th className="py-3 px-4 font-semibold">Hip ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurelle-border">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-aurelle-ivory transition-colors">
                  <td className="py-3 px-4 font-semibold text-aurelle-ink">{m.size}</td>
                  <td className="py-3 px-4 text-aurelle-charcoal">
                    {unit === "inches" ? m.bustIn : m.bustCm}
                  </td>
                  <td className="py-3 px-4 text-aurelle-charcoal">
                    {unit === "inches" ? m.waistIn : m.waistCm}
                  </td>
                  <td className="py-3 px-4 text-aurelle-charcoal">
                    {unit === "inches" ? m.hipIn : m.hipCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bespoke Notes */}
        <div className="mt-6 p-4 bg-aurelle-sand/50 border border-aurelle-border space-y-2 text-xs text-aurelle-charcoal">
          <h4 className="font-semibold text-aurelle-ink uppercase tracking-wider text-[11px]">
            Bespoke Tailoring & Alterations:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-aurelle-muted">
            <li>Sarees include 1 meter unstitched blouse fabric with up to 4 inches seam allowance.</li>
            <li>Bridal lehengas are accompanied by complimentary virtual measurement consultations.</li>
            <li>All stitched sets provide a 2-inch concealed margin on side seams for future ease.</li>
          </ul>
        </div>

        <div className="mt-6 text-right">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Guide
          </Button>
        </div>
      </div>
    </div>
  );
}
