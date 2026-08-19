import { isIsin, resolveInstrumentMeta } from "@/lib/instruments/ticker-meta";
import type { StockQuote } from "@/types";

const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Accept: "application/json",
} as const;

const QUOTE_CACHE_TTL_MS = 30_000;

type CacheEntry = {
  quote: StockQuote;
  expiresAt: number;
};

const quoteCache = new Map<string, CacheEntry>();

type YahooChartMeta = {
  symbol?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  currency?: string;
  exchangeName?: string;
  fullExchangeName?: string;
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: YahooChartMeta;
    }>;
    error?: { description?: string };
  };
};

export function getYahooFinanceSymbol(ticker: string): string {
  const meta = resolveInstrumentMeta(ticker);

  if (meta.isEuropean) {
    return `${meta.ticker}.DE`;
  }

  return meta.ticker;
}

export function resolveQuoteInput(ticker?: string | null, isin?: string | null): string | null {
  const normalizedTicker = ticker?.toUpperCase().trim();
  const normalizedIsin = isin?.toUpperCase().trim();

  if (normalizedIsin && isIsin(normalizedIsin)) {
    const meta = resolveInstrumentMeta(normalizedIsin);
    return getYahooFinanceSymbol(meta.ticker);
  }

  if (normalizedTicker) {
    return getYahooFinanceSymbol(normalizedTicker);
  }

  return null;
}

async function searchYahooSymbol(query: string): Promise<string | null> {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=1&newsCount=0`,
    {
      headers: YAHOO_HEADERS,
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    quotes?: Array<{ symbol?: string }>;
  };

  return data.quotes?.[0]?.symbol?.toUpperCase() ?? null;
}

function parseYahooChart(data: YahooChartResponse, fallbackSymbol: string): StockQuote | null {
  const meta = data.chart?.result?.[0]?.meta;

  if (!meta?.regularMarketPrice) {
    return null;
  }

  const price = meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = Number((price - previousClose).toFixed(4));
  const changePercent =
    previousClose === 0 ? 0 : Number(((change / previousClose) * 100).toFixed(2));

  return {
    symbol: (meta.symbol ?? fallbackSymbol).toUpperCase(),
    price,
    change,
    changePercent,
    currency: meta.currency ?? "USD",
    exchange: meta.fullExchangeName ?? meta.exchangeName,
  };
}

async function fetchYahooQuote(yahooSymbol: string): Promise<StockQuote | null> {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`,
    {
      headers: YAHOO_HEADERS,
      next: { revalidate: 30 },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as YahooChartResponse;
  return parseYahooChart(data, yahooSymbol);
}

export async function fetchStockQuote(
  ticker?: string | null,
  isin?: string | null,
): Promise<StockQuote> {
  const cacheKey = `${ticker ?? ""}|${isin ?? ""}`.toUpperCase();
  const cached = quoteCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.quote;
  }

  const yahooSymbol = resolveQuoteInput(ticker, isin);

  if (!yahooSymbol) {
    throw new Error("Ticker or ISIN is required");
  }

  let quote = await fetchYahooQuote(yahooSymbol);

  if (!quote && isin && isIsin(isin.toUpperCase().trim())) {
    const searched = await searchYahooSymbol(isin.toUpperCase().trim());
    if (searched) {
      quote = await fetchYahooQuote(searched);
    }
  }

  if (!quote && ticker) {
    const searched = await searchYahooSymbol(ticker.toUpperCase().trim());
    if (searched) {
      quote = await fetchYahooQuote(searched);
    }
  }

  if (!quote) {
    throw new Error(`Quote not found for ${yahooSymbol}`);
  }

  quoteCache.set(cacheKey, {
    quote,
    expiresAt: Date.now() + QUOTE_CACHE_TTL_MS,
  });

  return quote;
}
