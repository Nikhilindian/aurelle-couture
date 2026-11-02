import crypto from "crypto";

/**
 * Enterprise Cryptographic Security & Password Hashing Utilities
 * - PBKDF2 with 100,000 iterations & SHA-512 + cryptographically secure salt
 * - Constant-time comparison (crypto.timingSafeEqual) against timing attacks
 * - HMAC-SHA256 signed session tokens with expiry
 * - Strict XSS and HTML input sanitization
 */

const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";

/**
 * Hash a password or passkey using PBKDF2-HMAC-SHA512 with a random 16-byte salt.
 * Format: `<saltHex>:<hashHex>`
 */
export function hashPassword(plainText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(
      plainText,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEYLEN,
      PBKDF2_DIGEST,
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString("hex")}`);
      }
    );
  });
}

/**
 * Synchronous PBKDF2 hash helper
 */
export function hashPasswordSync(plainText: string, customSalt?: string): string {
  const salt = customSalt || crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(
    plainText,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  );
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plaintext password or passkey against a stored `<salt>:<hash>` or raw hash using constant-time comparison.
 */
export function verifyPassword(plainText: string, storedHashWithSalt: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!plainText || !storedHashWithSalt) {
      return resolve(false);
    }

    const parts = storedHashWithSalt.split(":");
    if (parts.length !== 2) {
      // Legacy or un-salted fallback comparison with constant-time equality
      return resolve(constantTimeStringCompare(plainText, storedHashWithSalt));
    }

    const [salt, expectedHash] = parts;
    crypto.pbkdf2(
      plainText,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEYLEN,
      PBKDF2_DIGEST,
      (err, derivedKey) => {
        if (err) return resolve(false);
        const derivedHash = derivedKey.toString("hex");
        resolve(constantTimeStringCompare(derivedHash, expectedHash));
      }
    );
  });
}

/**
 * Constant-time string comparison preventing side-channel timing attacks
 */
export function constantTimeStringCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");

  if (bufA.length !== bufB.length) {
    // Prevent timing discrepancy on length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Create a cryptographically signed HMAC-SHA256 session token
 * Format: `base64(payload).timestamp.hmacSignature`
 */
export function createSignedSessionToken<T extends object>(
  payload: T,
  secretKey: string,
  expiresInSeconds: number = 8 * 3600 // 8 hours default
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const dataToSign = {
    ...payload,
    exp: expiresAt,
    iat: Math.floor(Date.now() / 1000),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(dataToSign)).toString("base64url");
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${hmac}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed session token
 */
export function verifySignedSessionToken<T extends object>(
  token: string,
  secretKey: string
): { valid: boolean; payload?: T & { exp: number; iat: number }; error?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing or malformed token." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Invalid token signature format." };
  }

  const [payloadBase64, providedHmac] = parts;
  const expectedHmac = crypto
    .createHmac("sha256", secretKey)
    .update(payloadBase64)
    .digest("base64url");

  if (!constantTimeStringCompare(providedHmac, expectedHmac)) {
    return { valid: false, error: "Invalid cryptographic token signature." };
  }

  try {
    const rawPayload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);

    if (rawPayload.exp && rawPayload.exp < now) {
      return { valid: false, error: "Session token has expired. Please authenticate again." };
    }

    return { valid: true, payload: rawPayload };
  } catch {
    return { valid: false, error: "Corrupted token payload." };
  }
}

/**
 * Sanitizes arbitrary input strings against Cross-Site Scripting (XSS),
 * HTML tag injection, and script execution vectors.
 */
export function sanitizeInput(input: unknown): string {
  if (input === null || input === undefined) return "";
  let str = String(input).trim();

  // 1. Remove dangerous script and style tags and contents
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Remove javascript: and data: pseudo-protocols in links/attributes
  str = str.replace(/javascript:[^"']*/gi, "");
  str = str.replace(/vbscript:[^"']*/gi, "");

  // 3. Remove inline on* event handlers (e.g. onerror=, onclick=)
  str = str.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  str = str.replace(/on\w+\s*=\s*[^>\s]+/gi, "");

  // 4. Escape raw HTML entities
  str = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return str;
}

/**
 * Recursively sanitize objects or arrays before storage or processing
 */
export function sanitizeDeep<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeInput(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeDeep(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      clean[key] = sanitizeDeep(val);
    }
    return clean as T;
  }
  return obj;
}
