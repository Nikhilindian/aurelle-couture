import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import {
  updateAdminInventory,
  AdminUpdateInventorySchema,
} from "@/lib/server/admin-service";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = AdminUpdateInventorySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await updateAdminInventory(auth.actor, parsed.data);
    return NextResponse.json({
      success: true,
      message: `Inventory updated for ${result.product.title}`,
      product: result.product,
      previousStock: result.previousStock,
      newStock: result.newStock,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
