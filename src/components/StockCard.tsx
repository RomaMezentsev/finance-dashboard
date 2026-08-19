"use client";

import Link from "next/link";
import { formatPercent } from "@/lib/data";
import { ValuationBadge } from "@/components/ValuationBadge";
import { useCurrency } from "@/context/CurrencyContext";
import { useStockPrice } from "@/hooks/useStockPrice";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { Stock } from "@/types";

type StockCardProps = {
  stock: Stock;
  onRemove: (id: string) => void;
  index: number;
};

export function StockCard({ stock, onRemove, index }: StockCardProps) {
  const { t } = useTranslations();
  const { formatPrice } = useCurrency();
  const { quote, loading } = useStockPrice({ ticker: stock.ticker });

  const price = quote?.price ?? stock.price;
  const change = quote?.change ?? stock.change;
  const changePercent = quote?.changePercent ?? stock.changePercent;
  const quoteCurrency = quote?.currency ?? "USD";
  const isPositive = changePercent >= 0;
  const assetHref = `/asset/${encodeURIComponent(stock.ticker)}`;

  return (
    <Link
      href={assetHref}
      className="group animate-fade-up block cursor-pointer rounded-3xl border border-card-border bg-card/80 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-[0_20px_60px_-30px_var(--glow)]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 font-mono text-sm font-bold text-emerald-300">
              {stock.ticker.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-mono text-xl font-semibold tracking-[0.12em] text-white">
                {stock.ticker}
              </h3>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <p className="truncate text-sm text-muted">{stock.name}</p>
                {stock.isETF ? (
                  <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200 whitespace-nowrap">
                    {t.portfolio.etfBadge}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove(stock.id);
          }}
          aria-label={t.portfolio.removeAria(stock.ticker)}
          className="shrink-0 rounded-xl border border-transparent px-3 py-1.5 text-xs font-medium text-muted opacity-0 transition group-hover:opacity-100 hover:border-white/10 hover:bg-white/5 hover:text-white whitespace-nowrap"
        >
          {t.portfolio.remove}
        </button>
      </div>

      {stock.isETF ? null : (
        <div className="mt-4">
          <ValuationBadge ticker={stock.ticker} />
        </div>
      )}

      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.portfolio.lastPrice}
          </p>
          <p className="mt-1 truncate font-mono text-2xl font-semibold text-white">
            {loading && !quote ? (
              <span className="inline-block h-7 w-24 animate-pulse rounded-lg bg-white/10" />
            ) : (
              formatPrice(price, quoteCurrency)
            )}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-2xl px-3 py-2 text-right ${
            isPositive ? "bg-accent-muted text-accent" : "bg-danger-muted text-danger"
          }`}
        >
          <p className="font-mono text-sm font-semibold">{formatPercent(changePercent)}</p>
          <p className="font-mono text-xs opacity-80">
            {isPositive ? "+" : ""}
            {formatPrice(change, quoteCurrency)}
          </p>
        </div>
      </div>
    </Link>
  );
}
