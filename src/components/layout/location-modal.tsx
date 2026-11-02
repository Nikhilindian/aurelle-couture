"use client";

import * as React from "react";
import {
  X,
  MapPin,
  User,
  Navigation,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useLocation } from "@/context/location-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { useRouter } from "next/navigation";

const POPULAR_LOCATIONS = [
  { city: "New Delhi", pincode: "110001", state: "Delhi" },
  { city: "Mumbai", pincode: "400001", state: "Maharashtra" },
  { city: "Bengaluru", pincode: "560001", state: "Karnataka" },
  { city: "Jaipur", pincode: "302001", state: "Rajasthan" },
  { city: "Varanasi", pincode: "221001", state: "Uttar Pradesh" },
  { city: "Kolkata", pincode: "700001", state: "West Bengal" },
];

export function LocationModal() {
  const {
    location,
    isDetecting,
    isLocationModalOpen,
    closeLocationModal,
    setPincode,
    setExplicitLocation,
    detectCurrentLocation,
    clearLocation,
  } = useLocation();

  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [isPincodeInputOpen, setIsPincodeInputOpen] = React.useState(false);
  const [pinInput, setPinInput] = React.useState("");
  const [isSubmittingPin, setIsSubmittingPin] = React.useState(false);
  const [pinError, setPinError] = React.useState<string | null>(null);

  // Close modal on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLocationModalOpen) {
        closeLocationModal();
      }
    };
    if (isLocationModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isLocationModalOpen, closeLocationModal]);

  if (!isLocationModalOpen) return null;

  // Handle Current Location Detection
  const handleDetectLocation = async () => {
    const success = await detectCurrentLocation();
    if (success) {
      showToast({
        title: "Location Updated",
        message: "Current location detected and applied successfully!",
        type: "success",
      });
      closeLocationModal();
    }
  };

  // Handle Manual PIN Code Submission
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setPinError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setIsSubmittingPin(true);
    setPinError(null);
    try {
      const success = await setPincode(cleanPin);
      if (success) {
        showToast({
          title: "Location Set",
          message: `Delivery location set to PIN ${cleanPin}!`,
          type: "success",
        });
        setIsPincodeInputOpen(false);
        setPinInput("");
        closeLocationModal();
      } else {
        setPinError("Could not resolve location for this PIN code.");
      }
    } catch {
      setPinError("Failed to verify PIN code. Please try again.");
    } finally {
      setIsSubmittingPin(false);
    }
  };

  // Handle Login or Saved Address
  const handleLoginClick = () => {
    closeLocationModal();
    router.push("/account");
  };

  // Select Quick Popular City
  const handleSelectQuickCity = (cityItem: typeof POPULAR_LOCATIONS[0]) => {
    setExplicitLocation({
      city: cityItem.city,
      pincode: cityItem.pincode,
      state: cityItem.state,
      isCurrentLocation: false,
    });
    showToast({
      title: "Location Set",
      message: `Delivery location set to ${cityItem.city} (${cityItem.pincode})`,
      type: "success",
    });
    closeLocationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={closeLocationModal}
      />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all duration-300 animate-slideUp sm:animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Mobile Pull Indicator Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-aurelle-border/60">
          <h3 className="font-serif text-lg sm:text-xl font-normal text-aurelle-ink tracking-wide">
            Choose your location
          </h3>
          <button
            type="button"
            onClick={closeLocationModal}
            className="w-9 h-9 rounded-full flex items-center justify-center text-aurelle-charcoal hover:bg-neutral-100 hover:text-aurelle-burgundy transition-colors focus:outline-none"
            aria-label="Close location selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Subtitle Banner Note */}
          <div className="p-3.5 bg-[#FAF7F2] border border-aurelle-border/70 rounded-xl text-xs sm:text-[13px] text-aurelle-charcoal leading-relaxed font-sans">
            Please share your location to know estimated date of delivery and special offers in your area
          </div>

          {/* Currently Selected Location Pill */}
          {location && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-900">
                    {location.city} - {location.pincode}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    {location.area ? `${location.area}, ` : ""}{location.state}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={clearLocation}
                className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-rose-600 transition-colors"
              >
                Reset
              </button>
            </div>
          )}

          {/* Action List (Identical to reference screenshot) */}
          <div className="space-y-1 divide-y divide-aurelle-border/50 border-y border-aurelle-border/50">
            {/* Option 1: Login to select a saved address */}
            <button
              type="button"
              onClick={handleLoginClick}
              className="w-full flex items-center justify-between py-4 text-left group hover:bg-neutral-50 transition-colors cursor-pointer px-1"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full border border-aurelle-border bg-white flex items-center justify-center text-aurelle-ink group-hover:border-aurelle-burgundy group-hover:text-aurelle-burgundy transition-colors shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-aurelle-ink">
                    {user ? "Select from your saved addresses" : "Login to select a saved address"}
                  </div>
                  <div className="text-[11px] text-aurelle-muted">
                    {user ? `Logged in as ${user.displayName}` : "View addresses saved in your patron account"}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-aurelle-muted group-hover:text-aurelle-ink transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Option 2: Enter your pincode */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => setIsPincodeInputOpen(!isPincodeInputOpen)}
                className="w-full flex items-center justify-between py-3 text-left group hover:bg-neutral-50 transition-colors cursor-pointer px-1"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-aurelle-border bg-white flex items-center justify-center text-aurelle-ink group-hover:border-aurelle-burgundy group-hover:text-aurelle-burgundy transition-colors shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-aurelle-ink">
                      Enter your pincode
                    </div>
                    <div className="text-[11px] text-aurelle-muted">
                      Check delivery date and express COD availability
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-aurelle-muted group-hover:text-aurelle-ink transition-transform ${
                    isPincodeInputOpen ? "rotate-90" : "group-hover:translate-x-0.5"
                  }`}
                />
              </button>

              {/* Collapsible PIN Code Form */}
              {isPincodeInputOpen && (
                <form
                  onSubmit={handlePinSubmit}
                  className="mt-3 p-3.5 bg-neutral-50 border border-aurelle-border rounded-xl space-y-2 animate-fadeIn"
                >
                  <label htmlFor="pincode-input" className="block text-[11px] font-semibold uppercase tracking-wider text-aurelle-charcoal">
                    Enter 6-Digit Indian PIN Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="pincode-input"
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 110001, 400001, 560001"
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value.replace(/\D/g, ""));
                        setPinError(null);
                      }}
                      className="flex-1 h-11 px-3.5 bg-white border border-aurelle-border text-xs sm:text-sm text-aurelle-ink placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-aurelle-burgundy rounded-lg"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingPin || pinInput.length < 6}
                      className="px-5 h-11 bg-aurelle-ink text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-aurelle-charcoal disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center"
                    >
                      {isSubmittingPin ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {pinError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Option 3: Share your current location */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full flex items-center justify-between py-4 text-left group hover:bg-neutral-50 transition-colors cursor-pointer px-1 disabled:opacity-60"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full border border-aurelle-border bg-white flex items-center justify-center text-aurelle-burgundy group-hover:bg-aurelle-burgundy group-hover:text-white transition-all shrink-0">
                  {isDetecting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-aurelle-ink flex items-center gap-1.5">
                    <span>Share your current location</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      Auto GPS
                    </span>
                  </div>
                  <div className="text-[11px] text-aurelle-muted">
                    {isDetecting
                      ? "Fetching current GPS coordinates & area..."
                      : "Using your device GPS for precision courier routing"}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-aurelle-muted group-hover:text-aurelle-ink transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Quick Popular Delivery Hubs */}
          <div className="pt-2 space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-muted">
              Popular Cities
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LOCATIONS.map((c) => (
                <button
                  key={c.pincode}
                  type="button"
                  onClick={() => handleSelectQuickCity(c)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-aurelle-sand hover:text-aurelle-ink text-neutral-700 text-xs rounded-full border border-neutral-200 transition-colors cursor-pointer"
                >
                  {c.city} ({c.pincode})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
