import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "flex h-11 w-full border bg-white px-3.5 py-2 text-base sm:text-sm text-aurelle-ink placeholder:text-aurelle-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-burgundy focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-600 focus-visible:ring-red-600"
                : "border-aurelle-border hover:border-aurelle-muted/50 focus:border-aurelle-burgundy",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-600 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-aurelle-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
