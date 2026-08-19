import { buildCacheKey, getKeyValueCache } from "@/lib/cache/key-value-cache";
import type { PortfolioImpactSummary } from "@/types";

export const PORTFOLIO_IMPACT_CACHE_TTL_MS = 15 * 60 * 1000;
const NAMESPACE = "portfolio-impact";

export function buildPortfolioImpactCacheKey(tickers: string[], language: string): string {
  const sorted = [...tickers].map((t) => t.toUpperCase()).sort().join(",");
  return buildCacheKey(NAMESPACE, [sorted, language]);
}

export async function getCachedPortfolioImpact(
  tickers: string[],
  language: string,
): Promise<PortfolioImpactSummary | null> {
  return getKeyValueCache().get<PortfolioImpactSummary>(
    buildPortfolioImpactCacheKey(tickers, language),
  );
}

export async function setCachedPortfolioImpact(
  tickers: string[],
  language: string,
  response: PortfolioImpactSummary,
): Promise<void> {
  await getKeyValueCache().set(
    buildPortfolioImpactCacheKey(tickers, language),
    response,
    PORTFOLIO_IMPACT_CACHE_TTL_MS,
  );
}
