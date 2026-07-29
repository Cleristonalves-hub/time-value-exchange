import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Video, CalendarCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/auctions";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useLeilao, useSpecialist, useMyAgendamento, criarAgendamento } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { translateErrorMessage } from "@/lib/errorMessages";
import { toast } from "sonner";

export const Route = createFileRoute("/vitoria/$id")({
  head: () => ({ meta: [{ title: "Você venceu — Valore" }] }),
  component: () => (
    <RequireAuth>
      <WinPage />
    </RequireAuth>
  ),
});

// Mapeia JS Date.getDay() (0 = domingo) para os códigos usados no perfil do
// especialista (dias_disponibilidade: "seg","ter",...) — leitura sempre no
// horário local do navegador, como o resto do app já faz (nenhuma tela usa
// fuso horário explícito hoje).
const WEEKDAY_CODE_BY_JS_DAY = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

type DiaComHorarios = { iso: string; label: string; weekday: string; slots: string[] };

function buildDiasDisponiveis(availableDays: string[], startTime: string, endTime: string, durationMin: number): DiaComHorarios[] {
  if (availableDays.length === 0 || !startTime || !endTime || durationMin <= 0) return [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  if ([startH, startM, endH, endM].some((n) => Number.isNaN(n))) return [];

  const out: DiaComHorarios[] = [];
  const base = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const codigo = WEEKDAY_CODE_BY_JS_DAY[d.getDay()];
    if (!availableDays.includes(codigo)) continue;

    const slots: string[] = [];
    let cursorMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    while (cursorMin + durationMin <= endMin) {
      const hh = String(Math.floor(cursorMin / 60)).padStart(2, "0");
      const mm = String(cursorMin % 60).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      cursorMin += durationMin;
    }
    if (slots.length === 0) continue;

    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      weekday: codigo,
      slots,
    });
  }
  return out;
}

function combinarDataHora(iso: string, hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(`${iso}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

function WinPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { t } = useT();
  const leilao = useLeilao(id);
  const especialista = useSpecialist(leilao?.especialistaId);
  const agendamento = useMyAgendamento(id);

  const dias = useMemo(
    () =>
      especialista
        ? buildDiasDisponiveis(especialista.availableDays, especialista.startTime, especialista.endTime, Number(especialista.duration) || 60)
        : [],
    [especialista],
  );
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const diaAtual = day ?? dias[0]?.iso ?? null;

  if (!leilao) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-2xl">{t("vt.notFound")}</p>
          <Link to="/home" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
            {t("vt.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  if (leilao.status !== "encerrado") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-2xl">{t("vt.notDecidedTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("vt.notDecidedMsg")}</p>
          <Link
            to="/leilao/$id"
            params={{ id: leilao.id }}
            className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline"
          >
            {t("vt.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  if (!user || leilao.vencedorUsuarioId !== user.id) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-2xl">{t("vt.notWinnerTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("vt.notWinnerMsg")}</p>
          <Link to="/home" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
            {t("vt.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  const nomeEspecialista = especialista?.fullName || leilao.especialista?.nome || "";

  async function onConfirmar() {
    if (!diaAtual || !time) return;
    setSubmitting(true);
    const dataHora = combinarDataHora(diaAtual, time);
    const { error } = await criarAgendamento(leilao!.id, dataHora);
    setSubmitting(false);
    if (error) {
      toast.error(translateErrorMessage(error, t));
      return;
    }
    toast.success(t("vt.sessionConfirmed"));
  }

  if (agendamento) {
    const dataFmt = new Date(agendamento.dataHora).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const horaFmt = new Date(agendamento.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return (
      <main className="min-h-screen px-5 pt-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <CalendarCheck className="size-10 text-background" />
          </div>
          <h1 className="mt-6 font-display text-3xl">{t("vt.sessionConfirmed")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("vt.sessionConfirmedDetail", { day: dataFmt, time: horaFmt, expert: nomeEspecialista })}
          </p>

          <div className="mt-8 flex items-center gap-2 rounded-md border border-border/60 bg-surface p-4 text-left text-xs text-muted-foreground">
            <Video className="size-4 shrink-0 text-gold" />
            {t("vt.platformNote", { platform: agendamento.plataforma || especialista?.platform || "—" })}
          </div>

          <Link
            to="/home"
            className="mt-6 inline-block text-xs uppercase tracking-widest text-muted-foreground hover:text-gold"
          >
            {t("vt.backHome")}
          </Link>
        </div>
      </main>
    );
  }

  return (
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
            {t("vt.exclusiveHourPrefix")} <span className="text-foreground">{nomeEspecialista}</span>
            <br />
            {t("vt.exclusiveHourFor")} <span className="text-gold">{formatBRL(leilao.lanceAtual ?? leilao.lanceMinimo)}</span>
          </p>
        </div>

        {dias.length === 0 ? (
          <p className="mt-10 rounded-xl border border-border/60 bg-surface p-6 text-center text-sm text-muted-foreground">
            {t("vt.noAvailability")}
          </p>
        ) : (
          <section className="mt-10">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("vt.chooseDay")}</h2>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {dias.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => {
                    setDay(d.iso);
                    setTime(null);
                  }}
                  className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 text-xs ${
                    diaAtual === d.iso ? "border-gold bg-gold/10 text-gold" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  <span className="uppercase tracking-widest text-[9px]">{t(`weekday.${d.weekday}`)}</span>
                  <span className="mt-1 font-display text-base">{d.label}</span>
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("vt.schedule")}</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {dias.find((d) => d.iso === diaAtual)?.slots.map((s) => (
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
        )}

        <div className="mt-8 flex items-center gap-2 rounded-md border border-border/60 bg-surface p-3 text-xs text-muted-foreground">
          <Video className="size-4 text-gold" />
          {t("vt.platformNote", { platform: especialista?.platform || "—" })}
        </div>

        <button
          onClick={onConfirmar}
          disabled={!time || submitting}
          className="mt-6 w-full rounded-md bg-gradient-gold py-3 text-sm font-semibold uppercase tracking-widest text-background disabled:opacity-40"
        >
          {submitting ? t("vt.booking") : t("vt.confirmSchedule")}
        </button>
      </div>
    </main>
  );
}
