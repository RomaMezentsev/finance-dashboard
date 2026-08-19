const STOCK_NAMES: Record<string, string> = {
  MP: "MP Materials",
  UUUU: "Energy Fuels",
  AAPL: "Apple Inc.",
  MSFT: "Microsoft",
  NVDA: "NVIDIA",
  TSLA: "Tesla",
  GOOGL: "Alphabet",
  AMZN: "Amazon",
  META: "Meta Platforms",
  AMD: "Advanced Micro Devices",
};

export type InstrumentMeta = {
  ticker: string;
  symbol: string;
  isETF: boolean;
  isAccumulating: boolean;
  isEuropean: boolean;
  isin: string | null;
  displayName: string;
  tradingViewSymbol: string;
  topHoldings: string[];
};

type EtfDefinition = {
  symbol: string;
  name: string;
  isin: string;
  isEuropean: boolean;
  isAccumulating: boolean;
  topHoldings: string[];
};

const ETF_ISIN_PREFIXES = ["IE", "DE", "LU", "NL", "FR", "CH", "GB"] as const;

const POPULAR_ETFS: EtfDefinition[] = [
  {
    symbol: "EUNL",
    name: "iShares Core MSCI World UCITS ETF (Acc)",
    isin: "IE00B4L5Y983",
    isEuropean: true,
    isAccumulating: true,
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"],
  },
  {
    symbol: "SXR8",
    name: "iShares Core S&P 500 UCITS ETF (Acc)",
    isin: "IE00B5BMR087",
    isEuropean: true,
    isAccumulating: true,
    topHoldings: ["Apple", "Microsoft", "Amazon", "NVIDIA", "Alphabet"],
  },
  {
    symbol: "IWDA",
    name: "iShares Core MSCI World UCITS ETF (Acc)",
    isin: "IE00B4L5Y983",
    isEuropean: true,
    isAccumulating: true,
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"],
  },
  {
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    isin: "US9229083632",
    isEuropean: false,
    isAccumulating: false,
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"],
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    isin: "US46090E1038",
    isEuropean: false,
    isAccumulating: false,
    topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Broadcom"],
  },
];

const ETF_BY_SYMBOL = new Map(POPULAR_ETFS.map((etf) => [etf.symbol, etf]));
const ETF_BY_ISIN = new Map(POPULAR_ETFS.map((etf) => [etf.isin, etf]));

import { formatTradingViewSymbol } from "@/lib/tradingview-symbol";

export function isIsin(value: string): boolean {
  return /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(value);
}

function hasEtfIsinPrefix(value: string): boolean {
  if (!isIsin(value)) {
    return false;
  }

  const prefix = value.slice(0, 2);
  return ETF_ISIN_PREFIXES.includes(prefix as (typeof ETF_ISIN_PREFIXES)[number]);
}

export function isPopularEtfSymbol(value: string): boolean {
  return ETF_BY_SYMBOL.has(value.toUpperCase());
}

export function isEtfInput(value: string): boolean {
  const normalized = value.toUpperCase().trim();
  return (
    isPopularEtfSymbol(normalized) ||
    ETF_BY_ISIN.has(normalized) ||
    hasEtfIsinPrefix(normalized)
  );
}

export function isValidInstrumentInput(value: string): boolean {
  const normalized = value.toUpperCase().trim();

  if (/^[A-Z]{1,5}$/.test(normalized)) {
    return true;
  }

  if (/^[A-Z0-9]{1,5}$/.test(normalized) && isPopularEtfSymbol(normalized)) {
    return true;
  }

  if (isIsin(normalized)) {
    return true;
  }

  return false;
}

function getTradingViewSymbolForEtf(symbol: string): string {
  return formatTradingViewSymbol(symbol);
}

function buildGenericEtfMeta(normalized: string): InstrumentMeta {
  const isEuropean = hasEtfIsinPrefix(normalized);

  return {
    ticker: normalized,
    symbol: normalized,
    isETF: true,
    isAccumulating: isEuropean,
    isEuropean,
    isin: isIsin(normalized) ? normalized : null,
    displayName: isIsin(normalized) ? `UCITS ETF (${normalized})` : `${normalized} ETF`,
    tradingViewSymbol: formatTradingViewSymbol(isIsin(normalized) ? normalized.slice(0, 4) : normalized),
    topHoldings: [],
  };
}

export function resolveInstrumentMeta(input: string): InstrumentMeta {
  const normalized = input.toUpperCase().trim();
  const knownEtf = ETF_BY_SYMBOL.get(normalized) ?? ETF_BY_ISIN.get(normalized);

  if (knownEtf) {
    return {
      ticker: knownEtf.symbol,
      symbol: knownEtf.symbol,
      isETF: true,
      isAccumulating: knownEtf.isAccumulating,
      isEuropean: knownEtf.isEuropean,
      isin: knownEtf.isin,
      displayName: knownEtf.name,
      tradingViewSymbol: getTradingViewSymbolForEtf(knownEtf.symbol),
      topHoldings: knownEtf.topHoldings,
    };
  }

  if (isEtfInput(normalized)) {
    return buildGenericEtfMeta(normalized);
  }

  return {
    ticker: normalized,
    symbol: normalized,
    isETF: false,
    isAccumulating: false,
    isEuropean: false,
    isin: null,
    displayName: STOCK_NAMES[normalized] ?? `${normalized} Corp.`,
    tradingViewSymbol: formatTradingViewSymbol(normalized),
    topHoldings: [],
  };
}

export function getTradingViewSymbol(ticker: string, exchange?: string): string {
  return formatTradingViewSymbol(ticker, exchange);
}

export function getInstrumentDisplayName(ticker: string): string {
  return resolveInstrumentMeta(ticker).displayName;
}
