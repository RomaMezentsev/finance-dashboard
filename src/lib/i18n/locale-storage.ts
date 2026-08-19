import type { AppLocale } from "@/types";

export const APP_LANGUAGE_KEY = "app_language";
const LEGACY_LOCALE_KEY = "investment-dashboard-locale";
export const DEFAULT_APP_LOCALE: AppLocale = "ru";

const SUPPORTED_LOCALES: AppLocale[] = ["ru", "en", "de"];

function parseLocale(value: string | null): AppLocale | null {
  if (value && SUPPORTED_LOCALES.includes(value as AppLocale)) {
    return value as AppLocale;
  }

  return null;
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

export function loadLocaleFromStorage(): AppLocale {
  if (typeof window === "undefined") {
    return DEFAULT_APP_LOCALE;
  }

  const stored = parseLocale(readStorageItem(APP_LANGUAGE_KEY));
  if (stored) {
    return stored;
  }

  const legacy = parseLocale(readStorageItem(LEGACY_LOCALE_KEY));
  if (legacy) {
    saveLocaleToStorage(legacy);
    try {
      window.localStorage.removeItem(LEGACY_LOCALE_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }
    return legacy;
  }

  saveLocaleToStorage(DEFAULT_APP_LOCALE);
  return DEFAULT_APP_LOCALE;
}

export function saveLocaleToStorage(locale: AppLocale): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(APP_LANGUAGE_KEY, locale);
  } catch {
    // Ignore quota or private-mode write failures.
  }
}
