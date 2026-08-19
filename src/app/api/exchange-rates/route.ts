import { NextResponse } from "next/server";
import type { AppCurrency } from "@/types";

const CACHE_TTL_MS = 30 * 60 * 1000;

type RatesCache = {
  rates: Record<AppCurrency, number>;
  expiresAt: number;
};

let cache: RatesCache | null = null;

const FALLBACK_RATES: Record<AppCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
};

type ExchangeRateResponse = {
  base?: string;
  rates?: Record<string, number>;
};

function normalizeRates(data: ExchangeRateResponse): Record<AppCurrency, number> {
  const source = data.rates ?? {};

  return {
    USD: 1,
    EUR: source.EUR ?? FALLBACK_RATES.EUR,
    GBP: source.GBP ?? FALLBACK_RATES.GBP,
    CHF: source.CHF ?? FALLBACK_RATES.CHF,
  };
}

export async function GET() {
  if (cache && cache.expiresAt > Date.now()) {
    return NextResponse.json(
      { base: "USD", rates: cache.rates },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      },
    );
  }

  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error("Exchange rate API unavailable");
    }

    const data = (await response.json()) as ExchangeRateResponse;
    const rates = normalizeRates(data);

    cache = {
      rates,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return NextResponse.json(
      { base: "USD", rates },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Exchange rates error:", error);

    return NextResponse.json(
      { base: "USD", rates: FALLBACK_RATES, fallback: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  }
}
