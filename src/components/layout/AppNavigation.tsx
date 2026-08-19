"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/Sidebar";
import { useTranslations } from "@/lib/i18n/use-translations";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslations();

  return (
    <nav
      aria-label={t.nav.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/5 bg-[#070b12]/95 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid w-full max-w-lg grid-cols-3 px-2 py-2">
        {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
          const active = pathname === href;
          const label = t.nav[labelKey];

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition ${
                active ? "text-emerald-300" : "text-muted"
              }`}
            >
              <Icon active={active} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
