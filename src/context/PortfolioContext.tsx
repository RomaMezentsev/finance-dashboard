"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createMockStock } from "@/lib/data";
import { resolveInstrumentMeta } from "@/lib/instruments/ticker-meta";
import {
  loadWatchlistFromStorage,
  saveWatchlistToStorage,
} from "@/lib/storage/watchlist-storage";
import type { Stock } from "@/types";

type PortfolioContextValue = {
  stocks: Stock[];
  ready: boolean;
  addStock: (ticker: string) => boolean;
  removeStock: (id: string) => void;
  isInPortfolio: (ticker: string) => boolean;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStocks(loadWatchlistFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    saveWatchlistToStorage(stocks);
  }, [ready, stocks]);

  const value = useMemo(
    () => ({
      stocks,
      ready,
      addStock: (ticker: string) => {
        const meta = resolveInstrumentMeta(ticker);
        const normalized = meta.ticker;
        if (!normalized || stocks.some((stock) => stock.ticker === normalized)) {
          return false;
        }

        setStocks((current) => [createMockStock(normalized), ...current]);
        return true;
      },
      removeStock: (id: string) => {
        setStocks((current) => current.filter((stock) => stock.id !== id));
      },
      isInPortfolio: (ticker: string) =>
        stocks.some((stock) => stock.ticker === ticker.toUpperCase().trim()),
    }),
    [ready, stocks],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
