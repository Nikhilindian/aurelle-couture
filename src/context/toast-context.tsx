"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  imageUrl?: string;
  type?: "success" | "error" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = "toast_" + Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev.slice(-3), newToast]); // keep at most 4

      const timer = setTimeout(() => {
        dismissToast(id);
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast Floating Viewport */}
      <div
        aria-live="assertive"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#181615] text-[#FDFBF7] border border-aurelle-gold/40 shadow-2xl p-3.5 sm:p-4 rounded-none flex items-start gap-3 transition-all duration-300 ease-out transform translate-y-0"
          >
            {/* Optional Thumbnail */}
            {toast.imageUrl ? (
              <div className="relative w-12 h-14 bg-aurelle-charcoal shrink-0 border border-white/10 overflow-hidden">
                <Image
                  src={toast.imageUrl}
                  alt={toast.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : toast.type === "info" ? (
              <Info className="w-5 h-5 text-aurelle-gold shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-xs sm:text-sm font-medium tracking-wide text-[#FDFBF7] truncate">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-[#C9C3BA] font-sans mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    dismissToast(toast.id);
                  }}
                  className="mt-2 text-[10px] uppercase tracking-widest text-aurelle-gold hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-[#9E978F] hover:text-white p-1 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
