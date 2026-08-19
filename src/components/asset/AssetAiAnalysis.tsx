"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { fetchStockNews, isNewsRateLimitError } from "@/lib/news-api";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { NewsAnalysis, NewsSentiment } from "@/types";

const COOLDOWN_MS = 30_000;

const SENTIMENT_STYLES: Record<NewsSentiment, string> = {
  Bullish: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Bearish: "border-red-400/30 bg-red-400/10 text-red-300",
  Neutral: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

type AssetAiAnalysisProps = {
  ticker: string;
  autoLoad?: boolean;
};

export function AssetAiAnalysis({ ticker, autoLoad = true }: AssetAiAnalysisProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const cooldownActive = cooldownUntil > now;
  const cooldownSecondsLeft = cooldownActive ? Math.ceil((cooldownUntil - now) / 1000) : 0;

  useEffect(() => {
    if (!cooldownActive) {
      return;
    }

    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [cooldownActive, cooldownUntil]);

  const loadAnalysis = useCallback(
    async (fromManualClick = false) => {
      setLoading(true);
      setError(null);
      setIsRateLimited(false);

      try {
        const result = await fetchStockNews(ticker, "week", locale);
        setAnalysis(result);
        setHasLoaded(true);

        if (fromManualClick) {
          setCooldownUntil(Date.now() + COOLDOWN_MS);
        }
      } catch (fetchError) {
        if (isNewsRateLimitError(fetchError)) {
          setIsRateLimited(true);
          setError(t.news.rateLimitError);
        } else {
          setError(fetchError instanceof Error ? fetchError.message : t.dashboard.fetchNewsError);
        }
      } finally {
        setLoading(false);
      }
    },
    [locale, t.dashboard.fetchNewsError, t.news.rateLimitError, ticker],
  );

  useEffect(() => {
    setAnalysis(null);
    setError(null);
    setIsRateLimited(false);
    setHasLoaded(false);
    setCooldownUntil(0);
  }, [ticker, locale]);

  useEffect(() => {
    if (autoLoad && !hasLoaded && !loading) {
      void loadAnalysis(false);
    }
  }, [autoLoad, hasLoaded, loadAnalysis, loading, locale, ticker]);

  const summary = (analysis?.summary ?? []).filter((bullet) => bullet.trim().length > 0);
  const buttonDisabled = loading || cooldownActive;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{t.news.aiBriefing}</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{ticker}</h2>
        </div>

        <button
          type="button"
          onClick={() => void loadAnalysis(true)}
          disabled={buttonDisabled}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cooldownActive
            ? t.news.cooldownSeconds(cooldownSecondsLeft)
            : hasLoaded
              ? t.news.refreshAnalysis
              : t.news.analyzeNews}
        </button>
      </div>

      <FinancialDisclaimer className="-mt-1" />

      {loading ? (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-card-border bg-card/80 px-6 py-10">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
            <p className="mt-4 text-sm text-muted">{t.news.analyzing(ticker)}</p>
          </div>
        </div>
      ) : error ? (
        <div
          className={`rounded-2xl px-5 py-4 ${
            isRateLimited
              ? "border border-amber-400/20 bg-amber-400/5"
              : "border border-red-400/20 bg-red-400/5"
          }`}
        >
          <p className={`text-sm ${isRateLimited ? "text-amber-200" : "text-red-300"}`}>{error}</p>
          {!isRateLimited ? (
            <button
              type="button"
              onClick={() => void loadAnalysis(true)}
              disabled={buttonDisabled}
              className="mt-3 text-sm font-medium text-emerald-300 transition hover:text-emerald-200 disabled:opacity-60"
            >
              {t.news.refreshAnalysis}
            </button>
          ) : null}
        </div>
      ) : analysis ? (
        <article className="space-y-5 rounded-2xl border border-card-border bg-card/80 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${SENTIMENT_STYLES[analysis.sentiment]}`}
            >
              {t.enums.sentiment[analysis.sentiment]}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
              {t.news.keyTakeaways}
            </h3>
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
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{t.news.sources}</h3>
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
