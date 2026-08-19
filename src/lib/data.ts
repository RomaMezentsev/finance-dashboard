import type { FinancialMetrics, NewsItem, Stock, StockValuation, UpcomingEvent, ValuationStatus } from "@/types";
import { getInstrumentDisplayName, resolveInstrumentMeta } from "@/lib/instruments/ticker-meta";

const STOCK_MOCK_DATA: Record<string, { price: number; changePercent: number }> = {
  MP: { price: 18.42, changePercent: 2.35 },
  UUUU: { price: 9.87, changePercent: -1.12 },
  AAPL: { price: 189.3, changePercent: 0.84 },
  MSFT: { price: 415.5, changePercent: 1.21 },
  NVDA: { price: 875.28, changePercent: 3.42 },
  TSLA: { price: 248.5, changePercent: -0.67 },
  GOOGL: { price: 171.86, changePercent: 0.55 },
  AMZN: { price: 198.38, changePercent: 1.08 },
  META: { price: 585.25, changePercent: 2.14 },
  AMD: { price: 122.64, changePercent: -1.45 },
};

const MOCK_ADDED_AT = "2026-01-15T12:00:00.000Z";

export function getStockName(ticker: string): string {
  return getInstrumentDisplayName(ticker);
}

function getDeterministicMockMetrics(ticker: string) {
  const normalized = ticker.toUpperCase().trim();
  const known = STOCK_MOCK_DATA[normalized];

  if (known) {
    return known;
  }

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }

  const price = Number(((hash % 18000) / 100 + 12).toFixed(2));
  const changePercent = Number((((hash % 800) / 100) - 3.5).toFixed(2));

  return { price, changePercent };
}

export function createMockStock(ticker: string): Stock {
  const meta = resolveInstrumentMeta(ticker);
  const normalized = meta.ticker;
  const { price, changePercent } = getDeterministicMockMetrics(normalized);
  const change = Number(((price * changePercent) / 100).toFixed(2));

  return {
    id: normalized,
    ticker: normalized,
    name: meta.displayName,
    isETF: meta.isETF,
    price,
    change,
    changePercent,
    addedAt: MOCK_ADDED_AT,
  };
}

const FINANCIAL_METRICS: Record<
  string,
  Omit<FinancialMetrics, "ticker">
> = {
  MP: { marketCap: 3_200_000_000, peRatio: 45.2, week52Low: 12.4, week52High: 24.85 },
  UUUU: { marketCap: 1_650_000_000, peRatio: null, week52Low: 4.2, week52High: 11.3 },
  AAPL: { marketCap: 3_050_000_000_000, peRatio: 32.4, week52Low: 164.08, week52High: 220.2 },
  MSFT: { marketCap: 3_120_000_000_000, peRatio: 35.8, week52Low: 362.9, week52High: 468.35 },
  NVDA: { marketCap: 2_150_000_000_000, peRatio: 54.7, week52Low: 475.0, week52High: 950.02 },
  TSLA: { marketCap: 795_000_000_000, peRatio: 58.3, week52Low: 138.8, week52High: 279.5 },
  GOOGL: { marketCap: 2_080_000_000_000, peRatio: 24.6, week52Low: 130.67, week52High: 191.75 },
  AMZN: { marketCap: 2_010_000_000_000, peRatio: 42.1, week52Low: 151.61, week52High: 214.5 },
  META: { marketCap: 1_420_000_000_000, peRatio: 27.9, week52Low: 390.4, week52High: 638.4 },
  AMD: { marketCap: 198_000_000_000, peRatio: 118.5, week52Low: 76.48, week52High: 132.83 },
};

export function getFinancialMetrics(ticker: string): FinancialMetrics {
  const normalized = ticker.toUpperCase().trim();
  const known = FINANCIAL_METRICS[normalized];

  if (known) {
    return { ticker: normalized, ...known };
  }

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }

  const price = Number(((hash % 18000) / 100 + 12).toFixed(2));
  const marketCap = Number((((hash % 9000) + 500) * 1_000_000).toFixed(0));
  const peRatio = hash % 5 === 0 ? null : Number(((hash % 4500) / 100 + 8).toFixed(1));
  const week52Low = Number((price * 0.72).toFixed(2));
  const week52High = Number((price * 1.38).toFixed(2));

  return {
    ticker: normalized,
    marketCap,
    peRatio,
    week52Low,
    week52High,
  };
}

const VALUATION_DATA: Record<string, Omit<StockValuation, "ticker">> = {
  MP: { status: "Undervalued", targetPrice: 22.5, upsidePercent: 22.1 },
  UUUU: { status: "Fairly Valued", targetPrice: 10.2, upsidePercent: 3.3 },
  AAPL: { status: "Fairly Valued", targetPrice: 210.0, upsidePercent: 10.9 },
  NVDA: { status: "Overvalued", targetPrice: 820.0, upsidePercent: -6.3 },
  MSFT: { status: "Fairly Valued", targetPrice: 450.0, upsidePercent: 8.3 },
  TSLA: { status: "Overvalued", targetPrice: 220.0, upsidePercent: -11.5 },
  GOOGL: { status: "Undervalued", targetPrice: 195.0, upsidePercent: 13.5 },
  AMZN: { status: "Undervalued", targetPrice: 225.0, upsidePercent: 13.4 },
  META: { status: "Fairly Valued", targetPrice: 610.0, upsidePercent: 4.2 },
  AMD: { status: "Undervalued", targetPrice: 145.0, upsidePercent: 18.2 },
};

const EVENT_OFFSETS: Record<string, { earningsDays: number; exDivDays: number }> = {
  MP: { earningsDays: 4, exDivDays: 18 },
  UUUU: { earningsDays: 11, exDivDays: 27 },
  AAPL: { earningsDays: 9, exDivDays: 22 },
  NVDA: { earningsDays: 6, exDivDays: 14 },
  MSFT: { earningsDays: 13, exDivDays: 31 },
  TSLA: { earningsDays: 8, exDivDays: 0 },
  GOOGL: { earningsDays: 15, exDivDays: 25 },
  AMZN: { earningsDays: 7, exDivDays: 19 },
  META: { earningsDays: 12, exDivDays: 28 },
  AMD: { earningsDays: 5, exDivDays: 16 },
};

export function getStockValuation(ticker: string): StockValuation {
  const normalized = ticker.toUpperCase().trim();
  const known = VALUATION_DATA[normalized];

  if (known) {
    return { ticker: normalized, ...known };
  }

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }

  const statuses: ValuationStatus[] = ["Undervalued", "Fairly Valued", "Overvalued"];
  const status = statuses[hash % statuses.length];
  const price = Number(((hash % 18000) / 100 + 12).toFixed(2));
  const upsidePercent = Number((((hash % 400) - 150) / 10).toFixed(1));
  const targetPrice = Number((price * (1 + upsidePercent / 100)).toFixed(2));

  return { ticker: normalized, status, targetPrice, upsidePercent };
}

export function getUpcomingEventsForTickers(tickers: string[]): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];

  for (const ticker of tickers) {
    const normalized = ticker.toUpperCase().trim();
    const offsets = EVENT_OFFSETS[normalized] ?? {
      earningsDays: (normalized.charCodeAt(0) % 14) + 3,
      exDivDays: (normalized.charCodeAt(1) % 20) + 10,
    };

    events.push({
      ticker: normalized,
      type: "Earnings",
      daysUntil: offsets.earningsDays,
      dateLabel: `in ${offsets.earningsDays} days`,
    });

    if (offsets.exDivDays > 0) {
      events.push({
        ticker: normalized,
        type: "Ex-Dividend",
        daysUntil: offsets.exDivDays,
        dateLabel: `in ${offsets.exDivDays} days`,
      });
    }
  }

  return events.sort((left, right) => left.daysUntil - right.daysUntil);
}

export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  return formatCurrency(value);
}

export function formatPeRatio(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${value.toFixed(1)}x`;
}

export function format52WeekRange(low: number, high: number): string {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

export const MARKET_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Rare earth stocks rally on new EV supply chain deals",
    source: "MarketWatch",
    summary:
      "MP Materials and peers gained after automakers announced expanded domestic sourcing agreements for critical minerals.",
    publishedAt: "2 hours ago",
    category: "Commodities",
  },
  {
    id: "2",
    title: "Uranium miners extend gains as nuclear demand outlook improves",
    source: "Reuters",
    summary:
      "Energy Fuels and sector peers climbed following updated long-term power contracts across North America and Europe.",
    publishedAt: "4 hours ago",
    category: "Energy",
  },
  {
    id: "3",
    title: "Fed officials signal patience before next rate move",
    source: "Bloomberg",
    summary:
      "Markets parsed mixed commentary from policymakers, with growth stocks leading while defensives lagged into the close.",
    publishedAt: "6 hours ago",
    category: "Macro",
  },
  {
    id: "4",
    title: "Tech earnings season kicks off with cloud growth in focus",
    source: "CNBC",
    summary:
      "Investors are watching AI infrastructure spending and margin guidance as mega-cap reports roll in this week.",
    publishedAt: "8 hours ago",
    category: "Technology",
  },
  {
    id: "5",
    title: "Oil holds steady as traders weigh OPEC guidance",
    source: "Financial Times",
    summary:
      "Energy equities traded mixed while crude prices consolidated ahead of inventory data and geopolitical headlines.",
    publishedAt: "11 hours ago",
    category: "Energy",
  },
  {
    id: "6",
    title: "Retail investors increase ETF inflows into thematic baskets",
    source: "Barron's",
    summary:
      "Thematic funds tied to clean energy, semiconductors, and uranium saw another week of net inflows from retail accounts.",
    publishedAt: "1 day ago",
    category: "Markets",
  },
];

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
