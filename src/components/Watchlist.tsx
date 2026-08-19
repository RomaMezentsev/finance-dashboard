"use client";

import { BookmarkPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { StockCard } from "@/components/StockCard";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTranslations } from "@/lib/i18n/use-translations";

const QUICK_ADD_TICKERS = ["NVDA", "AAPL", "MSFT", "TSLA", "SPY"] as const;

export function Watchlist() {
  const { t } = useTranslations();
  const router = useRouter();
  const { stocks, removeStock, addStock, ready, isInPortfolio } = usePortfolio();

  if (!ready) {
    return (
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted">
          {t.portfolio.yourHoldings}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <p className="text-sm text-muted">{t.dashboard.loadingWatchlist}</p>
        </div>
      </section>
    );
  }

  if (stocks.length === 0) {
    return (
      <section className="animate-fade-up">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted">
          {t.portfolio.yourHoldings}
        </h2>

        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-card/50 px-6 py-10 text-center backdrop-blur-xl sm:px-10 sm:py-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <BookmarkPlus className="h-7 w-7 text-emerald-300" strokeWidth={1.75} aria-hidden="true" />
          </div>

          <h3 className="mt-5 text-xl font-semibold text-white">{t.portfolio.watchlistEmptyTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            {t.portfolio.watchlistEmptySubtitle}
          </p>

          <button
            type="button"
            onClick={() => router.push("/search")}
            className="mt-6 rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            {t.portfolio.watchlistFindStock}
          </button>

          <div className="mt-8 border-t border-white/5 pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {t.portfolio.watchlistQuickAdd}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {QUICK_ADD_TICKERS.map((ticker) => {
                const added = isInPortfolio(ticker);

                return (
                  <button
                    key={ticker}
                    type="button"
                    disabled={added}
                    onClick={() => addStock(ticker)}
                    className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-sm text-slate-200 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-200 disabled:cursor-default disabled:opacity-50"
                  >
                    {ticker}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-up">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted">
        {t.portfolio.yourHoldings}
      </h2>

      <div className="flex flex-col space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-3">
        {stocks.map((stock, index) => (
          <div key={stock.id} className="flex flex-1 flex-col">
            <StockCard stock={stock} index={index} onRemove={removeStock} />
          </div>
        ))}
      </div>
    </section>
  );
}
