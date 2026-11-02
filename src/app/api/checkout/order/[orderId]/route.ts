import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAuthoritativeOrderReceipt,
  ORDER_RECEIPT_COOKIE_NAME,
} from "@/lib/server/order-service";
import { CART_COOKIE_NAME } from "@/lib/server/cart-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const url = new URL(request.url);
    const queryReceiptToken = url.searchParams.get("token");

    const cookieStore = cookies();
    const cookieReceiptToken = cookieStore.get(ORDER_RECEIPT_COOKIE_NAME)?.value;
    const cartToken = cookieStore.get(CART_COOKIE_NAME)?.value;

    const receiptToken = queryReceiptToken || cookieReceiptToken;

    const result = await getAuthoritativeOrderReceipt(orderId, {
      receiptToken,
      cartToken,
    });

    if (!result.isAuthorized || !result.order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found or you are not authorized to view this receipt.",
        },
        { status: 404 }
      );
    }

    // Strip sensitive internal fields before responding
    const safeOrder = {
      id: result.order.id,
      publicOrderNumber: result.order.publicOrderNumber,
      createdAt: result.order.createdAt,
      currency: result.order.currency,
      subtotalPaise: result.order.subtotalPaise,
      shippingPaise: result.order.shippingPaise,
      discountPaise: result.order.discountPaise,
      totalPaise: result.order.totalPaise,
      paymentMethod: result.order.paymentMethod,
      paymentStatus: result.order.paymentStatus,
      fulfillmentStatus: result.order.fulfillmentStatus,
      shippingAddress: result.order.shippingAddress,
      orderNotes: result.order.orderNotes,
      couponCode: result.order.couponCode,
      items: result.order.items,
      isDatabaseConnected: result.order.isDatabaseConnected,
    };

    return NextResponse.json({
      success: true,
      order: safeOrder,
    });
  } catch (error: any) {
    console.error("Fetch order receipt error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve order receipt." },
      { status: 500 }
    );
  }
}
