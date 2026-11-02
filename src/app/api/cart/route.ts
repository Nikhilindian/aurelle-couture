import { NextResponse } from "next/server";
import { getOrCreateCartToken, getServerCart } from "@/lib/server/cart-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cartToken = getOrCreateCartToken();
    const cartSummary = await getServerCart(cartToken);

    const response = NextResponse.json({
      success: true,
      data: cartSummary,
    });

    // Ensure cookie is set
    response.cookies.set("aurelle_cart_token", cartToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve server cart" },
      { status: 500 }
    );
  }
}
