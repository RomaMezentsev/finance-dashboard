"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TradingViewChart } from "@/components/TradingViewChart";
import { useLocale } from "@/context/LocaleContext";
import { fetchStockNews } from "@/lib/news-api";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { NewsAnalysis, NewsSentiment } from "@/types";

const SENTIMENT_STYLES: Record<NewsSentiment, string> = {
  Bullish: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Bearish: "border-red-400/30 bg-red-400/10 text-red-300",
  Neutral: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

type StockAnalysisSectionProps = {
  ticker: string;
};

export function StockAnalysisSection({ ticker }: StockAnalysisSectionProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchStockNews(ticker, "week", locale);
      setAnalysis(result);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : t.dashboard.fetchNewsError);
    } finally {
      setLoading(false);
    }
  }, [locale, t.dashboard.fetchNewsError, ticker]);

  useEffect(() => {
    setAnalysis(null);
    setError(null);
  }, [ticker]);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ticker]);

  const summary = (analysis?.summary ?? []).filter((bullet) => bullet.trim().length > 0);

  return (
    <section ref={sectionRef} className="animate-fade-up space-y-4 scroll-mt-24">
      <TradingViewChart ticker={ticker} />

      {!analysis && !loading && !error ? (
        <div className="rounded-2xl border border-card-border bg-card/80 px-6 py-8 text-center backdrop-blur-xl">
          <p className="text-sm text-muted">{t.news.noAnalysisHint}</p>
          <button
            type="button"
            onClick={() => void loadAnalysis()}
            className="mt-4 rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            {t.news.analyzeNews}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-card-border bg-card/80 px-6 py-10">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
            <p className="mt-4 text-sm text-muted">{t.news.analyzing(ticker)}</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4">
          <p className="text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => void loadAnalysis()}
            className="mt-3 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            {t.news.refreshAnalysis}
          </button>
        </div>
      ) : analysis ? (
        <article className="space-y-5 rounded-2xl border border-card-border bg-card/80 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{t.news.aiBriefing}</p>
              <h3 className="mt-1 font-mono text-2xl font-semibold text-white">{analysis.ticker}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void loadAnalysis()}
                disabled={loading}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/5 disabled:opacity-60"
              >
                {t.news.refreshAnalysis}
              </button>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${SENTIMENT_STYLES[analysis.sentiment]}`}
              >
                {t.enums.sentiment[analysis.sentiment]}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
              {t.news.keyTakeaways}
            </h4>
            {summary.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {summary.map((bullet, index) => (
                  <li key={`${analysis.ticker}-${index}`} className="flex gap-2 text-sm leading-6 text-slate-200">
                    <span className="font-mono text-xs text-emerald-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">{t.news.noBullets}</p>
            )}
          </div>

          {analysis.sources.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{t.news.sources}</h4>
              <ul className="mt-3 space-y-2">
                {analysis.sources.slice(0, 4).map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm text-emerald-300 hover:text-emerald-200"
                    >
                      {source.title || t.news.untitledSource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
