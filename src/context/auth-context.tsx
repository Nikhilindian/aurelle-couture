"use client";

import * as React from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthProfile {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  role: "customer" | "admin";
}

export interface CustomerAddress {
  id: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerOrderItem {
  id: string;
  title: string;
  sku: string;
  color: string;
  size: string;
  pricePaise: number;
  quantity: number;
  image: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  subtotalPaise: number;
  totalPaise: number;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  fulfillmentStatus: "unfulfilled" | "processing" | "shipped" | "delivered";
  items: CustomerOrderItem[];
  shippingAddress: {
    recipient: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface AuthContextType {
  user: AuthProfile | null;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, phone: string) => Promise<{ success: boolean; message: string }>;
  addAddress: (address: Omit<CustomerAddress, "id">) => Promise<{ success: boolean; message: string }>;
  updateAddress: (id: string, address: Partial<CustomerAddress>) => Promise<{ success: boolean; message: string }>;
  deleteAddress: (id: string) => Promise<{ success: boolean; message: string }>;
  setDefaultAddress: (id: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = "aurelle_auth_user_v1";
const LOCAL_ADDRESSES_KEY = "aurelle_addresses_v1";

// Safe seed addresses for demo initialization
const INITIAL_DEMO_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr-1",
    recipientName: "Meera Singhania",
    phone: "+91 98201 12345",
    addressLine1: "Bunglow No. 14, Amaltas Enclave",
    addressLine2: "Off Golf Course Road",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    country: "IN",
    isDefault: true,
  },
  {
    id: "addr-2",
    recipientName: "Meera Singhania (Ancestral)",
    phone: "+91 98201 12345",
    addressLine1: "Flat 4B, Silver Oak Manor",
    addressLine2: "Malabar Hill",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400006",
    country: "IN",
    isDefault: false,
  },
];

// Safe seed orders reflecting Phase 7 orders schema
const INITIAL_DEMO_ORDERS: CustomerOrder[] = [
  {
    id: "ord-1001",
    orderNumber: "AUR-2026-1001",
    date: "04 Oct 2026",
    subtotalPaise: 2850000,
    totalPaise: 2850000,
    paymentMethod: "RAZORPAY",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    items: [
      {
        id: "item-1",
        title: "Gulbagh Crimson Katan Saree",
        sku: "SKU-SAR-GUL-RED",
        color: "Crimson Red",
        size: "Unstitched",
        pricePaise: 2850000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
      },
    ],
    shippingAddress: {
      recipient: "Meera Singhania",
      line1: "Bunglow No. 14, Amaltas Enclave",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
    },
  },
  {
    id: "ord-1002",
    orderNumber: "AUR-2026-1002",
    date: "07 Oct 2026",
    subtotalPaise: 1950000,
    totalPaise: 1950000,
    paymentMethod: "COD",
    paymentStatus: "pending",
    fulfillmentStatus: "processing",
    items: [
      {
        id: "item-2",
        title: "Kesar Mehra Silk Anarkali Set",
        sku: "SKU-KUR-KESAR-GLD-M",
        color: "Mustard Gold",
        size: "M",
        pricePaise: 1950000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80",
      },
    ],
    shippingAddress: {
      recipient: "Meera Singhania",
      line1: "Flat 4B, Silver Oak Manor, Malabar Hill",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400006",
    },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthProfile | null>(null);
  const [addresses, setAddresses] = React.useState<CustomerAddress[]>([]);
  const [orders, setOrders] = React.useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  // Initialize Auth & Addresses from storage or Supabase session
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              displayName: session.user.user_metadata?.displayName || "Aurelle Patron",
              phone: session.user.user_metadata?.phone || "",
              role: "customer",
            });
          }
        } else {
          // Check local simulated session
          const savedUser = localStorage.getItem(LOCAL_USER_KEY);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }

        const savedAddrs = localStorage.getItem(LOCAL_ADDRESSES_KEY);
        if (savedAddrs) {
          setAddresses(JSON.parse(savedAddrs));
        } else {
          setAddresses(INITIAL_DEMO_ADDRESSES);
        }

        setOrders(INITIAL_DEMO_ORDERS);
      } catch (err) {
        console.warn("Auth initialization note:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sync addresses to localStorage
  React.useEffect(() => {
    if (!isLoading && addresses.length > 0) {
      try {
        localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(addresses));
      } catch (e) {
        console.warn("Failed to persist addresses", e);
      }
    }
  }, [addresses, isLoading]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const sendOtp = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true },
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: `OTP passcode dispatched to ${cleanEmail}` };
    } else {
      // Local demo mode simulation
      return {
        success: true,
        message: `[Demo Mode] OTP sent to ${cleanEmail}. Enter passkey '123456' to proceed.`,
      };
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: "email",
      });
      if (error || !data.user) {
        return { success: false, message: error?.message || "Verification failed" };
      }

      const verifiedUser: AuthProfile = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        displayName: data.user.user_metadata?.displayName || "Aurelle Patron",
        phone: data.user.user_metadata?.phone || "",
        role: "customer",
      };
      setUser(verifiedUser);
      closeAuthModal();
      return { success: true, message: "Welcome to Aurelle Maison" };
    } else {
      // Demo authentication validation
      if (cleanToken === "123456" || cleanToken.length === 6) {
        const demoUser: AuthProfile = {
          id: "u-patron-" + Math.random().toString(36).substring(2, 9),
          email: cleanEmail,
          displayName: cleanEmail.split("@")[0].toUpperCase(),
          phone: "+91 98201 12345",
          role: "customer",
        };
        setUser(demoUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
        closeAuthModal();
        return { success: true, message: "Welcome to Aurelle Maison (Demo Session Active)" };
      }
      return { success: false, message: "Invalid passcode. Use demo passcode '123456'" };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const updateProfile = async (displayName: string, phone: string) => {
    if (!user) return { success: false, message: "No active session" };

    const updated: AuthProfile = {
      ...user,
      displayName,
      phone,
    };
    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    return { success: true, message: "Profile updated successfully" };
  };

  const addAddress = async (newAddr: Omit<CustomerAddress, "id">) => {
    const id = "addr-" + Math.random().toString(36).substring(2, 9);
    const created: CustomerAddress = { ...newAddr, id };

    setAddresses((prev) => {
      if (created.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), created];
      }
      return [...prev, created];
    });
    return { success: true, message: "Delivery address added" };
  };

  const updateAddress = async (id: string, updatedFields: Partial<CustomerAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    return { success: true, message: "Address updated successfully" };
  };

  const deleteAddress = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    return { success: true, message: "Address removed" };
  };

  const setDefaultAddress = async (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    return { success: true, message: "Default address updated" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        addresses,
        orders,
        isLoading,
        isSupabaseConfigured,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        signOut,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
