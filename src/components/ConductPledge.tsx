import { Check, ShieldAlert } from "lucide-react";
import { useT } from "@/lib/i18n";

export function ConductPledge({
  accepted,
  onToggle,
  error,
}: {
  accepted: boolean;
  onToggle: () => void;
  error?: boolean;
}) {
  const { t } = useT();
  return (
    <div className={`rounded-xl border bg-surface p-5 ${error ? "border-destructive" : "border-gold/30"}`}>
      <div className="flex items-center gap-2 text-gold">
        <ShieldAlert className="size-4" />
        <span className="text-[10px] uppercase tracking-[0.3em]">{t("cp.title")}</span>
      </div>
      <p className="mt-3 font-display text-xl leading-snug text-foreground">
        "{t("cp.quote1")}<br />
        <span className="italic text-gradient-gold">{t("cp.quote2")}</span>"
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("cp.body")}</p>

      <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground">
        <Tier n={1} label={t("cp.tier1Label")} effect={t("cp.tier1Effect")} />
        <Tier n={2} label={t("cp.tier2Label")} effect={t("cp.tier2Effect")} />
        <Tier n={3} label={t("cp.tier3Label")} effect={t("cp.tier3Effect")} />
      </ul>

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={accepted}
          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
            accepted ? "border-gold bg-gold" : error ? "border-destructive" : "border-border"
          }`}
        >
          {accepted && <Check className="size-3 text-primary-foreground" />}
        </button>
        <span className="text-xs leading-relaxed text-foreground/80">{t("cp.accept")}</span>
      </label>
    </div>
  );
}

function Tier({ n, label, effect }: { n: number; label: string; effect: string }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2">
      <span className="flex size-5 items-center justify-center rounded-full border border-gold/40 font-mono text-[10px] text-gold">
        {n}
      </span>
      <span className="text-foreground/80">{label}</span>
      <span className="ml-auto text-muted-foreground">{effect}</span>
    </li>
  );
}

export type WarningTier = 0 | 1 | 2 | 3;

export function WarningBadge({ tier }: { tier: WarningTier }) {
  const { t } = useT();
  if (tier === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-[10px] uppercase tracking-widest text-success">
        <ShieldAlert className="size-3" /> {t("cp.reputationIntact")}
      </span>
    );
  }
  const map = {
    1: { label: t("cp.oneWarning"), cls: "border-gold/40 bg-gold/10 text-gold" },
    2: { label: t("cp.suspended"), cls: "border-warning/40 bg-warning/10 text-warning" },
    3: { label: t("cp.banned"), cls: "border-destructive/40 bg-destructive/10 text-destructive" },
  }[tier];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${map.cls}`}>
      <ShieldAlert className="size-3" /> {map.label}
    </span>
  );
}
