import { buildCacheKey, getKeyValueCache } from "@/lib/cache/key-value-cache";
import type { CalendarEventItem } from "@/types";

export const EVENTS_CALENDAR_CACHE_TTL_MS = 15 * 60 * 1000;
const NAMESPACE = "events-calendar";

export function buildEventsCalendarCacheKey(ticker: string, language: string): string {
  return buildCacheKey(NAMESPACE, [ticker.toUpperCase(), language]);
}

export async function getCachedTickerEvents(
  ticker: string,
  language: string,
): Promise<CalendarEventItem[] | null> {
  return getKeyValueCache().get<CalendarEventItem[]>(
    buildEventsCalendarCacheKey(ticker, language),
  );
}

export async function setCachedTickerEvents(
  ticker: string,
  language: string,
  events: CalendarEventItem[],
): Promise<void> {
  await getKeyValueCache().set(
    buildEventsCalendarCacheKey(ticker, language),
    events,
    EVENTS_CALENDAR_CACHE_TTL_MS,
  );
}
