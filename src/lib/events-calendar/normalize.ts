import type { CalendarEventItem } from "@/types";
import type { InstrumentMeta } from "@/lib/instruments/ticker-meta";

export const MAX_NEAR_EVENT_DAYS = 60;

export function filterCalendarEvents(events: CalendarEventItem[]): CalendarEventItem[] {
  return events.filter((event) => {
    if (event.eventType === "dividend") {
      return event.daysLeft <= MAX_NEAR_EVENT_DAYS;
    }

    if (event.daysLeft > MAX_NEAR_EVENT_DAYS) {
      return event.dateString.trim().length > 0 || Boolean(event.isoDate);
    }

    return event.dateString.trim().length > 0 || Boolean(event.isoDate);
  });
}

export function filterCalendarEventsForInstrument(
  events: CalendarEventItem[],
  meta: InstrumentMeta,
): CalendarEventItem[] {
  let filtered = filterCalendarEvents(events);

  if (meta.isETF) {
    filtered = filtered.filter((event) => event.eventType !== "earnings");
  }

  if (meta.isETF && meta.isAccumulating) {
    filtered = filtered.filter((event) => event.eventType !== "dividend");
  }

  return filtered;
}

export function sortCalendarEvents(events: CalendarEventItem[]): CalendarEventItem[] {
  return [...events].sort((left, right) => {
    const leftSort = left.daysLeft >= 0 ? left.daysLeft : Number.MAX_SAFE_INTEGER;
    const rightSort = right.daysLeft >= 0 ? right.daysLeft : Number.MAX_SAFE_INTEGER;
    return leftSort - rightSort;
  });
}
