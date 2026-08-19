"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { EarningsSecInsight } from "@/components/EarningsSecInsight";
import { FinancialMetricsBar } from "@/components/FinancialMetricsBar";
import { InsiderActivityWidget } from "@/components/InsiderActivityWidget";
import { TradingViewChart } from "@/components/TradingViewChart";
import { TIMEFRAME_IDS, type Translations } from "@/lib/i18n/translations";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { NewsAnalysis, NewsSentiment, NewsTimeframe } from "@/types";

type MarketNewsTabProps = {
  activeTicker: string | null;
  analysis: NewsAnalysis | null;
  loading: boolean;
  error: string | null;
  onSearch: (ticker: string, timeframe: NewsTimeframe) => void;
  onAddToPortfolio: (ticker: string) => boolean;
  isInPortfolio: (ticker: string) => boolean;
};

const QUICK_TICKERS = ["MP", "UUUU", "NVDA", "AAPL"] as const;

const SENTIMENT_STYLES: Record<NewsSentiment, string> = {
  Bullish: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Bearish: "border-red-400/30 bg-red-400/10 text-red-300",
  Neutral: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

function isEmptyAnalysis(analysis: NewsAnalysis): boolean {
  const summary = analysis.summary ?? [];
  const sources = analysis.sources ?? [];
  const hasSummary = summary.some((bullet) => bullet.trim().length > 0);

  return sources.length === 0 && !hasSummary;
}

function getFriendlyErrorMessage(error: string, fallback: string): string {
  const normalized = error.toLowerCase();

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("500")
  ) {
    return fallback;
  }

  return error || fallback;
}

export function MarketNewsTab({
  activeTicker,
  analysis,
  loading,
  error,
  onSearch,
  onAddToPortfolio,
  isInPortfolio,
}: MarketNewsTabProps) {
  const { t } = useTranslations();
  const [ticker, setTicker] = useState(activeTicker ?? "");
  const [timeframe, setTimeframe] = useState<NewsTimeframe>("week");

  useEffect(() => {
    if (activeTicker) {
      setTicker(activeTicker);
    }
  }, [activeTicker]);

  function runSearch(nextTicker: string, nextTimeframe: NewsTimeframe = timeframe) {
    const normalized = nextTicker.trim().toUpperCase();

    if (!normalized) {
      return;
    }

    onSearch(normalized, nextTimeframe);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(ticker);
  }

  function handleQuickSelect(selectedTicker: string) {
    setTicker(selectedTicker);
    runSearch(selectedTicker);
  }

  function handleTimeframeChange(nextTimeframe: NewsTimeframe) {
    setTimeframe(nextTimeframe);

    if (activeTicker) {
      runSearch(activeTicker, nextTimeframe);
    }
  }

  const chartTicker = useMemo(() => {
    return activeTicker?.toUpperCase() || "MP";
  }, [activeTicker]);

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">{t.news.title}</h2>
        <p className="mt-2 text-sm text-muted">{t.news.subtitle}</p>
      </div>

      <div className="rounded-3xl border border-card-border bg-card/80 p-6 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="min-w-0 flex-1">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
                {t.news.tickerSymbol}
              </span>
              <input
                value={ticker}
                onChange={(event) => setTicker(event.target.value.toUpperCase())}
                placeholder={t.news.tickerPlaceholder}
                maxLength={12}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 font-mono text-lg uppercase tracking-[0.18em] text-white outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-auto shrink-0 rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
            >
              {t.news.analyzeNews}
            </button>
          </div>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
              {t.news.timeframe}
            </span>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAME_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={loading}
                  onClick={() => handleTimeframeChange(id)}
                  className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap ${
                    timeframe === id
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-slate-950/50 text-slate-300 hover:border-emerald-400/30 hover:bg-emerald-400/5 hover:text-emerald-200"
                  }`}
                >
                  {t.timeframe[id]}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-5 border-t border-white/5 pt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.news.quickSelect}
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TICKERS.map((symbol) => (
              <button
                key={symbol}
                type="button"
                disabled={loading}
                onClick={() => handleQuickSelect(symbol)}
                className={`rounded-xl border px-4 py-2 font-mono text-sm font-semibold tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  ticker === symbol
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-slate-950/50 text-slate-300 hover:border-emerald-400/30 hover:bg-emerald-400/5 hover:text-emerald-200"
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTicker ? (
        <ActiveTickerHeader
          ticker={activeTicker}
          onAddToPortfolio={onAddToPortfolio}
          isInPortfolio={isInPortfolio}
        />
      ) : null}

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="min-w-0 space-y-4">
          {activeTicker ? <FinancialMetricsBar ticker={activeTicker} /> : null}

          {loading ? (
            <LoadingPanel ticker={activeTicker} />
          ) : error ? (
            <WarningPanel
              title={t.news.somethingWrong}
              message={getFriendlyErrorMessage(error, t.news.fetchError)}
              variant="error"
            />
          ) : analysis && isEmptyAnalysis(analysis) ? (
            <WarningPanel
              title={t.news.noNewsTitle}
              message={t.news.noNewsMessage(analysis.ticker || activeTicker || t.news.thisTicker)}
              variant="warning"
            />
          ) : analysis ? (
            <div className="space-y-4">
              <AnalysisPanel analysis={analysis} />
              <EarningsSecInsight ticker={analysis.ticker} />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
              <p className="text-lg font-medium text-white">{t.news.noAnalysisTitle}</p>
              <p className="mt-2 text-sm text-muted">{t.news.noAnalysisHint}</p>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <TradingViewChart ticker={chartTicker} />
          {activeTicker ? <InsiderActivityWidget ticker={activeTicker} /> : null}
        </div>
      </div>
    </section>
  );
}

function ActiveTickerHeader({
  ticker,
  onAddToPortfolio,
  isInPortfolio,
}: {
  ticker: string;
  onAddToPortfolio: (ticker: string) => boolean;
  isInPortfolio: (ticker: string) => boolean;
}) {
  const { t } = useTranslations();
  const normalized = ticker.toUpperCase();
  const alreadyAdded = isInPortfolio(normalized);

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-3xl border border-card-border bg-card/80 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
          {t.news.activeTicker}
        </p>
        <h3 className="mt-1 truncate font-mono text-3xl font-semibold tracking-[0.12em] text-white">
          {normalized}
        </h3>
      </div>

      <WatchlistButton
        ticker={normalized}
        alreadyAdded={alreadyAdded}
        onAddToPortfolio={onAddToPortfolio}
      />
    </div>
  );
}

function WatchlistButton({
  ticker,
  alreadyAdded,
  onAddToPortfolio,
}: {
  ticker: string;
  alreadyAdded: boolean;
  onAddToPortfolio: (ticker: string) => boolean;
}) {
  const { t } = useTranslations();

  return (
    <button
      type="button"
      disabled={alreadyAdded}
      onClick={() => onAddToPortfolio(ticker)}
      className="shrink-0 rounded-2xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-400/15 disabled:border-white/10 disabled:bg-white/5 disabled:text-muted whitespace-nowrap"
    >
      {alreadyAdded ? t.news.inWatchlist : t.news.addToWatchlist}
    </button>
  );
}

function LoadingPanel({ ticker }: { ticker: string | null }) {
  const { t } = useTranslations();
  const label = ticker ?? t.news.analyzingFallback;

  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-card-border bg-card/80 px-6 py-16 backdrop-blur-xl">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
      <p className="mt-5 text-center text-sm font-medium text-white">{t.news.analyzing(label)}</p>
      <p className="mt-2 text-center text-sm text-muted">{t.news.fetchingSources}</p>
    </div>
  );
}

function WarningPanel({
  title,
  message,
  variant,
}: {
  title: string;
  message: string;
  variant: "error" | "warning";
}) {
  const styles =
    variant === "error"
      ? "border-red-400/20 bg-red-400/5 text-red-300"
      : "border-amber-400/20 bg-amber-400/5 text-amber-200";

  return (
    <div className={`rounded-3xl border px-6 py-8 text-center ${styles}`}>
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  );
}

function formatAnalysisText(
  analysis: NewsAnalysis,
  bullets: string[],
  t: Translations,
): string {
  const lines = [
    `${t.news.copyTicker}: ${analysis.ticker.toUpperCase()}`,
    `${t.news.copySentiment}: ${t.enums.sentiment[analysis.sentiment]}`,
    "",
    `${t.news.copyKeyTakeaways}:`,
  ];

  if (bullets.length > 0) {
    lines.push(...bullets.map((bullet, index) => `${index + 1}. ${bullet}`));
  } else {
    lines.push(t.news.copyNoBullets);
  }

  return lines.join("\n");
}

function CopyAnalysisButton({
  analysis,
  bullets,
}: {
  analysis: NewsAnalysis;
  bullets: string[];
}) {
  const { t } = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatAnalysisText(analysis, bullets, t));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-200 whitespace-nowrap"
    >
      {copied ? t.news.copied : t.news.copyAnalysis}
    </button>
  );
}

function AnalysisPanel({ analysis }: { analysis: NewsAnalysis }) {
  const { t } = useTranslations();
  const sentimentClass = SENTIMENT_STYLES[analysis.sentiment] ?? SENTIMENT_STYLES.Neutral;
  const summary = (analysis.summary ?? []).filter((bullet) => bullet.trim().length > 0);
  const sources = analysis.sources ?? [];

  return (
    <article className="animate-fade-up space-y-6 rounded-3xl border border-card-border bg-card/80 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.news.aiBriefing}
          </p>
          <h3 className="mt-2 truncate font-mono text-3xl font-semibold tracking-[0.12em] text-white">
            {analysis.ticker}
          </h3>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm ${sentimentClass}`}
          >
            {t.enums.sentiment[analysis.sentiment]}
          </span>

          <CopyAnalysisButton analysis={analysis} bullets={summary} />
        </div>
      </div>

      <div className="min-w-0">
        <h4 className="truncate text-sm font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
          {t.news.keyTakeaways}
        </h4>
        {summary.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {summary.map((bullet, index) => (
              <li
                key={`${analysis.ticker}-${index}`}
                className="flex gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
              >
                <span className="shrink-0 font-mono text-emerald-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">{t.news.noBullets}</p>
        )}
      </div>

      <div className="min-w-0">
        <h4 className="truncate text-sm font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
          {t.news.sources}
        </h4>
        {sources.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-w-0 items-start justify-between gap-4 rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3 transition hover:border-emerald-400/30 hover:bg-emerald-400/5"
                >
                  <span className="min-w-0 text-sm leading-6 text-white group-hover:text-emerald-200">
                    {source.title || t.news.untitledSource}
                  </span>
                  <span className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-emerald-400 whitespace-nowrap">
                    {t.news.open}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">{t.news.noSources}</p>
        )}
      </div>
    </article>
  );
}
