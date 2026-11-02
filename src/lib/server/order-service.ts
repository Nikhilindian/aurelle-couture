import { z } from "zod";
import crypto from "crypto";
import { cookies } from "next/headers";
import {
  getServerCart,
  clearServerCart,
  getOrCreateCartToken,
  FREE_SHIPPING_THRESHOLD_PAISE,
} from "@/lib/server/cart-service";
import { MOCK_PRODUCTS } from "@/data/mock-catalog";
import { getServiceSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

export const STANDARD_SHIPPING_FEE_PAISE = 25000; // Flat ₹250 domestic insured luxury courier for orders below ₹5,000 threshold

export const ShippingAddressSchema = z.object({
  recipientName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15)
    .regex(/^[0-9+\s()-]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  addressLine1: z.string().min(3, "Address line 1 must be at least 3 characters").max(200),
  addressLine2: z.string().max(200).optional().default(""),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  postalCode: z
    .string()
    .min(4, "Postal code must be at least 4 digits")
    .max(10)
    .regex(/^[0-9A-Za-z\s-]+$/, "Invalid postal code"),
  country: z.string().default("IN"),
});

export const CreateOrderSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  orderNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional().default(""),
  idempotencyKey: z.string().min(8, "Valid idempotency key required"),
  paymentMethod: z.literal("COD"), // Strictly COD in Phase 10
  userId: z.string().nullable().optional(),
});

export interface OrderItemSnapshot {
  productId: string;
  title: string;
  subtitle: string;
  category: string;
  sku: string;
  color: string;
  size: string;
  pricePaise: number;
  quantity: number;
  subtotalPaise: number;
  image: string;
}

export interface AuthoritativeOrder {
  id: string; // opaque UUID
  publicOrderNumber: string; // opaque human-readable e.g. AUR-202610-8X9K2P
  receiptToken: string; // cryptographically secure token to authorize receipt view
  cartToken: string;
  userId: string | null;
  guestEmail: string;
  guestPhone: string;
  currency: string;
  subtotalPaise: number;
  shippingPaise: number;
  discountPaise: number;
  totalPaise: number;
  paymentMethod: "COD";
  paymentStatus: "pending";
  fulfillmentStatus: "unfulfilled";
  shippingAddress: z.infer<typeof ShippingAddressSchema>;
  orderNotes?: string;
  couponCode: string | null;
  items: OrderItemSnapshot[];
  idempotencyKey: string;
  createdAt: string;
  isDatabaseConnected: boolean;
}

// Memory stores for local/offline runtime consistency
const orderStore = new Map<string, AuthoritativeOrder>();
const idempotencyStore = new Map<string, AuthoritativeOrder>();

export const ORDER_RECEIPT_COOKIE_NAME = "aurelle_last_receipt_token";

/**
 * Creates an authoritative order strictly computing all prices on server.
 * Handles duplicate submissions gracefully via idempotency key.
 */
export async function createAuthoritativeOrder(
  cartToken: string,
  payload: z.infer<typeof CreateOrderSchema>
): Promise<AuthoritativeOrder> {
  // 1. Idempotency Check: Return existing order if identical submission already processed
  const existingOrder = idempotencyStore.get(payload.idempotencyKey);
  if (existingOrder) {
    return existingOrder;
  }

  // 2. Fetch authoritative cart
  const cartSummary = await getServerCart(cartToken);
  if (!cartSummary.items || cartSummary.items.length === 0) {
    throw new Error("Your shopping bag is empty. Please add items before checking out.");
  }

  // 3. Re-verify stock and current catalog availability for every line item
  for (const item of cartSummary.items) {
    const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
    if (!product || (product.status && product.status !== "active")) {
      throw new Error(`Item "${item.title}" is no longer available in master catalog.`);
    }
    if (!product.inStock) {
      throw new Error(`Item "${item.title}" is currently out of stock.`);
    }
    const maxAvailable = product.stockCount || 5;
    if (item.quantity > maxAvailable) {
      throw new Error(
        `Requested quantity for "${item.title}" exceeds available stock (Maximum: ${maxAvailable}).`
      );
    }
  }

  // 4. Server-Authoritative Financial Totals (integer paise)
  const subtotalPaise = cartSummary.subtotalPaise;
  const discountPaise = cartSummary.discountPaise;
  const shippingPaise =
    subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : STANDARD_SHIPPING_FEE_PAISE;
  const totalPaise = Math.max(0, subtotalPaise - discountPaise + shippingPaise);

  // 5. Generate Opaque Identifiers
  const orderId = crypto.randomUUID();
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  const dateCode = new Date().toISOString().slice(2, 7).replace(/-/g, ""); // e.g. 2610
  const publicOrderNumber = `AUR-${dateCode}-${randomSuffix}`;
  const receiptToken = "rec_" + crypto.randomBytes(16).toString("hex");

  // 6. Build item snapshots
  const itemSnapshots: OrderItemSnapshot[] = cartSummary.items.map((item) => ({
    productId: item.productId,
    title: item.title,
    subtitle: item.subtitle,
    category: item.category,
    sku: `${item.productId}-${item.selectedColor.slice(0, 3).toUpperCase()}-${item.selectedSize.slice(0, 2).toUpperCase()}`,
    color: item.selectedColor,
    size: item.selectedSize,
    pricePaise: item.pricePaise,
    quantity: item.quantity,
    subtotalPaise: item.pricePaise * item.quantity,
    image: item.image,
  }));

  const orderRecord: AuthoritativeOrder = {
    id: orderId,
    publicOrderNumber,
    receiptToken,
    cartToken,
    userId: payload.userId || null,
    guestEmail: payload.shippingAddress.email,
    guestPhone: payload.shippingAddress.phone,
    currency: "INR",
    subtotalPaise,
    shippingPaise,
    discountPaise,
    totalPaise,
    paymentMethod: "COD",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    shippingAddress: payload.shippingAddress,
    orderNotes: payload.orderNotes,
    couponCode: cartSummary.appliedCoupon?.code || null,
    items: itemSnapshots,
    idempotencyKey: payload.idempotencyKey,
    createdAt: new Date().toISOString(),
    isDatabaseConnected: false,
  };

  // 7. Persist to Supabase if configured
  const supabase = getServiceSupabase();
  if (isServerSupabaseConfigured && supabase) {
    try {
      const { error: orderError } = await (supabase as any).from("orders").insert({
        id: orderId,
        public_order_number: publicOrderNumber,
        user_id: payload.userId || null,
        guest_email: payload.shippingAddress.email,
        guest_phone: payload.shippingAddress.phone,
        currency: "INR",
        subtotal_paise: subtotalPaise,
        shipping_paise: shippingPaise,
        discount_paise: discountPaise,
        total_paise: totalPaise,
        payment_method: "COD",
        payment_status: "pending",
        fulfillment_status: "unfulfilled",
        shipping_address_snapshot: {
          ...payload.shippingAddress,
          orderNotes: payload.orderNotes,
          receiptToken,
        },
        coupon_code_snapshot: cartSummary.appliedCoupon?.code || null,
        idempotency_key: payload.idempotencyKey,
      });

      if (!orderError) {
        orderRecord.isDatabaseConnected = true;
        // Insert order items snapshot
        const orderItemsRows = itemSnapshots.map((item) => ({
          order_id: orderId,
          title_snapshot: item.title,
          sku_snapshot: item.sku,
          color_snapshot: item.color,
          size_snapshot: item.size,
          price_paise_snapshot: item.pricePaise,
          quantity: item.quantity,
          image_snapshot: item.image,
        }));
        await (supabase as any).from("order_items").insert(orderItemsRows);
      } else {
        console.warn("Supabase order insert warning:", orderError.message);
      }
    } catch (dbErr) {
      console.warn("Database unavailable for order insert, using authoritative memory fallback:", dbErr);
    }
  }

  // 8. Store in server memory and lock idempotency key
  orderStore.set(orderId, orderRecord);
  idempotencyStore.set(payload.idempotencyKey, orderRecord);

  // 9. Clear the cart authoritatively after successful order creation
  await clearServerCart(cartToken);

  return orderRecord;
}

/**
 * Securely fetch order details for the receipt page.
 * Only returns order if caller owns it or has the matching receiptToken/cartToken.
 * Prevents unauthorized exposure of other customers' addresses and orders.
 */
export async function getAuthoritativeOrderReceipt(
  orderId: string,
  authContext: {
    userId?: string | null;
    receiptToken?: string | null;
    cartToken?: string | null;
  }
): Promise<{ order: AuthoritativeOrder | null; isAuthorized: boolean }> {
  // Check memory store
  let order = orderStore.get(orderId) || null;

  // If not found in memory, check Supabase
  if (!order) {
    const supabase = getServiceSupabase();
    if (isServerSupabaseConfigured && supabase) {
      try {
        const { data: dbOrder } = await (supabase as any)
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", orderId)
          .maybeSingle();

        if (dbOrder) {
          const addressSnapshot = (dbOrder.shipping_address_snapshot as any) || {};
          order = {
            id: dbOrder.id,
            publicOrderNumber: dbOrder.public_order_number,
            receiptToken: addressSnapshot.receiptToken || "",
            cartToken: "",
            userId: dbOrder.user_id,
            guestEmail: dbOrder.guest_email || "",
            guestPhone: dbOrder.guest_phone || "",
            currency: dbOrder.currency,
            subtotalPaise: Number(dbOrder.subtotal_paise),
            shippingPaise: Number(dbOrder.shipping_paise),
            discountPaise: Number(dbOrder.discount_paise),
            totalPaise: Number(dbOrder.total_paise),
            paymentMethod: "COD",
            paymentStatus: "pending",
            fulfillmentStatus: "unfulfilled",
            shippingAddress: {
              recipientName: addressSnapshot.recipientName || "Valued Client",
              phone: addressSnapshot.phone || "",
              email: addressSnapshot.email || "",
              addressLine1: addressSnapshot.addressLine1 || "",
              addressLine2: addressSnapshot.addressLine2 || "",
              city: addressSnapshot.city || "",
              state: addressSnapshot.state || "",
              postalCode: addressSnapshot.postalCode || "",
              country: addressSnapshot.country || "IN",
            },
            orderNotes: addressSnapshot.orderNotes || "",
            couponCode: dbOrder.coupon_code_snapshot,
            items: ((dbOrder as any).order_items || []).map((it: any) => ({
              productId: it.product_id || "",
              title: it.title_snapshot,
              subtitle: "",
              category: "",
              sku: it.sku_snapshot,
              color: it.color_snapshot,
              size: it.size_snapshot,
              pricePaise: Number(it.price_paise_snapshot),
              quantity: it.quantity,
              subtotalPaise: Number(it.price_paise_snapshot) * it.quantity,
              image: it.image_snapshot || "",
            })),
            idempotencyKey: dbOrder.idempotency_key || "",
            createdAt: dbOrder.created_at,
            isDatabaseConnected: true,
          };
          orderStore.set(orderId, order);
        }
      } catch (err) {
        console.warn("DB get order receipt error:", err);
      }
    }
  }

  if (!order) {
    return { order: null, isAuthorized: false };
  }

  // Security Check: Customer ownership or matching receipt token verification
  const isUserOwner = Boolean(
    authContext.userId && order.userId && authContext.userId === order.userId
  );
  const hasMatchingReceiptToken = Boolean(
    authContext.receiptToken && order.receiptToken === authContext.receiptToken
  );
  const hasMatchingCartToken = Boolean(
    authContext.cartToken && order.cartToken === authContext.cartToken
  );

  const isAuthorized = isUserOwner || hasMatchingReceiptToken || hasMatchingCartToken;

  if (!isAuthorized) {
    // Hide all customer PII, address, and items if unauthorized
    return { order: null, isAuthorized: false };
  }

  return { order, isAuthorized: true };
}
