"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStockPrice } from "@/hooks/useStockPrice";
import { getTradingViewSymbol } from "@/lib/tradingview-symbol";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { AppLocale } from "@/types";

const WIDGET_SCRIPT = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

function getTradingViewLocale(locale: AppLocale): string {
  return locale;
}

function getWidgetConfig(symbol: string, locale: AppLocale) {
  return {
    autosize: true,
    symbol,
    interval: "D",
    timezone: "exchange",
    theme: "dark",
    backgroundColor: "rgba(7, 11, 18, 1)",
    gridColor: "rgba(148, 163, 184, 0.08)",
    style: "3",
    locale: getTradingViewLocale(locale),
    enable_publishing: false,
    allow_symbol_change: false,
    hide_top_toolbar: true,
    hide_side_toolbar: true,
    hide_legend: true,
    withdateranges: false,
    show_popup_button: false,
    save_image: false,
    calendar: false,
    studies: [],
    support_host: "https://www.tradingview.com",
  };
}

type TradingViewChartProps = {
  ticker: string;
  exchange?: string;
  className?: string;
};

export function TradingViewChart({ ticker, exchange, className = "" }: TradingViewChartProps) {
  const { t, locale } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { quote } = useStockPrice({ ticker });

  const resolvedExchange = exchange ?? quote?.exchange;
  const tradingViewSymbol = useMemo(
    () => getTradingViewSymbol(ticker, resolvedExchange),
    [resolvedExchange, ticker],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget h-full w-full";
    container.appendChild(widgetHost);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = WIDGET_SCRIPT;
    script.async = true;
    script.textContent = JSON.stringify(getWidgetConfig(tradingViewSymbol, locale));
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [locale, mounted, tradingViewSymbol]);

  return (
    <section
      className={`rounded-3xl border border-card-border bg-card/80 p-4 backdrop-blur-xl sm:p-5 ${className}`}
    >
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.chart.liveChart}
          </p>
          <h3 className="mt-1 truncate font-mono text-lg font-semibold tracking-[0.12em] text-white">
            {ticker.toUpperCase()}
          </h3>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300 whitespace-nowrap">
          {t.chart.area}
        </span>
      </div>

      {!mounted ? (
        <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/5 bg-slate-950/50">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="tradingview-widget-container [&_.tradingview-widget-copyright]:hidden h-[420px] overflow-hidden rounded-2xl border border-white/5 bg-[#070b12]"
        />
      )}
    </section>
  );
}
