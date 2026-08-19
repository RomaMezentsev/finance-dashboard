"use client";

import { BottomNav } from "@/components/layout/AppNavigation";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b12]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <Sidebar />

      <div className="relative md:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
          {children}

          <footer className="mt-10 border-t border-white/5 pt-6">
            <FinancialDisclaimer />
          </footer>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
