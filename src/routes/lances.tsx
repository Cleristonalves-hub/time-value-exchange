import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, ChevronDown, ChevronUp, Gavel, Trophy } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { RequireAuth } from "@/components/RequireAuth";
import { Countdown } from "@/components/Countdown";
import { useAuth } from "@/lib/auth";
import { useActiveLeiloes, useMySpecialist, useMyLeiloes, type Leilao, type LeilaoComEspecialista } from "@/lib/store";
import { formatBRL, formatEndsAt } from "@/lib/auctions";
import { useT, nicheLabel, leilaoStatusLabel } from "@/lib/i18n";

export const Route = createFileRoute("/lances")({
  head: () => ({ meta: [{ title: "Lances — Valore" }] }),
  component: LancesPage,
});

function LancesPage() {
  const { t } = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const leiloesAtivos = useActiveLeiloes();
  // Consulta real ao banco por usuario_id — a "Área do Profissional" só
  // aparece para quem de fato tem um registro em `especialistas` vinculado
  // ao usuário logado, nunca por uma flag de sessão/local.
  const especialista = useMySpecialist(user?.id, user?.email ?? undefined);
  const [showArea, setShowArea] = useState(false);

  // TODO(debug temporário): remover depois de confirmar em produção que a
  // Área do Profissional aparece corretamente para especialistas reais.
  console.log("[DEBUG /lances] useMySpecialist ->", {
    userId: user?.id,
    userEmail: user?.email,
    especialista,
  });

  return (
    <RequireAuth>
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-2xl px-5 pt-10">
          <h1 className="font-display text-3xl">{t("ln.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("ln.subtitle")}</p>

          <section className="mt-8">
            <h2 className="font-display text-lg">{t("ln.activeAuctions")}</h2>
            {leiloesAtivos.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-border/60 bg-surface p-10 text-center">
                <p className="font-display text-xl">{t("ln.emptyTitle")}</p>
                <p className="mt-2 text-xs text-muted-foreground">{t("ln.emptyMsg")}</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {leiloesAtivos.map((l) => (
                  <ActiveLeilaoCard key={l.id} leilao={l} />
                ))}
              </div>
            )}
          </section>

          {especialista && (
            <section className="mt-10">
              <button
                onClick={() => setShowArea((s) => !s)}
                className="flex w-full items-center justify-between rounded-xl border border-gold/40 bg-gold/5 px-5 py-4 text-left transition-colors hover:bg-gold/10"
              >
                <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold">
                  <Briefcase className="size-4" /> {t("ln.professionalArea")}
                </span>
                {showArea ? <ChevronUp className="size-4 text-gold" /> : <ChevronDown className="size-4 text-gold" />}
              </button>
              {showArea && <ProfessionalArea especialistaId={especialista.id} onCreateAuction={() => navigate({ to: "/criar-leilao" })} />}
            </section>
          )}
        </div>
        <BottomNav />
      </main>
    </RequireAuth>
  );
}

function ActiveLeilaoCard({ leilao }: { leilao: LeilaoComEspecialista }) {
  const { t } = useT();
  const lanceAtual = leilao.lanceAtual ?? leilao.lanceMinimo;
  return (
    <Link
      to="/leilao/$id"
      params={{ id: leilao.id }}
      className="block overflow-hidden rounded-xl border border-border/60 bg-surface p-4 transition-all hover:border-gold/50 hover:shadow-gold"
    >
      <div className="mb-1 inline-block rounded-sm border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
        {leilao.especialista ? nicheLabel(t, leilao.especialista.nicho) : t("home.specialistFallback")}
      </div>
      <h3 className="font-display text-lg leading-tight text-foreground">
        {leilao.especialista?.nome || t("home.specialistFallback")}
      </h3>
      <p className="truncate text-xs text-muted-foreground">{leilao.especialista?.especialidade || leilao.titulo}</p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("home.currentBid")}</div>
          <div className="font-display text-xl text-gradient-gold">{formatBRL(lanceAtual)}</div>
        </div>
        <div className="text-right">
          <Countdown endsAt={leilao.dataFim} className="text-sm" />
          <div className="mt-0.5 text-[10px] text-muted-foreground">{formatEndsAt(leilao.dataFim)}</div>
        </div>
      </div>
    </Link>
  );
}

function ProfessionalArea({ especialistaId, onCreateAuction }: { especialistaId: string; onCreateAuction: () => void }) {
  const { t } = useT();
  const { leiloes, totalLancesRecebidos, totalGanho } = useMyLeiloes(especialistaId);

  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-surface p-5">
      <div className="grid grid-cols-2 gap-3">
        <StatTile icon={<Gavel className="size-4" />} label={t("ln.totalBidsReceived")} value={String(totalLancesRecebidos)} />
        <StatTile icon={<Trophy className="size-4" />} label={t("ln.totalEarned")} value={formatBRL(totalGanho)} />
      </div>

      <button
        onClick={onCreateAuction}
        className="mt-5 w-full rounded-md bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold hover:opacity-90"
      >
        {t("pf.createAuction")}
      </button>

      <h3 className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("ln.myAuctions")}</h3>
      {leiloes.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">{t("ln.noAuctionsCreated")}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {leiloes.map((l) => (
            <MyLeilaoRow key={l.id} leilao={l} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-gold">{icon}</div>
      <div className="mt-2 font-display text-lg text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

const STATUS_TONE: Record<Leilao["status"], string> = {
  ativo: "border-gold/40 text-gold",
  encerrado: "border-border text-muted-foreground",
  cancelado: "border-destructive/40 text-destructive",
};

function MyLeilaoRow({ leilao }: { leilao: Leilao }) {
  const { t } = useT();
  const lanceAtual = leilao.lanceAtual ?? leilao.lanceMinimo;
  return (
    <Link
      to="/leilao/$id"
      params={{ id: leilao.id }}
      className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 p-3 transition-colors hover:border-gold/40"
    >
      <div className="min-w-0">
        <p className="truncate text-sm text-foreground">{leilao.titulo}</p>
        <span className={`mt-1 inline-block rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_TONE[leilao.status]}`}>
          {leilaoStatusLabel(t, leilao.status)}
        </span>
      </div>
      <div className="shrink-0 text-right font-display text-sm text-gradient-gold">{formatBRL(lanceAtual)}</div>
    </Link>
  );
}
