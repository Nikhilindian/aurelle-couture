import { NextResponse } from "next/server";
import {
  getOrCreateCartToken,
  addServerCartItem,
  updateServerCartItem,
  removeServerCartItem,
  AddItemSchema,
  UpdateItemSchema,
  RemoveItemSchema,
} from "@/lib/server/cart-service";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";
import { sanitizeDeep } from "@/lib/server/security-crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, "cart");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart request rate limit exceeded. Please slow down.",
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

    // Strict Zod input validation
    const parsed = AddItemSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid cart payload",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeDeep(parsed.data);
    const updatedCart = await addServerCartItem(cartToken, sanitizedData);

    const response = NextResponse.json({
      success: true,
      data: updatedCart,
    });

    response.cookies.set("aurelle_cart_token", cartToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error("Cart item POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, "cart");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const cartToken = getOrCreateCartToken();
    const rawBody = await request.json();

    const parsed = UpdateItemSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid update payload",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeDeep(parsed.data);
    const updatedCart = await updateServerCartItem(cartToken, sanitizedData);
    return NextResponse.json({
      success: true,
      data: updatedCart,
    });
  } catch (error: any) {
    console.error("Cart item PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, "cart");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const cartToken = getOrCreateCartToken();
    const rawBody = await request.json();

    const parsed = RemoveItemSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid deletion payload",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const updatedCart = await removeServerCartItem(cartToken, parsed.data.itemId);
    return NextResponse.json({
      success: true,
      data: updatedCart,
    });
  } catch (error: any) {
    console.error("Cart item DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove item" },
      { status: 500 }
    );
  }
}
