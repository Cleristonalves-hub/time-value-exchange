import { useState } from "react";
import { Flag, X, Check } from "lucide-react";
import { addReport } from "@/lib/store";

const CATEGORIES = [
  "Não compareceu",
  "Comportamento ofensivo",
  "Não efetuou pagamento",
  "Conteúdo inadequado",
  "Credenciais suspeitas",
  "Outro",
] as const;

type Category = typeof CATEGORIES[number];

export function ReportButton({
  target,
  variant = "ghost",
}: {
  target: string;
  variant?: "ghost" | "outline";
}) {
  const [open, setOpen] = useState(false);
  const base =
    variant === "outline"
      ? "border border-destructive/40 text-destructive hover:bg-destructive/5"
      : "border border-border/60 text-muted-foreground hover:border-destructive/40 hover:text-destructive";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] uppercase tracking-widest transition-colors ${base}`}
      >
        <Flag className="size-3.5" /> Denunciar
      </button>
      {open && <ReportDialog target={target} onClose={() => setOpen(false)} />}
    </>
  );
}

function ReportDialog({ target, onClose }: { target: string; onClose: () => void }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!category) return;
    addReport({ target, category, details });
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-gold/30 bg-surface p-6 shadow-gold sm:rounded-2xl animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold">
            <Flag className="size-4" />
            <span className="text-[10px] uppercase tracking-[0.3em]">Denúncia confidencial</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold bg-gold/10">
              <Check className="size-6 text-gold" />
            </div>
            <h3 className="mt-4 font-display text-2xl">Denúncia enviada</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Nossa curadoria analisará em até 24h. Um email foi encaminhado para contato@valore.services.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h3 className="mt-4 font-display text-2xl">Reportar {target}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecione o motivo. Todas as denúncias são analisadas pela curadoria Valore.
            </p>

            <div className="mt-5 space-y-2">
              {CATEGORIES.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-all ${
                      active
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-foreground/80 hover:border-gold/40"
                    }`}
                  >
                    <span>{c}</span>
                    {active && <Check className="size-4" />}
                  </button>
                );
              })}
            </div>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva o ocorrido (opcional)"
              className="mt-4 min-h-[90px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />

            <button
              onClick={submit}
              disabled={!category}
              className="mt-5 w-full rounded-md bg-gradient-gold py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
            >
              Enviar denúncia
            </button>
          </>
        )}
      </div>
    </div>
  );
}
