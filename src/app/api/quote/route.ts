import { NextResponse } from "next/server";
import { fetchStockQuote } from "@/lib/quotes/yahoo-quote";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const isin = searchParams.get("isin");

  if (!ticker?.trim() && !isin?.trim()) {
    return NextResponse.json({ error: "Provide ticker or isin query parameter" }, { status: 400 });
  }

  try {
    const quote = await fetchStockQuote(ticker, isin);

    return NextResponse.json(quote, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error: unknown) {
    console.error("Quote API error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch quote";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
