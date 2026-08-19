"use client";

import { getStockValuation } from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { ValuationStatus } from "@/types";

type ValuationBadgeProps = {
  ticker: string;
};

const STATUS_STYLES: Record<ValuationStatus, string> = {
  Undervalued: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Fairly Valued": "border-white/10 bg-white/5 text-slate-300",
  Overvalued: "border-red-400/30 bg-red-400/10 text-red-300",
};

export function ValuationBadge({ ticker }: ValuationBadgeProps) {
  const { t } = useTranslations();
  const { formatPrice } = useCurrency();
  const valuation = getStockValuation(ticker);
  const badgeClass = STATUS_STYLES[valuation.status];

  return (
    <div className="space-y-2">
      <span
        className={`inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${badgeClass}`}
      >
        {t.enums.valuation[valuation.status]}
      </span>
      <p className="truncate text-xs text-muted">
        {t.valuation.target} {formatPrice(valuation.targetPrice, "USD")} ·{" "}
        <span className={valuation.upsidePercent >= 0 ? "text-emerald-300" : "text-red-300"}>
          {valuation.upsidePercent >= 0 ? "+" : ""}
          {valuation.upsidePercent.toFixed(1)}%
        </span>
      </p>
    </div>
  );
}
