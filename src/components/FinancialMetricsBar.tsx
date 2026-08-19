"use client";

import {
  formatPeRatio,
  getFinancialMetrics,
  getStockName,
} from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations } from "@/lib/i18n/use-translations";

type FinancialMetricsBarProps = {
  ticker: string;
};

export function FinancialMetricsBar({ ticker }: FinancialMetricsBarProps) {
  const { t } = useTranslations();
  const { formatPrice, formatPriceCompact } = useCurrency();
  const metrics = getFinancialMetrics(ticker);

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-4 backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.metrics.keyMetrics}
          </p>
          <p className="mt-1 truncate text-sm text-slate-300">{getStockName(metrics.ticker)}</p>
        </div>
        <p className="shrink-0 text-xs text-muted whitespace-nowrap">{t.metrics.mockData}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={t.metrics.marketCap} value={formatPriceCompact(metrics.marketCap, "USD")} />
        <MetricCard label={t.metrics.peRatio} value={formatPeRatio(metrics.peRatio)} />
        <MetricCard
          label={t.metrics.week52Range}
          value={`${formatPrice(metrics.week52Low, "USD")} – ${formatPrice(metrics.week52High, "USD")}`}
        />
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3">
      <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
        {label}
      </p>
      <p className="mt-2 truncate font-mono text-base font-semibold text-white sm:text-lg">{value}</p>
    </div>
  );
}
