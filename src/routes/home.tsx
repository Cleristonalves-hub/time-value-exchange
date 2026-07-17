import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ValoreLogo, ValoreMark } from "@/components/ValoreLogo";
import { BottomNav } from "@/components/BottomNav";
import { Disclaimer } from "@/components/Disclaimer";
import { AuctionCard } from "@/components/AuctionCard";
import { Countdown } from "@/components/Countdown";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LiveActivity } from "@/components/LiveActivity";
import { useT } from "@/lib/i18n";
import { auctions, niches, formatBRL, formatEndsAt } from "@/lib/auctions";
import { RequireAuth } from "@/components/RequireAuth";

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return { greeting: "Bom dia.", period: "esta manhã" };
  if (h < 18) return { greeting: "Boa tarde.", period: "esta tarde" };
  return { greeting: "Boa noite.", period: "esta noite" };
}



export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Leilões em andamento — Valore" },
      { name: "description", content: "Explore os leilões ativos dos profissionais mais admirados do Brasil." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [niche, setNiche] = useState("Todos");
  const { greeting, period } = useMemo(getTimeOfDay, []);
  const auctionsCount = auctions.length;


  const featured = useMemo(
    () => [...auctions].sort((a, b) => a.endsAt - b.endsAt)[0],
    [],
  );

  const filtered = useMemo(() => {
    return auctions.filter((a) => {
      const matchN = niche === "Todos" || a.niche === niche;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        a.expert.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchN && matchQ;
    });
  }, [query, niche]);

  return (
    <RequireAuth>
    <main className="min-h-screen pb-24">
      {/* Header */}
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
        <p className="font-display text-2xl text-foreground">{greeting}</p>
        <p className="text-sm text-muted-foreground">
          {auctionsCount} leilões aguardam seus lances {period}.
        </p>

        <LiveActivity />



        {/* Featured */}
        <Link
          to="/leilao/$id"
          params={{ id: featured.id }}
          className="group mt-6 block overflow-hidden rounded-2xl border border-gold/30 bg-surface shadow-gold"
        >
          <div className="relative">
            <img
              src={featured.photo}
              alt={featured.expert}
              width={768}
              height={420}
              className="h-56 w-full object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
              {t("home.featured")}
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-[10px] uppercase tracking-widest text-gold/80">
                {featured.niche}
              </div>
              <h2 className="font-display text-2xl leading-tight text-foreground">
                {featured.expert}
              </h2>
              <p className="text-xs text-foreground/70">{featured.specialty}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("home.currentBid")}
                  </div>
                  <div className="font-display text-3xl text-gradient-gold">
                    {formatBRL(featured.currentBid)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("home.endsIn")}
                  </div>
                  <Countdown endsAt={featured.endsAt} className="text-lg" />
                  <div className="mt-0.5 text-[10px] text-foreground/60">
                    {formatEndsAt(featured.endsAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="mt-6 flex items-center gap-2 rounded-md border border-border/60 bg-surface px-3 py-3 focus-within:border-gold/50">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("home.search")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Niche filters */}
        <div className="-mx-5 mt-4 overflow-x-auto px-5">
          <div className="flex w-max gap-2 pb-1">
            {niches.map((n) => {
              const active = n === niche;
              return (
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                    active
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border/60 text-muted-foreground hover:border-gold/40 hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Auction list */}
        <section className="mt-6 space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-lg">{t("home.activeAuctions")}</h3>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {filtered.length} {t("home.results")}
            </span>
          </div>
          {filtered.map((a) => (
            <AuctionCard key={a.id} a={a} />
          ))}
          {filtered.length === 0 && (
            <p className="rounded-md border border-border/60 bg-surface p-8 text-center text-sm text-muted-foreground">
              {t("home.empty")}
            </p>
          )}
        </section>
      </div>
      <Disclaimer />
      <BottomNav />
    </main>
    </RequireAuth>
  );
}
