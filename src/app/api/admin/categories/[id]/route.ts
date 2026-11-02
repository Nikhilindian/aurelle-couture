import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import {
  updateAdminCategory,
  toggleCategoryArchive,
  AdminUpdateCategorySchema,
} from "@/lib/server/admin-service";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = AdminUpdateCategorySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateAdminCategory(auth.actor, params.id, parsed.data);
    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
