import { buildCacheKey, getKeyValueCache } from "@/lib/cache/key-value-cache";
import type { EarningsSummary } from "@/types";

export const EARNINGS_CACHE_TTL_MS = 15 * 60 * 1000;
const NAMESPACE = "earnings";

export function buildEarningsCacheKey(ticker: string, language: string): string {
  return buildCacheKey(NAMESPACE, [ticker.toUpperCase(), language]);
}

export async function getCachedEarningsSummary(
  ticker: string,
  language: string,
): Promise<EarningsSummary | null> {
  return getKeyValueCache().get<EarningsSummary>(buildEarningsCacheKey(ticker, language));
}

export async function setCachedEarningsSummary(
  ticker: string,
  language: string,
  response: EarningsSummary,
): Promise<void> {
  await getKeyValueCache().set(
    buildEarningsCacheKey(ticker, language),
    response,
    EARNINGS_CACHE_TTL_MS,
  );
}
