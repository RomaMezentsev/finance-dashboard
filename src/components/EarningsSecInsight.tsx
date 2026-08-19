"use client";

import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useTranslations } from "@/lib/i18n/use-translations";
import { fetchEarningsSummary } from "@/lib/features-api";
import type { EarningsSummary } from "@/types";
import { useEffect, useState } from "react";

type EarningsSecInsightProps = {
  ticker: string;
};

const STATUS_STYLES = {
  Beat: "text-emerald-300",
  Missed: "text-red-300",
  Inline: "text-amber-200",
  Unknown: "text-muted",
} as const;

export function EarningsSecInsight({ ticker }: EarningsSecInsightProps) {
  const { t, locale } = useTranslations();
  const [data, setData] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    fetchEarningsSummary(ticker, locale)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : t.earnings.loadError);
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
  }, [locale, t.earnings.loadError, ticker]);

  if (loading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6">
        <p className="text-sm text-red-300">{error}</p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.earnings.title}
          </p>
          <h3 className="mt-2 truncate font-mono text-2xl font-semibold tracking-[0.12em] text-white">
            {data.ticker}
          </h3>
        </div>
        <p
          className={`shrink-0 text-sm font-semibold uppercase tracking-[0.16em] whitespace-nowrap ${STATUS_STYLES[data.revenue_eps_status]}`}
        >
          {t.earnings.revenueEps}: {t.enums.earningsStatus[data.revenue_eps_status]}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <InsightList
          title={t.earnings.bullishHighlights}
          items={data.bullish_highlights}
          tone="positive"
          noItems={t.earnings.noItems}
        />
        <InsightList title={t.earnings.keyRisks} items={data.key_risks} tone="negative" noItems={t.earnings.noItems} />
      </div>

      <blockquote className="mt-6 rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4 text-sm italic leading-7 text-slate-200">
        “{data.ceo_quote}”
      </blockquote>
    </section>
  );
}

function InsightList({
  title,
  items,
  tone,
  noItems,
}: {
  title: string;
  items: string[];
  tone: "positive" | "negative";
  noItems: string;
}) {
  const accent = tone === "positive" ? "text-emerald-400" : "text-red-300";

  return (
    <div className="min-w-0">
      <h4 className="truncate text-sm font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
        {title}
      </h4>
      <ul className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
            >
              <span className={`mr-2 font-mono ${accent}`}>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))
        ) : (
          <li className="text-sm text-muted">{noItems}</li>
        )}
      </ul>
    </div>
  );
}
