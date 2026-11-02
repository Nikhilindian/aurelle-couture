import { NextResponse } from "next/server";
import { verifyAdminAuthorization } from "@/lib/server/admin-auth";
import { getAdminProducts, getAdminCollections, getAdminAuditLogs } from "@/lib/server/admin-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminAuthorization(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const products = getAdminProducts();
  const collections = getAdminCollections();
  const auditLogs = getAdminAuditLogs(10);

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const lowStockProducts = products.filter((p) => p.stockCount > 0 && p.stockCount <= 3);
  const outOfStockProducts = products.filter((p) => !p.inStock || p.stockCount === 0);
  const totalCollections = collections.length;

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalProducts,
        inStockProducts,
        lowStockProductsCount: lowStockProducts.length,
        outOfStockProductsCount: outOfStockProducts.length,
        totalCollections,
      },
      lowStockAlerts: lowStockProducts.map((p) => ({
        id: p.id,
        title: p.title,
        stockCount: p.stockCount,
        category: p.category,
      })),
      recentAuditLogs: auditLogs,
    },
  });
}
