import type { AppCurrency, AppLocale } from "@/types";
import {
  IMPRESSUM_OPERATOR_NAME,
  IMPRESSUM_PROJECT_EMAIL,
} from "@/lib/legal/impressum-config";

export type SettingsTranslations = {
  title: string;
  tabs: {
    language: string;
    impressum: string;
    privacy: string;
  };
  language: {
    heading: string;
    description: string;
    label: string;
    appVersionLabel: string;
    options: Record<AppLocale, string>;
    savedHint: string;
  };
  currency: {
    heading: string;
    description: string;
    label: string;
    savedHint: string;
    options: Record<AppCurrency, string>;
  };
  impressum: {
    heading: string;
    description: string;
    operatorLabel: string;
    contactLabel: string;
    addressLabel: string;
    addressText: string;
    contentResponsibleLabel: string;
    liabilityDisclaimerLabel: string;
    liabilityDisclaimerText: string;
  };
  privacy: {
    heading: string;
    description: string;
    controllerLabel: string;
    cookiesLabel: string;
    cookiesText: string;
    localStorageLabel: string;
    localStorageText: string;
    hostingLabel: string;
    hostingText: string;
    thirdPartyLabel: string;
    thirdPartyText: string;
    legalBasisLabel: string;
    legalBasisText: string;
    rightsLabel: string;
    rightsText: string;
  };
};

export type LegalTranslations = {
  disclaimer: string;
  disclaimerAriaLabel: string;
};

export const LOCALE_OPTIONS: AppLocale[] = ["ru", "en", "de"];
export const CURRENCY_OPTIONS: AppCurrency[] = ["USD", "EUR", "GBP", "CHF"];

const sharedEmail = IMPRESSUM_PROJECT_EMAIL;

export const SETTINGS_BY_LOCALE: Record<AppLocale, SettingsTranslations> = {
  ru: {
    title: "Настройки",
    tabs: {
      language: "Язык",
      impressum: "Правовая информация",
      privacy: "Конфиденциальность",
    },
    language: {
      heading: "Язык интерфейса и AI-ответов",
      description: "Выбранный язык сохраняется локально и используется для всех AI-запросов.",
      label: "Язык",
      appVersionLabel: "Версия приложения",
      options: { ru: "Русский", en: "English", de: "Deutsch" },
      savedHint: "Язык сохранён в localStorage.",
    },
    currency: {
      heading: "Валюта отображения",
      description: "Цены акций и ETF пересчитываются по актуальному курсу относительно USD.",
      label: "Валюта",
      savedHint: "Валюта сохранена в localStorage.",
      options: {
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CHF: "CHF",
      },
    },
    impressum: {
      heading: "Правовая информация (Impressum)",
      description: "Сведения об операторе в соответствии с § 5 DDG (бывш. TMG) для бета-теста.",
      operatorLabel: "Оператор",
      contactLabel: "Контакт",
      addressLabel: "Адрес",
      addressText: "Частная бета-тестовая фаза (некоммерческий демонстрационный проект)",
      contentResponsibleLabel: "Ответственный за контент (§ 18 Abs. 2 MStV)",
      liabilityDisclaimerLabel: "Отказ от ответственности",
      liabilityDisclaimerText:
        "Представленная информация и AI-анализы не являются инвестиционной рекомендацией или призывом к покупке/продаже. За точность данных третьих лиц (API) ответственность не несётся.",
    },
    privacy: {
      heading: "Конфиденциальность (DSGVO / GDPR)",
      description: "Информация об обработке данных в рамках бесплатного бета-теста.",
      controllerLabel: "Контролёр данных",
      cookiesLabel: "Cookies",
      cookiesText:
        "Мы не используем cookies и не применяем сторонние cookie-трекеры. Сессионные данные не сохраняются на сервере для профилирования.",
      localStorageLabel: "localStorage (только на вашем устройстве)",
      localStorageText:
        "Настройки языка (`app_language`), валюты (`app_currency`), watchlist (`user_watchlist`) и история поиска хранятся исключительно в браузере на вашем устройстве. Эти данные не передаются на наш сервер, пока вы сами не инициируете запрос (например, AI-анализ тикера).",
      hostingLabel: "Хостинг (Vercel)",
      hostingText:
        "Приложение размещено на Vercel Inc. При обращении к сайту могут обрабатываться технические серверные логи (IP-адрес, время запроса, User-Agent, URL) для обеспечения безопасности и стабильности. Подробности: политика конфиденциальности Vercel.",
      thirdPartyLabel: "Внешние API (OpenAI, Tavily, Upstash)",
      thirdPartyText:
        "При запуске AI-анализа или поиска передаются минимально необходимые данные: символы тикеров и обезличенные поисковые запросы. Обработка выполняется через OpenAI API (генерация текста), Tavily API (поиск новостей) и Upstash Redis (ограничение частоты запросов по IP). Персональные профили пользователей не создаются; регистрация отсутствует.",
      legalBasisLabel: "Правовое основание (Rechtsgrundlage)",
      legalBasisText:
        "Art. 6 Abs. 1 lit. f GDPR (законный интерес в безопасной и работоспособной работе приложения) — для технической обработки серверных логов и запросов к внешним API.",
      rightsLabel: "Ваши права",
      rightsText:
        "Вы имеете права на доступ, исправление, удаление, ограничение обработки, возражение и переносимость данных согласно ст. 15–21 GDPR. Обращения: " +
        sharedEmail +
        ". localStorage можно очистить в настройках браузера.",
    },
  },
  en: {
    title: "Settings",
    tabs: {
      language: "Language",
      impressum: "Legal notice",
      privacy: "Privacy",
    },
    language: {
      heading: "Interface and AI response language",
      description: "Your selection is stored locally and applied to all AI requests.",
      label: "Language",
      appVersionLabel: "App version",
      options: { ru: "Russian", en: "English", de: "German" },
      savedHint: "Language saved to localStorage.",
    },
    currency: {
      heading: "Display currency",
      description: "Stock and ETF prices are converted using live FX rates against USD.",
      label: "Currency",
      savedHint: "Currency saved to localStorage.",
      options: {
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CHF: "CHF",
      },
    },
    impressum: {
      heading: "Legal notice (Impressum)",
      description: "Provider information under § 5 DDG (formerly TMG) for the free beta test.",
      operatorLabel: "Operator",
      contactLabel: "Contact",
      addressLabel: "Address",
      addressText: "Private beta test phase (non-commercial demonstration project)",
      contentResponsibleLabel: "Content responsible (§ 18 Abs. 2 MStV)",
      liabilityDisclaimerLabel: "Liability disclaimer",
      liabilityDisclaimerText:
        "The information and AI analyses provided do not constitute investment advice or a solicitation to buy or sell. No liability is assumed for the accuracy of third-party data (APIs).",
    },
    privacy: {
      heading: "Privacy (GDPR / DSGVO)",
      description: "How data is processed during the free beta test.",
      controllerLabel: "Data controller",
      cookiesLabel: "Cookies",
      cookiesText:
        "We do not use cookies or third-party cookie trackers. No server-side session profiling is performed.",
      localStorageLabel: "localStorage (client-side only)",
      localStorageText:
        "Language (`app_language`), currency (`app_currency`), watchlist (`user_watchlist`), and search history are stored only in your browser on your device. This data is not sent to our server until you initiate a request (e.g. AI analysis for a ticker).",
      hostingLabel: "Hosting (Vercel)",
      hostingText:
        "The app is hosted on Vercel Inc. When you access the site, technical server logs (IP address, request time, User-Agent, URL) may be processed for security and reliability. See Vercel's privacy policy for details.",
      thirdPartyLabel: "Third-party APIs (OpenAI, Tavily, Upstash)",
      thirdPartyText:
        "When you run AI analysis or search, we transmit the minimum data required: ticker symbols and anonymised search queries. Processing is done via OpenAI API (text generation), Tavily API (news search), and Upstash Redis (IP rate limiting). No user accounts or personal profiles are created.",
      legalBasisLabel: "Legal basis (Rechtsgrundlage)",
      legalBasisText:
        "Art. 6(1)(f) GDPR (legitimate interest in the secure and functional provision of the application) — for technical processing of server logs and requests to external APIs.",
      rightsLabel: "Your rights",
      rightsText:
        "You have the right to access, rectification, erasure, restriction, objection, and data portability under Art. 15–21 GDPR. Contact: " +
        sharedEmail +
        ". You can clear localStorage in your browser settings.",
    },
  },
  de: {
    title: "Einstellungen",
    tabs: {
      language: "Sprache",
      impressum: "Impressum",
      privacy: "Datenschutz",
    },
    language: {
      heading: "Sprache für UI und KI-Antworten",
      description: "Ihre Auswahl wird lokal gespeichert und für alle KI-Anfragen verwendet.",
      label: "Sprache",
      appVersionLabel: "App-Version",
      options: { ru: "Russisch", en: "Englisch", de: "Deutsch" },
      savedHint: "Sprache in localStorage gespeichert.",
    },
    currency: {
      heading: "Anzeigewährung",
      description: "Aktien- und ETF-Preise werden mit aktuellen FX-Kursen gegen USD umgerechnet.",
      label: "Währung",
      savedHint: "Währung in localStorage gespeichert.",
      options: {
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CHF: "CHF",
      },
    },
    impressum: {
      heading: "Impressum",
      description: "Angaben gemäß § 5 DDG (ehem. TMG) für den kostenlosen Beta-Test.",
      operatorLabel: "Betreiber",
      contactLabel: "Kontakt",
      addressLabel: "Anschrift",
      addressText: "Private Beta-Testphase (Nicht-kommerzielles Demonstrationsprojekt)",
      contentResponsibleLabel: "Inhaltlich verantwortlich (§ 18 Abs. 2 MStV)",
      liabilityDisclaimerLabel: "Haftungsausschluss",
      liabilityDisclaimerText:
        "Die bereitgestellten Informationen und AI-Analysen stellen keine Anlageberatung oder Aufforderung zum Kauf/Verkauf dar. Für die Richtigkeit der Daten Dritter (APIs) wird keine Haftung übernommen.",
    },
    privacy: {
      heading: "Datenschutzerklärung (DSGVO)",
      description: "Informationen zur Datenverarbeitung im kostenlosen Beta-Test.",
      controllerLabel: "Verantwortlicher",
      cookiesLabel: "Cookies",
      cookiesText:
        "Wir setzen keine Cookies ein und verwenden keine Cookie-Tracker Dritter. Es findet kein serverseitiges Session-Profiling statt.",
      localStorageLabel: "localStorage (nur clientseitig)",
      localStorageText:
        "Sprache (`app_language`), Währung (`app_currency`), Watchlist (`user_watchlist`) und Suchverlauf werden ausschließlich lokal in Ihrem Browser gespeichert. Diese Daten werden nicht an unseren Server übertragen, bis Sie selbst eine Anfrage auslösen (z. B. KI-Analyse für einen Ticker).",
      hostingLabel: "Hosting (Vercel)",
      hostingText:
        "Die Anwendung wird bei Vercel Inc. gehostet. Beim Aufruf der Website können technische Server-Logdaten (IP-Adresse, Zeitpunkt, User-Agent, URL) zur Sicherheit und Stabilität verarbeitet werden. Details: Datenschutzerklärung von Vercel.",
      thirdPartyLabel: "Externe APIs (OpenAI, Tavily, Upstash)",
      thirdPartyText:
        "Bei KI-Analysen oder Suche übermitteln wir nur die minimal erforderlichen Daten: Ticker-Symbole und anonymisierte Suchanfragen. Die Verarbeitung erfolgt über OpenAI API (Textgenerierung), Tavily API (News-Suche) und Upstash Redis (IP-basiertes Rate Limiting). Es werden keine Nutzerkonten oder personenbezogenen Profile angelegt.",
      legalBasisLabel: "Rechtsgrundlage",
      legalBasisText:
        "Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an der sicheren und funktionsfähigen Bereitstellung der Anwendung) — für die technische Verarbeitung von Server-Logdaten und API-Anfragen.",
      rightsLabel: "Ihre Rechte",
      rightsText:
        "Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit gemäß Art. 15–21 DSGVO. Kontakt: " +
        sharedEmail +
        ". localStorage können Sie in den Browser-Einstellungen löschen.",
    },
  },
};

export const LEGAL_BY_LOCALE: Record<AppLocale, LegalTranslations> = {
  ru: {
    disclaimer:
      "Не является инвестиционной рекомендацией. Материалы предназначены только для информационных целей.",
    disclaimerAriaLabel: "Отказ от ответственности",
  },
  en: {
    disclaimer: "No investment advice. Content is for informational purposes only.",
    disclaimerAriaLabel: "Disclaimer",
  },
  de: {
    disclaimer: "Keine Anlageberatung. Die Inhalte dienen nur zu Informationszwecken.",
    disclaimerAriaLabel: "Haftungsausschluss",
  },
};

export const COMMON_BY_LOCALE: Record<AppLocale, { loading: string }> = {
  ru: { loading: "Загрузка…" },
  en: { loading: "Loading…" },
  de: { loading: "Wird geladen…" },
};

/** Re-export for panels that display operator identity. */
export { IMPRESSUM_OPERATOR_NAME, IMPRESSUM_PROJECT_EMAIL } from "@/lib/legal/impressum-config";
