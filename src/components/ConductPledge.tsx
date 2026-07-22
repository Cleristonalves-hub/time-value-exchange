import { Check, ShieldAlert } from "lucide-react";

export function ConductPledge({
  accepted,
  onToggle,
  error,
}: {
  accepted: boolean;
  onToggle: () => void;
  error?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-surface p-5 ${error ? "border-destructive" : "border-gold/30"}`}>
      <div className="flex items-center gap-2 text-gold">
        <ShieldAlert className="size-4" />
        <span className="text-[10px] uppercase tracking-[0.3em]">Código de Conduta Valore</span>
      </div>
      <p className="mt-3 font-display text-xl leading-snug text-foreground">
        "Seja cordial ou seja cancelado.<br />
        <span className="italic text-gradient-gold">A escolha é sua.</span>"
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Má conduta, ausência sem aviso, inadimplência, comportamento ofensivo ou
        qualquer desrespeito resulta em <span className="text-foreground">banimento permanente</span>{" "}
        da plataforma. Sem exceções.
      </p>

      <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground">
        <Tier n={1} label="1ª denúncia" effect="Advertência pública no perfil" />
        <Tier n={2} label="2ª denúncia" effect="Suspensão temporária da conta" />
        <Tier n={3} label="3ª denúncia" effect="Banimento permanente da Valore" />
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
        <span className="text-xs leading-relaxed text-foreground/80">
          Li, compreendi e me comprometo com o Código de Conduta Valore.
        </span>
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
  if (tier === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-[10px] uppercase tracking-widest text-success">
        <ShieldAlert className="size-3" /> Reputação intacta
      </span>
    );
  }
  const map = {
    1: { label: "1 advertência", cls: "border-gold/40 bg-gold/10 text-gold" },
    2: { label: "Suspenso", cls: "border-warning/40 bg-warning/10 text-warning" },
    3: { label: "Banido", cls: "border-destructive/40 bg-destructive/10 text-destructive" },
  }[tier];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${map.cls}`}>
      <ShieldAlert className="size-3" /> {map.label}
    </span>
  );
}
