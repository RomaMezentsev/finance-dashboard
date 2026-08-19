"use client";

import { AddStockForm } from "@/components/AddStockForm";
import { StockCard } from "@/components/StockCard";
import { UpcomingEventsWidget } from "@/components/UpcomingEventsWidget";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { Stock } from "@/types";

type PortfolioTabProps = {
  stocks: Stock[];
  onAddStock: (ticker: string) => boolean;
  onRemoveStock: (id: string) => void;
};

export function PortfolioTab({
  stocks,
  onAddStock,
  onRemoveStock,
}: PortfolioTabProps) {
  const { t } = useTranslations();

  const holdingsHint =
    stocks.length === 0
      ? t.portfolio.emptyHint
      : stocks.length === 1
        ? t.portfolio.positionsOne
        : t.portfolio.positionsMany(stocks.length);

  return (
    <div className="space-y-8">
      <UpcomingEventsWidget stocks={stocks} />
      <AddStockForm onAdd={onAddStock} />

      <section>
        <div className="mb-5 flex min-w-0 items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-white">{t.portfolio.yourHoldings}</h2>
            <p className="mt-2 text-sm text-muted">{holdingsHint}</p>
          </div>
        </div>

        {stocks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
            <p className="text-lg font-medium text-white">{t.portfolio.emptyTitle}</p>
            <p className="mt-2 text-sm text-muted">{t.portfolio.emptySubtitle}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stocks.map((stock, index) => (
              <StockCard
                key={stock.id}
                stock={stock}
                index={index}
                onRemove={onRemoveStock}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
