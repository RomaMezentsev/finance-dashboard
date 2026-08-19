"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StockQuote } from "@/types";

const POLL_INTERVAL_MS = 30_000;

async function fetchQuote(params: { ticker?: string; isin?: string }): Promise<StockQuote> {
  const query = new URLSearchParams();

  if (params.ticker) {
    query.set("ticker", params.ticker);
  }

  if (params.isin) {
    query.set("isin", params.isin);
  }

  const response = await fetch(`/api/quote?${query.toString()}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to fetch quote");
  }

  return response.json() as Promise<StockQuote>;
}

type UseStockPriceOptions = {
  ticker?: string | null;
  isin?: string | null;
};

export function useStockPrice({ ticker, isin }: UseStockPriceOptions) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);

  const normalizedTicker = ticker?.toUpperCase().trim() ?? "";
  const normalizedIsin = isin?.toUpperCase().trim() ?? "";
  const enabled = Boolean(normalizedTicker || normalizedIsin);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    if (initialLoad.current) {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await fetchQuote({
        ticker: normalizedTicker || undefined,
        isin: normalizedIsin || undefined,
      });
      setQuote(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Quote error");
    } finally {
      setLoading(false);
      initialLoad.current = false;
    }
  }, [enabled, normalizedIsin, normalizedTicker]);

  useEffect(() => {
    if (!enabled) {
      setQuote(null);
      setError(null);
      setLoading(false);
      initialLoad.current = true;
      return;
    }

    void refresh();
    const intervalId = window.setInterval(() => void refresh(), POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, refresh]);

  return { quote, loading, error, refresh };
}

export function usePortfolioQuotes(tickers: string[]) {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);
  const tickersKey = tickers.map((ticker) => ticker.toUpperCase()).join(",");

  const refresh = useCallback(async () => {
    if (tickers.length === 0) {
      setQuotes({});
      return;
    }

    if (initialLoad.current) {
      setLoading(true);
    }

    setError(null);

    const results = await Promise.allSettled(
      tickers.map(async (ticker) => {
        const quote = await fetchQuote({ ticker });
        return { ticker: ticker.toUpperCase(), quote };
      }),
    );

    const nextQuotes: Record<string, StockQuote> = {};

    for (const result of results) {
      if (result.status === "fulfilled") {
        nextQuotes[result.value.ticker] = result.value.quote;
      }
    }

    if (Object.keys(nextQuotes).length === 0) {
      setError("Failed to load quotes");
    } else {
      setQuotes(nextQuotes);
    }

    setLoading(false);
    initialLoad.current = false;
  }, [tickers]);

  useEffect(() => {
    if (tickers.length === 0) {
      setQuotes({});
      setError(null);
      setLoading(false);
      initialLoad.current = true;
      return;
    }

    void refresh();
    const intervalId = window.setInterval(() => void refresh(), POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh, tickers.length, tickersKey]);

  return { quotes, loading, error, refresh };
}
