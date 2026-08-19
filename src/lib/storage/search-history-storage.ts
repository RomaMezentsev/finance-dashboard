import { safeParseJson } from "@/lib/storage/safe-json";

const SEARCH_HISTORY_KEY = "investment-dashboard-search-history";
const MAX_HISTORY = 5;

export function loadSearchHistory(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = safeParseJson<unknown>(raw, []);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.toUpperCase());
  } catch {
    return [];
  }
}

export function addSearchHistory(ticker: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalized = ticker.toUpperCase().trim();
  if (!normalized) {
    return loadSearchHistory();
  }

  const next = [normalized, ...loadSearchHistory().filter((item) => item !== normalized)].slice(
    0,
    MAX_HISTORY,
  );

  try {
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota or private-mode write failures.
  }

  return next;
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}
