import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BadgeCheck, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { niches } from "@/lib/auctions";
import { useSpecialists, type Specialist } from "@/lib/store";
import { Disclaimer } from "@/components/Disclaimer";
import { RequireAuth } from "@/components/RequireAuth";
import { useT, nicheLabel } from "@/lib/i18n";

export const Route = createFileRoute("/explorar")({
  head: () => ({ meta: [{ title: "Explorar — Valore" }] }),
  component: ExplorePage,
});

function ExplorePage() {
  const { t } = useT();
  const specialists = useSpecialists();
  const [query, setQuery] = useState("");
  const [niche, setNiche] = useState("Todos");

  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const availableSpecialists = useMemo(
    () => specialists.filter((s) => s.status !== "suspenso" && s.status !== "reprovado"),
    [specialists],
  );

  const filteredSpecialists = useMemo(() => {
    return availableSpecialists.filter((s) => {
      if (niche !== "Todos" && s.niche !== niche) return false;
      if (!query) return true;
      const q = norm(query);
      return norm(s.fullName).includes(q) || norm(s.specialty).includes(q) || norm(s.niche).includes(q);
    });
  }, [availableSpecialists, query, niche]);

  return (
    <RequireAuth>
    <main className="min-h-screen pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="font-display text-3xl">{t("ex.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("ex.subtitle")}</p>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border/60 bg-surface px-4 py-3 focus-within:border-gold">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("ex.searchPlaceholder")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {niches.map((n) => {
            const active = niche === n;
            return (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}
              >
                {nicheLabel(t, n)}
              </button>
            );
          })}
        </div>

        <section className="mt-6">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("ex.specialists")}</h2>
          {availableSpecialists.length === 0 ? (
            <p className="mt-3 rounded-xl border border-border/60 bg-surface p-6 text-center text-sm text-muted-foreground">
              {t("ex.emptyNone")}
            </p>
          ) : filteredSpecialists.length === 0 ? (
            <p className="mt-3 rounded-xl border border-border/60 bg-surface p-6 text-center text-sm text-muted-foreground">
              {t("ex.emptyFiltered")}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {filteredSpecialists.map((s) => <SpecialistCard key={s.id} s={s} />)}
            </ul>
          )}
        </section>
      </div>
      <Disclaimer />
      <BottomNav />
    </main>
    </RequireAuth>
  );
}

function SpecialistCard({ s }: { s: Specialist }) {
  const { t } = useT();
  const verified = s.status === "verificado";
  return (
    <li className="rounded-xl border border-border/60 bg-surface p-4">
      <div className="flex items-start gap-3">
        {s.photoUrl ? (
          <img src={s.photoUrl} alt="" className="size-12 shrink-0 rounded-full object-cover ring-1 ring-gold/30" />
        ) : (
          <div className="size-12 shrink-0 rounded-full bg-gradient-gold" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg leading-tight">{s.fullName}</h3>
            {verified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-success">
                <BadgeCheck className="size-3" /> {t("ex.verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
                <Sparkles className="size-3" /> {t("ex.new")}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gold">{nicheLabel(t, s.niche)} · {s.specialty}</p>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">{s.credential}</p>
        </div>
      </div>
    </li>
  );
}
