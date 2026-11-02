import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import {
  getAdminCategories,
  createAdminCategory,
  AdminCreateCategorySchema,
} from "@/lib/server/admin-service";
import { sanitizeDeep } from "@/lib/server/security-crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const categories = getAdminCategories();
  return NextResponse.json({ success: true, categories });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = AdminCreateCategorySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeDeep(parsed.data);
    const created = await createAdminCategory(auth.actor, sanitizedData);
    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
