"use client";

import * as React from "react";
import { Truck, CheckCircle2, AlertCircle } from "lucide-react";

export function PincodeChecker() {
  const [pincode, setPincode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [estimateDate, setEstimateDate] = React.useState("");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (/^\d{6}$/.test(cleanPin)) {
      // Calculate estimated date 3 to 4 days from today
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 4);

      const formatted = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      setEstimateDate(formatted);
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="p-4 bg-aurelle-sand/40 border border-aurelle-border space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal">
        <Truck className="w-4 h-4 text-aurelle-burgundy" />
        <span>Delivery & Dispatch Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ""));
            setStatus("idle");
          }}
          className="flex-1 h-10 px-3 border border-aurelle-border bg-white text-xs text-aurelle-ink placeholder:text-aurelle-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-burgundy"
        />
        <button
          type="submit"
          className="px-4 h-10 bg-aurelle-ink text-white text-xs uppercase tracking-wider font-semibold hover:bg-aurelle-charcoal transition-colors select-none"
        >
          Check
        </button>
      </form>

      {status === "success" && (
        <div className="space-y-1 text-xs text-green-800 pt-1">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
            <span>Eligible for Express Air Dispatch to {pincode}</span>
          </div>
          <p className="text-[11px] text-aurelle-muted pl-5">
            Estimated delivery by <strong className="text-aurelle-ink">{estimateDate}</strong>. Complimentary delivery & COD available.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Please enter a valid 6-digit Indian Postal PIN code</span>
        </div>
      )}
    </div>
  );
}
