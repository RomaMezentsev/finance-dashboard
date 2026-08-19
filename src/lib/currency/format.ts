import type { AppCurrency } from "@/types";

export const CURRENCY_SYMBOLS: Record<AppCurrency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CHF: "CHF",
};

export const CURRENCY_LOCALES: Record<AppCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CHF: "de-CH",
};

export function normalizeQuoteCurrency(currency: string | undefined): AppCurrency {
  const normalized = currency?.toUpperCase().trim();

  if (normalized === "EUR" || normalized === "GBP" || normalized === "CHF" || normalized === "USD") {
    return normalized;
  }

  return "USD";
}

export function convertAmount(
  amount: number,
  fromCurrency: AppCurrency,
  toCurrency: AppCurrency,
  rates: Record<AppCurrency, number>,
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInUsd = fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
  const converted = toCurrency === "USD" ? amountInUsd : amountInUsd * rates[toCurrency];

  return Number(converted.toFixed(4));
}

export function formatAmountWithCurrency(amount: number, currency: AppCurrency): string {
  if (currency === "CHF") {
    return `CHF ${amount.toLocaleString(CURRENCY_LOCALES[currency], {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactAmountWithCurrency(amount: number, currency: AppCurrency): string {
  const symbol = CURRENCY_SYMBOLS[currency];

  if (amount >= 1_000_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (amount >= 1_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000).toFixed(2)}B`;
  }

  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
  }

  return formatAmountWithCurrency(amount, currency);
}
