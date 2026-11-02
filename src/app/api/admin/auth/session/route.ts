import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  DEFAULT_ADMIN_EMAIL,
  validateAdminPasskey,
  createAdminSessionToken,
} from "@/lib/server/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";
import { sanitizeInput } from "@/lib/server/security-crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Enforce strict Rate Limiting on authentication attempts
    const rateCheck = checkRateLimit(clientIp, "auth");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many authentication attempts. Please wait before retrying.",
          retryAfterSeconds: rateCheck.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetSeconds),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const rawPasskey = body?.passkey;
    const rawEmail = body?.email;

    if (!rawPasskey || typeof rawPasskey !== "string") {
      return NextResponse.json(
        { success: false, error: "Administrative passkey is required." },
        { status: 400 }
      );
    }

    // 2. Validate passkey in constant time
    const isValid = validateAdminPasskey(rawPasskey.trim());
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid atelier administrative passkey. Access denied.",
        },
        {
          status: 403,
          headers: {
            "X-RateLimit-Remaining": String(rateCheck.remaining),
          },
        }
      );
    }

    // 3. Issue cryptographically signed HMAC-SHA256 session token
    const actor = {
      id: "admin-vault-master",
      email: sanitizeInput(rawEmail) || DEFAULT_ADMIN_EMAIL,
      role: "admin" as const,
    };

    const signedToken = createAdminSessionToken(actor);

    // 4. Set HttpOnly, Secure, SameSite cookie
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours session
    });

    return NextResponse.json(
      {
        success: true,
        message: "Atelier administrative vault unlocked with cryptographically signed session.",
        actor,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to establish admin session." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true, message: "Admin session terminated." });
}
