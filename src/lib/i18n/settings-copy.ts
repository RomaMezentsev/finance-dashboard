import type { AppCurrency, AppLocale } from "@/types";

type SettingsCopy = {
  title: string;
  close: string;
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
    providerLabel: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    contentResponsibleLabel: string;
  };
  privacy: {
    heading: string;
    description: string;
    controllerLabel: string;
    dataProcessingLabel: string;
    localStorageLabel: string;
    rightsLabel: string;
  };
};

export const SETTINGS_COPY: Record<AppLocale, SettingsCopy> = {
  ru: {
    title: "Настройки",
    close: "Закрыть",
    tabs: {
      language: "Язык",
      impressum: "Impressum",
      privacy: "Datenschutz",
    },
    language: {
      heading: "Язык интерфейса и AI-ответов",
      description: "Выбранный язык сохраняется локально и используется для всех AI-запросов.",
      label: "Язык",
      appVersionLabel: "Версия приложения",
      options: {
        ru: "Русский",
        en: "English",
        de: "Deutsch",
      },
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
      heading: "Правовая информация",
      description: "Обязательные сведения об операторе сервиса (§ 5 TMG).",
      providerLabel: "Правообладатель",
      addressLabel: "Адрес",
      phoneLabel: "Телефон",
      emailLabel: "E-Mail",
      contentResponsibleLabel: "Ответственный за контент",
    },
    privacy: {
      heading: "Конфиденциальность (DSGVO)",
      description: "Как мы обрабатываем данные и какие у вас есть права.",
      controllerLabel: "Контролёр данных",
      dataProcessingLabel: "Обработка данных и API",
      localStorageLabel: "Local Storage",
      rightsLabel: "Ваши права",
    },
  },
  en: {
    title: "Settings",
    close: "Close",
    tabs: {
      language: "Language",
      impressum: "Impressum",
      privacy: "Privacy",
    },
    language: {
      heading: "Interface and AI response language",
      description: "Your selection is stored locally and applied to all AI requests.",
      label: "Language",
      appVersionLabel: "App version",
      options: {
        ru: "Russian",
        en: "English",
        de: "German",
      },
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
      heading: "Legal information",
      description: "Mandatory provider details (§ 5 TMG).",
      providerLabel: "Provider",
      addressLabel: "Address",
      phoneLabel: "Phone",
      emailLabel: "Email",
      contentResponsibleLabel: "Content responsible",
    },
    privacy: {
      heading: "Privacy (GDPR)",
      description: "How we process data and what rights you have.",
      controllerLabel: "Data controller",
      dataProcessingLabel: "Data processing & APIs",
      localStorageLabel: "Local storage",
      rightsLabel: "Your rights",
    },
  },
  de: {
    title: "Einstellungen",
    close: "Schließen",
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
      options: {
        ru: "Russisch",
        en: "Englisch",
        de: "Deutsch",
      },
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
      heading: "Rechtliche Informationen",
      description: "Pflichtangaben gemäß § 5 TMG.",
      providerLabel: "Anbieter",
      addressLabel: "Adresse",
      phoneLabel: "Telefon",
      emailLabel: "E-Mail",
      contentResponsibleLabel: "Inhaltlich verantwortlich",
    },
    privacy: {
      heading: "Datenschutz (DSGVO)",
      description: "Wie wir Daten verarbeiten und welche Rechte Sie haben.",
      controllerLabel: "Verantwortlicher",
      dataProcessingLabel: "Datenverarbeitung & APIs",
      localStorageLabel: "Local Storage",
      rightsLabel: "Ihre Rechte",
    },
  },
};

export const LOCALE_OPTIONS: AppLocale[] = ["ru", "en", "de"];

export const CURRENCY_OPTIONS: AppCurrency[] = ["USD", "EUR", "GBP", "CHF"];
