import { NextResponse } from "next/server";

type YahooQuote = {
  symbol?: string;
  shortname?: string;
  longname?: string;
  quoteType?: string;
};

export async function GET(req: Request) {
  const query = new URL(req.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const data = (await response.json()) as { quotes?: YahooQuote[] };
    const suggestions = (data.quotes ?? [])
      .filter((quote) => quote.symbol)
      .map((quote) => ({
        symbol: quote.symbol!.toUpperCase(),
        name: quote.shortname ?? quote.longname ?? quote.symbol!,
        type: quote.quoteType ?? "EQUITY",
      }));

    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    console.error("Yahoo search suggest error:", error);
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
