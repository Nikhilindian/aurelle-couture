import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "burgundy" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-burgundy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";

    const variantStyles = {
      primary:
        "bg-aurelle-ink text-aurelle-ivory hover:bg-aurelle-charcoal active:scale-[0.99] shadow-sm",
      burgundy:
        "bg-aurelle-burgundy text-white hover:bg-aurelle-wine active:scale-[0.99] shadow-sm",
      secondary:
        "bg-aurelle-sand text-aurelle-ink hover:bg-aurelle-cream border border-aurelle-border active:scale-[0.99]",
      outline:
        "bg-transparent text-aurelle-ink border border-aurelle-ink hover:bg-aurelle-sand active:scale-[0.99]",
      ghost:
        "bg-transparent text-aurelle-ink hover:bg-aurelle-sand/70 active:bg-aurelle-cream",
      link:
        "bg-transparent text-aurelle-burgundy underline-offset-4 hover:underline p-0 h-auto tracking-normal lowercase first-letter:uppercase",
    };

    const sizeStyles = {
      sm: "text-[11px] px-3.5 py-1.5 min-h-[38px] rounded-none font-medium",
      md: "text-xs px-5 py-2.5 min-h-[44px] rounded-none font-semibold",
      lg: "text-sm px-6 sm:px-7 py-3 min-h-[48px] rounded-none font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "link" && sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
