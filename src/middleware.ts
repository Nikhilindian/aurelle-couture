import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Suspicious paths and scanner probes to block immediately
const BLOCKED_PROBE_PATTERNS = [
  /\/\.git/i,
  /\/\.env/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/phpmyadmin/i,
  /\/cgi-bin/i,
  /\/etc\/passwd/i,
  /\/eval-stdin/i,
  /\/\.aws/i,
  /\/actuator/i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Immediately drop malicious probe scans
  for (const pattern of BLOCKED_PROBE_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse("Access Denied", { status: 403 });
    }
  }

  // 2. Early Guard for Administrative API endpoints (excluding auth/session)
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth/session")) {
    const adminToken = request.cookies.get("aurelle_admin_token")?.value;
    const adminHeader = request.headers.get("x-admin-key") || request.headers.get("authorization");
    const roleHeader = request.headers.get("x-user-role");

    // Fast-reject if user explicitly identified as customer or completely unauthenticated
    if (roleHeader === "customer" && !adminToken && !adminHeader) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Customer accounts are restricted from administrative actions.",
        },
        { status: 403 }
      );
    }

    if (!adminToken && !adminHeader) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing administrative authorization credentials.",
        },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  // 3. Inject Strict Production Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HSTS (Strict-Transport-Security)
  if (process.env.NODE_ENV === "production" || request.headers.get("x-forwarded-proto") === "https") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
