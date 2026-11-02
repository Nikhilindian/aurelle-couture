import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import { setProductStatus } from "@/lib/server/admin-service";

export const dynamic = "force-dynamic";

const SetStatusSchema = z.object({
  status: z.enum(["active", "draft", "archived"]),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = SetStatusSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status value", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await setProductStatus(auth.actor, params.id, parsed.data.status);
    return NextResponse.json({
      success: true,
      message: `Product "${updated.title}" status changed to ${updated.status}`,
      product: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
