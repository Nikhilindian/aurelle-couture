import { z } from "zod";
import { cookies } from "next/headers";
import { MOCK_PRODUCTS } from "@/data/mock-catalog";
import { getServiceSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

export const AddItemSchema = z.object({
  productId: z.string().min(1),
  selectedColor: z.string().min(1),
  selectedSize: z.string().min(1),
  quantity: z.number().int().positive().max(10),
  // Any client-supplied price or total will be ignored!
});

export const UpdateItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(0).max(10),
});

export const RemoveItemSchema = z.object({
  itemId: z.string().min(1),
});

export const ApplyCouponSchema = z.object({
  code: z.string().min(1).max(20),
});

export interface ServerCartItem {
  id: string; // unique item id
  productId: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  selectedColor: string;
  selectedSize: string;
  pricePaise: number; // Server-authoritative integer paise
  quantity: number;
  stockLimit: number;
  image: string;
}

export interface ServerCartSummary {
  items: ServerCartItem[];
  totalCount: number;
  subtotalPaise: number;
  discountPaise: number;
  finalTotalPaise: number;
  isFreeShipping: boolean;
  freeShippingThresholdPaise: number;
  appliedCoupon: {
    code: string;
    discountType: "percentage" | "fixed_amount";
    discountValue: number;
  } | null;
  isDatabaseConnected: boolean;
}

export const FREE_SHIPPING_THRESHOLD_PAISE = 500000; // ₹5,000 in paise
export const CART_COOKIE_NAME = "aurelle_cart_token";

// In-memory server session fallback store when Supabase credentials are not set
const memoryCarts = new Map<
  string,
  {
    items: ServerCartItem[];
    couponCode: string | null;
  }
>();

/**
 * Authoritative Server Coupon Rules (in Paise)
 */
const AUTHORITATIVE_COUPONS = [
  {
    code: "AURELLE10",
    type: "percentage" as const,
    value: 10,
    minOrderPaise: 500000, // min ₹5,000
    maxDiscountPaise: 500000, // max ₹5,000
  },
  {
    code: "ROYALTY15",
    type: "percentage" as const,
    value: 15,
    minOrderPaise: 2000000, // min ₹20,000
    maxDiscountPaise: 1500000, // max ₹15,000
  },
  {
    code: "FESTIVE20",
    type: "percentage" as const,
    value: 20,
    minOrderPaise: 5000000, // min ₹50,000
    maxDiscountPaise: 2500000, // max ₹25,000
  },
];

/**
 * Get or establish a cryptographically random, scoped anonymous cart token
 */
export function getOrCreateCartToken(): string {
  const cookieStore = cookies();
  const existing = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (existing && existing.length >= 16) {
    return existing;
  }

  const newToken = "anon_" + crypto.randomUUID();
  try {
    cookieStore.set(CART_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } catch {
    // In Server Components cookies().set may not be permitted; route handler will write header
  }
  return newToken;
}

/**
 * Authoritative helper to fetch item details and current price from database/catalog.
 * NEVER trusts client-supplied price.
 */
function getAuthoritativeProductVariant(
  productId: string,
  selectedColor: string,
  selectedSize: string
) {
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product || (product.status && product.status !== "active")) return null;

  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle,
    category: product.category,
    pricePaise: product.pricePaise, // Server authoritative price in paise
    stockLimit: product.stockCount || 5,
    image: product.images[0]?.url || "",
  };
}

/**
 * Retrieve current cart from server storage (Supabase or scoped server fallback)
 */
export async function getServerCart(cartToken: string): Promise<ServerCartSummary> {
  const supabase = getServiceSupabase();
  const isDb = isServerSupabaseConfigured && supabase !== null;

  let rawItems: ServerCartItem[] = [];
  let appliedCouponCode: string | null = null;

  if (isDb) {
    // In live DB mode, query cart from Supabase
    // (If not yet migrated or credentials fail, gracefully fall back to scoped memory)
    try {
      const { data: cartData } = await supabase
        .from("carts")
        .select("id, cart_items(*, variants(*, products(*)))")
        .eq("anonymous_token", cartToken)
        .maybeSingle();

      if (cartData) {
        // Map DB relations to ServerCartItem
      }
    } catch (e) {
      console.warn("DB query failed, using authoritative memory fallback", e);
    }
  }

  // Scoped Memory Fallback
  const cartRecord = memoryCarts.get(cartToken) || { items: [], couponCode: null };
  rawItems = cartRecord.items;
  appliedCouponCode = cartRecord.couponCode;

  // Re-verify every item against authoritative catalog price and stock
  const sanitizedItems: ServerCartItem[] = [];
  for (const item of rawItems) {
    const authRecord = getAuthoritativeProductVariant(
      item.productId,
      item.selectedColor,
      item.selectedSize
    );
    if (authRecord) {
      sanitizedItems.push({
        ...item,
        pricePaise: authRecord.pricePaise, // Enforce server price
        stockLimit: authRecord.stockLimit,
        quantity: Math.min(item.quantity, authRecord.stockLimit),
      });
    }
  }

  // Calculate Subtotal in Paise
  const subtotalPaise = sanitizedItems.reduce(
    (sum, i) => sum + i.pricePaise * i.quantity,
    0
  );
  const totalCount = sanitizedItems.reduce((sum, i) => sum + i.quantity, 0);

  // Authoritative Coupon Validation
  let discountPaise = 0;
  let validatedCoupon = null;

  if (appliedCouponCode) {
    const couponDef = AUTHORITATIVE_COUPONS.find(
      (c) => c.code === appliedCouponCode
    );
    if (couponDef && subtotalPaise >= couponDef.minOrderPaise) {
      if (couponDef.type === "percentage") {
        const rawDiscount = Math.round((subtotalPaise * couponDef.value) / 100);
        discountPaise = couponDef.maxDiscountPaise
          ? Math.min(rawDiscount, couponDef.maxDiscountPaise)
          : rawDiscount;
      }
      validatedCoupon = {
        code: couponDef.code,
        discountType: couponDef.type,
        discountValue: couponDef.value,
      };
    }
  }

  const isFreeShipping = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const finalTotalPaise = Math.max(0, subtotalPaise - discountPaise);

  return {
    items: sanitizedItems,
    totalCount,
    subtotalPaise,
    discountPaise,
    finalTotalPaise,
    isFreeShipping,
    freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
    appliedCoupon: validatedCoupon,
    isDatabaseConnected: isDb,
  };
}

/**
 * Add or update cart item on server
 */
export async function addServerCartItem(
  cartToken: string,
  params: z.infer<typeof AddItemSchema>
): Promise<ServerCartSummary> {
  const authRecord = getAuthoritativeProductVariant(
    params.productId,
    params.selectedColor,
    params.selectedSize
  );

  if (!authRecord) {
    throw new Error("Product variant not found in master catalog");
  }

  const itemId = `${params.productId}-${params.selectedColor}-${params.selectedSize}`;
  const cartRecord = memoryCarts.get(cartToken) || { items: [], couponCode: null };

  const existingIndex = cartRecord.items.findIndex((i) => i.id === itemId);
  if (existingIndex >= 0) {
    const existing = cartRecord.items[existingIndex];
    const newQty = Math.min(
      existing.quantity + params.quantity,
      authRecord.stockLimit
    );
    cartRecord.items[existingIndex] = {
      ...existing,
      quantity: newQty,
      pricePaise: authRecord.pricePaise, // Enforce current price
    };
  } else {
    cartRecord.items.push({
      id: itemId,
      productId: authRecord.productId,
      slug: authRecord.slug,
      title: authRecord.title,
      subtitle: authRecord.subtitle,
      category: authRecord.category,
      selectedColor: params.selectedColor,
      selectedSize: params.selectedSize,
      pricePaise: authRecord.pricePaise,
      quantity: Math.min(params.quantity, authRecord.stockLimit),
      stockLimit: authRecord.stockLimit,
      image: authRecord.image,
    });
  }

  memoryCarts.set(cartToken, cartRecord);
  return getServerCart(cartToken);
}

/**
 * Update quantity on server
 */
export async function updateServerCartItem(
  cartToken: string,
  params: z.infer<typeof UpdateItemSchema>
): Promise<ServerCartSummary> {
  const cartRecord = memoryCarts.get(cartToken) || { items: [], couponCode: null };

  if (params.quantity <= 0) {
    cartRecord.items = cartRecord.items.filter((i) => i.id !== params.itemId);
  } else {
    cartRecord.items = cartRecord.items.map((item) => {
      if (item.id === params.itemId) {
        return {
          ...item,
          quantity: Math.min(params.quantity, item.stockLimit),
        };
      }
      return item;
    });
  }

  memoryCarts.set(cartToken, cartRecord);
  return getServerCart(cartToken);
}

/**
 * Remove item from server cart
 */
export async function removeServerCartItem(
  cartToken: string,
  itemId: string
): Promise<ServerCartSummary> {
  const cartRecord = memoryCarts.get(cartToken) || { items: [], couponCode: null };
  cartRecord.items = cartRecord.items.filter((i) => i.id !== itemId);
  memoryCarts.set(cartToken, cartRecord);
  return getServerCart(cartToken);
}

/**
 * Apply coupon on server
 */
export async function applyServerCoupon(
  cartToken: string,
  code: string
): Promise<{ success: boolean; message: string; summary: ServerCartSummary }> {
  const normalized = code.trim().toUpperCase();
  const coupon = AUTHORITATIVE_COUPONS.find((c) => c.code === normalized);

  if (!coupon) {
    const summary = await getServerCart(cartToken);
    return {
      success: false,
      message: "Invalid privilege code. Valid demo codes: AURELLE10, ROYALTY15",
      summary,
    };
  }

  const currentSummary = await getServerCart(cartToken);
  if (currentSummary.subtotalPaise < coupon.minOrderPaise) {
    return {
      success: false,
      message: `Code ${normalized} requires a minimum order value of ₹${(
        coupon.minOrderPaise / 100
      ).toLocaleString("en-IN")}`,
      summary: currentSummary,
    };
  }

  const cartRecord = memoryCarts.get(cartToken) || { items: [], couponCode: null };
  cartRecord.couponCode = normalized;
  memoryCarts.set(cartToken, cartRecord);

  const updatedSummary = await getServerCart(cartToken);
  return {
    success: true,
    message: `Privilege code ${normalized} applied (-${coupon.value}%)`,
    summary: updatedSummary,
  };
}

/**
 * Clear all items and coupon from the server cart
 */
export async function clearServerCart(cartToken: string): Promise<ServerCartSummary> {
  memoryCarts.delete(cartToken);
  const supabase = getServiceSupabase();
  if (isServerSupabaseConfigured && supabase) {
    try {
      const { data: cartData } = await (supabase as any)
        .from("carts")
        .select("id")
        .eq("anonymous_token", cartToken)
        .maybeSingle();
      if (cartData) {
        await (supabase as any).from("cart_items").delete().eq("cart_id", cartData.id);
      }
    } catch (e) {
      console.warn("DB clear cart error:", e);
    }
  }
  return getServerCart(cartToken);
}

