"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n/use-translations";

export const NAV_ITEMS = [
  { href: "/", labelKey: "home" as const, Icon: HomeIcon },
  { href: "/search", labelKey: "search" as const, Icon: SearchIcon },
  { href: "/settings", labelKey: "settings" as const, Icon: SettingsIcon },
];

export function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`h-5 w-5 ${active ? "text-white" : ""}`}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 10.5 9-6 9 6M5 9.5V20h5v-6h4v6h5V9.5" />
    </svg>
  );
}

export function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`h-5 w-5 ${active ? "text-white" : ""}`}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`h-5 w-5 ${active ? "text-white" : ""}`}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 13a7.8 7.8 0 0 0 .1-2l2-1.2-2-3.5-2.3 1a8 8 0 0 0-1.7-1L15 3h-6l-.5 2.3a8 8 0 0 0-1.7 1l-2.3-1-2 3.5 2 1.2a7.8 7.8 0 0 0 .1 2l-2 1.2 2 3.5 2.3-1a8 8 0 0 0 1.7 1L9 21h6l.5-2.3a8 8 0 0 0 1.7-1l2.3 1 2-3.5-2-1.2Z"
      />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslations();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-4 md:flex">
      <div>
        <div className="mb-8 px-2 py-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400/90">
            {t.dashboard.brand}
          </p>
        </div>

        <nav aria-label={t.nav.ariaLabel} className="space-y-1">
          {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
            const active = pathname === href;
            const label = t.nav[labelKey];

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-zinc-800/60 text-white"
                    : "text-muted hover:text-white"
                }`}
              >
                <Icon active={active} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <p className="px-2 text-xs text-muted">MVP · Investment Dashboard</p>
    </aside>
  );
}
