"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MapPin,
  Banknote,
  Sparkles,
  ShoppingBag,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalCount,
    subtotalPaise,
    discountPaise,
    finalTotalPaise,
    appliedCoupon,
    isSyncing: isCartLoading,
    isDatabaseConnected,
    clearCart,
  } = useCart();

  const { user, addresses } = useAuth();

  // Idempotency key generated once per checkout session
  const [idempotencyKey] = React.useState(() => "idemp_" + Math.random().toString(36).substring(2) + Date.now().toString(36));

  // Form State
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("new");
  const [recipientName, setRecipientName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [addressLine1, setAddressLine1] = React.useState("");
  const [addressLine2, setAddressLine2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [orderNotes, setOrderNotes] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Pre-fill if user has saved addresses
  React.useEffect(() => {
    if (user) {
      if (user.displayName && !recipientName) setRecipientName(user.displayName);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);

      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr && selectedAddressId === "new") {
        setSelectedAddressId(defaultAddr.id);
        setRecipientName(defaultAddr.recipientName);
        setPhone(defaultAddr.phone);
        setAddressLine1(defaultAddr.addressLine1);
        setAddressLine2(defaultAddr.addressLine2 || "");
        setCity(defaultAddr.city);
        setState(defaultAddr.state);
        setPostalCode(defaultAddr.postalCode);
      }
    }
  }, [user, addresses]);

  // Handle choosing a saved address
  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setRecipientName(user?.displayName || "");
      setPhone(user?.phone || "");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPostalCode("");
    } else {
      const chosen = addresses.find((a) => a.id === addrId);
      if (chosen) {
        setRecipientName(chosen.recipientName);
        setPhone(chosen.phone);
        setAddressLine1(chosen.addressLine1);
        setAddressLine2(chosen.addressLine2 || "");
        setCity(chosen.city);
        setState(chosen.state);
        setPostalCode(chosen.postalCode);
      }
    }
  };

  // Shipping Fee calculation
  const FREE_SHIPPING_THRESHOLD_PAISE = 500000; // ₹5,000
  const STANDARD_SHIPPING_FEE_PAISE = 25000; // ₹250
  const isFreeShipping = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const shippingPaise = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE_PAISE;
  const grandTotalPaise = Math.max(0, subtotalPaise - discountPaise + shippingPaise);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!recipientName.trim() || recipientName.trim().length < 2) {
      setSubmitError("Please enter the recipient's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Please enter a valid email address for delivery updates.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setSubmitError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!addressLine1.trim() || addressLine1.trim().length < 3) {
      setSubmitError("Please provide a street address.");
      return;
    }
    if (!city.trim()) {
      setSubmitError("City is required.");
      return;
    }
    if (!state.trim()) {
      setSubmitError("State is required.");
      return;
    }
    if (!postalCode.trim() || postalCode.trim().length < 4) {
      setSubmitError("Please enter a valid postal PIN code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            recipientName: recipientName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            country: "IN",
          },
          orderNotes: orderNotes.trim(),
          idempotencyKey,
          paymentMethod: "COD",
          userId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to place order. Please review your details.");
      }

      // Clear cart locally so client state reflects empty cart
      await clearCart();

      // Redirect securely to order confirmation receipt page with receipt token
      router.push(`/order-success/${data.order.id}?token=${data.order.receiptToken}`);
    } catch (err: any) {
      console.error("Order submission failure:", err);
      setSubmitError(err.message || "Failed to process order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-aurelle-cream/30 py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-10 h-10 border-2 border-aurelle-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-aurelle-ink text-lg">Retrieving your atelier cart...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-aurelle-cream/30 py-12 sm:py-20">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white p-6 sm:p-10 border border-aurelle-border shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-aurelle-cream/60 flex items-center justify-center mx-auto text-aurelle-gold">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-xl sm:text-2xl text-aurelle-ink">Your Shopping Bag is Empty</h1>
              <p className="text-xs text-aurelle-muted leading-relaxed">
                Add heirloom handcrafted garments from our collections before proceeding to checkout.
              </p>
            </div>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-aurelle-burgundy text-aurelle-cream text-xs uppercase tracking-luxury hover:bg-aurelle-gold hover:text-aurelle-ink transition-colors font-medium min-h-[44px]"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aurelle-cream/30 py-6 sm:py-10 md:py-16">
      <Container>
        {/* Breadcrumb Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs text-aurelle-muted tracking-wider uppercase mb-2">
            <Link href="/cart" className="hover:text-aurelle-gold transition-colors">
              Shopping Bag
            </Link>
            <span>/</span>
            <span className="text-aurelle-ink font-semibold">Atelier Checkout</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-aurelle-ink">
            Complete Your Acquisition
          </h1>
          <p className="text-xs text-aurelle-muted mt-1">
            Authoritative, secure checkout backed by server verification & Cash on Delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT COLUMN: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
              {/* Step 1: Contact Details */}
              <div className="bg-white p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-aurelle-border pb-3">
                  <span className="w-6 h-6 rounded-full bg-aurelle-burgundy text-aurelle-cream text-xs flex items-center justify-center font-serif">
                    1
                  </span>
                  <h2 className="font-serif text-lg text-aurelle-ink">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="meera@singhania.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white"
                    />
                    <p className="text-[10px] text-aurelle-muted">
                      Order confirmation & tracking link will be sent here.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="+91 98201 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white"
                    />
                    <p className="text-[10px] text-aurelle-muted">
                      For courier dispatch updates & delivery OTP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-aurelle-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-aurelle-burgundy text-aurelle-cream text-xs flex items-center justify-center font-serif">
                      2
                    </span>
                    <h2 className="font-serif text-lg text-aurelle-ink">Shipping Destination</h2>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-aurelle-muted">
                    <MapPin className="w-3.5 h-3.5 text-aurelle-gold" />
                    <span>Pan-India Delivery</span>
                  </div>
                </div>

                {/* Saved addresses selector for signed-in users */}
                {user && addresses.length > 0 && (
                  <div className="space-y-3 pb-3 border-b border-aurelle-border/60">
                    <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                      Select Saved Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr.id)}
                          className={`p-3.5 border cursor-pointer transition-all text-left ${
                            selectedAddressId === addr.id
                              ? "border-aurelle-burgundy bg-aurelle-cream/20 shadow-sm"
                              : "border-aurelle-border hover:border-aurelle-muted"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-aurelle-ink">
                              {addr.recipientName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] uppercase tracking-wider bg-aurelle-cream px-1.5 py-0.5 text-aurelle-burgundy font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-aurelle-muted line-clamp-2">
                            {addr.addressLine1}, {addr.city}, {addr.postalCode}
                          </p>
                        </div>
                      ))}
                      <div
                        onClick={() => handleSelectSavedAddress("new")}
                        className={`p-3.5 border border-dashed cursor-pointer transition-all text-center flex items-center justify-center text-xs font-medium min-h-[44px] ${
                          selectedAddressId === "new"
                            ? "border-aurelle-burgundy text-aurelle-burgundy bg-aurelle-cream/20"
                            : "border-aurelle-border text-aurelle-muted hover:border-aurelle-gold"
                        }`}
                      >
                        + Enter New Address
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Input Form */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                      Recipient Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Meera Singhania"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                      Address (House/Flat No., Building, Street) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="Bunglow No. 14, Amaltas Enclave, Off Golf Course Road"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                      Apartment, Floor, Landmark (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Near Cyber City Club"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                        City <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="Gurugram"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                        State <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="Haryana"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-aurelle-ink tracking-wider uppercase">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="122002"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Optional Atelier Notes */}
              <div className="bg-white p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-aurelle-border pb-3">
                  <span className="w-6 h-6 rounded-full bg-aurelle-burgundy text-aurelle-cream text-xs flex items-center justify-center font-serif">
                    3
                  </span>
                  <h2 className="font-serif text-lg text-aurelle-ink">
                    Atelier Customization & Delivery Instructions
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-aurelle-muted tracking-wider uppercase">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="e.g., Please add complimentary saree fall & edging, auspicious wedding delivery request, or doorstep security gate notes..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-base sm:text-xs p-3 border border-aurelle-border bg-white text-aurelle-ink focus:outline-none focus:border-aurelle-gold font-sans leading-relaxed resize-none"
                  />
                  <div className="flex justify-between items-center text-[10px] text-aurelle-muted">
                    <span>Our master drapers review all customer instructions prior to packing.</span>
                    <span>{orderNotes.length}/500</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Selection (COD Only in Phase 10) */}
              <div className="bg-white p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-aurelle-border pb-3">
                  <span className="w-6 h-6 rounded-full bg-aurelle-burgundy text-aurelle-cream text-xs flex items-center justify-center font-serif">
                    4
                  </span>
                  <h2 className="font-serif text-lg text-aurelle-ink">Payment Method</h2>
                </div>

                {/* COD Card */}
                <div className="p-3.5 sm:p-4 border-2 border-aurelle-burgundy bg-aurelle-cream/15 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-aurelle-burgundy/10 flex items-center justify-center text-aurelle-burgundy shrink-0">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-aurelle-ink uppercase tracking-wider">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-medium whitespace-nowrap">
                            Verified Active
                          </span>
                        </div>
                        <p className="text-[11px] text-aurelle-muted mt-0.5">
                          Inspect tamper-evident royal seal & pay cash or UPI upon delivery.
                        </p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-4 border-aurelle-burgundy bg-white shrink-0 mt-0.5" />
                  </div>

                  <div className="p-3 bg-white border border-aurelle-border text-[11px] text-aurelle-ink space-y-1">
                    <p className="font-medium text-aurelle-burgundy flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero Prepayment Risk:</span>
                    </p>
                    <p className="text-aurelle-muted leading-relaxed">
                      Your order is verified and dispatched directly from our Varanasi atelier. Total of{" "}
                      <strong className="text-aurelle-ink">{formatPrice(grandTotalPaise)}</strong> to be handed over to the courier executive upon receipt.
                    </p>
                  </div>
                </div>

                {/* Online Payment Private Beta Notice */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-stone-700">Digital Gateway Status:</span> Online Payment Gateways (Razorpay / Cards / NetBanking) are in private atelier testing. Cash on Delivery is 100% active for all domestic orders.
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unable to process order:</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] py-3.5 bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink text-xs uppercase tracking-luxury font-medium transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing & Reserving Heirloom Stock...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Order ({formatPrice(grandTotalPaise)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-center text-aurelle-muted leading-relaxed">
                  By clicking confirm, your reservation is sealed. Duplicate submissions are protected by server-side idempotency.
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Authoritative Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-sm sticky top-24 space-y-6">
              <div className="border-b border-aurelle-border pb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl text-aurelle-ink">
                  Order Summary ({totalCount} {totalCount === 1 ? "item" : "items"})
                </h3>
                <Link
                  href="/cart"
                  className="text-xs text-aurelle-burgundy hover:text-aurelle-gold underline tracking-wider uppercase font-medium"
                >
                  Edit Bag
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs pb-3 border-b border-aurelle-border/60">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-18 object-cover bg-aurelle-cream/40 shrink-0 border border-aurelle-border"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-serif text-aurelle-ink font-semibold truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-aurelle-muted">
                        <span>{item.selectedColor}</span>
                        <span>•</span>
                        <span>{item.selectedSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-aurelle-muted">Qty: {item.quantity}</span>
                        <span className="font-medium text-aurelle-ink">
                          {formatPrice(item.pricePaise * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs text-aurelle-muted pt-2 border-t border-aurelle-border">
                <div className="flex justify-between">
                  <span>Subtotal (Authoritative):</span>
                  <span className="text-aurelle-ink font-medium font-mono">
                    {formatPrice(subtotalPaise)}
                  </span>
                </div>

                {discountPaise > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>
                      Privilege Discount {appliedCoupon ? `(${appliedCoupon.code})` : ""}:
                    </span>
                    <span className="font-mono">-{formatPrice(discountPaise)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <span>Shipping & Delivery:</span>
                    {isFreeShipping ? (
                      <span className="block text-[10px] text-emerald-800">
                        Complimentary (Orders &gt; ₹5,000)
                      </span>
                    ) : (
                      <span className="block text-[10px] text-stone-500">
                        Standard Insured Courier
                      </span>
                    )}
                  </div>
                  <span className="text-aurelle-ink font-medium font-mono">
                    {isFreeShipping ? "FREE" : formatPrice(shippingPaise)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                  <span>Applicable GST (Taxes):</span>
                  <span>Included in MRP</span>
                </div>

                {/* Final Total */}
                <div className="flex justify-between text-base font-semibold text-aurelle-ink pt-3 border-t border-aurelle-border">
                  <span>Total Payable (COD):</span>
                  <span className="text-2xl text-aurelle-burgundy font-serif">
                    {formatPrice(grandTotalPaise)}
                  </span>
                </div>
              </div>

              {/* Server Security Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Authoritative Server Checkout</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Zero client-side price trust. Current catalog prices, active stock, and idempotency locks are authoritatively validated on the server.
                  {!isDatabaseConnected && (
                    <span className="block mt-1 text-emerald-900/70">
                      (Running with scoped server token session; connect Supabase in .env.local for database persistence).
                    </span>
                  )}
                </p>
              </div>

              {/* Heritage Guarantees */}
              <div className="pt-2 border-t border-aurelle-border space-y-2 text-[11px] text-aurelle-muted">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-aurelle-gold shrink-0" />
                  <span>100% Certified Silk Mark Varanasi Weaves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-aurelle-gold shrink-0" />
                  <span>Dispatched in Tamper-Evident Velvet Boxes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-aurelle-gold shrink-0" />
                  <span>Doorstep Inspection & Easy 7-Day Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
