import { NextResponse } from "next/server";
import { z } from "zod";
import { createJsonCompletion } from "@/lib/ai/json-completion";
import { searchNewsContext } from "@/lib/ai/tavily-search";
import { mapApiError } from "@/lib/api/map-api-error";
import { getLanguageInstruction, languageSchema, tickerSchema } from "@/lib/api/schemas";
import {
  getCachedInsiderActivity,
  setCachedInsiderActivity,
} from "@/lib/cache/insider-cache";
import type { InsiderActivity, InsiderTrade } from "@/types";

const requestSchema = z.object({
  ticker: tickerSchema,
  language: languageSchema,
});

function normalizeNetActivity(value: unknown): InsiderActivity["netActivity"] {
  if (
    value === "Net Insider Buying" ||
    value === "Net Insider Selling" ||
    value === "Neutral"
  ) {
    return value;
  }
  return "Neutral";
}

function normalizeTrades(value: unknown): InsiderTrade[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((trade) => {
      if (!trade || typeof trade !== "object") {
        return null;
      }

      const record = trade as Record<string, unknown>;
      const action = record.action === "Buy" || record.action === "Sell" ? record.action : "Buy";

      return {
        insider: String(record.insider ?? "Unknown insider"),
        role: String(record.role ?? "Insider"),
        action,
        value: String(record.value ?? "N/A"),
        date: String(record.date ?? "Recent"),
      };
    })
    .filter((trade): trade is InsiderTrade => trade !== null)
    .slice(0, 3);
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

    const cached = await getCachedInsiderActivity(ticker, language);
    if (cached) {
      return NextResponse.json(cached);
    }

    let context: string;

    try {
      const search = await searchNewsContext({
        query: `${ticker} insider trading SEC Form 4 institutional buying selling last 3 months`,
        timeRange: "month",
        maxResults: 6,
      });
      context = search.context;
    } catch (error: unknown) {
      console.error("Insider Tavily error:", error);
      const mapped = mapApiError(error, "news search");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    let aiResult: {
      netActivity?: string;
      trades?: unknown[];
    };

    try {
      aiResult = await createJsonCompletion({
        system: `You summarize insider and institutional activity for investors. ${getLanguageInstruction(language)} Return JSON: { "netActivity": "Net Insider Buying|Net Insider Selling|Neutral", "trades": [{ "insider": "...", "role": "CEO|CFO|Director|Fund", "action": "Buy|Sell", "value": "$X", "date": "..." }] }`,
        user: `Ticker: ${ticker}\n\nSource context:\n${context || "Limited insider filing context available."}`,
      });
    } catch (error: unknown) {
      console.error("Insider OpenAI error:", error);
      const mapped = mapApiError(error, "AI analysis");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    const response: InsiderActivity = {
      ticker,
      netActivity: normalizeNetActivity(aiResult.netActivity),
      trades: normalizeTrades(aiResult.trades),
    };

    await setCachedInsiderActivity(ticker, language, response);
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Insider activity API error:", error);
    const mapped = mapApiError(error, "AI analysis");
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
