import type { AppLocale } from "@/types";

const LOCALE_MAP: Record<AppLocale, string> = {
  ru: "ru-RU",
  en: "en-US",
  de: "de-DE",
};

const FALLBACK_DATES: Record<string, string> = {
  MP: "2026-11-05",
  UUUU: "2026-11-06",
};

const DEFAULT_FALLBACK = "2026-11-05";

export type EventDateLabels = {
  today: string;
  inDays: (days: number) => string;
};

export function isIsoDateString(value: string | null | undefined): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseIsoDate(iso: string): Date | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function rollForwardToNextEventDate(targetDate: Date, now: Date = new Date()): Date {
  const result = new Date(targetDate.getTime());
  const today = startOfDay(now);

  while (startOfDay(result) < today) {
    result.setMonth(result.getMonth() + 3);
  }

  return result;
}

export function resolveNextEventDate(
  dateString: string | null | undefined,
  symbol: string,
  now: Date = new Date(),
): { isoDate: string; daysLeft: number; targetDate: Date } {
  const today = startOfDay(now);
  let targetDate = dateString ? parseIsoDate(dateString) : null;

  if (!targetDate) {
    const fallback = FALLBACK_DATES[symbol.toUpperCase()] ?? DEFAULT_FALLBACK;
    targetDate = parseIsoDate(fallback) ?? parseIsoDate(DEFAULT_FALLBACK)!;
  }

  targetDate = rollForwardToNextEventDate(targetDate, now);

  const diffTime = startOfDay(targetDate).getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    isoDate: toIsoDateString(targetDate),
    daysLeft,
    targetDate,
  };
}

export function formatEventDate(
  dateString: string | null | undefined,
  symbol: string,
  locale: AppLocale,
  labels: EventDateLabels,
  now: Date = new Date(),
): { dateText: string; daysText: string } {
  const { targetDate, daysLeft } = resolveNextEventDate(dateString, symbol, now);

  const dateText = targetDate.toLocaleDateString(LOCALE_MAP[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const daysText = daysLeft === 0 ? labels.today : labels.inDays(daysLeft);

  return { dateText, daysText };
}
