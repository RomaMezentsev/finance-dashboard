import { buildCacheKey, getKeyValueCache } from "@/lib/cache/key-value-cache";
import type { InsiderActivity } from "@/types";

export const INSIDER_CACHE_TTL_MS = 15 * 60 * 1000;
const NAMESPACE = "insider";

export function buildInsiderCacheKey(ticker: string, language: string): string {
  return buildCacheKey(NAMESPACE, [ticker.toUpperCase(), language]);
}

export async function getCachedInsiderActivity(
  ticker: string,
  language: string,
): Promise<InsiderActivity | null> {
  return getKeyValueCache().get<InsiderActivity>(buildInsiderCacheKey(ticker, language));
}

export async function setCachedInsiderActivity(
  ticker: string,
  language: string,
  response: InsiderActivity,
): Promise<void> {
  await getKeyValueCache().set(
    buildInsiderCacheKey(ticker, language),
    response,
    INSIDER_CACHE_TTL_MS,
  );
}
