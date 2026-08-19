"use client";

import type { ReactNode } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale } from "@/context/LocaleContext";
import { CURRENCY_OPTIONS, LOCALE_OPTIONS, SETTINGS_COPY } from "@/lib/i18n/settings-copy";
import type { AppCurrency, AppLocale } from "@/types";

const APP_VERSION = "0.1.0";

export function SettingsTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border-b-2 pb-3 text-sm font-medium transition ${
        active
          ? "border-emerald-400 text-white"
          : "border-transparent text-muted hover:border-zinc-700 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function SettingsSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}

function SettingsRow({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="border-b border-zinc-800/60 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 sm:max-w-[45%]">
          <p className="text-sm font-medium text-white">{label}</p>
          {hint ? <p className="mt-1 text-xs leading-5 text-muted">{hint}</p> : null}
        </div>
        <div className="min-w-0 flex-1 text-sm leading-6 text-slate-200 sm:text-right">{children}</div>
      </div>
    </div>
  );
}

function LanguageSegmentedControl({
  locale,
  onSelect,
}: {
  locale: AppLocale;
  onSelect: (locale: AppLocale) => void;
}) {
  const copy = SETTINGS_COPY[locale];

  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-1 sm:justify-end">
      {LOCALE_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            locale === option
              ? "bg-emerald-400/15 text-emerald-300"
              : "text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          {copy.language.options[option]}
        </button>
      ))}
    </div>
  );
}

function CurrencySegmentedControl({
  currency,
  onSelect,
}: {
  currency: AppCurrency;
  onSelect: (currency: AppCurrency) => void;
}) {
  const { locale } = useLocale();
  const copy = SETTINGS_COPY[locale];

  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-1 sm:justify-end">
      {CURRENCY_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            currency === option
              ? "bg-emerald-400/15 text-emerald-300"
              : "text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          {copy.currency.options[option]}
        </button>
      ))}
    </div>
  );
}

export function LanguageSettingsPanel({
  locale,
  onSelect,
}: {
  locale: AppLocale;
  onSelect: (locale: AppLocale) => void;
}) {
  const copy = SETTINGS_COPY[locale];
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="space-y-10">
      <section>
        <SettingsSectionHeader title={copy.language.heading} description={copy.language.description} />

        <div>
          <SettingsRow label={copy.language.label}>
            <LanguageSegmentedControl locale={locale} onSelect={onSelect} />
          </SettingsRow>

          <SettingsRow label={copy.language.appVersionLabel}>
            <span className="font-mono text-muted">{APP_VERSION}</span>
          </SettingsRow>
        </div>

        <p className="mt-4 text-xs text-muted">{copy.language.savedHint}</p>
      </section>

      <section>
        <SettingsSectionHeader title={copy.currency.heading} description={copy.currency.description} />

        <div>
          <SettingsRow label={copy.currency.label}>
            <CurrencySegmentedControl currency={currency} onSelect={setCurrency} />
          </SettingsRow>
        </div>

        <p className="mt-4 text-xs text-muted">{copy.currency.savedHint}</p>
      </section>
    </div>
  );
}

export function ImpressumPanel() {
  const { locale } = useLocale();
  const copy = SETTINGS_COPY[locale];

  return (
    <section>
      <SettingsSectionHeader title={copy.impressum.heading} description={copy.impressum.description} />

      <div>
        <SettingsRow label={copy.impressum.providerLabel}>
          <div className="space-y-0.5 sm:text-right">
            <p>Investment Dashboard GmbH (Muster)</p>
          </div>
        </SettingsRow>

        <SettingsRow label={copy.impressum.addressLabel}>
          <div className="space-y-0.5 sm:text-right">
            <p>Musterstraße 12</p>
            <p>10115 Berlin, Deutschland</p>
          </div>
        </SettingsRow>

        <SettingsRow label={copy.impressum.phoneLabel}>
          <span>+49 (0)30 1234567</span>
        </SettingsRow>

        <SettingsRow label={copy.impressum.emailLabel}>
          <a
            href="mailto:kontakt@investment-dashboard.example"
            className="text-emerald-300 transition hover:text-emerald-200"
          >
            kontakt@investment-dashboard.example
          </a>
        </SettingsRow>

        <SettingsRow label={copy.impressum.contentResponsibleLabel}>
          <div className="space-y-0.5 sm:text-right">
            <p>Max Mustermann</p>
            <p className="text-muted">Musterstraße 12, 10115 Berlin</p>
          </div>
        </SettingsRow>
      </div>
    </section>
  );
}

export function PrivacyPanel() {
  const { locale } = useLocale();
  const copy = SETTINGS_COPY[locale];

  return (
    <section>
      <SettingsSectionHeader title={copy.privacy.heading} description={copy.privacy.description} />

      <div>
        <SettingsRow label={copy.privacy.controllerLabel}>
          <div className="space-y-0.5 sm:text-right">
            <p>Investment Dashboard GmbH (Muster)</p>
            <p className="text-muted">Musterstraße 12, 10115 Berlin</p>
            <a
              href="mailto:datenschutz@investment-dashboard.example"
              className="text-emerald-300 transition hover:text-emerald-200"
            >
              datenschutz@investment-dashboard.example
            </a>
          </div>
        </SettingsRow>

        <SettingsRow label={copy.privacy.dataProcessingLabel}>
          <p className="sm:text-right">
            Für News-Analysen werden Ticker-Symbole an unsere Server übermittelt und an externe Dienste
            (Tavily API, OpenAI API, Yahoo Finance) weitergegeben.
          </p>
        </SettingsRow>

        <SettingsRow label={copy.privacy.localStorageLabel}>
          <p className="sm:text-right">
            Wir speichern lokal im Browser u. a. `app_language`, `app_currency`, `user_watchlist` und Suchverlauf.
          </p>
        </SettingsRow>

        <SettingsRow label={copy.privacy.rightsLabel}>
          <p className="sm:text-right">
            Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und
            Datenübertragbarkeit gemäß Art. 15–21 DSGVO.
          </p>
        </SettingsRow>
      </div>
    </section>
  );
}

export function useSettingsCopy() {
  const { locale } = useLocale();
  return SETTINGS_COPY[locale];
}
