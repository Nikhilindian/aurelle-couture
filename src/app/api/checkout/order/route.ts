import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createAuthoritativeOrder,
  CreateOrderSchema,
  ORDER_RECEIPT_COOKIE_NAME,
} from "@/lib/server/order-service";
import { getOrCreateCartToken } from "@/lib/server/cart-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";
import { sanitizeDeep } from "@/lib/server/security-crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting: Max 10 orders per minute per IP
    const rateCheck = checkRateLimit(clientIp, "checkout");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many checkout requests in a short period. Please wait a moment.",
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

    const parsed = CreateOrderSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid checkout submission data",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    // 2. Strict XSS Sanitization of all user-supplied address & note fields
    const sanitizedData = sanitizeDeep(parsed.data);

    const order = await createAuthoritativeOrder(cartToken, sanitizedData);

    // 3. Set secure cookie with the order's receipt token for session authorization
    const cookieStore = cookies();
    cookieStore.set(ORDER_RECEIPT_COOKIE_NAME, order.receiptToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          publicOrderNumber: order.publicOrderNumber,
          receiptToken: order.receiptToken,
          totalPaise: order.totalPaise,
          paymentMethod: order.paymentMethod,
          isDatabaseConnected: order.isDatabaseConnected,
        },
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (error: any) {
    console.error("Checkout order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process order. Please try again.",
      },
      { status: 400 }
    );
  }
}
