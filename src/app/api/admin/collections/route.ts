import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import {
  getAdminCollections,
  createAdminCollection,
  AdminCreateCollectionSchema,
} from "@/lib/server/admin-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const collections = getAdminCollections();
  return NextResponse.json({ success: true, collections });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = AdminCreateCollectionSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const created = await createAdminCollection(auth.actor, parsed.data);
    return NextResponse.json({ success: true, collection: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
