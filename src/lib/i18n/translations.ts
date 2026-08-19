import type {
  AppLocale,
  InsiderActivity,
  InsiderTrade,
  NewsSentiment,
  NewsTimeframe,
  UpcomingEvent,
  ValuationStatus,
} from "@/types";
import {
  COMMON_BY_LOCALE,
  LEGAL_BY_LOCALE,
  SETTINGS_BY_LOCALE,
  type LegalTranslations,
  type SettingsTranslations,
} from "@/lib/i18n/settings-legal";

export type Translations = {
  dashboard: {
    brand: string;
    title: string;
    subtitle: string;
    holdings: string;
    portfolio: string;
    avgChange: string;
    fetchNewsError: string;
    loadingWatchlist: string;
  };
  nav: {
    home: string;
    search: string;
    settings: string;
    ariaLabel: string;
  };
  search: {
    title: string;
    subtitle: string;
    placeholder: string;
    history: string;
    clearHistory: string;
    emptyHistory: string;
    popular: string;
    addToWatchlist: string;
    goToAnalysis: string;
    alreadyInWatchlist: string;
    loading: string;
  };
  tabs: {
    portfolio: string;
    news: string;
    ariaLabel: string;
  };
  portfolio: {
    yourHoldings: string;
    emptyHint: string;
    positionsOne: string;
    positionsMany: (count: number) => string;
    emptyTitle: string;
    emptySubtitle: string;
    watchlistEmptyTitle: string;
    watchlistEmptySubtitle: string;
    watchlistFindStock: string;
    watchlistQuickAdd: string;
    addStock: string;
    addStockHint: string;
    tickerSymbol: string;
    tickerPlaceholder: string;
    addToPortfolio: string;
    errorEmpty: string;
    errorInvalid: string;
    errorDuplicate: (ticker: string) => string;
    lastPrice: string;
    remove: string;
    removeAria: (ticker: string) => string;
    etfBadge: string;
  };
  quotes: {
    title: string;
    delayed: string;
    loading: string;
    unavailable: string;
    avgChange: string;
  };
  news: {
    title: string;
    subtitle: string;
    tickerSymbol: string;
    tickerPlaceholder: string;
    analyzeNews: string;
    refreshAnalysis: string;
    rateLimitError: string;
    cooldownSeconds: (seconds: number) => string;
    timeframe: string;
    quickSelect: string;
    activeTicker: string;
    inWatchlist: string;
    addToWatchlist: string;
    somethingWrong: string;
    fetchError: string;
    noNewsTitle: string;
    noNewsMessage: (ticker: string) => string;
    thisTicker: string;
    noAnalysisTitle: string;
    noAnalysisHint: string;
    analyzing: (ticker: string) => string;
    analyzingFallback: string;
    fetchingSources: string;
    aiBriefing: string;
    keyTakeaways: string;
    noBullets: string;
    copyAnalysis: string;
    copied: string;
    sources: string;
    untitledSource: string;
    open: string;
    noSources: string;
    copyTicker: string;
    copySentiment: string;
    copyKeyTakeaways: string;
    copyNoBullets: string;
  };
  timeframe: Record<NewsTimeframe, string>;
  metrics: {
    keyMetrics: string;
    mockData: string;
    marketCap: string;
    peRatio: string;
    week52Range: string;
  };
  chart: {
    liveChart: string;
    area: string;
  };
  insider: {
    smartMoney: string;
    title: string;
    noTrades: string;
    loadError: string;
  };
  earnings: {
    title: string;
    revenueEps: string;
    bullishHighlights: string;
    keyRisks: string;
    noItems: string;
    loadError: string;
  };
  asset: {
    back: string;
  };
  legal: LegalTranslations;
  settings: SettingsTranslations;
  common: {
    loading: string;
  };
  portfolioImpact: {
    label: string;
    title: string;
    sentimentScore: string;
    loadError: string;
  };
  valuation: {
    target: string;
  };
  events: {
    upcoming: string;
    calendar: string;
    inDays: (days: number) => string;
    today: string;
    completed: string;
    earningsOn: (date: string) => string;
    dividendOn: (date: string) => string;
    loadError: string;
    empty: string;
  };
  enums: {
    sentiment: Record<NewsSentiment, string>;
    valuation: Record<ValuationStatus, string>;
    netActivity: Record<InsiderActivity["netActivity"], string>;
    tradeAction: Record<InsiderTrade["action"], string>;
    earningsStatus: Record<"Beat" | "Missed" | "Inline" | "Unknown", string>;
    eventType: Record<UpcomingEvent["type"], string>;
  };
};

const ru: Translations = {
  dashboard: {
    brand: "Investment Dashboard",
    title: "Ежедневный обзор",
    subtitle: "Главное по портфелю за 15 секунд.",
    holdings: "Позиции",
    portfolio: "Портфель",
    avgChange: "Ср. изменение",
    fetchNewsError: "Не удалось загрузить новости",
    loadingWatchlist: "Загрузка Watchlist…",
  },
  nav: {
    home: "Главная",
    search: "Поиск",
    settings: "Настройки",
    ariaLabel: "Основная навигация",
  },
  search: {
    title: "Поиск",
    subtitle: "Найдите тикер, ETF или индекс",
    placeholder: "Введите тикер или название...",
    history: "История поиска",
    clearHistory: "Очистить",
    emptyHistory: "История пуста",
    popular: "Популярные активы и индексы",
    addToWatchlist: "Добавить в Watchlist",
    goToAnalysis: "Перейти к AI-анализу",
    alreadyInWatchlist: "Уже в Watchlist",
    loading: "Поиск...",
  },
  tabs: {
    portfolio: "Мой портфель",
    news: "Новости рынка",
    ariaLabel: "Разделы дашборда",
  },
  portfolio: {
    yourHoldings: "Ваши позиции",
    emptyHint: "Пока нет акций. Добавьте первый тикер выше.",
    positionsOne: "1 позиция в избранном. Нажмите на карточку для анализа новостей.",
    positionsMany: (count) =>
      `${count} позиций в избранном. Нажмите на карточку для анализа новостей.`,
    emptyTitle: "Портфель пуст",
    emptySubtitle: "Добавьте тикер через поиск или форму выше.",
    watchlistEmptyTitle: "Ваш список отслеживания пуст",
    watchlistEmptySubtitle:
      "Добавляйте акции и ETF, чтобы следить за котировками и AI-аналитикой в реальном времени",
    watchlistFindStock: "Найти акцию",
    watchlistQuickAdd: "Быстрый старт",
    addStock: "Добавить акцию",
    addStockHint: "Введите тикер для добавления в портфель. Например NVDA, AAPL или MSFT.",
    tickerSymbol: "Тикер",
    tickerPlaceholder: "напр. NVDA или EUNL",
    addToPortfolio: "Добавить в портфель",
    errorEmpty: "Введите тикер или ISIN, например NVDA или EUNL.",
    errorInvalid: "Тикер (1–5 букв), ETF (EUNL, VOO) или ISIN (12 символов).",
    errorDuplicate: (ticker) => `${ticker} уже есть в портфеле.`,
    lastPrice: "Последняя цена",
    remove: "Удалить",
    removeAria: (ticker) => `Удалить ${ticker}`,
    etfBadge: "ETF",
  },
  quotes: {
    title: "Котировки",
    delayed: "Задержка ~15 мин · обновление каждые 30 сек",
    loading: "Загрузка...",
    unavailable: "Котировки временно недоступны",
    avgChange: "Среднее изменение",
  },
  news: {
    title: "Новости рынка",
    subtitle: "Найдите тикер для AI-сентимента, кратких выводов и ссылок на источники.",
    tickerSymbol: "Тикер",
    tickerPlaceholder: "напр. MP",
    analyzeNews: "Анализировать",
    refreshAnalysis: "Обновить анализ",
    rateLimitError: "Слишком много запросов. Попробуйте через 10 минут.",
    cooldownSeconds: (seconds) => `Повтор через ${seconds} с`,
    timeframe: "За период",
    quickSelect: "Быстрый выбор",
    activeTicker: "Активный тикер",
    inWatchlist: "В избранном",
    addToWatchlist: "В избранное",
    somethingWrong: "Что-то пошло не так",
    fetchError: "Не удалось загрузить новости, попробуйте снова",
    noNewsTitle: "Новостей нет",
    noNewsMessage: (ticker) => `Свежих новостей для ${ticker} не найдено`,
    thisTicker: "этого тикера",
    noAnalysisTitle: "Анализ ещё не готов",
    noAnalysisHint:
      "Нажмите «Анализировать», чтобы запустить AI-дайджест по новостям выбранного тикера.",
    analyzing: (ticker) => `Анализ новостей ${ticker}...`,
    analyzingFallback: "тикера",
    fetchingSources: "Загрузка источников и генерация сентимента.",
    aiBriefing: "AI-Аналитика",
    keyTakeaways: "Главные тезисы",
    noBullets: "Краткие выводы для этого тикера не сгенерированы.",
    copyAnalysis: "Скопировать",
    copied: "Скопировано!",
    sources: "Источники",
    untitledSource: "Без названия",
    open: "Открыть",
    noSources: "Ссылки на источники не найдены.",
    copyTicker: "Тикер",
    copySentiment: "Сентимент",
    copyKeyTakeaways: "Главные тезисы",
    copyNoBullets: "Краткие выводы недоступны.",
  },
  timeframe: {
    "24h": "24 часа",
    week: "Неделя",
    month: "Месяц",
  },
  metrics: {
    keyMetrics: "Ключевые метрики",
    mockData: "Демо-данные",
    marketCap: "Капитализация",
    peRatio: "P/E",
    week52Range: "Диапазон 52 нед.",
  },
  chart: {
    liveChart: "График онлайн",
    area: "Область",
  },
  insider: {
    smartMoney: "Смарт-мани",
    title: "Сделки инсайдеров и фондов",
    noTrades: "Недавних сделок Form 4 в контексте AI не найдено.",
    loadError: "Не удалось загрузить активность инсайдеров",
  },
  earnings: {
    title: "Отчётность и SEC",
    revenueEps: "Выручка / EPS",
    bullishHighlights: "Позитивные моменты",
    keyRisks: "Ключевые риски",
    noItems: "Нет данных.",
    loadError: "Не удалось загрузить отчётность",
  },
  asset: {
    back: "Назад",
  },
  legal: LEGAL_BY_LOCALE.ru,
  settings: SETTINGS_BY_LOCALE.ru,
  common: COMMON_BY_LOCALE.ru,
  portfolioImpact: {
    label: "Влияние на портфель",
    title: "Пульс рынка за 24ч для ваших позиций",
    sentimentScore: "Оценка сентимента",
    loadError: "Не удалось загрузить сводку",
  },
  valuation: {
    target: "Цель",
  },
  events: {
    upcoming: "Ближайшие события",
    calendar: "Календарь отчётности и дивидендов",
    inDays: (days) => `через ${days} дн.`,
    today: "Сегодня",
    completed: "Отчёт завершён",
    earningsOn: (date) => `Отчётность: ${date}`,
    dividendOn: (date) => `Экс-дивиденд: ${date}`,
    loadError: "Не удалось загрузить календарь",
    empty: "Ближайших событий не найдено",
  },
  enums: {
    sentiment: {
      Bullish: "Бычий",
      Bearish: "Медвежий",
      Neutral: "Нейтральный",
    },
    valuation: {
      Undervalued: "Недооценена",
      "Fairly Valued": "Справедливая",
      Overvalued: "Переоценена",
    },
    netActivity: {
      "Net Insider Buying": "Покупки инсайдеров",
      "Net Insider Selling": "Продажи инсайдеров",
      Neutral: "Нейтрально",
    },
    tradeAction: {
      Buy: "Покупка",
      Sell: "Продажа",
    },
    earningsStatus: {
      Beat: "Выше прогноза",
      Missed: "Ниже прогноза",
      Inline: "В прогнозе",
      Unknown: "Неизвестно",
    },
    eventType: {
      Earnings: "Отчётность",
      "Ex-Dividend": "Экс-дивиденд",
    },
  },
};

const en: Translations = {
  dashboard: {
    brand: "Investment Dashboard",
    title: "Daily market routine",
    subtitle: "Your portfolio essentials in 15 seconds.",
    holdings: "Holdings",
    portfolio: "Portfolio",
    avgChange: "Avg. change",
    fetchNewsError: "Failed to fetch news",
    loadingWatchlist: "Loading watchlist…",
  },
  nav: {
    home: "Home",
    search: "Search",
    settings: "Settings",
    ariaLabel: "Main navigation",
  },
  search: {
    title: "Search",
    subtitle: "Find a ticker, ETF, or index",
    placeholder: "Enter ticker or name...",
    history: "Search history",
    clearHistory: "Clear",
    emptyHistory: "No recent searches",
    popular: "Popular assets & indices",
    addToWatchlist: "Add to Watchlist",
    goToAnalysis: "Go to AI analysis",
    alreadyInWatchlist: "Already in Watchlist",
    loading: "Searching...",
  },
  tabs: {
    portfolio: "My Portfolio",
    news: "Market News",
    ariaLabel: "Dashboard sections",
  },
  portfolio: {
    yourHoldings: "Your holdings",
    emptyHint: "No stocks yet. Add your first ticker above.",
    positionsOne: "1 position in your watchlist. Click a card to analyze news.",
    positionsMany: (count) =>
      `${count} positions in your watchlist. Click a card to analyze news.`,
    emptyTitle: "Portfolio is empty",
    emptySubtitle: "Add a ticker from search or the form above.",
    watchlistEmptyTitle: "Your watchlist is empty",
    watchlistEmptySubtitle:
      "Add stocks and ETFs to track live quotes and AI analytics in real time",
    watchlistFindStock: "Find a stock",
    watchlistQuickAdd: "Quick start",
    addStock: "Add a stock",
    addStockHint: "Enter a ticker to add it to your portfolio. Try NVDA, AAPL, or MSFT.",
    tickerSymbol: "Ticker symbol",
    tickerPlaceholder: "e.g. NVDA or EUNL",
    addToPortfolio: "Add to portfolio",
    errorEmpty: "Enter a ticker or ISIN, e.g. NVDA or EUNL.",
    errorInvalid: "Ticker (1–5 letters), ETF (EUNL, VOO), or ISIN (12 chars).",
    errorDuplicate: (ticker) => `${ticker} is already in your portfolio.`,
    lastPrice: "Last price",
    remove: "Remove",
    removeAria: (ticker) => `Remove ${ticker}`,
    etfBadge: "ETF",
  },
  quotes: {
    title: "Live quotes",
    delayed: "Delayed ~15 min · refreshes every 30s",
    loading: "Loading...",
    unavailable: "Quotes temporarily unavailable",
    avgChange: "Avg. daily change",
  },
  news: {
    title: "Market News",
    subtitle: "Search a ticker for AI-powered sentiment, bullet summaries, and source links.",
    tickerSymbol: "Ticker symbol",
    tickerPlaceholder: "e.g. MP",
    analyzeNews: "Analyze news",
    refreshAnalysis: "Refresh analysis",
    rateLimitError: "Too many requests. Please try again in 10 minutes.",
    cooldownSeconds: (seconds) => `Retry in ${seconds}s`,
    timeframe: "Timeframe",
    quickSelect: "Quick select",
    activeTicker: "Active ticker",
    inWatchlist: "In Watchlist",
    addToWatchlist: "Add to Portfolio",
    somethingWrong: "Something went wrong",
    fetchError: "Failed to fetch news, please try again",
    noNewsTitle: "No news available",
    noNewsMessage: (ticker) => `No recent news found for ${ticker}`,
    thisTicker: "this ticker",
    noAnalysisTitle: "No analysis yet",
    noAnalysisHint:
      "Click Analyze news to run an AI briefing for the selected ticker.",
    analyzing: (ticker) => `Analyzing ${ticker} news...`,
    analyzingFallback: "ticker",
    fetchingSources: "Fetching sources and generating sentiment.",
    aiBriefing: "AI briefing",
    keyTakeaways: "Key takeaways",
    noBullets: "No summary bullets were generated for this ticker.",
    copyAnalysis: "Copy Analysis",
    copied: "Copied!",
    sources: "Sources",
    untitledSource: "Untitled source",
    open: "Open",
    noSources: "No source links were returned for this search.",
    copyTicker: "Ticker",
    copySentiment: "Sentiment",
    copyKeyTakeaways: "Key takeaways",
    copyNoBullets: "No summary bullets available.",
  },
  timeframe: {
    "24h": "Past 24h",
    week: "Past Week",
    month: "Past Month",
  },
  metrics: {
    keyMetrics: "Key metrics",
    mockData: "Mock market data",
    marketCap: "Market Cap",
    peRatio: "P/E Ratio",
    week52Range: "52w Range",
  },
  chart: {
    liveChart: "Live chart",
    area: "Area",
  },
  insider: {
    smartMoney: "Smart money",
    title: "Insider & institutional activity",
    noTrades: "No recent Form 4 trades found in AI context.",
    loadError: "Failed to load insider activity",
  },
  earnings: {
    title: "Earnings & SEC Insight",
    revenueEps: "Revenue / EPS",
    bullishHighlights: "Bullish highlights",
    keyRisks: "Key risks",
    noItems: "No items available.",
    loadError: "Failed to load earnings insight",
  },
  asset: {
    back: "Back",
  },
  legal: LEGAL_BY_LOCALE.en,
  settings: SETTINGS_BY_LOCALE.en,
  common: COMMON_BY_LOCALE.en,
  portfolioImpact: {
    label: "Daily Portfolio Impact",
    title: "24h market pulse for your holdings",
    sentimentScore: "Sentiment score",
    loadError: "Failed to load impact summary",
  },
  valuation: {
    target: "Target",
  },
  events: {
    upcoming: "Upcoming events",
    calendar: "Earnings & dividend calendar",
    inDays: (days) => `in ${days} days`,
    today: "Today",
    completed: "Report completed",
    earningsOn: (date) => `Earnings: ${date}`,
    dividendOn: (date) => `Ex-dividend: ${date}`,
    loadError: "Failed to load calendar",
    empty: "No upcoming events found",
  },
  enums: {
    sentiment: {
      Bullish: "Bullish",
      Bearish: "Bearish",
      Neutral: "Neutral",
    },
    valuation: {
      Undervalued: "Undervalued",
      "Fairly Valued": "Fairly Valued",
      Overvalued: "Overvalued",
    },
    netActivity: {
      "Net Insider Buying": "Net Insider Buying",
      "Net Insider Selling": "Net Insider Selling",
      Neutral: "Neutral",
    },
    tradeAction: {
      Buy: "Buy",
      Sell: "Sell",
    },
    earningsStatus: {
      Beat: "Beat",
      Missed: "Missed",
      Inline: "Inline",
      Unknown: "Unknown",
    },
    eventType: {
      Earnings: "Earnings",
      "Ex-Dividend": "Ex-Dividend",
    },
  },
};

const de: Translations = {
  dashboard: {
    brand: "Investment Dashboard",
    title: "Täglicher Marktüberblick",
    subtitle: "Das Wichtigste zu Ihrem Portfolio in 15 Sekunden.",
    holdings: "Positionen",
    portfolio: "Portfolio",
    avgChange: "Ø Veränderung",
    fetchNewsError: "Nachrichten konnten nicht geladen werden",
    loadingWatchlist: "Watchlist wird geladen…",
  },
  nav: {
    home: "Start",
    search: "Suche",
    settings: "Einstellungen",
    ariaLabel: "Hauptnavigation",
  },
  search: {
    title: "Suche",
    subtitle: "Ticker, ETF oder Index finden",
    placeholder: "Ticker oder Name eingeben...",
    history: "Suchverlauf",
    clearHistory: "Löschen",
    emptyHistory: "Kein Suchverlauf",
    popular: "Beliebte Assets & Indizes",
    addToWatchlist: "Zur Watchlist",
    goToAnalysis: "Zur KI-Analyse",
    alreadyInWatchlist: "Bereits in Watchlist",
    loading: "Suche...",
  },
  tabs: {
    portfolio: "Mein Portfolio",
    news: "Marktnachrichten",
    ariaLabel: "Dashboard-Bereiche",
  },
  portfolio: {
    yourHoldings: "Ihre Positionen",
    emptyHint: "Noch keine Aktien. Fügen Sie oben Ihren ersten Ticker hinzu.",
    positionsOne: "1 Position in Ihrer Watchlist. Klicken Sie auf eine Karte für News-Analyse.",
    positionsMany: (count) =>
      `${count} Positionen in Ihrer Watchlist. Klicken Sie auf eine Karte für News-Analyse.`,
    emptyTitle: "Portfolio ist leer",
    emptySubtitle: "Fügen Sie über die Suche oder das Formular oben einen Ticker hinzu.",
    watchlistEmptyTitle: "Ihre Watchlist ist leer",
    watchlistEmptySubtitle:
      "Fügen Sie Aktien und ETFs hinzu, um Kurse und KI-Analysen in Echtzeit zu verfolgen",
    watchlistFindStock: "Aktie finden",
    watchlistQuickAdd: "Schnellstart",
    addStock: "Aktie hinzufügen",
    addStockHint:
      "Geben Sie einen Ticker ein, um ihn Ihrem Portfolio hinzuzufügen. Probieren Sie NVDA, AAPL oder MSFT.",
    tickerSymbol: "Tickersymbol",
    tickerPlaceholder: "z.B. NVDA oder EUNL",
    addToPortfolio: "Zum Portfolio hinzufügen",
    errorEmpty: "Ticker oder ISIN eingeben, z.B. NVDA oder EUNL.",
    errorInvalid: "Ticker (1–5 Buchstaben), ETF (EUNL, VOO) oder ISIN (12 Zeichen).",
    errorDuplicate: (ticker) => `${ticker} ist bereits im Portfolio.`,
    lastPrice: "Letzter Kurs",
    remove: "Entfernen",
    removeAria: (ticker) => `${ticker} entfernen`,
    etfBadge: "ETF",
  },
  quotes: {
    title: "Live-Kurse",
    delayed: "Verzögert ~15 Min · Aktualisierung alle 30 Sek",
    loading: "Laden...",
    unavailable: "Kurse vorübergehend nicht verfügbar",
    avgChange: "Ø Tagesänderung",
  },
  news: {
    title: "Marktnachrichten",
    subtitle:
      "Suchen Sie einen Ticker für KI-Stimmung, Kurzfassungen und Quellenlinks.",
    tickerSymbol: "Tickersymbol",
    tickerPlaceholder: "z.B. MP",
    analyzeNews: "News analysieren",
    refreshAnalysis: "Analyse aktualisieren",
    rateLimitError: "Zu viele Anfragen. Bitte versuchen Sie es in 10 Minuten erneut.",
    cooldownSeconds: (seconds) => `Erneut in ${seconds} s`,
    timeframe: "Zeitraum",
    quickSelect: "Schnellauswahl",
    activeTicker: "Aktiver Ticker",
    inWatchlist: "In Watchlist",
    addToWatchlist: "Zum Portfolio",
    somethingWrong: "Etwas ist schiefgelaufen",
    fetchError: "Nachrichten konnten nicht geladen werden, bitte erneut versuchen",
    noNewsTitle: "Keine Nachrichten verfügbar",
    noNewsMessage: (ticker) => `Keine aktuellen Nachrichten für ${ticker} gefunden`,
    thisTicker: "diesen Ticker",
    noAnalysisTitle: "Noch keine Analyse",
    noAnalysisHint:
      "Klicken Sie auf „News analysieren“, um ein KI-Briefing für den ausgewählten Ticker zu starten.",
    analyzing: (ticker) => `Analysiere ${ticker}-Nachrichten...`,
    analyzingFallback: "Ticker",
    fetchingSources: "Quellen werden geladen und Stimmung generiert.",
    aiBriefing: "KI-Digest",
    keyTakeaways: "Kernaussagen",
    noBullets: "Für diesen Ticker wurden keine Kurzpunkte generiert.",
    copyAnalysis: "Kopieren",
    copied: "Kopiert!",
    sources: "Quellen",
    untitledSource: "Unbenannte Quelle",
    open: "Öffnen",
    noSources: "Für diese Suche wurden keine Quellenlinks zurückgegeben.",
    copyTicker: "Ticker",
    copySentiment: "Stimmung",
    copyKeyTakeaways: "Kernaussagen",
    copyNoBullets: "Keine Kurzpunkte verfügbar.",
  },
  timeframe: {
    "24h": "24 Stunden",
    week: "Woche",
    month: "Monat",
  },
  metrics: {
    keyMetrics: "Kennzahlen",
    mockData: "Demo-Marktdaten",
    marketCap: "Marktkapitalisierung",
    peRatio: "KGV",
    week52Range: "52-Wochen-Spanne",
  },
  chart: {
    liveChart: "Live-Chart",
    area: "Fläche",
  },
  insider: {
    smartMoney: "Smart Money",
    title: "Insider- & institutionelle Aktivität",
    noTrades: "Keine recenten Form-4-Transaktionen im KI-Kontext gefunden.",
    loadError: "Insider-Aktivität konnte nicht geladen werden",
  },
  earnings: {
    title: "Earnings & SEC",
    revenueEps: "Umsatz / EPS",
    bullishHighlights: "Positive Highlights",
    keyRisks: "Hauptrisiken",
    noItems: "Keine Einträge verfügbar.",
    loadError: "Earnings-Daten konnten nicht geladen werden",
  },
  asset: {
    back: "Zurück",
  },
  legal: LEGAL_BY_LOCALE.de,
  settings: SETTINGS_BY_LOCALE.de,
  common: COMMON_BY_LOCALE.de,
  portfolioImpact: {
    label: "Portfolio-Auswirkung",
    title: "24h-Marktpuls für Ihre Positionen",
    sentimentScore: "Stimmungswert",
    loadError: "Zusammenfassung konnte nicht geladen werden",
  },
  valuation: {
    target: "Ziel",
  },
  events: {
    upcoming: "Anstehende Ereignisse",
    calendar: "Earnings- & Dividendenkalender",
    inDays: (days) => `in ${days} Tagen`,
    today: "Heute",
    completed: "Bericht abgeschlossen",
    earningsOn: (date) => `Quartalszahlen: ${date}`,
    dividendOn: (date) => `Ex-Dividende: ${date}`,
    loadError: "Kalender konnte nicht geladen werden",
    empty: "Keine anstehenden Ereignisse gefunden",
  },
  enums: {
    sentiment: {
      Bullish: "Bullisch",
      Bearish: "Bärisch",
      Neutral: "Neutral",
    },
    valuation: {
      Undervalued: "Unterbewertet",
      "Fairly Valued": "Fair bewertet",
      Overvalued: "Überbewertet",
    },
    netActivity: {
      "Net Insider Buying": "Netto-Käufe",
      "Net Insider Selling": "Netto-Verkäufe",
      Neutral: "Neutral",
    },
    tradeAction: {
      Buy: "Kauf",
      Sell: "Verkauf",
    },
    earningsStatus: {
      Beat: "Übertroffen",
      Missed: "Verfehlt",
      Inline: "Im Plan",
      Unknown: "Unbekannt",
    },
    eventType: {
      Earnings: "Quartalszahlen",
      "Ex-Dividend": "Ex-Dividende",
    },
  },
};

export const TRANSLATIONS: Record<AppLocale, Translations> = { ru, en, de };

export function getTranslations(locale: AppLocale): Translations {
  return TRANSLATIONS[locale];
}

export const TIMEFRAME_IDS: NewsTimeframe[] = ["24h", "week", "month"];
