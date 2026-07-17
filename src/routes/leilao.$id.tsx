import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Users, Video, Globe2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Countdown } from "@/components/Countdown";
import { getAuction, formatBRL } from "@/lib/auctions";
import { ReportButton } from "@/components/ReportDialog";
import { Disclaimer } from "@/components/Disclaimer";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/leilao/$id")({
  loader: ({ params }) => {
    const auction = getAuction(params.id);
    if (!auction) throw notFound();
    return { auction };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.auction.expert} — Valore` },
          { name: "description", content: loaderData.auction.specialty },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <p className="font-display text-2xl">Leilão não encontrado.</p>
        <Link to="/home" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
          Voltar aos leilões
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-muted-foreground">
      Algo não saiu como esperado. {error.message}
    </div>
  ),
  component: AuctionDetail,
});

function AuctionDetail() {
  const { auction: a } = Route.useLoaderData();
  const navigate = useNavigate();
  const [bid, setBid] = useState(a.currentBid + 200);
  const [confirmed, setConfirmed] = useState<number | null>(null);

  const minNext = a.currentBid + 100;
  const valid = bid > a.currentBid;

  const submit = () => {
    if (!valid) return;
    setConfirmed(bid);
  };

  return (
    <RequireAuth>
    <main className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative">
        <img
          src={a.photo}
          alt={a.expert}
          width={768}
          height={768}
          className="h-[420px] w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
        <button
          onClick={() => navigate({ to: "/home" })}
          className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 p-2 text-foreground backdrop-blur hover:border-gold/40 hover:text-gold"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
          <div className="mx-auto max-w-2xl">
            <span className="inline-block rounded-sm border border-gold/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
              {a.niche}
            </span>
            <h1 className="mt-3 font-display text-3xl leading-tight">{a.expert}</h1>
            <p className="text-sm text-foreground/80">{a.specialty}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5">
        {/* Credentials */}
        <div className="-mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-sm border border-gold/30 bg-surface px-2.5 py-1 text-[11px] text-gold">
            <Sparkles className="h-3 w-3" /> {a.credential}
          </span>
        </div>

        {/* Bid card */}
        <section className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 shadow-gold">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Lance atual
              </div>
              <div className="font-display text-4xl text-gradient-gold">
                {formatBRL(a.currentBid)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Encerra em
              </div>
              <Countdown endsAt={a.endsAt} variant="live" className="text-xl" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {a.seats} {a.seats === 1 ? "vaga" : "vagas"}
            </span>
            <span className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" /> {a.platform}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5" /> {a.languages.join(" · ")}
            </span>
          </div>
        </section>

        {/* Bio */}
        <section className="mt-6">
          <h2 className="font-display text-lg">Sobre</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">{a.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {a.tags.map((t: string) => (
              <span key={t} className="rounded-full border border-border/60 px-3 py-1 text-[11px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Included */}
        <section className="mt-6 rounded-xl border border-border/60 bg-surface p-5">
          <h3 className="text-[10px] uppercase tracking-widest text-gold">O que está incluso</h3>
          <p className="mt-2 text-sm text-foreground/80">{a.included}</p>
        </section>

        {/* History */}
        <section className="mt-6">
          <h3 className="font-display text-lg">Últimos lances</h3>
          <ul className="mt-3 divide-y divide-border/60 rounded-xl border border-border/60 bg-surface">
            {a.history.map((h: { value: number; at: string }, i: number) => (
              <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-muted-foreground">Lance anônimo · {h.at}</span>
                <span className="font-mono tabular-nums text-gold">{formatBRL(h.value)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bid form */}
        <section className="mt-8">
          <h3 className="font-display text-lg">Seu lance</h3>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-gold/30 bg-surface px-4 py-3 focus-within:border-gold">
            <span className="text-sm text-muted-foreground">R$</span>
            <input
              type="number"
              value={bid}
              min={minNext}
              step={100}
              onChange={(e) => setBid(Number(e.target.value))}
              className="w-full bg-transparent font-display text-2xl outline-none"
            />
          </div>
          <div className="mt-3 flex gap-2">
            {[200, 500, 1000].map((inc) => (
              <button
                key={inc}
                onClick={() => setBid(a.currentBid + inc)}
                className="flex-1 rounded-md border border-border/60 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
              >
                +{formatBRL(inc)}
              </button>
            ))}
          </div>
          {!valid && (
            <p className="mt-2 text-xs text-destructive">
              Seu lance precisa superar o atual de {formatBRL(a.currentBid)}.
            </p>
          )}

          <button
            disabled={!valid}
            onClick={submit}
            className="mt-5 w-full rounded-md bg-gradient-gold py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirmar lance
          </button>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Ao vencer, você tem 24h para confirmar o agendamento. Comissão de 20% retida
            pela plataforma. Sessão realizada 100% online por videochamada.
          </p>

          <div className="mt-6 flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-4 py-3">
            <p className="text-[11px] text-muted-foreground">
              Algo errado com este especialista?
            </p>
            <ReportButton target={a.expert} />
          </div>
        </section>

        <Disclaimer variant="inline" />
      </div>



      {/* Confirmation modal */}
      {confirmed !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl border border-gold/40 bg-surface p-8 text-center shadow-gold sm:rounded-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-gold/10">
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-display text-2xl">Lance registrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Seu lance de{" "}
              <span className="text-gradient-gold font-display text-base">
                {formatBRL(confirmed)}
              </span>{" "}
              foi confirmado.
            </p>
            <div className="mt-4 inline-block rounded-full border border-success/40 bg-success/10 px-3 py-1 text-[11px] uppercase tracking-widest text-success">
              Você está vencendo
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => setConfirmed(null)}
                className="rounded-md border border-gold/40 py-3 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
              >
                Continuar acompanhando
              </button>
              <Link
                to="/home"
                className="rounded-md py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Voltar aos leilões
              </Link>
              <div className="mt-2 border-t border-border/60 pt-3">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Após a sessão
                </p>
                <ReportButton target={a.expert} variant="outline" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    </RequireAuth>
  );
}
