"use client";

import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useTranslations } from "@/lib/i18n/use-translations";
import { fetchPortfolioImpact } from "@/lib/features-api";
import type { PortfolioImpactSummary, Stock } from "@/types";
import { useEffect, useMemo, useState } from "react";

const SENTIMENT_STYLES = {
  Bullish: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Bearish: "border-red-400/30 bg-red-400/10 text-red-300",
  Neutral: "border-amber-400/30 bg-amber-400/10 text-amber-200",
} as const;

type PortfolioImpactSummaryProps = {
  stocks: Stock[];
};

export function PortfolioImpactSummary({ stocks }: PortfolioImpactSummaryProps) {
  const { t, locale } = useTranslations();
  const [data, setData] = useState<PortfolioImpactSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tickers = useMemo(() => stocks.map((stock) => stock.ticker), [stocks]);
  const tickersKey = useMemo(() => tickers.join(","), [tickers]);

  useEffect(() => {
    if (tickers.length === 0) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPortfolioImpact(tickers, locale)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : t.portfolioImpact.loadError);
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
  }, [locale, t.portfolioImpact.loadError, tickers, tickersKey]);

  if (tickers.length === 0) {
    return null;
  }

  if (loading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6 backdrop-blur-xl">
        <p className="text-sm text-red-300">{error}</p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const sentimentClass = SENTIMENT_STYLES[data.verdict];

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.portfolioImpact.label}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{t.portfolioImpact.title}</h2>
          <p className="mt-2 truncate text-sm text-muted">{data.tickers.join(" · ")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] whitespace-nowrap sm:text-sm sm:px-4 sm:py-2 ${sentimentClass}`}
          >
            {t.enums.sentiment[data.verdict]}
          </span>
          <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-2 text-center">
            <p className="truncate text-xs uppercase tracking-[0.16em] text-muted whitespace-nowrap">
              {t.portfolioImpact.sentimentScore}
            </p>
            <p className="font-mono text-xl font-semibold text-white">{data.sentimentScore}%</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-7 text-slate-200">{data.summary}</p>

      {data.drivers.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {data.drivers.map((driver, index) => (
            <li
              key={`${driver}-${index}`}
              className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
            >
              {driver}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
