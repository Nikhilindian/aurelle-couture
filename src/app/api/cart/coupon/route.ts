import { NextResponse } from "next/server";
import {
  getOrCreateCartToken,
  applyServerCoupon,
  ApplyCouponSchema,
} from "@/lib/server/cart-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";
import { sanitizeInput } from "@/lib/server/security-crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate Limit: 10 coupon attempts per minute
    const rateCheck = checkRateLimit(clientIp, "checkout");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many coupon attempts. Please wait a moment before trying again.",
          retryAfterSeconds: rateCheck.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetSeconds),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const cartToken = getOrCreateCartToken();
    const rawBody = await request.json();

    const parsed = ApplyCouponSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid coupon payload",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const cleanCode = sanitizeInput(parsed.data.code).toUpperCase();
    const result = await applyServerCoupon(cartToken, cleanCode);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Cart coupon error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
