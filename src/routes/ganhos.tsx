import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { formatBRL } from "@/lib/auctions";
import { ArrowDownToLine, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ganhos")({
  head: () => ({ meta: [{ title: "Ganhos — Valore" }] }),
  component: EarningsPage,
});

const sessions = [
  { id: "s1", client: "Marcos R.", date: "02 Jun 2026", gross: 4800 },
  { id: "s2", client: "Beatriz L.", date: "28 Mai 2026", gross: 3200 },
  { id: "s3", client: "Henrique P.", date: "21 Mai 2026", gross: 5600 },
  { id: "s4", client: "Ana C.", date: "14 Mai 2026", gross: 2400 },
  { id: "s5", client: "Júlia M.", date: "07 Mai 2026", gross: 3800 },
];

function net(gross: number) {
  return Math.round(gross * 0.8);
}
function fee(gross: number) {
  return gross - net(gross);
}

function EarningsPage() {
  const [requested, setRequested] = useState(false);
  const monthGross = sessions.reduce((s, x) => s + x.gross, 0);
  const monthNet = sessions.reduce((s, x) => s + net(x.gross), 0);
  const monthFee = monthGross - monthNet;

  return (
    <main className="min-h-screen pb-28">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Junho · 2026</p>
        <h1 className="mt-1 font-display text-3xl">Ganhos do mês</h1>

        <section className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 shadow-gold">
          <div className="flex items-center gap-2 text-gold">
            <TrendingUp className="size-4" />
            <p className="text-[10px] uppercase tracking-[0.3em]">Líquido a receber</p>
          </div>
          <p className="mt-2 font-display text-5xl text-gradient-gold">{formatBRL(monthNet)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <Stat label="Bruto" value={formatBRL(monthGross)} />
            <Stat label="Comissão 20%" value={`− ${formatBRL(monthFee)}`} tone="text-muted-foreground" />
          </div>
          <button
            onClick={() => setRequested(true)}
            disabled={requested}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold py-3 text-sm font-semibold uppercase tracking-widest text-background disabled:opacity-60"
          >
            <ArrowDownToLine className="size-4" />
            {requested ? "Solicitação enviada" : "Solicitar saque"}
          </button>
          {requested && (
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Pagamento em até 2 dias úteis via PIX.
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Histórico de sessões</h2>
          <ul className="mt-3 space-y-2">
            {sessions.map((s) => (
              <li key={s.id} className="rounded-xl border border-border/60 bg-surface p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{s.client}</p>
                    <p className="text-xs text-muted-foreground">{s.date}</p>
                  </div>
                  <p className="font-display text-xl text-gold">{formatBRL(net(s.gross))}</p>
                </div>
                <div className="mt-3 flex justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                  <span>Bruto {formatBRL(s.gross)}</span>
                  <span>Comissão − {formatBRL(fee(s.gross))}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function Stat({ label, value, tone = "text-foreground" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-border/50 bg-background/40 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-lg ${tone}`}>{value}</p>
    </div>
  );
}
