import OpenAI from "openai";

type ApiErrorResult = {
  message: string;
  status: 400 | 429 | 504 | 500;
};

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === "AbortError" || error.name === "TimeoutError";
  }

  if (error instanceof OpenAI.APIUserAbortError) {
    return true;
  }

  return false;
}

function isTimeoutError(error: unknown): boolean {
  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("timed out") || message.includes("timeout");
  }

  return false;
}

function isRateLimitError(error: unknown): boolean {
  if (error instanceof OpenAI.RateLimitError) {
    return true;
  }

  if (error instanceof OpenAI.APIError && error.status === 429) {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("rate limit") || message.includes("429");
  }

  return false;
}

function isBadRequestError(error: unknown): boolean {
  if (error instanceof OpenAI.BadRequestError) {
    return true;
  }

  if (error instanceof OpenAI.APIError && error.status === 400) {
    return true;
  }

  return false;
}

export function mapApiError(error: unknown, provider: "news search" | "AI analysis"): ApiErrorResult {
  if (isAbortError(error) || isTimeoutError(error)) {
    return {
      message: `${provider === "news search" ? "News search" : "AI analysis"} timed out. Please try again.`,
      status: 504,
    };
  }

  if (isRateLimitError(error)) {
    return {
      message: `${provider === "news search" ? "News search" : "AI analysis"} rate limit exceeded. Please try again shortly.`,
      status: 429,
    };
  }

  if (isBadRequestError(error)) {
    return {
      message:
        error instanceof Error
          ? error.message
          : `Invalid request to ${provider === "news search" ? "news search" : "AI analysis"} provider.`,
      status: 400,
    };
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: "Failed to fetch news",
    status: 500,
  };
}
