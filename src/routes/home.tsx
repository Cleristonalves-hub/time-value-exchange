import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { ValoreLogo, ValoreMark } from "@/components/ValoreLogo";
import { BottomNav } from "@/components/BottomNav";
import { Disclaimer } from "@/components/Disclaimer";
import { Countdown } from "@/components/Countdown";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LiveActivity } from "@/components/LiveActivity";
import { RequireAuth } from "@/components/RequireAuth";
import { auctions, formatBRL, formatEndsAt } from "@/lib/auctions";
import { useActiveLeiloes } from "@/lib/store";

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia.";
  if (h < 18) return "Boa tarde.";
  return "Boa noite.";
}

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Leilões em andamento — Valore" },
      { name: "description", content: "Explore os leilões ativos dos profissionais mais admirados do Brasil." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Home />
    </RequireAuth>
  ),
});

function Home() {
  const leiloes = useActiveLeiloes();

  return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ValoreMark size={36} className="h-9 w-9" />
            <ValoreLogo className="text-xl" />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              aria-label="Notificações"
              className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Bell className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 pt-6">
        <p className="font-display text-2xl text-foreground">{getTimeOfDay()}</p>

        {/* Parte superior — Atividade ao vivo */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <LiveActivity />
          <FictitiousCarousel />
        </section>

        {/* Parte inferior — Especialistas reais */}
        <section className="mt-8">
          <h2 className="font-display text-lg">Especialistas disponíveis agora</h2>
          {leiloes.length === 0 ? (
            <p className="mt-4 rounded-md border border-border/60 bg-surface p-8 text-center text-sm text-muted-foreground">
              Nenhum especialista ou leilão disponível no momento. Volte em breve.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {leiloes.map((l) => (
                <LeilaoCard key={l.id} leilao={l} />
              ))}
            </div>
          )}
        </section>
      </div>
      <Disclaimer />
      <BottomNav />
    </main>
  );
}

function LeilaoCard({ leilao }: { leilao: ReturnType<typeof useActiveLeiloes>[number] }) {
  const lanceAtual = leilao.lanceAtual ?? leilao.lanceMinimo;
  return (
    <Link
      to="/leilao/$id"
      params={{ id: leilao.id }}
      className="block overflow-hidden rounded-xl border border-border/60 bg-surface p-4 transition-all hover:border-gold/50 hover:shadow-gold"
    >
      <div className="mb-1 inline-block rounded-sm border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
        {leilao.especialista?.nicho || "Especialista"}
      </div>
      <h3 className="font-display text-lg leading-tight text-foreground">
        {leilao.especialista?.nome || "Especialista"}
      </h3>
      <p className="truncate text-xs text-muted-foreground">{leilao.especialista?.especialidade || leilao.titulo}</p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Lance atual</div>
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

// Carrossel decorativo com especialistas fictícios, deixando claro que são só
// ilustrativos (badge "Exemplo") — não linka para lugar nenhum.
function FictitiousCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % auctions.length), 3200);
    return () => clearInterval(t);
  }, []);

  const a = auctions[index];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface">
      <div className="absolute right-3 top-3 z-10 rounded-full border border-gold/40 bg-background/70 px-2.5 py-1 text-[9px] uppercase tracking-widest text-gold backdrop-blur">
        Exemplo
      </div>
      <img
        src={a.photo}
        alt={a.expert}
        className="h-40 w-full object-cover object-top opacity-90 grayscale-[15%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="text-[10px] uppercase tracking-widest text-gold/80">{a.niche}</div>
        <h3 className="font-display text-lg leading-tight text-foreground">{a.expert}</h3>
        <p className="text-[11px] text-foreground/70">{a.specialty}</p>
      </div>
      <div className="flex justify-center gap-1.5 py-2.5">
        {auctions.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${i === index ? "w-4 bg-gold" : "w-1 bg-border"}`}
          />
        ))}
      </div>
    </section>
  );
}
