const DISCLAIMER_TEXT =
  "Haftungsausschluss: Die bereitgestellten Informationen und KI-Analysen dienen ausschließlich Informationszwecken und stellen keine Anlageberatung oder Kaufempfehlung dar. Keine Gewähr für die Richtigkeit der Daten.";

type FinancialDisclaimerProps = {
  className?: string;
};

export function FinancialDisclaimer({ className = "" }: FinancialDisclaimerProps) {
  return (
    <p
      className={`text-[11px] leading-5 text-muted/75 ${className}`.trim()}
      role="note"
      aria-label="Haftungsausschluss"
    >
      {DISCLAIMER_TEXT}
    </p>
  );
}
