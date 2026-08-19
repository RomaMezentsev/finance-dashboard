import { createMockStock } from "@/lib/data";
import { resolveInstrumentMeta } from "@/lib/instruments/ticker-meta";
import { safeParseJson } from "@/lib/storage/safe-json";
import type { Stock } from "@/types";

export const WATCHLIST_STORAGE_KEY = "user_watchlist";
const LEGACY_PORTFOLIO_KEY = "investment-dashboard-portfolio";

function normalizeWatchlist(stocks: Stock[]): Stock[] {
  return stocks
    .filter((stock) => stock?.ticker?.trim())
    .map((stock) => {
      const meta = resolveInstrumentMeta(stock.ticker);
      return {
        ...stock,
        id: stock.id || meta.ticker,
        ticker: meta.ticker,
        name: stock.name || meta.displayName,
        isETF: stock.isETF ?? meta.isETF,
      };
    });
}

function parseWatchlist(raw: string | null): Stock[] | null {
  if (!raw) {
    return null;
  }

  const parsed = safeParseJson<unknown>(raw, null);

  if (!Array.isArray(parsed)) {
    return null;
  }

  return normalizeWatchlist(parsed as Stock[]);
}

function readWatchlistKey(key: string): Stock[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return parseWatchlist(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function saveWatchlistToStorage(stocks: Stock[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(stocks));
  } catch {
    // Ignore quota or private-mode write failures.
  }
}

export function loadWatchlistFromStorage(): Stock[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = readWatchlistKey(WATCHLIST_STORAGE_KEY);
  if (saved !== null) {
    return saved;
  }

  const legacy = readWatchlistKey(LEGACY_PORTFOLIO_KEY);
  if (legacy && legacy.length > 0) {
    saveWatchlistToStorage(legacy);
    try {
      window.localStorage.removeItem(LEGACY_PORTFOLIO_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }
    return legacy;
  }

  saveWatchlistToStorage([]);
  return [];
}

export function createWatchlistStock(ticker: string): Stock {
  return createMockStock(ticker);
}
