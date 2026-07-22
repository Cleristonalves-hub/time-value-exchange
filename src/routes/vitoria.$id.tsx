import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Trophy, Video, Copy, CalendarCheck, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { auctions, formatBRL } from "@/lib/auctions";
import { RequireAuth } from "@/components/RequireAuth";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/vitoria/$id")({
  head: () => ({ meta: [{ title: "Você venceu — Valore" }] }),
  component: WinPage,
  notFoundComponent: () => {
    const { t } = useT();
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <p className="text-muted-foreground">{t("vt.notFound")}</p>
      </main>
    );
  },
  errorComponent: () => {
    const { t } = useT();
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <p className="text-destructive">{t("vt.loadError")}</p>
      </main>
    );
  },
  loader: ({ params }) => {
    const a = auctions.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { auction: a };
  },
});

function nextDates() {
  const out: { iso: string; label: string; weekday: string; slots: string[] }[] = [];
  const base = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      slots: ["09:00", "11:30", "14:00", "16:30", "19:00"],
    });
  }
  return out;
}

function WinPage() {
  const { auction } = Route.useLoaderData();
  const { t } = useT();
  const days = useMemo(nextDates, []);
  const [day, setDay] = useState(days[0].iso);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const meetLink = useMemo(() => {
    const slug = Math.random().toString(36).slice(2, 6);
    return `https://meet.valore.app/${auction.id}-${slug}`;
  }, [auction.id]);

  if (confirmed) {
    return (
      <RequireAuth>
      <main className="min-h-screen px-5 pt-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <CalendarCheck className="size-10 text-background" />
          </div>
          <h1 className="mt-6 font-display text-3xl">{t("vt.sessionConfirmed")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("vt.sessionConfirmedDetail", { day, time: time ?? "", expert: auction.expert })}
          </p>

          <div className="mt-8 rounded-2xl border border-gold/30 bg-surface p-5 text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{t("vt.videoCallLink")}</p>
            <p className="mt-2 break-all font-mono text-sm">{meetLink}</p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(meetLink);
                setCopied(true);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-gold/50 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? t("vt.linkCopied") : t("vt.copyLink")}
            </button>
          </div>

          <Link
            to="/home"
            className="mt-6 inline-block text-xs uppercase tracking-widest text-muted-foreground hover:text-gold"
          >
            {t("vt.backHome")}
          </Link>
        </div>
      </main>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
    <main className="min-h-screen px-5 pt-10 pb-12">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="relative mx-auto size-28">
            <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
            <div className="relative mx-auto flex size-28 items-center justify-center rounded-full bg-gradient-gold shadow-gold animate-scale-in">
              <Trophy className="size-14 text-background" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-gold">{t("vt.congrats")}</p>
          <h1 className="mt-2 font-display text-4xl text-gradient-gold">{t("vt.youWon")}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("vt.exclusiveHourPrefix")} <span className="text-foreground">{auction.expert}</span>
            <br />
            {t("vt.exclusiveHourFor")} <span className="text-gold">{formatBRL(auction.currentBid)}</span>
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("vt.chooseDay")}</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.iso}
                onClick={() => {
                  setDay(d.iso);
                  setTime(null);
                }}
                className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 text-xs ${
                  day === d.iso
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                <span className="uppercase tracking-widest text-[9px]">{d.weekday}</span>
                <span className="mt-1 font-display text-base">{d.label}</span>
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("vt.schedule")}</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {days.find((d) => d.iso === day)?.slots.map((s) => (
              <button
                key={s}
                onClick={() => setTime(s)}
                className={`rounded-md border py-2 text-sm ${
                  time === s ? "border-gold bg-gold/10 text-gold" : "border-border/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 flex items-center gap-2 rounded-md border border-border/60 bg-surface p-3 text-xs text-muted-foreground">
          <Video className="size-4 text-gold" />
          {t("vt.linkNote", { platform: auction.platform })}
        </div>

        <button
          onClick={() => setConfirmed(true)}
          disabled={!time}
          className="mt-6 w-full rounded-md bg-gradient-gold py-3 text-sm font-semibold uppercase tracking-widest text-background disabled:opacity-40"
        >
          {t("vt.confirmSchedule")}
        </button>
      </div>
    </main>
    </RequireAuth>
  );
}
