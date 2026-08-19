import { NextResponse } from "next/server";
import { z } from "zod";
import { createJsonCompletion } from "@/lib/ai/json-completion";
import { searchNewsContext } from "@/lib/ai/tavily-search";
import { mapApiError } from "@/lib/api/map-api-error";
import { getLanguageInstruction, languageSchema, tickersSchema } from "@/lib/api/schemas";
import {
  getCachedPortfolioImpact,
  setCachedPortfolioImpact,
} from "@/lib/cache/portfolio-impact-cache";
import type { NewsSentiment, PortfolioImpactSummary } from "@/types";

const requestSchema = z.object({
  tickers: tickersSchema,
  language: languageSchema,
});

function normalizeVerdict(value: unknown): NewsSentiment {
  if (value === "Bullish" || value === "Bearish" || value === "Neutral") {
    return value;
  }
  return "Neutral";
}

function normalizeScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 50;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
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

    const { tickers, language } = parsed.data;

    const cached = await getCachedPortfolioImpact(tickers, language);
    if (cached) {
      return NextResponse.json(cached);
    }

    let context: string;

    try {
      const search = await searchNewsContext({
        query: `macro market news Fed commodities and company news for ${tickers.join(", ")} stocks last 24 hours`,
        timeRange: "day",
        maxResults: 8,
      });
      context = search.context;
    } catch (error: unknown) {
      console.error("Portfolio impact Tavily error:", error);
      const mapped = mapApiError(error, "news search");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    if (!context.trim()) {
      const empty: PortfolioImpactSummary = {
        tickers,
        verdict: "Neutral",
        sentimentScore: 50,
        summary: "No major portfolio-relevant headlines were found in the last 24 hours.",
        drivers: [],
      };
      await setCachedPortfolioImpact(tickers, language, empty);
      return NextResponse.json(empty);
    }

    let aiResult: {
      verdict?: string;
      sentimentScore?: number;
      summary?: string;
      drivers?: string[];
    };

    try {
      aiResult = await createJsonCompletion({
        system: `You are a senior portfolio strategist. Analyze how macro and company-specific news affects the given stock basket. ${getLanguageInstruction(language)} Return JSON: { "verdict": "Bullish|Bearish|Neutral", "sentimentScore": 0-100, "summary": "2-3 sentences", "drivers": ["...", "...", "..."] }`,
        user: `Portfolio tickers: ${tickers.join(", ")}\n\nNews context:\n${context}`,
      });
    } catch (error: unknown) {
      console.error("Portfolio impact OpenAI error:", error);
      const mapped = mapApiError(error, "AI analysis");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    const response: PortfolioImpactSummary = {
      tickers,
      verdict: normalizeVerdict(aiResult.verdict),
      sentimentScore: normalizeScore(aiResult.sentimentScore),
      summary: aiResult.summary?.trim() || "No summary generated.",
      drivers: Array.isArray(aiResult.drivers) ? aiResult.drivers.filter(Boolean) : [],
    };

    await setCachedPortfolioImpact(tickers, language, response);
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Portfolio impact API error:", error);
    const mapped = mapApiError(error, "news search");
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
