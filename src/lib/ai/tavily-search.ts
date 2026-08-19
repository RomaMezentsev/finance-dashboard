import { tvly } from "@/lib/ai/clients";
import { API_TIMEOUT_MS, withAbortTimeout } from "@/lib/api/with-abort-timeout";

type TavilySearchOptions = {
  query: string;
  timeRange?: "day" | "week" | "month";
  maxResults?: number;
  topic?: "general" | "news" | "finance";
};

export async function searchNewsContext({
  query,
  timeRange = "day",
  maxResults = 5,
  topic = "news",
}: TavilySearchOptions) {
  const response = await withAbortTimeout(async (signal) => {
    if (signal.aborted) {
      throw signal.reason ?? new DOMException("Search timed out", "TimeoutError");
    }

    return tvly.search(query, {
      searchDepth: "basic",
      topic,
      timeRange,
      maxResults,
      timeout: API_TIMEOUT_MS / 1000,
    });
  });

  const context = response.results
    .map((result) => `Title: ${result.title}\nContent: ${result.content}\nURL: ${result.url}`)
    .join("\n\n");

  return { results: response.results, context };
}

export async function searchEventsContext(ticker: string, companyName: string) {
  return searchNewsContext({
    query: `${companyName} ${ticker} next earnings date ex-dividend date 2026`,
    timeRange: "month",
    maxResults: 6,
    topic: "finance",
  });
}
