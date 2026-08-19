"use client";

import { useState } from "react";
import {
  ImpressumPanel,
  LanguageSettingsPanel,
  PrivacyPanel,
  SettingsTabButton,
  useSettingsCopy,
} from "@/components/settings/SettingsPanels";
import { useLocale } from "@/context/LocaleContext";

type SettingsTab = "language" | "impressum" | "privacy";

const TABS: SettingsTab[] = ["language", "impressum", "privacy"];

export function SettingsView() {
  const { locale, setLocale } = useLocale();
  const copy = useSettingsCopy();
  const [activeTab, setActiveTab] = useState<SettingsTab>("language");

  const tabLabels: Record<SettingsTab, string> = {
    language: copy.tabs.language,
    impressum: copy.tabs.impressum,
    privacy: copy.tabs.privacy,
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="border-b border-zinc-800/60">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{copy.title}</h1>

        <nav aria-label={copy.title} className="-mb-px mt-8 flex gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <SettingsTabButton
              key={tab}
              active={activeTab === tab}
              label={tabLabels[tab]}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </nav>
      </header>

      <div className="py-8">
        {activeTab === "language" ? (
          <LanguageSettingsPanel locale={locale} onSelect={setLocale} />
        ) : null}
        {activeTab === "impressum" ? <ImpressumPanel /> : null}
        {activeTab === "privacy" ? <PrivacyPanel /> : null}
      </div>
    </div>
  );
}
