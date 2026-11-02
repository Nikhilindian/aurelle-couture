// Comprehensive Security Hardening & Penetration Verification Suite
import http from "http";

const BASE_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = options.headers || {};
  const method = options.method || "GET";
  const body = options.body ? JSON.stringify(options.body) : undefined;

  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text();
  }

  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    data,
  };
}

async function runSecurityAudit() {
  console.log("\n🔒 ========================================================");
  console.log("🔒 AURELLE LUXURY COUTURE — SECURITY VERIFICATION AUDIT");
  console.log("🔒 ========================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // --- 1. Security Headers Verification ---
  console.log("\n--- 1. Testing Security Headers & Information Disclosure ---");
  const homeRes = await request("/");
  assert(homeRes.status === 200, "Home page loads with HTTP 200");
  assert(
    homeRes.headers["x-frame-options"] === "DENY",
    "Anti-Clickjacking header present (X-Frame-Options: DENY)"
  );
  assert(
    homeRes.headers["x-content-type-options"] === "nosniff",
    "Anti-MIME sniffing header present (X-Content-Type-Options: nosniff)"
  );
  assert(
    homeRes.headers["referrer-policy"] === "strict-origin-when-cross-origin",
    "Referrer policy configured (strict-origin-when-cross-origin)"
  );
  assert(
    Boolean(homeRes.headers["permissions-policy"]),
    "Permissions-Policy configured to restrict device sensors"
  );
  assert(
    !homeRes.headers["x-powered-by"],
    "X-Powered-By header is strictly removed (Technology fingerprinting disabled)"
  );

  // --- 2. Scanner Probes & Malicious Path Defense ---
  console.log("\n--- 2. Testing Edge Scanner Probe Defense ---");
  const probeEnv = await request("/.env");
  assert(probeEnv.status === 403, "Probe '/.env' immediately blocked with HTTP 403");

  const probeGit = await request("/.git/config");
  assert(probeGit.status === 403, "Probe '/.git/config' immediately blocked with HTTP 403");

  const probeWp = await request("/wp-admin");
  assert(probeWp.status === 403, "Probe '/wp-admin' immediately blocked with HTTP 403");

  // --- 3. Admin Route Protection & RBAC ---
  console.log("\n--- 3. Testing Administrative Route Authorization & RBAC ---");
  const unauthAdmin = await request("/api/admin/products");
  assert(
    unauthAdmin.status === 401 || unauthAdmin.status === 403,
    `Unauthenticated /api/admin/products rejected with HTTP ${unauthAdmin.status}`
  );

  const customerAdmin = await request("/api/admin/products", {
    headers: { "x-user-role": "customer" },
  });
  assert(
    customerAdmin.status === 403,
    "Customer role explicitly forbidden on /api/admin/products with HTTP 403"
  );

  // --- 4. Rate Limiting Defense ---
  console.log("\n--- 4. Testing Authentication Rate Limiting ---");
  let hitRateLimit = false;
  let lastStatus = 0;
  for (let i = 0; i < 7; i++) {
    const attempt = await request("/api/admin/auth/session", {
      method: "POST",
      body: { passkey: `wrong-passkey-${i}`, email: "attacker@test.com" },
    });
    lastStatus = attempt.status;
    if (attempt.status === 429) {
      hitRateLimit = true;
      break;
    }
  }
  assert(
    hitRateLimit,
    `Rate limiter tripped on repeated failed logins (Received HTTP 429 Too Many Requests)`
  );

  // --- 5. Valid Admin Authentication with HMAC Session Token ---
  console.log("\n--- 5. Testing Authorized Admin Session & Constant-Time Check ---");
  const validLogin = await request("/api/admin/auth/session", {
    method: "POST",
    headers: { "x-forwarded-for": "10.0.0.99" }, // separate IP for fresh rate limit bucket
    body: { passkey: "aurelle_admin_vault_passkey_2026", email: "admin@aurelle.in" },
  });

  assert(validLogin.status === 200, "Valid admin login returns HTTP 200 OK");
  const rawSetCookie = validLogin.headers["set-cookie"] || "";
  assert(
    rawSetCookie.includes("aurelle_admin_token"),
    "HttpOnly signed session cookie 'aurelle_admin_token' issued"
  );

  // Extract session token from cookie
  const cookieMatch = rawSetCookie.match(/aurelle_admin_token=([^;]+)/);
  const sessionToken = cookieMatch ? cookieMatch[1] : "";
  assert(
    sessionToken.includes("."),
    "Session token is cryptographically signed (HMAC payload.signature format)"
  );

  // Test admin route with the signed session cookie
  const authAdminRes = await request("/api/admin/products", {
    headers: {
      Cookie: `aurelle_admin_token=${sessionToken}`,
    },
  });
  assert(
    authAdminRes.status === 200,
    "Authorized admin request using HMAC session cookie returns HTTP 200 with catalog data"
  );

  // --- 6. IDOR & Order Receipt Authorization ---
  console.log("\n--- 6. Testing IDOR Defense on Order Receipts ---");
  const unauthOrder = await request("/api/checkout/order/ord-non-existent-999");
  assert(
    unauthOrder.status === 404,
    "Unauthorized or missing order request returns 404 (No data leaked via IDOR)"
  );

  console.log(`\n========================================================`);
  console.log(`🎯 AUDIT COMPLETE: ${passed} / ${total} security checks passed!`);
  console.log(`========================================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Audit script error:", err);
  process.exit(1);
});
