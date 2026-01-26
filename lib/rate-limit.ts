import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Create a Redis instance using the API-specific Redis (if available) or the default one
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL_API || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN_API || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Combined rate limits for all Omnia API endpoints (STT + Voice)
// 5 per minute, 15 per hour, 20 per day - shared across all endpoints
export const omniaRatelimitMinute = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:omnia:min",
});

export const omniaRatelimitHour = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1 h"),
  analytics: true,
  prefix: "ratelimit:omnia:hour",
});

export const omniaRatelimitDay = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 d"),
  analytics: true,
  prefix: "ratelimit:omnia:day",
});

/**
 * Get the client IP address from the request
 */
export function getClientIp(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  return request.ip || "127.0.0.1";
}

interface RateLimitResult {
  success: boolean;
  limit: string;
  remaining: number;
  reset: number;
  retryAfter: number;
}

/**
 * Check combined rate limits (5/min, 15/hour, 20/day) shared across all Omnia endpoints
 */
export async function checkOmniaRateLimit(request: NextRequest): Promise<RateLimitResult> {
  const ip = getClientIp(request);

  // Check all limits in parallel
  const [minuteResult, hourResult, dayResult] = await Promise.all([
    omniaRatelimitMinute.limit(ip),
    omniaRatelimitHour.limit(ip),
    omniaRatelimitDay.limit(ip),
  ]);

  // Check day limit first (most restrictive long-term)
  if (!dayResult.success) {
    return {
      success: false,
      limit: "20/day",
      remaining: 0,
      reset: dayResult.reset,
      retryAfter: Math.ceil((dayResult.reset - Date.now()) / 1000),
    };
  }

  // Check hour limit
  if (!hourResult.success) {
    return {
      success: false,
      limit: "15/hour",
      remaining: 0,
      reset: hourResult.reset,
      retryAfter: Math.ceil((hourResult.reset - Date.now()) / 1000),
    };
  }

  // Check minute limit
  if (!minuteResult.success) {
    return {
      success: false,
      limit: "5/minute",
      remaining: 0,
      reset: minuteResult.reset,
      retryAfter: Math.ceil((minuteResult.reset - Date.now()) / 1000),
    };
  }

  // All limits passed
  return {
    success: true,
    limit: "5/min, 15/hour, 20/day",
    remaining: Math.min(minuteResult.remaining, hourResult.remaining, dayResult.remaining),
    reset: Math.min(minuteResult.reset, hourResult.reset, dayResult.reset),
    retryAfter: 0,
  };
}
