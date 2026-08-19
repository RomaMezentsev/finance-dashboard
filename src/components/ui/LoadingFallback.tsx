"use client";

import { useTranslations } from "@/lib/i18n/use-translations";

export function LoadingFallback() {
  const { t } = useTranslations();

  return <div className="text-sm text-muted">{t.common.loading}</div>;
}
