import { NextResponse } from "next/server";
import { tavily } from "@tavily/core";
import OpenAI from "openai";
import { z } from "zod";
import { mapApiError } from "@/lib/api/map-api-error";
import { getClientIp } from "@/lib/api/client-ip";
import { checkNewsRateLimit, NEWS_RATE_LIMIT_ERROR } from "@/lib/api/news-rate-limit";
import { getLanguageInstruction, aiTickerSchema, languageSchema } from "@/lib/api/schemas";
import { API_TIMEOUT_MS, withAbortTimeout } from "@/lib/api/with-abort-timeout";
import { buildInstrumentNewsQuery } from "@/lib/ai/instrument-search";
import { resolveInstrumentMeta } from "@/lib/instruments/ticker-meta";
import {
  getCachedNewsResponse,
  setCachedNewsResponse,
  type CachedNewsResponse,
} from "@/lib/cache/news-cache";
import type { AppLocale, NewsSentiment, NewsTimeframe } from "@/types";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const newsRequestSchema = z.object({
  ticker: aiTickerSchema,
  timeframe: z.enum(["24h", "week", "month"]).optional().default("week"),
  language: languageSchema,
});

function getTavilyTimeRange(timeframe: NewsTimeframe): "day" | "week" | "month" {
  switch (timeframe) {
    case "24h":
      return "day";
    case "month":
      return "month";
    case "week":
    default:
      return "week";
  }
}

function normalizeSentiment(value: unknown): NewsSentiment {
  if (value === "Bullish" || value === "Bearish" || value === "Neutral") {
    return value;
  }

  return "Neutral";
}

async function fetchNewsFromTavily(ticker: string, timeframe: NewsTimeframe) {
  const meta = resolveInstrumentMeta(ticker);
  const timeframeLabel =
    timeframe === "24h" ? "past 24 hours" : timeframe === "month" ? "past month" : "past week";
  const query = buildInstrumentNewsQuery(meta, timeframeLabel);

  return withAbortTimeout(async (signal) => {
    if (signal.aborted) {
      throw signal.reason ?? new DOMException("News search timed out", "TimeoutError");
    }

    return tvly.search(query, {
      searchDepth: "basic",
      topic: "news",
      timeRange: getTavilyTimeRange(timeframe),
      maxResults: 5,
      timeout: API_TIMEOUT_MS / 1000,
    });
  });
}

async function analyzeNewsWithOpenAI(
  ticker: string,
  timeframe: NewsTimeframe,
  newsContext: string,
  language: AppLocale,
) {
  return withAbortTimeout((signal) =>
    openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a financial analyst. Summarize recent news for the given ${resolveInstrumentMeta(ticker).isETF ? "ETF (focus on macro trends and top underlying holdings)" : "ticker"} into 3 bullet points and provide an overall sentiment (Bullish, Bearish, or Neutral). ${getLanguageInstruction(language)} Respond in JSON format: { "sentiment": "Bullish|Bearish|Neutral", "bullets": ["...", "...", "..."] }`,
          },
          {
            role: "user",
            content: `Analyze news for ${ticker} from the ${timeframe} timeframe:\n\n${newsContext}`,
          },
        ],
        response_format: { type: "json_object" },
      },
      { signal },
    ),
  );
}

export async function POST(req: Request) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = newsRequestSchema.safeParse(body);

    if (!parsed.success) {
      const hasTickerIssue = parsed.error.issues.some((issue) => issue.path[0] === "ticker");

      if (hasTickerIssue) {
        return NextResponse.json({ error: "Invalid ticker symbol" }, { status: 400 });
      }

      const message = parsed.error.issues[0]?.message ?? "Invalid request body";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { ticker, timeframe } = parsed.data;
    const language = parsed.data.language;

    const cachedResponse = await getCachedNewsResponse(ticker, timeframe, language);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    const ip = getClientIp(req);
    const { success } = await checkNewsRateLimit(ip);

    if (!success) {
      return NextResponse.json({ error: NEWS_RATE_LIMIT_ERROR }, { status: 429 });
    }

    let searchResponse;

    try {
      searchResponse = await fetchNewsFromTavily(ticker, timeframe);
    } catch (error: unknown) {
      console.error("Tavily API Error:", error);
      const mapped = mapApiError(error, "news search");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    if (searchResponse.results.length === 0) {
      const emptyResponse: CachedNewsResponse = {
        ticker,
        timeframe,
        sentiment: "Neutral",
        summary: [],
        sources: [],
      };

      await setCachedNewsResponse(ticker, timeframe, language, emptyResponse);
      return NextResponse.json(emptyResponse);
    }

    const newsContext = searchResponse.results
      .map((result) => `Title: ${result.title}\nContent: ${result.content}\nURL: ${result.url}`)
      .join("\n\n");

    let completion;

    try {
      completion = await analyzeNewsWithOpenAI(ticker, timeframe, newsContext, language);
    } catch (error: unknown) {
      console.error("OpenAI API Error:", error);
      const mapped = mapApiError(error, "AI analysis");
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }

    const aiAnalysis = JSON.parse(completion.choices[0].message.content || "{}");

    const response: CachedNewsResponse = {
      ticker,
      timeframe,
      sentiment: normalizeSentiment(aiAnalysis.sentiment),
      summary: Array.isArray(aiAnalysis.bullets) ? aiAnalysis.bullets : [],
      sources: searchResponse.results,
    };

    await setCachedNewsResponse(ticker, timeframe, language, response);

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("API Error:", error);
    const mapped = mapApiError(error, "news search");
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
