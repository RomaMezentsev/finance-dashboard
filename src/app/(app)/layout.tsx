import { CurrencyProvider } from "@/context/CurrencyContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CurrencyProvider>
        <PortfolioProvider>
          <AppShell>{children}</AppShell>
        </PortfolioProvider>
      </CurrencyProvider>
    </LocaleProvider>
  );
}
