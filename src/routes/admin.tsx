import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Check, X, Clock } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Valore" }] }),
  component: AdminPage,
});

type Status = "pendente" | "aprovado" | "rejeitado";
type Pending = {
  id: string;
  name: string;
  niche: string;
  specialty: string;
  credential: string;
  city: string;
  submittedAt: string;
  status: Status;
};

const initial: Pending[] = [
  { id: "p1", name: "Dr. Rafael Monteiro", niche: "Saúde", specialty: "Neurocirurgião", credential: "Pós-doc Johns Hopkins", city: "São Paulo", submittedAt: "há 2h", status: "pendente" },
  { id: "p2", name: "Carla Beneditti", niche: "Direito", specialty: "Direito tributário internacional", credential: "Sócia · Mattos Filho", city: "Rio de Janeiro", submittedAt: "há 5h", status: "pendente" },
  { id: "p3", name: "Maestro Igor Lessa", niche: "Música", specialty: "Regência orquestral", credential: "Royal College of Music", city: "Curitiba", submittedAt: "há 1d", status: "pendente" },
  { id: "p4", name: "Tatiana Furlan", niche: "Finanças", specialty: "Wealth management private", credential: "CFA · ex-J.P. Morgan", city: "São Paulo", submittedAt: "há 1d", status: "pendente" },
];

function AdminPage() {
  const [items, setItems] = useState(initial);
  const update = (id: string, status: Status) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

  const pending = items.filter((i) => i.status === "pendente");
  const decided = items.filter((i) => i.status !== "pendente");

  return (
    <main className="min-h-screen px-5 pt-10 pb-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-gold">
          <ShieldCheck className="size-4" />
          <p className="text-[10px] uppercase tracking-[0.3em]">Painel administrativo</p>
        </div>
        <h1 className="mt-1 font-display text-3xl">Aprovações de especialistas</h1>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Kpi label="Pendentes" value={pending.length} tone="text-gold" />
          <Kpi label="Aprovados" value={items.filter((i) => i.status === "aprovado").length} tone="text-success" />
          <Kpi label="Rejeitados" value={items.filter((i) => i.status === "rejeitado").length} tone="text-destructive" />
        </div>

        <section className="mt-8">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Fila de revisão</h2>
          {pending.length === 0 ? (
            <p className="mt-4 rounded-xl border border-border/60 bg-surface p-6 text-center text-sm text-muted-foreground">
              Nenhum cadastro pendente. ✨
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {pending.map((p) => (
                <li key={p.id} className="rounded-2xl border border-gold/20 bg-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl">{p.name}</p>
                      <p className="text-xs text-gold">{p.niche} · {p.specialty}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{p.credential}</p>
                      <p className="text-[11px] text-muted-foreground">{p.city}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Clock className="size-3" /> {p.submittedAt}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => update(p.id, "aprovado")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-gold py-2 text-xs font-semibold uppercase tracking-widest text-background"
                    >
                      <Check className="size-4" /> Aprovar
                    </button>
                    <button
                      onClick={() => update(p.id, "rejeitado")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md border border-destructive/40 py-2 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10"
                    >
                      <X className="size-4" /> Rejeitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {decided.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Decisões recentes</h2>
            <ul className="mt-3 space-y-2">
              {decided.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-md border border-border/50 bg-surface/60 p-3 text-sm">
                  <span>
                    <span className="font-medium">{p.name}</span>{" "}
                    <span className="text-xs text-muted-foreground">· {p.specialty}</span>
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest ${p.status === "aprovado" ? "text-success" : "text-destructive"}`}>
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface p-4">
      <p className={`font-display text-3xl ${tone}`}>{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
