"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Watchlist } from "@/components/Watchlist";
import { PortfolioImpactSummary } from "@/components/PortfolioImpactSummary";
import { PortfolioPriceSummary } from "@/components/PortfolioPriceSummary";
import { UpcomingEventsWidget } from "@/components/UpcomingEventsWidget";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTranslations } from "@/lib/i18n/use-translations";

export function HomeView() {
  const { t } = useTranslations();
  const { stocks, ready } = usePortfolio();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ticker = searchParams.get("ticker")?.toUpperCase().trim();
    if (ticker) {
      router.replace(`/asset/${encodeURIComponent(ticker)}`);
    }
  }, [router, searchParams]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{t.dashboard.title}</h1>
        <p className="mt-1 text-sm text-muted">{t.dashboard.subtitle}</p>
      </div>

      {ready ? (
        <>
          <PortfolioPriceSummary stocks={stocks} />
          <PortfolioImpactSummary stocks={stocks} />
        </>
      ) : null}

      <Watchlist />

      {ready && stocks.length > 0 ? <UpcomingEventsWidget stocks={stocks} /> : null}
    </div>
  );
}
