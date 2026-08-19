"use client";

import { useEffect, useMemo, useState } from "react";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useLocale } from "@/context/LocaleContext";
import { getEventUrl } from "@/lib/event-url";
import { fetchEventsCalendar } from "@/lib/features-api";
import { formatEventDate } from "@/lib/events-calendar/format-event-date";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { CalendarEventItem, Stock } from "@/types";

type UpcomingEventsWidgetProps = {
  stocks: Stock[];
};

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function getEventTypeLabel(event: CalendarEventItem, t: ReturnType<typeof useTranslations>["t"]) {
  return event.eventType === "earnings"
    ? t.enums.eventType.Earnings
    : t.enums.eventType["Ex-Dividend"];
}

function EventDateDisplay({
  event,
  mounted,
}: {
  event: CalendarEventItem;
  mounted: boolean;
}) {
  const { locale } = useLocale();
  const { t } = useTranslations();

  if (!mounted) {
    return <span className="text-sm text-muted">{event.dateString || "…"}</span>;
  }

  const { dateText, daysText } = formatEventDate(event.isoDate ?? null, event.ticker, locale, {
    today: t.events.today,
    inDays: t.events.inDays,
  });

  return (
    <div className="text-right">
      <p className="text-sm font-medium text-emerald-300 transition-colors group-hover:text-emerald-400">
        {dateText}
      </p>
      <p className="text-xs text-muted">({daysText})</p>
    </div>
  );
}

export function UpcomingEventsWidget({ stocks }: UpcomingEventsWidgetProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tickers = useMemo(() => stocks.map((stock) => stock.ticker), [stocks]);
  const tickersKey = useMemo(() => tickers.join(","), [tickers]);

  useEffect(() => {
    if (tickers.length === 0) {
      setEvents([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEventsCalendar(tickers, locale)
      .then((result) => {
        if (!cancelled) {
          setEvents(result.events.slice(0, 8));
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : t.events.loadError);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale, t.events.loadError, tickers, tickersKey]);

  if (stocks.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-5 backdrop-blur-xl">
      <div className="mb-4 min-w-0">
        <p className="truncate text-xs uppercase tracking-[0.18em] text-muted whitespace-nowrap">
          {t.events.upcoming}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">{t.events.calendar}</h3>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : error ? (
        <p className="text-sm text-red-300">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted">{t.events.empty}</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={`${event.ticker}-${event.eventType}-${event.isoDate ?? event.dateString}`}>
              <a
                href={getEventUrl(event.ticker)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${event.ticker} — ${getEventTypeLabel(event, t)}`}
                className="group relative flex min-h-[52px] min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3 transition hover:border-emerald-400/30 hover:bg-emerald-400/5"
              >
                <span className="absolute right-3 top-3 text-slate-500 transition-colors group-hover:text-emerald-400">
                  <ExternalLinkIcon />
                </span>

                <div className="min-w-0 pr-6">
                  <p className="truncate font-mono text-sm font-semibold tracking-[0.12em] text-white transition-colors group-hover:text-emerald-400">
                    {event.ticker}
                  </p>
                  <p className="truncate text-xs text-muted transition-colors group-hover:text-slate-300">
                    {getEventTypeLabel(event, t)}
                  </p>
                </div>

                <div className="shrink-0 pr-5 sm:pr-0">
                  <EventDateDisplay event={event} mounted={mounted} />
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
