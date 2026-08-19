"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addSearchHistory,
  clearSearchHistory,
  loadSearchHistory,
} from "@/lib/storage/search-history-storage";
import { useTranslations } from "@/lib/i18n/use-translations";

type Suggestion = {
  symbol: string;
  name: string;
  type: string;
};

const POPULAR_ASSETS = [
  { ticker: "SPY", label: "S&P 500" },
  { ticker: "EUNL", label: "MSCI World" },
  { ticker: "NVDA", label: "NVDA" },
  { ticker: "TSLA", label: "TSLA" },
  { ticker: "AAPL", label: "AAPL" },
  { ticker: "MP", label: "MP" },
  { ticker: "UUUU", label: "UUUU" },
] as const;

export function SearchView() {
  const { t } = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(loadSearchHistory());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/search-suggest?q=${encodeURIComponent(debouncedQuery)}`)
      .then((response) => response.json())
      .then((data: { suggestions: Suggestion[] }) => {
        if (!cancelled) {
          setSuggestions(data.suggestions ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToAsset(ticker: string) {
    const normalized = ticker.toUpperCase().trim();
    if (!normalized) {
      return;
    }

    setQuery(normalized);
    setHistory(addSearchHistory(normalized));
    setShowResults(false);
    router.push(`/asset/${encodeURIComponent(normalized)}`);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setShowResults(false);
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const exactMatch = suggestions.find((item) => item.symbol === query.trim().toUpperCase());
    if (exactMatch) {
      goToAsset(exactMatch.symbol);
      return;
    }

    if (suggestions.length > 0) {
      goToAsset(suggestions[0].symbol);
      return;
    }

    if (query.trim()) {
      goToAsset(query.trim());
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">{t.search.title}</h1>
        <p className="mt-1 text-sm text-muted">{t.search.subtitle}</p>
      </div>

      <div className="relative" ref={searchRef}>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value.toUpperCase());
            setShowResults(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setShowResults(true);
            }
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={t.search.placeholder}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 font-mono text-base uppercase tracking-[0.08em] text-white outline-none transition focus:border-emerald-400/40"
        />

        {showResults && debouncedQuery && (suggestions.length > 0 || loading) ? (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-xl">
            {loading ? (
              <li className="px-4 py-3 text-sm text-muted">{t.search.loading}</li>
            ) : (
              suggestions.map((item) => (
                <li key={item.symbol}>
                  <button
                    type="button"
                    onClick={() => goToAsset(item.symbol)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        goToAsset(item.symbol);
                      }
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-emerald-400/5"
                  >
                    <span className="font-mono font-semibold text-white">{item.symbol}</span>
                    <span className="truncate text-sm text-muted">{item.name}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{t.search.history}</h2>
          {history.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                clearSearchHistory();
                setHistory([]);
              }}
              className="text-xs text-muted transition hover:text-white"
            >
              {t.search.clearHistory}
            </button>
          ) : null}
        </div>

        {history.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {history.map((ticker) => (
              <button
                key={ticker}
                type="button"
                onClick={() => goToAsset(ticker)}
                className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-sm text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-200"
              >
                {ticker}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">{t.search.emptyHistory}</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted">
          {t.search.popular}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {POPULAR_ASSETS.map((asset) => (
            <button
              key={asset.ticker}
              type="button"
              onClick={() => goToAsset(asset.ticker)}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3 text-left transition hover:border-emerald-400/20 hover:bg-emerald-400/5"
            >
              <span className="font-mono font-semibold text-white">{asset.ticker}</span>
              <span className="text-sm text-muted">{asset.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
