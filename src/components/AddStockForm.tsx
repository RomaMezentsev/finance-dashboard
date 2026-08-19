"use client";

import { FormEvent, useState } from "react";
import { isValidInstrumentInput } from "@/lib/instruments/ticker-meta";
import { useTranslations } from "@/lib/i18n/use-translations";

type AddStockFormProps = {
  onAdd: (ticker: string) => boolean;
};

export function AddStockForm({ onAdd }: AddStockFormProps) {
  const { t } = useTranslations();
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = ticker.trim().toUpperCase();

    if (!normalized) {
      setError(t.portfolio.errorEmpty);
      return;
    }

    if (!isValidInstrumentInput(normalized)) {
      setError(t.portfolio.errorInvalid);
      return;
    }

    const added = onAdd(normalized);
    if (!added) {
      setError(t.portfolio.errorDuplicate(normalized));
      return;
    }

    setTicker("");
    setError("");
  }

  return (
    <section className="rounded-3xl border border-card-border bg-card/80 p-6 backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">{t.portfolio.addStock}</h2>
        <p className="mt-2 text-sm text-muted">{t.portfolio.addStockHint}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-muted whitespace-nowrap">
            {t.portfolio.tickerSymbol}
          </span>
          <input
            value={ticker}
            onChange={(event) => {
              setTicker(event.target.value.toUpperCase());
              setError("");
            }}
            placeholder={t.portfolio.tickerPlaceholder}
            maxLength={12}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 font-mono text-lg uppercase tracking-[0.18em] text-white outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/10"
          />
        </label>

        <button
          type="submit"
          className="mt-auto shrink-0 rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:self-end"
        >
          {t.portfolio.addToPortfolio}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
    </section>
  );
}
