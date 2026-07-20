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
          <p className="font-display text-2xl">Leilão não encontrado.</p>
          <Link to="/home" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
            Voltar aos leilões
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
      toast.error("Cadastre um cartão antes de dar lances.");
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
    toast.success("Lance registrado.");
  }

  async function confirmarCancelamento() {
    setCancelando(true);
    const { error } = await cancelarLeilao(leilao!.id, cancelMotivo);
    setCancelando(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Leilão cancelado.");
    setCancelOpen(false);
    navigate({ to: "/perfil" });
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="relative flex h-56 items-end bg-gradient-gold/10 px-5 pb-6">
        <button
          onClick={() => navigate({ to: "/home" })}
          className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 p-2 text-foreground backdrop-blur hover:border-gold/40 hover:text-gold"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <div className="mx-auto w-full max-w-2xl">
          <span className="inline-block rounded-sm border border-gold/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
            {leilao.especialista?.nicho || "Especialista"}
          </span>
          <h1 className="mt-3 font-display text-3xl leading-tight">{leilao.especialista?.nome || "Especialista"}</h1>
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
                Cancelar leilão
              </button>
            ) : (
              <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Status: {leilao.status}
              </p>
            )}
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 shadow-gold">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Lance atual</div>
              <div className="font-display text-4xl text-gradient-gold">{formatBRL(lanceAtual)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Encerra em</div>
              <Countdown endsAt={leilao.dataFim} variant="live" className="text-xl" />
              <div className="mt-0.5 text-[10px] text-muted-foreground">{formatEndsAt(leilao.dataFim)}</div>
            </div>
          </div>
        </section>

        {leilao.descricao && (
          <section className="mt-6">
            <h2 className="font-display text-lg">Sobre o leilão</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{leilao.descricao}</p>
          </section>
        )}

        <section className="mt-6">
          <h3 className="font-display text-lg">Últimos lances</h3>
          {lances.length === 0 ? (
            <p className="mt-3 rounded-xl border border-border/60 bg-surface p-4 text-center text-sm text-muted-foreground">
              Nenhum lance ainda. Seja o primeiro.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border/60 rounded-xl border border-border/60 bg-surface">
              {lances.map((l) => (
                <li key={l.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Lance anônimo</span>
                  <span className="font-mono tabular-nums text-gold">{formatBRL(l.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {podeDarLance && (
          <section className="mt-8">
            <h3 className="font-display text-lg">Seu lance</h3>

            {!cartao && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4">
                <CreditCard className="size-5 shrink-0 text-gold" />
                <div className="flex-1 text-xs text-foreground/80">
                  Você precisa cadastrar um cartão para dar lances.
                </div>
                <Link to="/cartao" className="shrink-0 text-xs font-semibold uppercase tracking-widest text-gold underline-offset-4 hover:underline">
                  Cadastrar
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
              <p className="mt-2 text-xs text-destructive">
                Seu lance precisa superar o atual de {formatBRL(lanceAtual)}.
              </p>
            )}

            <button
              disabled={bid <= lanceAtual}
              onClick={abrirModal}
              className="mt-5 w-full rounded-md bg-gradient-gold py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirmar lance
            </button>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              Ao vencer, sua cobrança é processada automaticamente via cartão cadastrado. Comissão de
              20% retida pela plataforma. Sessão realizada 100% online por videochamada.
            </p>

            <div className="mt-6 flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-4 py-3">
              <p className="text-[11px] text-muted-foreground">Algo errado com este especialista?</p>
              <ReportButton target={leilao.especialista?.nome || "especialista"} />
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
            <h3 className="text-center font-display text-2xl">Confirmar lance</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">Valor do lance</p>
            <p className="text-center font-display text-3xl text-gradient-gold">{formatBRL(bid)}</p>

            <div className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-xs leading-relaxed text-foreground/80">
              Ao confirmar, você assume um compromisso irrevogável de compra. Em caso de desistência,
              multa de 20% do valor do lance será aplicada.
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs text-foreground/80">
              <input
                type="checkbox"
                checked={aceite}
                onChange={() => setAceite((v) => !v)}
                className="mt-0.5 size-4 accent-[color:var(--gold)]"
              />
              Entendo e aceito os termos
            </label>

            <div className="mt-6 flex flex-col gap-2">
              <button
                disabled={!aceite || submitting}
                onClick={confirmarLance}
                className="rounded-md bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold disabled:opacity-40"
              >
                {submitting ? "Enviando…" : "Confirmar lance"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Cancelar
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
            <h3 className="text-center font-display text-2xl">Cancelar leilão</h3>
            <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              Cancelamento até 2h antes do início não tem penalidade. Com menos de 2h de antecedência,
              seu perfil recebe o badge "Cancelamento recente" por 7 dias. Após 3 cancelamentos
              penalizados no mesmo mês, sua conta é suspensa por 30 dias.
            </p>
            <textarea
              value={cancelMotivo}
              onChange={(e) => setCancelMotivo(e.target.value)}
              placeholder="Motivo do cancelamento (opcional)"
              rows={3}
              className="mt-4 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <div className="mt-5 flex flex-col gap-2">
              <button
                disabled={cancelando}
                onClick={confirmarCancelamento}
                className="rounded-md border border-destructive/50 bg-destructive/10 py-3 text-xs font-semibold uppercase tracking-widest text-destructive hover:bg-destructive/20 disabled:opacity-40"
              >
                {cancelando ? "Cancelando…" : "Confirmar cancelamento"}
              </button>
              <button
                onClick={() => setCancelOpen(false)}
                className="rounded-md py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
