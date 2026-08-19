"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AssetAiAnalysis } from "@/components/asset/AssetAiAnalysis";
import { TradingViewChart } from "@/components/TradingViewChart";
import { UpcomingEventsWidget } from "@/components/UpcomingEventsWidget";
import { useCurrency } from "@/context/CurrencyContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { useStockPrice } from "@/hooks/useStockPrice";
import { formatPercent } from "@/lib/data";
import { getInstrumentDisplayName } from "@/lib/instruments/ticker-meta";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { Stock } from "@/types";

type AssetDetailViewProps = {
  symbol: string;
};

export function AssetDetailView({ symbol }: AssetDetailViewProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const { formatPrice } = useCurrency();
  const { addStock, isInPortfolio } = usePortfolio();
  const ticker = symbol.toUpperCase().trim();
  const name = getInstrumentDisplayName(ticker);
  const { quote, loading: quoteLoading } = useStockPrice({ ticker });

  const price = quote?.price ?? 0;
  const change = quote?.change ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const quoteCurrency = quote?.currency ?? "USD";
  const isPositive = changePercent >= 0;
  const inWatchlist = isInPortfolio(ticker);

  const eventStock = useMemo<Stock>(
    () => ({
      id: ticker,
      ticker,
      name,
      price,
      change,
      changePercent,
      addedAt: new Date().toISOString(),
    }),
    [change, changePercent, name, price, ticker],
  );

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-muted transition hover:border-emerald-400/30 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            {t.asset.back}
          </button>

          {!inWatchlist ? (
            <button
              type="button"
              onClick={() => addStock(ticker)}
              className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              {t.search.addToWatchlist}
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/30"
            >
              {t.search.alreadyInWatchlist}
            </Link>
          )}
        </div>

        <div className="rounded-3xl border border-card-border bg-card/80 p-5 backdrop-blur-xl sm:p-6">
          <p className="text-sm text-muted">{name}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-mono text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl">
              {ticker}
            </h1>

            <div className="text-right">
              {quoteLoading && !quote ? (
                <div className="h-9 w-28 animate-pulse rounded-lg bg-white/10" />
              ) : (
                <>
                  <p className="font-mono text-2xl font-semibold text-white">
                    {quote ? formatPrice(price, quoteCurrency) : "—"}
                  </p>
                  {quote ? (
                    <p
                      className={`mt-1 font-mono text-sm font-semibold ${
                        isPositive ? "text-accent" : "text-danger"
                      }`}
                    >
                      {formatPercent(changePercent)} · {isPositive ? "+" : ""}
                      {formatPrice(change, quoteCurrency)}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <TradingViewChart ticker={ticker} exchange={quote?.exchange} />

      <AssetAiAnalysis ticker={ticker} autoLoad />

      <UpcomingEventsWidget stocks={[eventStock]} />
    </div>
  );
}
