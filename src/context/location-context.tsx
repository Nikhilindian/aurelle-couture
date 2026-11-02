"use client";

import * as React from "react";

export interface UserLocation {
  pincode: string;
  city: string;
  state: string;
  area?: string;
  isCurrentLocation?: boolean;
}

interface LocationContextType {
  location: UserLocation | null;
  isDetecting: boolean;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  setPincode: (pincode: string) => Promise<boolean>;
  setExplicitLocation: (loc: UserLocation) => void;
  detectCurrentLocation: () => Promise<boolean>;
  clearLocation: () => void;
  getEstimatedDeliveryDate: () => string;
}

const LocationContext = React.createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = "aurelle_user_location";

// Built-in postal prefix directory for fast, offline-resilient resolution
const PINCODE_PREFIX_MAP: Record<string, { city: string; state: string; area?: string }> = {
  "11": { city: "New Delhi", state: "Delhi", area: "Central Delhi" },
  "12": { city: "Gurugram", state: "Haryana", area: "NCR West" },
  "13": { city: "Ambala", state: "Haryana" },
  "14": { city: "Ludhiana", state: "Punjab" },
  "16": { city: "Chandigarh", state: "Punjab" },
  "20": { city: "Noida", state: "Uttar Pradesh", area: "Gautam Buddha Nagar" },
  "22": { city: "Varanasi", state: "Uttar Pradesh", area: "Kashi Heritage Zone" },
  "24": { city: "Dehradun", state: "Uttarakhand" },
  "30": { city: "Jaipur", state: "Rajasthan", area: "Pink City Central" },
  "31": { city: "Udaipur", state: "Rajasthan" },
  "38": { city: "Ahmedabad", state: "Gujarat", area: "West Ahmedabad" },
  "39": { city: "Surat", state: "Gujarat" },
  "40": { city: "Mumbai", state: "Maharashtra", area: "South Mumbai & Bandra" },
  "41": { city: "Pune", state: "Maharashtra", area: "Shivajinagar" },
  "45": { city: "Indore", state: "Madhya Pradesh" },
  "50": { city: "Hyderabad", state: "Telangana", area: "Jubilee Hills & Hitec City" },
  "56": { city: "Bengaluru", state: "Karnataka", area: "Indiranagar & Koramangala" },
  "60": { city: "Chennai", state: "Tamil Nadu", area: "Central Chennai" },
  "68": { city: "Kochi", state: "Kerala" },
  "70": { city: "Kolkata", state: "West Bengal", area: "Park Street & Alipore" },
  "75": { city: "Bhubaneswar", state: "Odisha" },
  "78": { city: "Guwahati", state: "Assam" },
  "80": { city: "Patna", state: "Bihar" },
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = React.useState<UserLocation | null>(null);
  const [isDetecting, setIsDetecting] = React.useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);

  // Restore saved location on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocation(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, []);

  const openLocationModal = React.useCallback(() => setIsLocationModalOpen(true), []);
  const closeLocationModal = React.useCallback(() => setIsLocationModalOpen(false), []);

  const saveLocation = React.useCallback((loc: UserLocation | null) => {
    setLocation(loc);
    try {
      if (loc) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }, []);

  const clearLocation = React.useCallback(() => {
    saveLocation(null);
  }, [saveLocation]);

  const setExplicitLocation = React.useCallback(
    (loc: UserLocation) => {
      saveLocation(loc);
    },
    [saveLocation]
  );

  // Set location by entering a 6-digit Indian PIN code
  const setPincode = React.useCallback(
    async (rawPin: string): Promise<boolean> => {
      const pin = rawPin.trim().replace(/\D/g, "");
      if (pin.length !== 6) return false;

      // 1. Try public Indian Postal API for authentic postal circle data
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
            const po = data[0].PostOffice[0];
            const loc: UserLocation = {
              pincode: pin,
              city: po.District || po.Division || po.Circle || "Metro Area",
              state: po.State || "India",
              area: po.Name,
              isCurrentLocation: false,
            };
            saveLocation(loc);
            return true;
          }
        }
      } catch {
        // Network timeout / offline fallback to prefix dictionary
      }

      // 2. Built-in Prefix Mapping Fallback
      const prefix = pin.substring(0, 2);
      const match = PINCODE_PREFIX_MAP[prefix];
      if (match) {
        const loc: UserLocation = {
          pincode: pin,
          city: match.city,
          state: match.state,
          area: match.area,
          isCurrentLocation: false,
        };
        saveLocation(loc);
        return true;
      }

      // 3. Generic Valid PIN Fallback
      const loc: UserLocation = {
        pincode: pin,
        city: "India",
        state: "Standard Delivery Zone",
        isCurrentLocation: false,
      };
      saveLocation(loc);
      return true;
    },
    [saveLocation]
  );

  // Fetch current GPS position using browser Geolocation API
  const detectCurrentLocation = React.useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return false;
    }

    setIsDetecting(true);

    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode via OpenStreetMap Nominatim
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                signal: controller.signal,
                headers: {
                  "Accept-Language": "en",
                },
              }
            );
            clearTimeout(timeout);

            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const pin = addr.postcode ? addr.postcode.replace(/\D/g, "").slice(0, 6) : "";
              const city =
                addr.city ||
                addr.town ||
                addr.suburb ||
                addr.county ||
                addr.state_district ||
                "Detected Area";
              const state = addr.state || "India";
              const area = addr.suburb || addr.neighbourhood || addr.road;

              const loc: UserLocation = {
                pincode: pin || "110001",
                city,
                state,
                area,
                isCurrentLocation: true,
              };

              saveLocation(loc);
              setIsDetecting(false);
              resolve(true);
              return;
            }
          } catch {
            // Reverse geocoding failed or timed out
          }

          // Fallback if reverse geocoding was blocked by adblock/timeout
          const fallbackLoc: UserLocation = {
            pincode: "110001",
            city: "New Delhi",
            state: "Delhi",
            area: "Current GPS Location",
            isCurrentLocation: true,
          };
          saveLocation(fallbackLoc);
          setIsDetecting(false);
          resolve(true);
        },
        (error) => {
          setIsDetecting(false);
          let message = "Unable to retrieve your location.";
          if (error.code === error.PERMISSION_DENIED) {
            message = "Location permission was denied. You can enter your 6-digit pincode manually.";
          }
          alert(message);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }, [saveLocation]);

  // Calculate estimated delivery date based on location
  const getEstimatedDeliveryDate = React.useCallback((): string => {
    const today = new Date();
    // Default 3 to 4 days express couture delivery
    const days = location?.pincode?.startsWith("11") ? 2 : 4;
    const target = new Date(today);
    target.setDate(today.getDate() + days);

    return target.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [location]);

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        setPincode,
        setExplicitLocation,
        detectCurrentLocation,
        clearLocation,
        getEstimatedDeliveryDate,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
