"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_APP_LOCALE, loadLocaleFromStorage, saveLocaleToStorage } from "@/lib/i18n/locale-storage";
import type { AppLocale } from "@/types";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_APP_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(loadLocaleFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof document === "undefined") {
      return;
    }

    document.documentElement.lang = locale;
  }, [locale, ready]);

  const value = useMemo(
    () => ({
      locale,
      ready,
      setLocale: (nextLocale: AppLocale) => {
        setLocaleState(nextLocale);
        saveLocaleToStorage(nextLocale);
      },
    }),
    [locale, ready],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
