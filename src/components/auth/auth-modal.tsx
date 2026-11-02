"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    sendOtp,
    verifyOtp,
    isSupabaseConfigured,
  } = useAuth();

  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Close on ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setStep("email");
      setOtp("");
      setFeedback(null);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setFeedback({ success: false, message: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await sendOtp(email);
      setFeedback(res);
      if (res.success) {
        setStep("otp");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setFeedback({ success: false, message: "Please enter the 6-digit passcode" });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await verifyOtp(email, otp);
      setFeedback(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Customer Sign In"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white p-5 sm:p-8 shadow-2xl border border-aurelle-border z-10 text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-aurelle-ink hover:text-aurelle-burgundy transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <Badge variant="gold" className="text-[10px]">
            The Aurelle Maison Patron Portal
          </Badge>
          <h2 className="font-serif text-2xl sm:text-3xl text-aurelle-ink font-normal">
            {step === "email" ? "Patron Sign In" : "Verify Passcode"}
          </h2>
          <p className="text-xs text-aurelle-muted leading-relaxed">
            {step === "email"
              ? "Access your couture orders, bespoke blouse measurements, and saved addresses."
              : `Enter the 6-digit security passkey dispatched to ${email}`}
          </p>
        </div>

        {/* Step 1: Email Form */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              type="email"
              required
              label="Email Address"
              placeholder="e.g. ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="We will send a one-time passwordless sign-in passkey."
            />

            <Button
              type="submit"
              variant="burgundy"
              size="lg"
              isLoading={loading}
              className="w-full gap-2 tracking-[0.2em]"
            >
              <span>Continue with Email OTP</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              type="text"
              required
              maxLength={6}
              label="6-Digit Passkey"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              helperText={
                isSupabaseConfigured
                  ? "Check your inbox for the verification email."
                  : "Demo mode active: Enter passkey '123456' to proceed."
              }
            />

            <Button
              type="submit"
              variant="burgundy"
              size="lg"
              isLoading={loading}
              className="w-full gap-2 tracking-[0.2em]"
            >
              <span>Verify &amp; Enter Maison</span>
              <CheckCircle2 className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-aurelle-muted hover:text-aurelle-ink underline"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-aurelle-burgundy hover:underline font-semibold"
              >
                Resend Passkey
              </button>
            </div>
          </form>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 mt-4 text-xs border ${
              feedback.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Privacy Note */}
        <div className="pt-6 mt-6 border-t border-aurelle-border flex items-center justify-center gap-2 text-[11px] text-aurelle-muted">
          <ShieldCheck className="w-4 h-4 text-aurelle-gold" />
          <span>Encrypted Session • Strict Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
