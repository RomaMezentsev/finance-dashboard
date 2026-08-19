import { z } from "zod";
import { isValidInstrumentInput } from "@/lib/instruments/ticker-meta";

export const AI_TICKER_MAX_LENGTH = 10;
export const AI_TICKER_PATTERN = /^[A-Z0-9.-]+$/i;

/** Strict ticker validation for AI routes (prompt injection protection). */
export const aiTickerSchema = z
  .string({ error: "Invalid ticker symbol" })
  .trim()
  .min(1, "Invalid ticker symbol")
  .max(AI_TICKER_MAX_LENGTH, "Invalid ticker symbol")
  .regex(AI_TICKER_PATTERN, "Invalid ticker symbol")
  .transform((value) => value.toUpperCase());

export const tickerSchema = z
  .string({ error: "Ticker is required" })
  .trim()
  .min(1, "Ticker is required")
  .max(12, "Ticker or ISIN must be at most 12 characters")
  .regex(/^[A-Za-z0-9]+$/, "Ticker must contain letters and numbers only")
  .transform((value) => value.toUpperCase())
  .refine((value) => isValidInstrumentInput(value), {
    message: "Invalid ticker or ISIN",
  });

export const languageSchema = z.enum(["en", "ru", "de"]).optional().default("ru");

export const tickersSchema = z
  .array(tickerSchema)
  .min(1, "At least one ticker is required")
  .max(20, "Maximum 20 tickers allowed");

export function getLanguageInstruction(language: "en" | "ru" | "de"): string {
  switch (language) {
    case "ru":
      return "Respond in Russian. Keep JSON keys in English.";
    case "de":
      return "Respond in German. Keep JSON keys in English.";
    case "en":
    default:
      return "Respond in English.";
  }
}
