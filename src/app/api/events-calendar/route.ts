import { NextResponse } from "next/server";
import { z } from "zod";
import { createJsonCompletion } from "@/lib/ai/json-completion";
import { searchInstrumentEventsContext } from "@/lib/ai/instrument-search";
import { mapApiError } from "@/lib/api/map-api-error";
import { getLanguageInstruction, languageSchema, tickersSchema } from "@/lib/api/schemas";
import {
  getCachedTickerEvents,
  setCachedTickerEvents,
} from "@/lib/cache/events-calendar-cache";
import {
  isIsoDateString,
  resolveNextEventDate,
} from "@/lib/events-calendar/format-event-date";
import {
  filterCalendarEventsForInstrument,
  sortCalendarEvents,
} from "@/lib/events-calendar/normalize";
import { resolveInstrumentMeta } from "@/lib/instruments/ticker-meta";
import type { AppLocale, CalendarEventItem, EventsCalendarResponse } from "@/types";

const requestSchema = z.object({
  tickers: tickersSchema,
  language: languageSchema,
});

const calendarEventSchema = z.object({
  ticker: z.string(),
  eventType: z.enum(["earnings", "dividend"]),
  daysLeft: z.number().optional(),
  dateString: z.string(),
  eventDate: z.string().optional(),
});

const aiResponseSchema = z.object({
  events: z.array(calendarEventSchema),
});

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeAiEvents(raw: unknown, meta: ReturnType<typeof resolveInstrumentMeta>): CalendarEventItem[] {
  const parsed = aiResponseSchema.safeParse(raw);
  if (!parsed.success) {
    return [];
  }

  return parsed.data.events
    .filter(
      (event) =>
        event.ticker.toUpperCase() === meta.ticker.toUpperCase() ||
        event.ticker.toUpperCase() === meta.symbol.toUpperCase(),
    )
    .map((event) => {
      const sourceIso = isIsoDateString(event.eventDate) ? event.eventDate!.trim() : null;
      const resolved = resolveNextEventDate(sourceIso, meta.ticker);

      return {
        ticker: meta.ticker,
        eventType: event.eventType,
        daysLeft: resolved.daysLeft,
        dateString: event.dateString.trim(),
        isoDate: resolved.isoDate,
      };
    })
    .filter((event) => Boolean(event.isoDate));
}

function buildEventsSystemPrompt(meta: ReturnType<typeof resolveInstrumentMeta>, language: AppLocale): string {
  if (meta.isETF && meta.isAccumulating) {
    return `You are a financial calendar analyst. The instrument is an accumulating ETF (reinvesting dividends). Return ONLY: { "events": [] }`;
  }

  if (meta.isETF) {
    return `You are a financial calendar analyst for ETFs. Extract ONLY upcoming ex-dividend / distribution dates from the context.
Today's date is ${getTodayIsoDate()}.
Rules:
- Return ONLY strict JSON: { "events": [{ "ticker": string, "eventType": "dividend", "daysLeft": number, "dateString": string, "eventDate": "YYYY-MM-DD" }] }
- ETFs do NOT have earnings reports. NEVER return eventType "earnings".
- Include at most one dividend/distribution event.
- Omit accumulating/reinvesting share classes with no cash distributions.
- eventDate is required (ISO YYYY-MM-DD). Omit events without a known future or recent date.
- daysLeft = whole calendar days from today until eventDate.
- dateString localized (${getLanguageInstruction(language)}).`;
  }

  return `You are a financial calendar analyst. Extract upcoming earnings and ex-dividend dates from the provided search context.
Today's date is ${getTodayIsoDate()}.
Rules:
- Return ONLY strict JSON: { "events": [{ "ticker": string, "eventType": "earnings"|"dividend", "daysLeft": number, "dateString": string, "eventDate": "YYYY-MM-DD" }] }
- Include at most one earnings and one dividend event per ticker.
- If the company does NOT pay dividends, do NOT include a dividend event.
- eventDate is required (ISO YYYY-MM-DD). Omit events without a known date.
- daysLeft must match whole calendar days from today until eventDate (0 = today).
- dateString must be a short human-readable date localized for the user (${getLanguageInstruction(language)}).
- Omit past events older than 30 days. Do not guess dividend dates for non-dividend payers.`;
}

async function fetchEventsForTicker(
  ticker: string,
  language: AppLocale,
): Promise<CalendarEventItem[]> {
  const meta = resolveInstrumentMeta(ticker);
  const cached = await getCachedTickerEvents(meta.ticker, language);
  if (cached) {
    return cached;
  }

  if (meta.isETF && meta.isAccumulating) {
    await setCachedTickerEvents(meta.ticker, language, []);
    return [];
  }

  let context: string;
  try {
    const search = await searchInstrumentEventsContext(meta);
    context = search.context;
  } catch (error: unknown) {
    console.error(`Events calendar Tavily error (${meta.ticker}):`, error);
    throw error;
  }

  let aiResult: unknown;
  try {
    aiResult = await createJsonCompletion({
      system: buildEventsSystemPrompt(meta, language),
      user: `Ticker: ${meta.ticker}\nSymbol: ${meta.symbol}\nInstrument: ${meta.isETF ? "ETF" : "Stock"}\nName: ${meta.displayName}\nISIN: ${meta.isin ?? "n/a"}\nAccumulating: ${meta.isAccumulating ? "yes" : "no"}\n\nSearch context:\n${context || "No calendar context found."}`,
    });
  } catch (error: unknown) {
    console.error(`Events calendar OpenAI error (${meta.ticker}):`, error);
    throw error;
  }

  const normalized = filterCalendarEventsForInstrument(normalizeAiEvents(aiResult, meta), meta);
  await setCachedTickerEvents(meta.ticker, language, normalized);
  return normalized;
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request body";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { tickers, language } = parsed.data;
    const uniqueTickers = [
      ...new Set(tickers.map((ticker) => resolveInstrumentMeta(ticker).ticker)),
    ];

    const settled = await Promise.allSettled(
      uniqueTickers.map((ticker) => fetchEventsForTicker(ticker, language)),
    );

    const events: CalendarEventItem[] = [];

    for (const result of settled) {
      if (result.status === "fulfilled") {
        events.push(...result.value);
      }
    }

    if (events.length === 0 && settled.every((result) => result.status === "rejected")) {
      const firstError = settled.find((result) => result.status === "rejected");
      if (firstError && firstError.status === "rejected") {
        const mapped = mapApiError(firstError.reason, "news search");
        return NextResponse.json({ error: mapped.message }, { status: mapped.status });
      }
    }

    const response: EventsCalendarResponse = {
      events: sortCalendarEvents(events),
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Events calendar API error:", error);
    const mapped = mapApiError(error, "AI analysis");
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
