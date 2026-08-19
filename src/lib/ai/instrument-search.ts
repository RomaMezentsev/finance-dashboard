import { searchNewsContext } from "@/lib/ai/tavily-search";
import type { InstrumentMeta } from "@/lib/instruments/ticker-meta";

export async function searchStockEventsContext(ticker: string, companyName: string) {
  return searchNewsContext({
    query: `${companyName} ${ticker} next earnings date ex-dividend date 2026`,
    timeRange: "month",
    maxResults: 6,
    topic: "finance",
  });
}

export async function searchEtfEventsContext(meta: InstrumentMeta) {
  if (meta.isAccumulating) {
    return { results: [], context: "" };
  }

  const isinPart = meta.isin ? `${meta.isin} ISIN` : "";

  return searchNewsContext({
    query: `${meta.displayName} ${meta.symbol} ${isinPart} ETF ex-dividend distribution date 2026`,
    timeRange: "month",
    maxResults: 6,
    topic: "finance",
  });
}

export async function searchInstrumentEventsContext(meta: InstrumentMeta) {
  if (meta.isETF) {
    return searchEtfEventsContext(meta);
  }

  return searchStockEventsContext(meta.symbol, meta.displayName);
}

export function buildStockNewsQuery(ticker: string, timeframeLabel: string): string {
  return `latest news stock analysis ${ticker} ${timeframeLabel}`;
}

export function buildEtfNewsQuery(meta: InstrumentMeta, timeframeLabel: string): string {
  const isinPart = meta.isin ? `${meta.isin} ISIN` : "";
  const holdings = meta.topHoldings.length > 0 ? meta.topHoldings.join(", ") : "top holdings";

  return `${meta.displayName} ${meta.symbol} ${isinPart} ETF macro news top holdings ${holdings} sector outlook ${timeframeLabel}`;
}

export function buildInstrumentNewsQuery(meta: InstrumentMeta, timeframeLabel: string): string {
  if (meta.isETF) {
    return buildEtfNewsQuery(meta, timeframeLabel);
  }

  return buildStockNewsQuery(meta.symbol, timeframeLabel);
}
