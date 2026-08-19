"use client";

import { useLocale } from "@/context/LocaleContext";
import { getTranslations, type Translations } from "@/lib/i18n/translations";

export function useTranslations(): { t: Translations; locale: ReturnType<typeof useLocale>["locale"] } {
  const { locale } = useLocale();
  return { t: getTranslations(locale), locale };
}
