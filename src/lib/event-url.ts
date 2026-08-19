export function getEventUrl(ticker: string): string {
  const normalized = ticker.toUpperCase().trim();
  return `https://finance.yahoo.com/quote/${normalized}/financials/`;
}
