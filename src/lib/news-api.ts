import type { AppLocale, NewsAnalysis, NewsTimeframe } from "@/types";

const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  data: NewsAnalysis;
  fetchedAt: number;
};

const cache = new Map<string, CacheEntry>();

export class NewsRateLimitError extends Error {
  readonly status = 429;

  constructor(message: string) {
    super(message);
    this.name = "NewsRateLimitError";
  }
}

function getCacheKey(ticker: string, timeframe: NewsTimeframe, language: AppLocale): string {
  return `${ticker.toUpperCase().trim()}:${timeframe}:${language}`;
}

export async function fetchStockNews(
  ticker: string,
  timeframe: NewsTimeframe = "week",
  language: AppLocale = "ru",
): Promise<NewsAnalysis> {
  const normalized = ticker.toUpperCase().trim();
  const cacheKey = getCacheKey(normalized, timeframe, language);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker: normalized, timeframe, language }),
  });

  const data = await response.json();

  if (response.status === 429) {
    throw new NewsRateLimitError(
      typeof data.error === "string" ? data.error : "Too many requests. Try again in 10 minutes.",
    );
  }

  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Failed to fetch news");
  }

  const analysis = data as NewsAnalysis;
  cache.set(cacheKey, { data: analysis, fetchedAt: Date.now() });

  return analysis;
}

export function isNewsRateLimitError(error: unknown): error is NewsRateLimitError {
  return error instanceof NewsRateLimitError;
}
