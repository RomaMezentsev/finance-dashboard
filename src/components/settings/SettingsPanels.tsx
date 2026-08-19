"use client";

import type { ReactNode } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  IMPRESSUM_OPERATOR_NAME,
  IMPRESSUM_PROJECT_EMAIL,
} from "@/lib/legal/impressum-config";
import { CURRENCY_OPTIONS, LOCALE_OPTIONS } from "@/lib/i18n/settings-legal";
import { useTranslations } from "@/lib/i18n/use-translations";
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
  const { t } = useTranslations();

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
          {t.settings.language.options[option]}
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
  const { t } = useTranslations();

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
          {t.settings.currency.options[option]}
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
  const { t } = useTranslations();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="space-y-10">
      <section>
        <SettingsSectionHeader
          title={t.settings.language.heading}
          description={t.settings.language.description}
        />

        <div>
          <SettingsRow label={t.settings.language.label}>
            <LanguageSegmentedControl locale={locale} onSelect={onSelect} />
          </SettingsRow>

          <SettingsRow label={t.settings.language.appVersionLabel}>
            <span className="font-mono text-muted">{APP_VERSION}</span>
          </SettingsRow>
        </div>

        <p className="mt-4 text-xs text-muted">{t.settings.language.savedHint}</p>
      </section>

      <section>
        <SettingsSectionHeader
          title={t.settings.currency.heading}
          description={t.settings.currency.description}
        />

        <div>
          <SettingsRow label={t.settings.currency.label}>
            <CurrencySegmentedControl currency={currency} onSelect={setCurrency} />
          </SettingsRow>
        </div>

        <p className="mt-4 text-xs text-muted">{t.settings.currency.savedHint}</p>
      </section>
    </div>
  );
}

export function ImpressumPanel() {
  const { t } = useTranslations();
  const copy = t.settings.impressum;

  return (
    <section>
      <SettingsSectionHeader title={copy.heading} description={copy.description} />

      <div>
        <SettingsRow label={copy.operatorLabel}>
          <p className="sm:text-right">{IMPRESSUM_OPERATOR_NAME}</p>
        </SettingsRow>

        <SettingsRow label={copy.contactLabel}>
          <a
            href={`mailto:${IMPRESSUM_PROJECT_EMAIL}`}
            className="text-emerald-300 transition hover:text-emerald-200 sm:text-right"
          >
            {IMPRESSUM_PROJECT_EMAIL}
          </a>
        </SettingsRow>

        <SettingsRow label={copy.addressLabel}>
          <p className="sm:text-right">{copy.addressText}</p>
        </SettingsRow>

        <SettingsRow label={copy.contentResponsibleLabel}>
          <p className="sm:text-right">{IMPRESSUM_OPERATOR_NAME}</p>
        </SettingsRow>

        <SettingsRow label={copy.liabilityDisclaimerLabel}>
          <p className="sm:text-right">{copy.liabilityDisclaimerText}</p>
        </SettingsRow>
      </div>
    </section>
  );
}

export function PrivacyPanel() {
  const { t } = useTranslations();
  const copy = t.settings.privacy;

  return (
    <section>
      <SettingsSectionHeader title={copy.heading} description={copy.description} />

      <div>
        <SettingsRow label={copy.controllerLabel}>
          <div className="space-y-0.5 sm:text-right">
            <p>{IMPRESSUM_OPERATOR_NAME}</p>
            <a
              href={`mailto:${IMPRESSUM_PROJECT_EMAIL}`}
              className="text-emerald-300 transition hover:text-emerald-200"
            >
              {IMPRESSUM_PROJECT_EMAIL}
            </a>
          </div>
        </SettingsRow>

        <SettingsRow label={copy.cookiesLabel}>
          <p className="sm:text-right">{copy.cookiesText}</p>
        </SettingsRow>

        <SettingsRow label={copy.localStorageLabel}>
          <p className="sm:text-right">{copy.localStorageText}</p>
        </SettingsRow>

        <SettingsRow label={copy.hostingLabel}>
          <p className="sm:text-right">{copy.hostingText}</p>
        </SettingsRow>

        <SettingsRow label={copy.thirdPartyLabel}>
          <p className="sm:text-right">{copy.thirdPartyText}</p>
        </SettingsRow>

        <SettingsRow label={copy.legalBasisLabel}>
          <p className="sm:text-right">{copy.legalBasisText}</p>
        </SettingsRow>

        <SettingsRow label={copy.rightsLabel}>
          <p className="sm:text-right">{copy.rightsText}</p>
        </SettingsRow>
      </div>
    </section>
  );
}

export function useSettingsCopy() {
  const { t } = useTranslations();
  return t.settings;
}
