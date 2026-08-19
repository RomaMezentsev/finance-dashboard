export type Stock = {
  id: string;
  ticker: string;
  name: string;
  isETF?: boolean;
  price: number;
  change: number;
  changePercent: number;
  addedAt: string;
};

export type StockQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  exchange?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
};

export type TabId = "portfolio" | "news";

export type NewsTimeframe = "24h" | "week" | "month";

export const NEWS_TIMEFRAME_OPTIONS: { id: NewsTimeframe; label: string }[] = [
  { id: "24h", label: "Past 24h" },
  { id: "week", label: "Past Week" },
  { id: "month", label: "Past Month" },
];

export type NewsSentiment = "Bullish" | "Bearish" | "Neutral";

export type NewsSource = {
  title: string;
  url: string;
  content?: string;
};

export type NewsAnalysis = {
  ticker: string;
  sentiment: NewsSentiment;
  summary: string[];
  sources: NewsSource[];
};

export type FinancialMetrics = {
  ticker: string;
  marketCap: number;
  peRatio: number | null;
  week52Low: number;
  week52High: number;
};

export type AppLocale = "en" | "ru" | "de";

export type AppCurrency = "USD" | "EUR" | "GBP" | "CHF";

export const APP_CURRENCIES: AppCurrency[] = ["USD", "EUR", "GBP", "CHF"];

export type ValuationStatus = "Undervalued" | "Fairly Valued" | "Overvalued";

export type StockValuation = {
  ticker: string;
  status: ValuationStatus;
  targetPrice: number;
  upsidePercent: number;
};

export type PortfolioImpactSummary = {
  verdict: NewsSentiment;
  sentimentScore: number;
  summary: string;
  drivers: string[];
  tickers: string[];
};

export type EarningsSummary = {
  ticker: string;
  revenue_eps_status: "Beat" | "Missed" | "Inline" | "Unknown";
  bullish_highlights: string[];
  key_risks: string[];
  ceo_quote: string;
};

export type InsiderTrade = {
  insider: string;
  role: string;
  action: "Buy" | "Sell";
  value: string;
  date: string;
};

export type InsiderActivity = {
  ticker: string;
  netActivity: "Net Insider Buying" | "Net Insider Selling" | "Neutral";
  trades: InsiderTrade[];
};

export type UpcomingEvent = {
  ticker: string;
  type: "Earnings" | "Ex-Dividend";
  daysUntil: number;
  dateLabel: string;
};

export type CalendarEventItem = {
  ticker: string;
  eventType: "earnings" | "dividend";
  daysLeft: number;
  dateString: string;
  isoDate?: string | null;
};

export type EventsCalendarResponse = {
  events: CalendarEventItem[];
};
