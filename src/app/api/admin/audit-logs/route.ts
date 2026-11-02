import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import { getAdminAuditLogs } from "@/lib/server/admin-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const logs = getAdminAuditLogs(50);
  return NextResponse.json({ success: true, logs });
}
