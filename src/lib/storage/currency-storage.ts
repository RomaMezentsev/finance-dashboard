import type { AppCurrency } from "@/types";

export const CURRENCY_STORAGE_KEY = "app_currency";

export const DEFAULT_APP_CURRENCY: AppCurrency = "EUR";

export function isAppCurrency(value: string): value is AppCurrency {
  return value === "USD" || value === "EUR" || value === "GBP" || value === "CHF";
}

function readStorageItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function loadCurrencyFromStorage(): AppCurrency {
  if (typeof window === "undefined") {
    return DEFAULT_APP_CURRENCY;
  }

  const stored = readStorageItem(CURRENCY_STORAGE_KEY);

  if (stored && isAppCurrency(stored)) {
    return stored;
  }

  saveCurrencyToStorage(DEFAULT_APP_CURRENCY);
  return DEFAULT_APP_CURRENCY;
}

export function saveCurrencyToStorage(currency: AppCurrency): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch {
    // Ignore quota or private-mode write failures.
  }
}
