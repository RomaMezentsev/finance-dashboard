"use client";

import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useTranslations } from "@/lib/i18n/use-translations";
import { fetchInsiderActivity } from "@/lib/features-api";
import type { InsiderActivity } from "@/types";
import { useEffect, useState } from "react";

type InsiderActivityWidgetProps = {
  ticker: string;
};

const NET_ACTIVITY_STYLES = {
  "Net Insider Buying": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Net Insider Selling": "border-red-400/30 bg-red-400/10 text-red-300",
  Neutral: "border-amber-400/30 bg-amber-400/10 text-amber-200",
} as const;

export function InsiderActivityWidget({ ticker }: InsiderActivityWidgetProps) {
  const { t, locale } = useTranslations();
  const [data, setData] = useState<InsiderActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    fetchInsiderActivity(ticker, locale)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : t.insider.loadError);
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
  }, [locale, t.insider.loadError, ticker]);

  if (loading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/20 bg-red-400/5 p-5">
        <p className="text-sm text-red-300">{error}</p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-5 backdrop-blur-xl">
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.insider.smartMoney}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{t.insider.title}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${NET_ACTIVITY_STYLES[data.netActivity]}`}
        >
          {t.enums.netActivity[data.netActivity]}
        </span>
      </div>

      <ul className="space-y-3">
        {data.trades.length > 0 ? (
          data.trades.map((trade, index) => (
            <li
              key={`${trade.insider}-${index}`}
              className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{trade.insider}</p>
                  <p className="truncate text-xs text-muted">{trade.role}</p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${
                    trade.action === "Buy" ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {t.enums.tradeAction[trade.action]}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                <span className="truncate">{trade.value}</span>
                <span className="shrink-0 whitespace-nowrap">{trade.date}</span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted">{t.insider.noTrades}</li>
        )}
      </ul>
    </section>
  );
}
