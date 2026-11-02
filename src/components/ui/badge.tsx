import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "burgundy" | "gold" | "outline" | "sale";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 border transition-colors";

  const variantStyles = {
    default: "bg-aurelle-cream text-aurelle-ink border-aurelle-border",
    burgundy: "bg-aurelle-burgundy text-white border-aurelle-burgundy",
    gold: "bg-[#F9F5EB] text-[#8C6D3B] border-[#D4AF37]/50",
    outline: "bg-transparent text-aurelle-ink border-aurelle-ink/40",
    sale: "bg-red-800 text-white border-red-800 font-bold",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
