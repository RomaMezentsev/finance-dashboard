"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  convertAmount,
  formatAmountWithCurrency,
  formatCompactAmountWithCurrency,
  normalizeQuoteCurrency,
} from "@/lib/currency/format";
import {
  DEFAULT_APP_CURRENCY,
  loadCurrencyFromStorage,
  saveCurrencyToStorage,
} from "@/lib/storage/currency-storage";
import type { AppCurrency } from "@/types";

const DEFAULT_RATES: Record<AppCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
};

type CurrencyContextValue = {
  currency: AppCurrency;
  setCurrency: (currency: AppCurrency) => void;
  rates: Record<AppCurrency, number>;
  ready: boolean;
  ratesLoading: boolean;
  formatPrice: (amount: number, fromCurrency?: AppCurrency | string) => string;
  formatPriceCompact: (amount: number, fromCurrency?: AppCurrency | string) => string;
  convertPrice: (amount: number, fromCurrency?: AppCurrency | string) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<AppCurrency>(DEFAULT_APP_CURRENCY);
  const [rates, setRates] = useState<Record<AppCurrency, number>>(DEFAULT_RATES);
  const [ready, setReady] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    setCurrencyState(loadCurrencyFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      setRatesLoading(true);

      try {
        const response = await fetch("/api/exchange-rates");
        const data = (await response.json()) as { rates?: Record<AppCurrency, number> };

        if (!cancelled && data.rates) {
          setRates({
            USD: 1,
            EUR: data.rates.EUR ?? DEFAULT_RATES.EUR,
            GBP: data.rates.GBP ?? DEFAULT_RATES.GBP,
            CHF: data.rates.CHF ?? DEFAULT_RATES.CHF,
          });
        }
      } catch {
        if (!cancelled) {
          setRates(DEFAULT_RATES);
        }
      } finally {
        if (!cancelled) {
          setRatesLoading(false);
        }
      }
    }

    void loadRates();
    const intervalId = window.setInterval(() => void loadRates(), 30 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const convertPrice = useCallback(
    (amount: number, fromCurrency: AppCurrency | string = "USD") => {
      const source =
        typeof fromCurrency === "string" ? normalizeQuoteCurrency(fromCurrency) : fromCurrency;
      return convertAmount(amount, source, currency, rates);
    },
    [currency, rates],
  );

  const formatPrice = useCallback(
    (amount: number, fromCurrency: AppCurrency | string = "USD") => {
      const converted = convertPrice(amount, fromCurrency);
      return formatAmountWithCurrency(converted, currency);
    },
    [convertPrice, currency],
  );

  const formatPriceCompact = useCallback(
    (amount: number, fromCurrency: AppCurrency | string = "USD") => {
      const converted = convertPrice(amount, fromCurrency);
      return formatCompactAmountWithCurrency(converted, currency);
    },
    [convertPrice, currency],
  );

  const value = useMemo(
    () => ({
      currency,
      ready,
      rates,
      ratesLoading,
      setCurrency: (nextCurrency: AppCurrency) => {
        setCurrencyState(nextCurrency);
        saveCurrencyToStorage(nextCurrency);
      },
      formatPrice,
      formatPriceCompact,
      convertPrice,
    }),
    [currency, formatPrice, formatPriceCompact, convertPrice, rates, ratesLoading, ready],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}
