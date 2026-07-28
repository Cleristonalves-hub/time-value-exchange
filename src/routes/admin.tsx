import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, Check, X, Flag, MessageSquare, Gavel, Users, Lock, ScrollText } from "lucide-react";
import {
  useSpecialists,
  useReports,
  useReviews,
  useFeedbacks,
  useAuditLogs,
  setSpecialistStatus,
  type SpecialistStatus,
} from "@/lib/store";
import { auctions, formatBRL } from "@/lib/auctions";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib/auth";
import { useT, nicheLabel } from "@/lib/i18n";
import { isSafeHttpUrl } from "@/lib/validators";
import { maskEmail } from "@/lib/utils";
import { useSessionTimeout } from "@/lib/useSessionTimeout";
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Valore" }] }),
  component: AdminGate,
});

function AdminGate() {
  const { isAdmin, loading, user } = useIsAdmin();
  const { signOut } = useAuth();
  const { t } = useT();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("ad.loading")}</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="w-full max-w-sm rounded-2xl border border-gold/30 bg-surface p-8 text-center shadow-gold">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Lock className="size-4" />
            <p className="text-[10px] uppercase tracking-[0.3em]">{t("ad.restrictedAccess")}</p>
          </div>
          <h1 className="mt-2 font-display text-3xl">{t("ad.panelTitle")}</h1>
          <p className="mt-2 text-xs text-muted-foreground">{t("ad.loginToAccess")}</p>
          <Link
            to="/auth"
            className="mt-6 inline-block rounded-md bg-gradient-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold"
          >
            {t("ad.enter")}
          </Link>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="w-full max-w-sm rounded-2xl border border-destructive/30 bg-surface p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-destructive">
            <Lock className="size-4" />
            <p className="text-[10px] uppercase tracking-[0.3em]">{t("ad.noPermission")}</p>
          </div>
          <h1 className="mt-2 font-display text-2xl">{t("ad.accessDenied")}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("ad.noAdminRole", { email: maskEmail(user.email ?? "") })}
          </p>
          <button
            onClick={() => signOut()}
            className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-gold"
          >
            {t("ad.signOut")}
          </button>
        </div>
      </main>
    );
  }

  return <AdminPanel onLogout={() => signOut()} />;
}


type Tab = "especialistas" | "denuncias" | "leiloes" | "feedback" | "logs";

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { t } = useT();
  const specialists = useSpecialists();
  const reports = useReports();
  const reviews = useReviews();
  const feedbacks = useFeedbacks();
  const auditLogs = useAuditLogs();
  const [tab, setTab] = useState<Tab>("especialistas");
  // AdminPanel só renderiza depois que AdminGate já confirmou sessão + role
  // admin, então o timeout sempre está habilitado aqui.
  const { showWarning, continueSession } = useSessionTimeout(true);

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "especialistas", label: t("ad.specialists"), icon: Users, count: specialists.length },
    { id: "denuncias", label: t("ad.reports"), icon: Flag, count: reports.length },
    { id: "leiloes", label: t("ad.auctions"), icon: Gavel, count: auctions.length },
    { id: "feedback", label: t("ad.feedback"), icon: MessageSquare, count: feedbacks.length },
    { id: "logs", label: t("ad.auditLogs"), icon: ScrollText, count: auditLogs.length },
  ];

  return (
    <main className="min-h-screen px-5 pt-10 pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <ShieldCheck className="size-4" />
              <p className="text-[10px] uppercase tracking-[0.3em]">{t("ad.adminPanel")}</p>
            </div>
            <h1 className="mt-1 font-display text-3xl">Valore Admin</h1>
          </div>
          <button onClick={onLogout} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-gold">{t("ad.signOut")}</button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border/60 pb-2">
          {tabs.map((tb) => {
            const active = tab === tb.id;
            const Icon = tb.icon;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-xs uppercase tracking-widest transition-colors ${active ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Icon className="size-3.5" /> {tb.label} <span className="rounded-full bg-background/60 px-1.5 text-[10px]">{tb.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {tab === "especialistas" && <SpecialistsTab items={specialists} reviews={reviews} />}
          {tab === "denuncias" && <ReportsTab items={reports} />}
          {tab === "leiloes" && <AuctionsTab />}
          {tab === "feedback" && <FeedbackTab items={feedbacks} />}
          {tab === "logs" && <AuditLogsTab items={auditLogs} />}
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground">{t("ad.storageNote")}</p>
      </div>
      <SessionTimeoutWarning show={showWarning} onContinue={continueSession} />
    </main>
  );
}

function StatusBadge({ status }: { status: SpecialistStatus }) {
  const { t } = useT();
  const map: Record<SpecialistStatus, string> = {
    novo: "border-gold/40 text-gold bg-gold/5",
    verificado: "border-success/40 text-success bg-success/5",
    suspenso: "border-destructive/40 text-destructive bg-destructive/5",
    reprovado: "border-muted-foreground/40 text-muted-foreground bg-background/40",
  };
  const labels: Record<SpecialistStatus, string> = {
    novo: t("pf.statusNew"),
    verificado: t("pf.statusVerified"),
    suspenso: t("pf.statusSuspended"),
    reprovado: t("pf.statusRejected"),
  };
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

function SpecialistsTab({ items, reviews }: { items: ReturnType<typeof useSpecialists>; reviews: ReturnType<typeof useReviews> }) {
  const { t } = useT();
  if (items.length === 0) return <Empty text={t("ad.noSpecialists")} />;
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
                <p className="mt-1 text-xs text-gold">{nicheLabel(t, s.niche)} · {s.specialty}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.credential}</p>
                {s.registrationNumber && (
                  <p className="text-[11px] text-muted-foreground">{t("ad.registration")}: {s.registrationNumber}</p>
                )}
                <p className="text-[11px] text-muted-foreground">{maskEmail(s.email)} · {s.city}</p>
                {s.portfolioUrl && (
                  isSafeHttpUrl(s.portfolioUrl) ? (
                    <a href={s.portfolioUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block truncate text-[11px] text-gold underline-offset-4 hover:underline">
                      {s.portfolioUrl}
                    </a>
                  ) : (
                    <p className="mt-1 truncate text-[11px] text-destructive" title={t("ad.unsafeLink")}>
                      {s.portfolioUrl}
                    </p>
                  )
                )}
                {neg > 0 && (
                  <p className="mt-2 text-[11px] text-destructive">{neg} {t("ad.negativeReviews")}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn onClick={() => setSpecialistStatus(s.id, "verificado", s.status)} kind="gold">
                <Check className="size-3.5" /> {t("ad.approve")}
              </ActionBtn>
              <ActionBtn onClick={() => setSpecialistStatus(s.id, "reprovado", s.status)} kind="ghost">
                <X className="size-3.5" /> {t("ad.reject")}
              </ActionBtn>
              <ActionBtn onClick={() => setSpecialistStatus(s.id, "suspenso", s.status)} kind="danger">
                {t("ad.suspend")}
              </ActionBtn>
              {s.status === "suspenso" && (
                <ActionBtn onClick={() => setSpecialistStatus(s.id, "verificado", s.status)} kind="ghost">
                  {t("ad.reactivate")}
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
  const { t } = useT();
  if (items.length === 0) return <Empty text={t("ad.noReports")} />;
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
  const { t } = useT();
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
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("ad.currentBid")}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function FeedbackTab({ items }: { items: ReturnType<typeof useFeedbacks> }) {
  const { t } = useT();
  if (items.length === 0) return <Empty text={t("ad.noFeedback")} />;
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f.id} className="rounded-xl border border-border/60 bg-surface p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{f.name} <span className="text-xs text-muted-foreground">· {f.email ? maskEmail(f.email) : t("ad.noEmail")}</span></p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-gold">
                {f.kind === "sugestao" ? t("fb.suggestion") : t("fb.complaint")}
              </p>
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

const AUDIT_ACAO_LABEL_KEY: Record<string, string> = {
  aprovar_especialista: "ad.acaoAprovar",
  reprovar_especialista: "ad.acaoReprovar",
  suspender_especialista: "ad.acaoSuspender",
  atualizar_status_especialista: "ad.acaoAtualizarStatus",
};

function AuditLogsTab({ items }: { items: ReturnType<typeof useAuditLogs> }) {
  const { t } = useT();
  const [acaoFilter, setAcaoFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  const acaoOptions = useMemo(() => Array.from(new Set(items.map((l) => l.acao))), [items]);

  const filtered = useMemo(() => {
    return items.filter((l) => {
      if (acaoFilter && l.acao !== acaoFilter) return false;
      if (fromFilter && l.createdAt < new Date(fromFilter).getTime()) return false;
      if (toFilter && l.createdAt > new Date(toFilter).getTime() + 24 * 60 * 60 * 1000 - 1) return false;
      return true;
    });
  }, [items, acaoFilter, fromFilter, toFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select
          value={acaoFilter}
          onChange={(e) => setAcaoFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-2 text-xs"
        >
          <option value="">{t("ad.allActions")}</option>
          {acaoOptions.map((a) => (
            <option key={a} value={a}>{AUDIT_ACAO_LABEL_KEY[a] ? t(AUDIT_ACAO_LABEL_KEY[a]) : a}</option>
          ))}
        </select>
        <input
          type="date"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-2 text-xs"
          aria-label={t("ad.filterFrom")}
        />
        <input
          type="date"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-2 text-xs"
          aria-label={t("ad.filterTo")}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-3">
          <Empty text={t("ad.noAuditLogs")} />
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {filtered.map((l) => (
            <li key={l.id} className="rounded-xl border border-border/60 bg-surface p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gold">
                    {AUDIT_ACAO_LABEL_KEY[l.acao] ? t(AUDIT_ACAO_LABEL_KEY[l.acao]) : l.acao}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {l.alvoTipo} · {l.alvoId ?? "—"}
                  </p>
                  {!!l.detalhes && (
                    <p className="mt-1 truncate text-[11px] text-muted-foreground/80">
                      {JSON.stringify(l.detalhes)}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(l.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-border/60 bg-surface p-6 text-center text-sm text-muted-foreground">{text}</p>;
}
