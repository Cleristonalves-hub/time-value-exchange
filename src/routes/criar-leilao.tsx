import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useMySpecialist, useMyActiveLeilao, editarLeilao, updateSpecialistAvailability } from "@/lib/store";
import { useT, nicheLabel, WEEKDAY_LABEL_KEY } from "@/lib/i18n";
import { translateErrorMessage } from "@/lib/errorMessages";
import { sanitizeText } from "@/lib/sanitize";
import { maskDateBR, maskTimeHM } from "@/lib/masks";
import { useSessionTimeout } from "@/lib/useSessionTimeout";
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning";
import { toast } from "sonner";

export const Route = createFileRoute("/criar-leilao")({
  head: () => ({ meta: [{ title: "Editar leilão — Valore" }] }),
  component: CriarLeilaoPage,
});

type FieldKey = "titulo" | "dataFimData" | "dataFimHora" | "lanceMinimo" | "availableDays" | "endTime";
const FIELD_ORDER: FieldKey[] = ["titulo", "dataFimData", "dataFimHora", "lanceMinimo", "availableDays", "endTime"];

const WEEKDAY_CODES = Object.keys(WEEKDAY_LABEL_KEY);

const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let mins = 6 * 60; mins <= 23 * 60; mins += 30) {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    out.push(`${h}:${m}`);
  }
  return out;
})();

function toDateBR(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function toTimeHM(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Interpreta "DD/MM/AAAA" + "HH:MM" no horário local do navegador — retorna
// null se o formato bater mas os componentes não formarem uma data/hora real
// (ex.: 31/02, 25:00), em vez de deixar o JS "corrigir" silenciosamente.
function parseDataHoraBR(dataStr: string, horaStr: string): number | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataStr);
  const h = /^(\d{2}):(\d{2})$/.exec(horaStr);
  if (!m || !h) return null;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  const hh = Number(h[1]);
  const min = Number(h[2]);
  const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
  if (d.getDate() !== dd || d.getMonth() !== mm - 1 || d.getFullYear() !== yyyy) return null;
  if (d.getHours() !== hh || d.getMinutes() !== min) return null;
  return d.getTime();
}

function CriarLeilaoPage() {
  const { user, loading } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const especialista = useMySpecialist(user?.id, user?.email ?? undefined);
  const leilaoAtivo = useMyActiveLeilao(especialista?.id);
  const { showWarning, continueSession } = useSessionTimeout(!!user);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataFimData, setDataFimData] = useState("");
  const [dataFimHora, setDataFimHora] = useState("");
  const [lanceMinimo, setLanceMinimo] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [prefilled, setPrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});

  // Só é possível ajustar o valor mínimo enquanto o leilão ainda não recebeu
  // nenhum lance — mudar depois seria injusto com quem já apostou com base no
  // valor anterior (mesma regra aplicada no servidor, em editar-leilao).
  const podeEditarMinimo = !!leilaoAtivo && leilaoAtivo.lanceAtual === null;

  // Pré-preenche o formulário assim que o leilão ativo e o especialista
  // carregarem — só uma vez, para não sobrescrever o que já estiver digitando.
  useEffect(() => {
    if (leilaoAtivo && especialista && !prefilled) {
      setTitulo(leilaoAtivo.titulo);
      setDescricao(leilaoAtivo.descricao ?? "");
      setDataFimData(toDateBR(leilaoAtivo.dataFim));
      setDataFimHora(toTimeHM(leilaoAtivo.dataFim));
      setLanceMinimo(String(leilaoAtivo.lanceMinimo));
      setAvailableDays(especialista.availableDays);
      setStartTime(especialista.startTime || "09:00");
      setEndTime(especialista.endTime || "18:00");
      setPrefilled(true);
    }
  }, [leilaoAtivo, especialista, prefilled]);

  function clearFieldError(key: FieldKey) {
    setFieldErrors((s) => {
      if (!s[key]) return s;
      const next = { ...s };
      delete next[key];
      return next;
    });
  }

  function toggleDay(code: string) {
    setAvailableDays((d) => (d.includes(code) ? d.filter((c) => c !== code) : [...d, code]));
    clearFieldError("availableDays");
  }

  function validate(): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {};
    if (!titulo.trim()) errs.titulo = t("cl.required");

    if (!dataFimData.trim()) {
      errs.dataFimData = t("cl.required");
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataFimData)) {
      errs.dataFimData = t("cl.dateFormatInvalid");
    }
    if (!dataFimHora.trim()) {
      errs.dataFimHora = t("cl.required");
    } else if (!/^\d{2}:\d{2}$/.test(dataFimHora)) {
      errs.dataFimHora = t("cl.timeFormatInvalid");
    }
    if (!errs.dataFimData && !errs.dataFimHora) {
      const ts = parseDataHoraBR(dataFimData, dataFimHora);
      if (ts === null) {
        errs.dataFimData = t("cl.dateFormatInvalid");
      } else if (ts <= Date.now()) {
        errs.dataFimData = t("cl.dateInPast");
      } else if (leilaoAtivo && ts <= leilaoAtivo.dataInicio) {
        errs.dataFimData = t("cl.endDateBeforeStart");
      }
    }

    if (podeEditarMinimo && !(Number(lanceMinimo) > 0)) {
      errs.lanceMinimo = t("cl.minBidRequired");
    }
    if (availableDays.length === 0) errs.availableDays = t("ce.daysRequired");
    if (!(startTime < endTime)) errs.endTime = t("ce.endTimeError");

    return errs;
  }

  function scrollToFirstError(errs: Partial<Record<FieldKey, string>>) {
    const firstKey = FIELD_ORDER.find((k) => errs[k]);
    if (firstKey) fieldRefs.current[firstKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leilaoAtivo || !especialista) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      scrollToFirstError(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    const dataFimMs = parseDataHoraBR(dataFimData, dataFimHora)!;
    const { error: erroLeilao } = await editarLeilao(leilaoAtivo.id, {
      titulo: titulo.trim(),
      descricao: sanitizeText(descricao),
      dataFim: dataFimMs,
      ...(podeEditarMinimo ? { lanceMinimo: Number(lanceMinimo) } : {}),
    });
    if (erroLeilao) {
      setSubmitting(false);
      toast.error(translateErrorMessage(erroLeilao, t));
      return;
    }

    const okDisponibilidade = await updateSpecialistAvailability(especialista.id, { availableDays, startTime, endTime });
    setSubmitting(false);
    if (!okDisponibilidade) {
      toast.error(t("cl.availabilityError"));
      return;
    }
    toast.success(t("cl.published"));
    navigate({ to: "/perfil" });
  }

  if (loading) return null;

  if (!user) {
    return (
      <GuardScreen
        title={t("cl.guardLoginTitle")}
        message={t("cl.guardLoginMsg")}
        ctaLabel={t("cl.guardLoginCta")}
        ctaTo="/auth"
      />
    );
  }

  if (!especialista) {
    return (
      <GuardScreen
        title={t("cl.guardProfileTitle")}
        message={t("cl.guardProfileMsg")}
        ctaLabel={t("cl.guardProfileCta")}
        ctaTo="/cadastro/especialista"
      />
    );
  }

  if (!leilaoAtivo) {
    return (
      <GuardScreen
        title={t("cl.guardApprovalTitle")}
        message={t("cl.guardApprovalMsg")}
        ctaLabel={t("cl.guardApprovalCta")}
        ctaTo="/perfil"
      />
    );
  }

  const areaAtuacao = [nicheLabel(t, especialista.niche), especialista.specialty].filter(Boolean).join(" — ");

  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate({ to: "/perfil" })} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </button>
          <ValoreLogo className="text-2xl" />
          <span className="w-5" />
        </div>

        <div className="mt-8 rounded-md border border-gold/30 bg-gold/5 p-4">
          <p className="text-sm text-foreground/90">{t("cl.welcome")}</p>
        </div>

        <h1 className="mt-6 font-display text-4xl text-foreground">{t("cl.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("cl.subtitle")}</p>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
          <Field
            label={t("cl.titleField")}
            required
            error={fieldErrors.titulo}
            fieldRef={(el) => { fieldRefs.current.titulo = el; }}
          >
            <Input
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                clearFieldError("titulo");
              }}
              placeholder={t("cl.titlePlaceholder")}
              maxLength={100}
              className={fieldErrors.titulo ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>

          <Field label={t("cl.description")}>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={t("cl.descriptionPlaceholder")}
              maxLength={1000}
              className="min-h-[110px]"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={t("cl.endDateDay")}
              required
              error={fieldErrors.dataFimData}
              fieldRef={(el) => { fieldRefs.current.dataFimData = el; }}
            >
              <Input
                value={dataFimData}
                onChange={(e) => {
                  setDataFimData(maskDateBR(e.target.value));
                  clearFieldError("dataFimData");
                }}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                maxLength={10}
                className={fieldErrors.dataFimData ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
            </Field>
            <Field
              label={t("cl.endDateHour")}
              required
              error={fieldErrors.dataFimHora}
              fieldRef={(el) => { fieldRefs.current.dataFimHora = el; }}
            >
              <Input
                value={dataFimHora}
                onChange={(e) => {
                  setDataFimHora(maskTimeHM(e.target.value));
                  clearFieldError("dataFimHora");
                }}
                placeholder="HH:MM"
                inputMode="numeric"
                maxLength={5}
                className={fieldErrors.dataFimHora ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
            </Field>
          </div>

          <Field label={t("cl.areaOfExpertise")}>
            <Input value={areaAtuacao || "—"} disabled className="text-muted-foreground" />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("cl.areaDefinedNote")}{" "}
              <Link to="/cadastro/especialista" className="text-gold underline-offset-4 hover:underline">
                {t("cl.editProfile")}
              </Link>
            </p>
          </Field>

          <Field
            label={t("cl.minBid")}
            required={podeEditarMinimo}
            error={fieldErrors.lanceMinimo}
            fieldRef={(el) => { fieldRefs.current.lanceMinimo = el; }}
          >
            {podeEditarMinimo ? (
              <Input
                type="number"
                min="0"
                value={lanceMinimo}
                onChange={(e) => {
                  setLanceMinimo(e.target.value);
                  clearFieldError("lanceMinimo");
                }}
                placeholder="500"
                className={fieldErrors.lanceMinimo ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
            ) : (
              <>
                <Input value={String(leilaoAtivo.lanceAtual ?? leilaoAtivo.lanceMinimo)} disabled className="text-muted-foreground" />
                <p className="mt-1 text-[11px] text-muted-foreground">{t("cl.minBidLockedNote")}</p>
              </>
            )}
          </Field>

          <div ref={(el) => { fieldRefs.current.availableDays = el; }}>
            <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("ce.availableDays")}</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_CODES.map((code) => {
                const active = availableDays.includes(code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleDay(code)}
                    className={`rounded-md border px-3 py-2 text-xs transition-all ${active ? "border-gold bg-gold/10 text-gold shadow-gold" : fieldErrors.availableDays ? "border-destructive text-foreground/80" : "border-border text-foreground/80 hover:border-gold/40"}`}
                  >
                    {t(WEEKDAY_LABEL_KEY[code])}
                  </button>
                );
              })}
            </div>
            {fieldErrors.availableDays && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.availableDays}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("ce.startTime")} required>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </Field>
            <Field
              label={t("ce.endTime")}
              required
              error={fieldErrors.endTime}
              fieldRef={(el) => { fieldRefs.current.endTime = el; }}
            >
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${fieldErrors.endTime ? "border-destructive" : "border-border"}`}
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("cl.platform")}>
            <Input value={especialista.platform || "—"} disabled className="text-muted-foreground" />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("cl.areaDefinedNote")}{" "}
              <Link to="/configurar-leilao" className="text-gold underline-offset-4 hover:underline">
                {t("cl.editProfile")}
              </Link>
            </p>
          </Field>

          <div className="rounded-md border border-warning/40 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="size-4" />
              <span className="text-[10px] uppercase tracking-[0.3em]">{t("lz.cancelAuction")}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80">{t("lz.cancelPolicy")}</p>
            <Link
              to="/leilao/$id"
              params={{ id: leilaoAtivo.id }}
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-gold underline-offset-4 hover:underline"
            >
              {t("lz.cancelAuction")}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-gold py-6 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-30"
          >
            {submitting ? t("cl.submitting") : t("cl.submit")}
          </Button>
        </form>
      </div>
      <SessionTimeoutWarning show={showWarning} onContinue={continueSession} />
    </main>
  );
}

function Field({
  label,
  required,
  error,
  fieldRef,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  fieldRef?: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return (
    <div ref={fieldRef}>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function GuardScreen({
  title,
  message,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  message: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl text-foreground">{title}</h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Link
        to={ctaTo}
        className="mt-8 rounded-md border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold/5"
      >
        {ctaLabel}
      </Link>
    </main>
  );
}
