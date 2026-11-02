/**
 * In-memory sliding window rate limiter
 * Protects authentication endpoints, checkout, and API routes against brute-force, DoS, and spam attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries periodically to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    Array.from(rateLimitStore.entries()).forEach(([key, record]) => {
      record.timestamps = record.timestamps.filter((ts: number) => now - ts < 360000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    });
  }, 300000);
}

export type RateLimitTier = "auth" | "checkout" | "cart" | "admin" | "general";

const TIER_CONFIG: Record<RateLimitTier, { limit: number; windowSeconds: number }> = {
  auth: { limit: 5, windowSeconds: 60 },         // 5 attempts per minute
  checkout: { limit: 10, windowSeconds: 60 },     // 10 orders per minute
  cart: { limit: 60, windowSeconds: 60 },         // 60 actions per minute
  admin: { limit: 30, windowSeconds: 60 },        // 30 admin modifications per minute
  general: { limit: 120, windowSeconds: 60 },     // 120 API calls per minute
};

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and records rate limit for a client identifier and tier.
 */
export function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = "general"
): RateLimitResult {
  const config = TIER_CONFIG[tier];
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const cutoff = now - windowMs;

  const key = `${tier}:${identifier}`;
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > cutoff);

  if (record.timestamps.length >= config.limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetSeconds,
    };
  }

  // Record this attempt
  record.timestamps.push(now);
  const remaining = Math.max(0, config.limit - record.timestamps.length);

  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetSeconds: config.windowSeconds,
  };
}

/**
 * Extracts client IP from standard request headers with fallback
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
