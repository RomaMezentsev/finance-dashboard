import { buildCacheKey, getKeyValueCache } from "@/lib/cache/key-value-cache";
import type { NewsSentiment, NewsSource, NewsTimeframe } from "@/types";

export const NEWS_CACHE_TTL_MS = 15 * 60 * 1000;
const NEWS_CACHE_NAMESPACE = "news";

export type CachedNewsResponse = {
  ticker: string;
  timeframe: NewsTimeframe;
  sentiment: NewsSentiment;
  summary: string[];
  sources: NewsSource[];
};

export function buildNewsCacheKey(ticker: string, timeframe: NewsTimeframe, language: string): string {
  return buildCacheKey(NEWS_CACHE_NAMESPACE, [ticker.toUpperCase(), timeframe, language]);
}

export async function getCachedNewsResponse(
  ticker: string,
  timeframe: NewsTimeframe,
  language: string,
): Promise<CachedNewsResponse | null> {
  return getKeyValueCache().get<CachedNewsResponse>(buildNewsCacheKey(ticker, timeframe, language));
}

export async function setCachedNewsResponse(
  ticker: string,
  timeframe: NewsTimeframe,
  language: string,
  response: CachedNewsResponse,
): Promise<void> {
  await getKeyValueCache().set(
    buildNewsCacheKey(ticker, timeframe, language),
    response,
    NEWS_CACHE_TTL_MS,
  );
}
