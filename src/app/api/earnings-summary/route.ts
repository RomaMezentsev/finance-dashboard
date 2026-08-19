import { NextResponse } from "next/server";
import { z } from "zod";
import { createJsonCompletion } from "@/lib/ai/json-completion";
import { searchNewsContext } from "@/lib/ai/tavily-search";
import { mapApiError } from "@/lib/api/map-api-error";
import { getLanguageInstruction, languageSchema, tickerSchema } from "@/lib/api/schemas";
import {
  getCachedEarningsSummary,
  setCachedEarningsSummary,
} from "@/lib/cache/earnings-cache";
import type { EarningsSummary } from "@/types";

const requestSchema = z.object({
  ticker: tickerSchema,
  language: languageSchema,
});

function normalizeEarningsStatus(value: unknown): EarningsSummary["revenue_eps_status"] {
  if (value === "Beat" || value === "Missed" || value === "Inline" || value === "Unknown") {
    return value;
  }
  return "Unknown";
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

    const { ticker, language } = parsed.data;

    const cached = await getCachedEarningsSummary(ticker, language);
    if (cached) {
      return NextResponse.json(cached);
    }

    let context: string;

    try {
      const search = await searchNewsContext({
        query: `${ticker} latest earnings call transcript 10-Q 10-K SEC filing revenue EPS guidance`,
        timeRange: "month",
        maxResults: 6,
      });
      context = search.context;
    } catch (error: unknown) {
      console.error("Earnings Tavily error:", error);
      const mapped = mapApiError(error, "news search");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    let aiResult: {
      revenue_eps_status?: string;
      bullish_highlights?: string[];
      key_risks?: string[];
      ceo_quote?: string;
    };

    try {
      aiResult = await createJsonCompletion({
        system: `You are an equity research analyst summarizing the latest earnings report or SEC filing. ${getLanguageInstruction(language)} Return JSON: { "revenue_eps_status": "Beat|Missed|Inline|Unknown", "bullish_highlights": ["...", "...", "..."], "key_risks": ["...", "...", "..."], "ceo_quote": "..." }`,
        user: `Ticker: ${ticker}\n\nSource context:\n${context || "Limited public filing context available."}`,
      });
    } catch (error: unknown) {
      console.error("Earnings OpenAI error:", error);
      const mapped = mapApiError(error, "AI analysis");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    const response: EarningsSummary = {
      ticker,
      revenue_eps_status: normalizeEarningsStatus(aiResult.revenue_eps_status),
      bullish_highlights: Array.isArray(aiResult.bullish_highlights)
        ? aiResult.bullish_highlights.filter(Boolean)
        : [],
      key_risks: Array.isArray(aiResult.key_risks) ? aiResult.key_risks.filter(Boolean) : [],
      ceo_quote: aiResult.ceo_quote?.trim() || "No direct management quote found in recent sources.",
    };

    await setCachedEarningsSummary(ticker, language, response);
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Earnings summary API error:", error);
    const mapped = mapApiError(error, "AI analysis");
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
