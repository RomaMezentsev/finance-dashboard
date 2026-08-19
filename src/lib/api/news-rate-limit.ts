import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

type RateLimitResult = {
  success: boolean;
};

let upstashRatelimit: Ratelimit | null | undefined;

const inMemoryHits = new Map<string, number[]>();

function getUpstashRatelimit(): Ratelimit | null {
  if (upstashRatelimit !== undefined) {
    return upstashRatelimit;
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    upstashRatelimit = null;
    return null;
  }

  upstashRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "10 m"),
    prefix: "investment-dashboard:news",
    analytics: true,
  });

  return upstashRatelimit;
}

function checkInMemoryRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const hits = (inMemoryHits.get(ip) ?? []).filter((timestamp) => timestamp > windowStart);

  if (hits.length >= MAX_REQUESTS) {
    inMemoryHits.set(ip, hits);
    return { success: false };
  }

  hits.push(now);
  inMemoryHits.set(ip, hits);
  return { success: true };
}

export async function checkNewsRateLimit(ip: string): Promise<RateLimitResult> {
  const limiter = getUpstashRatelimit();

  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[rate-limit] Upstash env vars missing; using in-memory fallback.");
    }

    return checkInMemoryRateLimit(ip);
  }

  const result = await limiter.limit(ip);
  return { success: result.success };
}

export const NEWS_RATE_LIMIT_ERROR =
  "Слишком много запросов. Попробуйте через 10 минут." as const;
