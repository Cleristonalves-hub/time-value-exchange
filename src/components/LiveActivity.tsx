import { useEffect, useState } from "react";
import { TrendingUp, Zap } from "lucide-react";
import { useT, nicheLabel } from "@/lib/i18n";

// Nomes próprios fictícios usados apenas para ilustrar o feed decorativo —
// não mudam entre idiomas, assim como os nomes dos especialistas fictícios.
const NAMES = [
  "Dra. Helena Vasconcellos",
  "Chef Marco Andreatta",
  "Ricardo Sarmento",
  "Beatriz Camargo",
  "Dr. Otávio Andrade",
  "Larissa Mendonça",
  "Prof. Iuri Bittencourt",
  "Isabela Ferraz",
  "Fernando Quintela",
  "Camila Rezende",
];
const NICHES = ["Saúde", "Direito", "Gastronomia", "Finanças", "Educação", "Design", "Música"];

type Event = { id: number; name: string; niche: string; value: number };

let seq = 0;
function makeEvent(): Event {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const niche = NICHES[Math.floor(Math.random() * NICHES.length)];
  const value = 800 + Math.floor(Math.random() * 42) * 250;
  return { id: ++seq, name, niche, value };
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function LiveActivity() {
  const { t } = useT();
  const [events, setEvents] = useState<Event[]>(() => Array.from({ length: 3 }, makeEvent));
  const [totalBids, setTotalBids] = useState(1247);
  const [online, setOnline] = useState(184);

  useEffect(() => {
    const t1 = setInterval(() => {
      setEvents((prev) => [makeEvent(), ...prev].slice(0, 4));
      setTotalBids((n) => n + 1 + Math.floor(Math.random() * 3));
    }, 2600);
    const t2 = setInterval(() => {
      setOnline((n) => Math.max(120, n + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(Math.random() * 3)));
    }, 1500);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-surface">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("liveActivity.live")}</span>
        </div>
        <div className="flex gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span><span className="text-gold font-mono">{online}</span> {t("liveActivity.online")}</span>
          <span><span className="text-gold font-mono">{totalBids.toLocaleString("pt-BR")}</span> {t("liveActivity.bidsToday")}</span>
        </div>
      </div>

      <ul className="divide-y divide-border/50">
        {events.map((e, i) => (
          <li
            key={e.id}
            className="flex items-center gap-3 px-5 py-3 animate-fade-in"
            style={{ opacity: 1 - i * 0.18 }}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold">
              {i === 0 ? <Zap className="size-4" /> : <TrendingUp className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">
                {t("liveActivity.newBid")} <span className="text-gold">{e.name}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{nicheLabel(t, e.niche)}</p>
            </div>
            <div className="font-display text-sm text-gradient-gold">{fmt(e.value)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
