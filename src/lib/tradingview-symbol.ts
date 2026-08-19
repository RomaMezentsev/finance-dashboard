function stripSuffix(symbol: string): string {
  return symbol.split(".")[0];
}

function normalizeExchangeCode(exchange: string): string {
  const ex = exchange.toUpperCase();

  if (
    ex.includes("NASDAQ") ||
    ex === "NMS" ||
    ex === "NGM" ||
    ex === "NCM" ||
    ex.includes("NASD")
  ) {
    return "NASDAQ";
  }

  if (ex.includes("NYSE") || ex === "NYQ" || ex.includes("NEW YORK")) {
    return "NYSE";
  }

  if (ex.includes("AMEX") || ex === "ASE" || ex.includes("AMERICAN")) {
    return "AMEX";
  }

  if (
    ex.includes("XETR") ||
    ex.includes("GER") ||
    ex.includes("XETRA") ||
    ex.includes("FRANKFURT") ||
    ex.includes("DEUTSCHE")
  ) {
    return "XETR";
  }

  if (ex.includes("LSE") || ex.includes("LONDON")) {
    return "LSE";
  }

  return ex;
}

export function getTradingViewSymbol(symbol: string, exchange?: string): string {
  if (!symbol) {
    return "NYSE:UUUU";
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  if (exchange) {
    const normalizedExchange = normalizeExchangeCode(exchange);

    if (normalizedExchange === "NASDAQ") {
      return `NASDAQ:${stripSuffix(cleanSymbol.replace(".DE", ""))}`;
    }

    if (normalizedExchange === "NYSE") {
      return `NYSE:${stripSuffix(cleanSymbol.replace(".DE", ""))}`;
    }

    if (normalizedExchange === "AMEX") {
      return `AMEX:${stripSuffix(cleanSymbol.replace(".DE", ""))}`;
    }

    if (normalizedExchange === "XETR") {
      return `XETR:${stripSuffix(cleanSymbol.replace(".DE", ""))}`;
    }

    if (normalizedExchange === "LSE") {
      return `LSE:${stripSuffix(cleanSymbol)}`;
    }
  }

  if (cleanSymbol.includes(":")) {
    return cleanSymbol;
  }

  if (cleanSymbol.endsWith(".DE") || cleanSymbol.endsWith(".F")) {
    return `XETR:${stripSuffix(cleanSymbol)}`;
  }

  if (cleanSymbol.endsWith(".L")) {
    return `LSE:${stripSuffix(cleanSymbol)}`;
  }

  if (cleanSymbol.length <= 3) {
    return `NYSE:${cleanSymbol}`;
  }

  return `NASDAQ:${cleanSymbol}`;
}

export function formatTradingViewSymbol(symbol: string, exchange?: string): string {
  return getTradingViewSymbol(symbol, exchange);
}

export function getTradingViewDisplayTicker(symbol: string, exchange?: string): string {
  const formatted = getTradingViewSymbol(symbol, exchange);
  const colonIndex = formatted.indexOf(":");
  return colonIndex >= 0 ? formatted.slice(colonIndex + 1) : formatted;
}
