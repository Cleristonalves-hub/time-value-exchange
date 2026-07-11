import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Check, X, Flag, MessageSquare, Gavel, Users, Lock } from "lucide-react";
import {
  useSpecialists,
  useReports,
  useReviews,
  useFeedbacks,
  setSpecialistStatus,
  type SpecialistStatus,
} from "@/lib/store";
import { auctions, formatBRL } from "@/lib/auctions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Valore" }] }),
  component: AdminGate,
});

const ADMIN_PASSWORD = "valore@admin2026";
const SESSION_KEY = "valore:admin";

function AdminGate() {
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") {
      setOk(true);
    }
  }, []);

  if (ok) return <AdminPanel onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setOk(false); }} />;

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm rounded-2xl border border-gold/30 bg-surface p-8 shadow-gold">
        <div className="flex items-center gap-2 text-gold">
          <Lock className="size-4" />
          <p className="text-[10px] uppercase tracking-[0.3em]">Acesso restrito</p>
        </div>
        <h1 className="mt-2 font-display text-3xl">Painel Valore</h1>
        <p className="mt-1 text-xs text-muted-foreground">Digite a senha administrativa.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && tryLogin()}
          autoFocus
          className="mt-5 w-full rounded-md border border-border bg-background px-3 py-3 text-sm outline-none focus:border-gold"
          placeholder="Senha"
        />
        {err && <p className="mt-2 text-xs text-destructive">Senha incorreta.</p>}
        <button
          onClick={tryLogin}
          className="mt-4 w-full rounded-md bg-gradient-gold py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold"
        >
          Entrar
        </button>
      </div>
    </main>
  );

  function tryLogin() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setOk(true);
    } else {
      setErr(true);
    }
  }
}

type Tab = "especialistas" | "denuncias" | "leiloes" | "feedback";

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const specialists = useSpecialists();
  const reports = useReports();
  const reviews = useReviews();
  const feedbacks = useFeedbacks();
  const [tab, setTab] = useState<Tab>("especialistas");

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "especialistas", label: "Especialistas", icon: Users, count: specialists.length },
    { id: "denuncias", label: "Denúncias", icon: Flag, count: reports.length },
    { id: "leiloes", label: "Leilões", icon: Gavel, count: auctions.length },
    { id: "feedback", label: "Feedback", icon: MessageSquare, count: feedbacks.length },
  ];

  return (
    <main className="min-h-screen px-5 pt-10 pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <ShieldCheck className="size-4" />
              <p className="text-[10px] uppercase tracking-[0.3em]">Painel administrativo</p>
            </div>
            <h1 className="mt-1 font-display text-3xl">Valore Admin</h1>
          </div>
          <button onClick={onLogout} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-gold">Sair</button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border/60 pb-2">
          {tabs.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-xs uppercase tracking-widest transition-colors ${active ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Icon className="size-3.5" /> {t.label} <span className="rounded-full bg-background/60 px-1.5 text-[10px]">{t.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {tab === "especialistas" && <SpecialistsTab items={specialists} reviews={reviews} />}
          {tab === "denuncias" && <ReportsTab items={reports} />}
          {tab === "leiloes" && <AuctionsTab />}
          {tab === "feedback" && <FeedbackTab items={feedbacks} />}
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground">
          Dados armazenados localmente neste navegador. Ative Lovable Cloud para persistência real e envio automático de emails para contato@valore.services.
        </p>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: SpecialistStatus }) {
  const map: Record<SpecialistStatus, string> = {
    novo: "border-gold/40 text-gold bg-gold/5",
    verificado: "border-success/40 text-success bg-success/5",
    suspenso: "border-destructive/40 text-destructive bg-destructive/5",
    reprovado: "border-muted-foreground/40 text-muted-foreground bg-background/40",
  };
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${map[status]}`}>
      {status}
    </span>
  );
}

function SpecialistsTab({ items, reviews }: { items: ReturnType<typeof useSpecialists>; reviews: ReturnType<typeof useReviews> }) {
  if (items.length === 0) return <Empty text="Nenhum especialista cadastrado ainda." />;
  return (
    <ul className="space-y-3">
      {items.map((s) => {
        const neg = reviews.filter((r) => r.specialistId === s.id && r.rating <= 2).length;
        return (
          <li key={s.id} className="rounded-2xl border border-border/60 bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-xl">{s.fullName}</p>
                  <StatusBadge status={s.status} />
                </div>
                <p className="mt-1 text-xs text-gold">{s.niche} · {s.specialty}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.credential}</p>
                {s.registrationNumber && (
                  <p className="text-[11px] text-muted-foreground">Registro: {s.registrationNumber}</p>
                )}
                <p className="text-[11px] text-muted-foreground">{s.email} · {s.city}</p>
                {s.portfolioUrl && (
                  <a href={s.portfolioUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block truncate text-[11px] text-gold underline-offset-4 hover:underline">
                    {s.portfolioUrl}
                  </a>
                )}
                {neg > 0 && (
                  <p className="mt-2 text-[11px] text-destructive">{neg} avaliação(ões) negativa(s)</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn onClick={() => setSpecialistStatus(s.id, "verificado")} kind="gold">
                <Check className="size-3.5" /> Aprovar
              </ActionBtn>
              <ActionBtn onClick={() => setSpecialistStatus(s.id, "reprovado")} kind="ghost">
                <X className="size-3.5" /> Reprovar
              </ActionBtn>
              <ActionBtn onClick={() => setSpecialistStatus(s.id, "suspenso")} kind="danger">
                Suspender
              </ActionBtn>
              {s.status === "suspenso" && (
                <ActionBtn onClick={() => setSpecialistStatus(s.id, "verificado")} kind="ghost">
                  Reativar
                </ActionBtn>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ActionBtn({ children, onClick, kind }: { children: React.ReactNode; onClick: () => void; kind: "gold" | "ghost" | "danger" }) {
  const cls =
    kind === "gold"
      ? "bg-gradient-gold text-background"
      : kind === "danger"
      ? "border border-destructive/40 text-destructive hover:bg-destructive/5"
      : "border border-border text-muted-foreground hover:border-gold/40 hover:text-gold";
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] uppercase tracking-widest ${cls}`}>
      {children}
    </button>
  );
}

function ReportsTab({ items }: { items: ReturnType<typeof useReports> }) {
  if (items.length === 0) return <Empty text="Nenhuma denúncia até o momento." />;
  return (
    <ul className="space-y-3">
      {items.map((r) => (
        <li key={r.id} className="rounded-xl border border-destructive/20 bg-surface p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg">{r.target}</p>
              <p className="text-xs text-destructive">{r.category}</p>
              {r.details && <p className="mt-2 text-xs text-muted-foreground">{r.details}</p>}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {new Date(r.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AuctionsTab() {
  return (
    <ul className="space-y-2">
      {auctions.map((a) => (
        <li key={a.id} className="flex items-center justify-between rounded-md border border-border/60 bg-surface p-4">
          <div>
            <p className="font-medium text-sm">{a.expert}</p>
            <p className="text-[11px] text-muted-foreground">{a.specialty}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg text-gold">{formatBRL(a.currentBid)}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Lance atual</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function FeedbackTab({ items }: { items: ReturnType<typeof useFeedbacks> }) {
  if (items.length === 0) return <Empty text="Nenhuma sugestão ou reclamação recebida." />;
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f.id} className="rounded-xl border border-border/60 bg-surface p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{f.name} <span className="text-xs text-muted-foreground">· {f.email || "sem email"}</span></p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-gold">{f.kind}</p>
              <p className="mt-2 text-sm text-foreground/80">{f.message}</p>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {new Date(f.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-border/60 bg-surface p-6 text-center text-sm text-muted-foreground">{text}</p>;
}
