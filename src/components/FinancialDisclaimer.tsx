"use client";

import { useTranslations } from "@/lib/i18n/use-translations";

type FinancialDisclaimerProps = {
  className?: string;
};

export function FinancialDisclaimer({ className = "" }: FinancialDisclaimerProps) {
  const { t } = useTranslations();

  return (
    <p
      className={`text-[11px] leading-5 text-muted/75 ${className}`.trim()}
      role="note"
      aria-label={t.legal.disclaimerAriaLabel}
    >
      {t.legal.disclaimer}
    </p>
  );
}
