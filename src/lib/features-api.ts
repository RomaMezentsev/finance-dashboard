import type {
  AppLocale,
  EarningsSummary,
  EventsCalendarResponse,
  InsiderActivity,
  PortfolioImpactSummary,
} from "@/types";

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }

  return data as T;
}

export function fetchPortfolioImpact(tickers: string[], language: AppLocale) {
  return postJson<PortfolioImpactSummary>("/api/portfolio-impact", { tickers, language });
}

export function fetchEarningsSummary(ticker: string, language: AppLocale) {
  return postJson<EarningsSummary>("/api/earnings-summary", { ticker, language });
}

export function fetchInsiderActivity(ticker: string, language: AppLocale) {
  return postJson<InsiderActivity>("/api/insider-activity", { ticker, language });
}

export function fetchEventsCalendar(tickers: string[], language: AppLocale) {
  return postJson<EventsCalendarResponse>("/api/events-calendar", { tickers, language });
}
