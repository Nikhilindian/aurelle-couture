"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth, CustomerAddress } from "@/context/auth-context";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  User,
  MapPin,
  Package,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Building2,
  Sparkles,
} from "lucide-react";

export default function AccountPage() {
  const {
    user,
    addresses,
    orders,
    isLoading,
    signOut,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    openAuthModal,
    isSupabaseConfigured,
  } = useAuth();

  const [activeTab, setActiveTab] = React.useState<"profile" | "addresses" | "orders">("orders");

  // Profile Form state
  const [nameInput, setNameInput] = React.useState("");
  const [phoneInput, setPhoneInput] = React.useState("");
  const [profileMsg, setProfileMsg] = React.useState<string | null>(null);

  // New Address Form state
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [newAddrRecipient, setNewAddrRecipient] = React.useState("");
  const [newAddrPhone, setNewAddrPhone] = React.useState("");
  const [newAddrLine1, setNewAddrLine1] = React.useState("");
  const [newAddrLine2, setNewAddrLine2] = React.useState("");
  const [newAddrCity, setNewAddrCity] = React.useState("");
  const [newAddrState, setNewAddrState] = React.useState("");
  const [newAddrPin, setNewAddrPin] = React.useState("");
  const [newAddrIsDefault, setNewAddrIsDefault] = React.useState(false);

  // Order item expansion
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setNameInput(user.displayName);
      setPhoneInput(user.phone);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile(nameInput, phoneInput);
    setProfileMsg(res.message);
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrRecipient || !newAddrLine1 || !newAddrCity || !newAddrPin) return;

    await addAddress({
      recipientName: newAddrRecipient,
      phone: newAddrPhone,
      addressLine1: newAddrLine1,
      addressLine2: newAddrLine2,
      city: newAddrCity,
      state: newAddrState,
      postalCode: newAddrPin,
      country: "IN",
      isDefault: newAddrIsDefault,
    });

    setIsAddingAddress(false);
    setNewAddrRecipient("");
    setNewAddrPhone("");
    setNewAddrLine1("");
    setNewAddrLine2("");
    setNewAddrCity("");
    setNewAddrState("");
    setNewAddrPin("");
    setNewAddrIsDefault(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-aurelle-ivory">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-aurelle-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-aurelle-muted">
            Opening Patron Vault...
          </p>
        </div>
      </div>
    );
  }

  // If not signed in, show luxury portal sign-in prompt
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 bg-aurelle-ivory">
        <Container size="narrow">
          <div className="bg-white border border-aurelle-border p-8 sm:p-12 text-center space-y-6 shadow-2xs max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-aurelle-sand flex items-center justify-center text-aurelle-burgundy">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="gold">Aurelle Maison Sign In</Badge>
              <h1 className="font-serif text-3xl sm:text-4xl text-aurelle-ink font-normal">
                Patron Portal
              </h1>
              <p className="text-xs text-aurelle-muted leading-relaxed">
                Sign in to view your bespoke couture commissions, track real-time dispatches, and manage delivery addresses.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="burgundy"
                size="lg"
                onClick={openAuthModal}
                className="w-full tracking-[0.2em] h-12"
              >
                Sign In With Email OTP
              </Button>
            </div>

            <div className="pt-4 border-t border-aurelle-border flex items-center justify-center gap-2 text-[11px] text-aurelle-muted">
              <ShieldCheck className="w-4 h-4 text-aurelle-gold" />
              <span>Passwordless Security • Strict Row Level Security</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full bg-aurelle-ivory min-h-screen py-6 sm:py-10 md:py-14 text-left">
      <Container size="wide">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 sm:mb-10 border-b border-aurelle-border gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">Verified Patron</Badge>
              <span className="text-[11px] text-aurelle-muted uppercase tracking-wider font-semibold">
                Role: {user.role}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-aurelle-ink font-normal">
              {user.displayName || "Patron Maison"}
            </h1>
            <p className="text-xs text-aurelle-muted mt-1 font-sans">
              {user.email} • Session Authenticated
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="gap-2 text-xs border-aurelle-border self-start sm:self-auto min-h-[38px]"
          >
            <LogOut className="w-3.5 h-3.5 text-aurelle-burgundy" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Status Notification if Supabase credentials not set */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Demo Session Active:</strong> Profile, address CRUD, and order history are operating in local client simulation. Add Supabase keys to <code>.env.local</code> for live cloud authentication.
              </span>
            </div>
          </div>
        )}

        {/* 3-Tab Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Navigation Menu (Horizontal scrollable on mobile, vertical on lg) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-2.5 lg:p-3.5 text-xs uppercase tracking-wider font-semibold border transition-all whitespace-nowrap min-h-[42px] ${
                activeTab === "orders"
                  ? "bg-aurelle-burgundy text-white border-aurelle-burgundy shadow-xs"
                  : "bg-white text-aurelle-charcoal border-aurelle-border hover:bg-aurelle-sand"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-2.5 lg:p-3.5 text-xs uppercase tracking-wider font-semibold border transition-all whitespace-nowrap min-h-[42px] ${
                activeTab === "addresses"
                  ? "bg-aurelle-burgundy text-white border-aurelle-burgundy shadow-xs"
                  : "bg-white text-aurelle-charcoal border-aurelle-border hover:bg-aurelle-sand"
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Addresses ({addresses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-2.5 lg:p-3.5 text-xs uppercase tracking-wider font-semibold border transition-all whitespace-nowrap min-h-[42px] ${
                activeTab === "profile"
                  ? "bg-aurelle-burgundy text-white border-aurelle-burgundy shadow-xs"
                  : "bg-white text-aurelle-charcoal border-aurelle-border hover:bg-aurelle-sand"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </button>
          </div>

          {/* Right: Tab Content Panels */}
          <div className="lg:col-span-9 bg-white border border-aurelle-border p-4 sm:p-6 md:p-8 shadow-2xs">
            {/* 1. ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-aurelle-border flex items-center justify-between">
                  <h2 className="font-serif text-xl sm:text-2xl text-aurelle-ink">
                    Couture Order History
                  </h2>
                  <span className="text-xs text-aurelle-muted">
                    {orders.length} Commissions Found
                  </span>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4 sm:space-y-6">
                    {orders.map((order) => {
                      const isExpanded = expandedOrder === order.id;
                      return (
                        <div
                          key={order.id}
                          className="border border-aurelle-border overflow-hidden"
                        >
                          {/* Order Header Summary */}
                          <div className="p-4 sm:p-5 bg-aurelle-ivory/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2.5">
                                <span className="font-serif text-base sm:text-lg font-semibold text-aurelle-ink">
                                  {order.orderNumber}
                                </span>
                                <Badge
                                  variant={
                                    order.paymentStatus === "paid"
                                      ? "gold"
                                      : "outline"
                                  }
                                >
                                  {order.paymentStatus.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-aurelle-muted">
                                Placed on {order.date} • Method: {order.paymentMethod}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-aurelle-border/60">
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] uppercase tracking-wider text-aurelle-muted block">
                                  Total (INR)
                                </span>
                                <span className="font-sans text-sm font-semibold text-aurelle-burgundy">
                                  {formatPrice(order.totalPaise)}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedOrder(isExpanded ? null : order.id)
                                }
                                className="p-2 border border-aurelle-border bg-white text-aurelle-ink hover:text-aurelle-burgundy min-h-[38px] min-w-[38px] flex items-center justify-center"
                                aria-label="Toggle order details"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Items & Snapshots */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 border-t border-aurelle-border bg-white space-y-4">
                              <h4 className="text-xs uppercase tracking-wider font-semibold text-aurelle-charcoal">
                                Purchased Items (Immutable Snapshot)
                              </h4>
                              <div className="divide-y divide-aurelle-border">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-12 h-16 sm:w-14 sm:h-18 object-cover border border-aurelle-border shrink-0"
                                      />
                                      <div>
                                        <h5 className="font-serif text-sm text-aurelle-ink">
                                          {item.title}
                                        </h5>
                                        <p className="text-[11px] text-aurelle-muted">
                                          SKU: {item.sku} • Color: {item.color} • Size: {item.size}
                                        </p>
                                        <p className="text-[11px] text-aurelle-charcoal font-semibold mt-0.5">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-sans text-xs font-semibold text-aurelle-ink self-end sm:self-auto">
                                      {formatPrice(item.pricePaise)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Shipping Snapshot */}
                              <div className="pt-3 border-t border-aurelle-border text-xs text-aurelle-muted flex items-start gap-2">
                                <Truck className="w-4 h-4 text-aurelle-burgundy shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-aurelle-charcoal">
                                    Dispatched To:
                                  </span>{" "}
                                  {order.shippingAddress.recipient},{" "}
                                  {order.shippingAddress.line1},{" "}
                                  {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.postalCode}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-aurelle-muted py-8 text-center">
                    No orders placed yet.
                  </p>
                )}
              </div>
            )}

            {/* 2. SAVED ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-aurelle-border flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-aurelle-ink">
                    Delivery Address Book
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="gap-1.5 text-xs border-aurelle-border"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingAddress ? "Cancel" : "Add Address"}</span>
                  </Button>
                </div>

                {/* Add Address Form */}
                {isAddingAddress && (
                  <form
                    onSubmit={handleCreateAddress}
                    className="p-4 sm:p-6 bg-aurelle-sand/40 border border-aurelle-border space-y-4 mb-6"
                  >
                    <h3 className="font-serif text-lg text-aurelle-ink pb-2 border-b border-aurelle-border">
                      New Delivery Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        required
                        label="Recipient Name"
                        placeholder="e.g. Meera Singhania"
                        value={newAddrRecipient}
                        onChange={(e) => setNewAddrRecipient(e.target.value)}
                      />
                      <Input
                        required
                        label="Phone Number"
                        type="tel"
                        placeholder="+91 98201 12345"
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          required
                          label="Address Line 1"
                          placeholder="House/Flat number, Building, Street"
                          value={newAddrLine1}
                          onChange={(e) => setNewAddrLine1(e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Input
                          label="Address Line 2 (Optional)"
                          placeholder="Locality, Landmark"
                          value={newAddrLine2}
                          onChange={(e) => setNewAddrLine2(e.target.value)}
                        />
                      </div>
                      <Input
                        required
                        label="City"
                        placeholder="e.g. Gurugram"
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                      />
                      <Input
                        required
                        label="State"
                        placeholder="e.g. Haryana"
                        value={newAddrState}
                        onChange={(e) => setNewAddrState(e.target.value)}
                      />
                      <Input
                        required
                        label="PIN Code"
                        maxLength={6}
                        placeholder="e.g. 122002"
                        value={newAddrPin}
                        onChange={(e) =>
                          setNewAddrPin(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      <div className="flex items-center gap-2 pt-6">
                        <label className="flex items-center gap-2 text-xs text-aurelle-charcoal cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newAddrIsDefault}
                            onChange={(e) =>
                              setNewAddrIsDefault(e.target.checked)
                            }
                            className="w-4 h-4 accent-aurelle-burgundy"
                          />
                          <span>Set as Default Delivery Address</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="burgundy" size="sm">
                        Save Address
                      </Button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 sm:p-5 border text-left relative flex flex-col justify-between ${
                        addr.isDefault
                          ? "border-aurelle-burgundy bg-aurelle-sand/30 ring-1 ring-aurelle-burgundy/30"
                          : "border-aurelle-border bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-serif text-base text-aurelle-ink font-semibold">
                            {addr.recipientName}
                          </h4>
                          {addr.isDefault && (
                            <Badge variant="burgundy">Default</Badge>
                          )}
                        </div>

                        <p className="text-xs text-aurelle-charcoal leading-relaxed">
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                          <br />
                          {addr.city}, {addr.state} — {addr.postalCode}
                        </p>
                        <p className="text-[11px] text-aurelle-muted mt-2">
                          Phone: {addr.phone}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-aurelle-border flex items-center justify-between text-xs">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-aurelle-burgundy hover:underline font-semibold text-[11px] uppercase tracking-wider p-1"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[11px] text-aurelle-muted font-medium">
                            Primary Address
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteAddress(addr.id)}
                          className="text-aurelle-muted hover:text-red-700 p-2 -mr-1 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                          aria-label={`Remove address for ${addr.recipientName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. PROFILE SETTINGS TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                <div className="pb-4 border-b border-aurelle-border">
                  <h2 className="font-serif text-2xl text-aurelle-ink">
                    Patron Profile Details
                  </h2>
                  <p className="text-xs text-aurelle-muted mt-1">
                    Manage your personal concierge preferences and communication numbers.
                  </p>
                </div>

                <Input
                  label="Registered Email"
                  value={user.email}
                  disabled
                  helperText="Email cannot be altered as it is bound to your authentication identity."
                />

                <Input
                  label="Full Name"
                  placeholder="e.g. Ananya Sharma"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />

                <Input
                  label="WhatsApp / Contact Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  helperText="Used for BlueDart dispatch SMS notifications and private concierge scheduling."
                />

                <Input
                  label="Account Privilege Tier"
                  value={`Role: ${user.role.toUpperCase()}`}
                  disabled
                  helperText="Role changes are server-authoritative and protected by database triggers."
                />

                {profileMsg && (
                  <p className="text-xs text-green-700 font-semibold">
                    {profileMsg}
                  </p>
                )}

                <div className="pt-2">
                  <Button type="submit" variant="burgundy" size="md">
                    Update Profile Details
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
