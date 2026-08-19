"use client";

import { useMemo } from "react";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useCurrency } from "@/context/CurrencyContext";
import { usePortfolioQuotes } from "@/hooks/useStockPrice";
import { formatPercent } from "@/lib/data";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { Stock } from "@/types";

type PortfolioPriceSummaryProps = {
  stocks: Stock[];
};

export function PortfolioPriceSummary({ stocks }: PortfolioPriceSummaryProps) {
  const { t } = useTranslations();
  const { formatPrice } = useCurrency();
  const tickers = useMemo(() => stocks.map((stock) => stock.ticker), [stocks]);
  const { quotes, loading, error } = usePortfolioQuotes(tickers);

  if (stocks.length === 0) {
    return null;
  }

  if (loading && Object.keys(quotes).length === 0) {
    return <CardSkeleton />;
  }

  const quoteList = tickers
    .map((ticker) => quotes[ticker.toUpperCase()])
    .filter((quote): quote is NonNullable<typeof quote> => Boolean(quote));

  const avgChangePercent =
    quoteList.length > 0
      ? Number(
          (quoteList.reduce((sum, quote) => sum + quote.changePercent, 0) / quoteList.length).toFixed(
            2,
          ),
        )
      : null;

  const isPositive = (avgChangePercent ?? 0) >= 0;

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-5 backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{t.quotes.title}</p>
          <p className="mt-1 text-sm text-muted">{t.quotes.delayed}</p>
        </div>

        {avgChangePercent !== null ? (
          <div
            className={`rounded-2xl px-4 py-2 text-right ${
              isPositive ? "bg-accent-muted text-accent" : "bg-danger-muted text-danger"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.16em] opacity-80">{t.quotes.avgChange}</p>
            <p className="font-mono text-lg font-semibold">{formatPercent(avgChangePercent)}</p>
          </div>
        ) : null}
      </div>

      {error && quoteList.length === 0 ? (
        <p className="mt-4 text-sm text-red-300">{t.quotes.unavailable}</p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => {
            const quote = quotes[stock.ticker.toUpperCase()];
            const isQuotePositive = (quote?.changePercent ?? 0) >= 0;

            return (
              <div
                key={stock.id}
                className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-sm font-semibold text-white">{stock.ticker}</p>
                  {quote ? (
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isQuotePositive ? "text-accent" : "text-danger"
                      }`}
                    >
                      {formatPercent(quote.changePercent)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted">{t.quotes.loading}</span>
                  )}
                </div>

                <p className="mt-2 font-mono text-xl font-semibold text-white">
                  {quote
                    ? formatPrice(quote.price, quote.currency)
                    : formatPrice(stock.price, "USD")}
                </p>

                {quote ? (
                  <p className="mt-1 font-mono text-xs text-muted">
                    {isQuotePositive ? "+" : ""}
                    {formatPrice(quote.change, quote.currency)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
