import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Sparkles, CreditCard, AlertTriangle } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { formatBRL, formatEndsAt } from "@/lib/auctions";
import { ReportButton } from "@/components/ReportDialog";
import { Disclaimer } from "@/components/Disclaimer";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useLeilao, useLances, useMyCard, useMySpecialist, darLance, cancelarLeilao } from "@/lib/store";
import { useT, leilaoStatusLabel } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/leilao/$id")({
  head: () => ({ meta: [{ title: "Leilão — Valore" }] }),
  component: () => (
    <RequireAuth>
      <AuctionDetail />
    </RequireAuth>
  ),
});

function AuctionDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const leilao = useLeilao(id);
  const lances = useLances(id);
  const cartao = useMyCard(user?.id);
  const meuEspecialista = useMySpecialist(user?.id, user?.email ?? undefined);

  const [bid, setBid] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [aceite, setAceite] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [cancelando, setCancelando] = useState(false);

  if (!leilao) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-2xl">{t("lz.notFound")}</p>
          <Link to="/home" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
            {t("lz.backToAuctions")}
          </Link>
        </div>
      </div>
    );
  }

  const souDono = !!meuEspecialista && meuEspecialista.id === leilao.especialistaId;
  const lanceAtual = leilao.lanceAtual ?? leilao.lanceMinimo;
  const minNext = lanceAtual + 100;
  const podeDarLance = leilao.status === "ativo" && !souDono;

  function abrirModal() {
    if (!cartao) {
      toast.error(t("lz.cardRequiredToast"));
      navigate({ to: "/cartao" });
      return;
    }
    if (bid <= lanceAtual) return;
    setAceite(false);
    setShowModal(true);
  }

  async function confirmarLance() {
    if (!aceite) return;
    setSubmitting(true);
    const { error } = await darLance(leilao!.id, bid);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    setShowModal(false);
    toast.success(t("lz.bidRegistered"));
  }

  async function confirmarCancelamento() {
    setCancelando(true);
    const { error } = await cancelarLeilao(leilao!.id, cancelMotivo);
    setCancelando(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(t("lz.auctionCancelled"));
    setCancelOpen(false);
    navigate({ to: "/perfil" });
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="relative flex h-56 items-end bg-gradient-gold/10 px-5 pb-6">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 p-2 text-foreground backdrop-blur hover:border-gold/40 hover:text-gold"
          aria-label={t("lz.back")}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <div className="mx-auto w-full max-w-2xl">
          <span className="inline-block rounded-sm border border-gold/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
            {leilao.especialista?.nicho || t("lz.specialistFallback")}
          </span>
          <h1 className="mt-3 font-display text-3xl leading-tight">{leilao.especialista?.nome || t("lz.specialistFallback")}</h1>
          <p className="text-sm text-foreground/80">{leilao.titulo}</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5">
        {souDono && (
          <div className="mt-4 rounded-xl border border-border/60 bg-surface p-4">
            {leilao.status === "ativo" ? (
              <button
                onClick={() => setCancelOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive/40 py-2 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10"
              >
                {t("lz.cancelAuction")}
              </button>
            ) : (
              <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                {t("lz.status", { status: leilaoStatusLabel(t, leilao.status) })}
              </p>
            )}
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 shadow-gold">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("lz.currentBid")}</div>
              <div className="font-display text-4xl text-gradient-gold">{formatBRL(lanceAtual)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("lz.endsIn")}</div>
              <Countdown endsAt={leilao.dataFim} variant="live" className="text-xl" />
              <div className="mt-0.5 text-[10px] text-muted-foreground">{formatEndsAt(leilao.dataFim)}</div>
            </div>
          </div>
        </section>

        {leilao.descricao && (
          <section className="mt-6">
            <h2 className="font-display text-lg">{t("lz.aboutAuction")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{leilao.descricao}</p>
          </section>
        )}

        <section className="mt-6">
          <h3 className="font-display text-lg">{t("lz.recentBids")}</h3>
          {lances.length === 0 ? (
            <p className="mt-3 rounded-xl border border-border/60 bg-surface p-4 text-center text-sm text-muted-foreground">
              {t("lz.noBidsYet")}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border/60 rounded-xl border border-border/60 bg-surface">
              {lances.map((l) => (
                <li key={l.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-muted-foreground">{t("lz.anonymousBid")}</span>
                  <span className="font-mono tabular-nums text-gold">{formatBRL(l.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {podeDarLance && (
          <section className="mt-8">
            <h3 className="font-display text-lg">{t("lz.yourBid")}</h3>

            {!cartao && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4">
                <CreditCard className="size-5 shrink-0 text-gold" />
                <div className="flex-1 text-xs text-foreground/80">{t("lz.needCardMsg")}</div>
                <Link to="/cartao" className="shrink-0 text-xs font-semibold uppercase tracking-widest text-gold underline-offset-4 hover:underline">
                  {t("lz.registerCard")}
                </Link>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-gold/30 bg-surface px-4 py-3 focus-within:border-gold">
              <span className="text-sm text-muted-foreground">R$</span>
              <input
                type="number"
                value={bid || ""}
                min={minNext}
                step={100}
                onChange={(e) => setBid(Number(e.target.value))}
                placeholder={String(minNext)}
                className="w-full bg-transparent font-display text-2xl outline-none"
              />
            </div>
            <div className="mt-3 flex gap-2">
              {[200, 500, 1000].map((inc) => (
                <button
                  key={inc}
                  onClick={() => setBid(lanceAtual + inc)}
                  className="flex-1 rounded-md border border-border/60 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
                >
                  +{formatBRL(inc)}
                </button>
              ))}
            </div>
            {bid > 0 && bid <= lanceAtual && (
              <p className="mt-2 text-xs text-destructive">{t("lz.bidMustExceed", { value: formatBRL(lanceAtual) })}</p>
            )}

            <button
              disabled={bid <= lanceAtual}
              onClick={abrirModal}
              className="mt-5 w-full rounded-md bg-gradient-gold py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("lz.confirmBid")}
            </button>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">{t("lz.chargeNote")}</p>

            <div className="mt-6 flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-4 py-3">
              <p className="text-[11px] text-muted-foreground">{t("lz.somethingWrong")}</p>
              <ReportButton target={leilao.especialista?.nome || t("lz.specialistFallback")} />
            </div>
          </section>
        )}

        <Disclaimer variant="inline" />
      </div>

      {/* Modal de irretratabilidade do lance (item 3) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl border border-gold/40 bg-surface p-8 sm:rounded-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-gold/10">
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <h3 className="text-center font-display text-2xl">{t("lz.bidModalTitle")}</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">{t("lz.bidValueLabel")}</p>
            <p className="text-center font-display text-3xl text-gradient-gold">{formatBRL(bid)}</p>

            <div className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-xs leading-relaxed text-foreground/80">
              {t("lz.irrevocableNotice")}
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs text-foreground/80">
              <input
                type="checkbox"
                checked={aceite}
                onChange={() => setAceite((v) => !v)}
                className="mt-0.5 size-4 accent-[color:var(--gold)]"
              />
              {t("lz.acceptTerms")}
            </label>

            <div className="mt-6 flex flex-col gap-2">
              <button
                disabled={!aceite || submitting}
                onClick={confirmarLance}
                className="rounded-md bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold disabled:opacity-40"
              >
                {submitting ? t("lz.sending") : t("lz.confirmBid")}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {t("lz.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cancelamento do leilão pelo especialista dono (item 7) */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl border border-destructive/40 bg-surface p-8 sm:rounded-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-destructive bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-center font-display text-2xl">{t("lz.cancelModalTitle")}</h3>
            <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">{t("lz.cancelPolicy")}</p>
            <textarea
              value={cancelMotivo}
              onChange={(e) => setCancelMotivo(e.target.value)}
              placeholder={t("lz.cancelReasonPlaceholder")}
              rows={3}
              className="mt-4 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <div className="mt-5 flex flex-col gap-2">
              <button
                disabled={cancelando}
                onClick={confirmarCancelamento}
                className="rounded-md border border-destructive/50 bg-destructive/10 py-3 text-xs font-semibold uppercase tracking-widest text-destructive hover:bg-destructive/20 disabled:opacity-40"
              >
                {cancelando ? t("lz.cancelling") : t("lz.confirmCancel")}
              </button>
              <button
                onClick={() => setCancelOpen(false)}
                className="rounded-md py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {t("lz.back")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
