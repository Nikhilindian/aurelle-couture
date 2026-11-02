import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import {
  getAdminProducts,
  createAdminProduct,
  AdminCreateProductSchema,
} from "@/lib/server/admin-service";
import { sanitizeDeep } from "@/lib/server/security-crypto";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const products = getAdminProducts();
  return NextResponse.json({ success: true, products });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(clientIp, "admin");
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Administrative rate limit exceeded. Please wait." },
      { status: 429 }
    );
  }

  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = AdminCreateProductSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeDeep(parsed.data);
    const created = await createAdminProduct(auth.actor, sanitizedData);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
