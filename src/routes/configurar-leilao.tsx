import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Video, AlertTriangle } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConductPledge } from "@/components/ConductPledge";
import { useAuth } from "@/lib/auth";
import { useMySpecialist, updateSpecialist } from "@/lib/store";
import { useT, WEEKDAY_LABEL_KEY } from "@/lib/i18n";
import { useSessionTimeout } from "@/lib/useSessionTimeout";
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning";
import { toast } from "sonner";

export const Route = createFileRoute("/configurar-leilao")({
  head: () => ({ meta: [{ title: "Configurar leilão — Valore" }] }),
  component: ConfigurarLeilaoPage,
});

type FieldKey = "platform" | "minBid" | "availableDays" | "endTime" | "pixKey" | "conduct" | "truthPledge" | "delinquencyAck" | "ageConfirmed";
const FIELD_ORDER: FieldKey[] = ["platform", "minBid", "availableDays", "endTime", "pixKey", "conduct", "truthPledge", "delinquencyAck", "ageConfirmed"];

const platformIds = ["Zoom", "Google Meet", "Microsoft Teams"] as const;
const platformSubKeys: Record<(typeof platformIds)[number], string> = {
  Zoom: "ce.platformZoomSub",
  "Google Meet": "ce.platformMeetSub",
  "Microsoft Teams": "ce.platformTeamsSub",
};

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

function ConfigurarLeilaoPage() {
  const { user, loading } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const existing = useMySpecialist(user?.id, user?.email ?? undefined);
  const { showWarning, continueSession } = useSessionTimeout(!!user);

  const [platform, setPlatform] = useState<"Google Meet" | "Zoom" | "Microsoft Teams" | "">("");
  const [duration, setDuration] = useState("60");
  const [languages, setLanguages] = useState("Português");
  const [minBid, setMinBid] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [pixKey, setPixKey] = useState("");
  const [conduct, setConduct] = useState(false);
  const [truthPledge, setTruthPledge] = useState(false);
  const [delinquencyAck, setDelinquencyAck] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});

  // Pré-preenche com o que já estiver salvo (segunda visita a esta página) —
  // só uma vez, para não sobrescrever o que o especialista já estiver digitando.
  useEffect(() => {
    if (existing && !prefilled) {
      setPlatform((existing.platform as typeof platform) || "");
      setDuration(existing.duration || "60");
      setLanguages(existing.languages || "Português");
      setMinBid(existing.minBid || "");
      setAvailableDays(existing.availableDays);
      setStartTime(existing.startTime || "09:00");
      setEndTime(existing.endTime || "18:00");
      setPixKey(existing.pixKey || "");
      setPrefilled(true);
    }
  }, [existing, prefilled]);

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
    if (!platform) errs.platform = t("ce.platformRequired");
    if (!(Number(minBid) > 0)) errs.minBid = t("cl.minBidRequired");
    if (availableDays.length === 0) errs.availableDays = t("ce.daysRequired");
    if (!(startTime < endTime)) errs.endTime = t("ce.endTimeError");
    if (!pixKey.trim()) errs.pixKey = t("ce.required");
    if (!conduct) errs.conduct = t("cc.acceptRequired");
    if (!truthPledge) errs.truthPledge = t("ce.truthPledgeRequired");
    if (!delinquencyAck) errs.delinquencyAck = t("ce.delinquencyRequired");
    if (!ageConfirmed) errs.ageConfirmed = t("cc.ageConfirmRequired");
    return errs;
  }

  function scrollToFirstError(errs: Partial<Record<FieldKey, string>>) {
    const firstKey = FIELD_ORDER.find((k) => errs[k]);
    if (firstKey) fieldRefs.current[firstKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit() {
    if (!existing) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      scrollToFirstError(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    const ok = await updateSpecialist(existing.id, {
      fullName: existing.fullName,
      email: existing.email,
      phone: existing.phone,
      city: existing.city,
      state: existing.state,
      niche: existing.niche,
      specialty: existing.specialty,
      bio: existing.bio,
      credential: existing.credential,
      experience: existing.experience,
      portfolioUrl: existing.portfolioUrl,
      registrationNumber: existing.registrationNumber,
      instagram: existing.instagram,
      twitter: existing.twitter,
      tiktok: existing.tiktok,
      youtube: existing.youtube,
      photoUrl: existing.photoUrl,
      document: existing.document,
      platform,
      duration,
      languages,
      minBid,
      availableDays,
      startTime,
      endTime,
      pixKey,
    });
    setSubmitting(false);
    if (ok) {
      toast.success(t("cfg.saved"));
      navigate({ to: "/perfil" });
    } else {
      toast.error(t("ce.updateError"));
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <GuardScreen
        title={t("cl.guardLoginTitle")}
        message={t("cfg.guardLoginMsg")}
        ctaLabel={t("cl.guardLoginCta")}
        ctaTo="/auth"
      />
    );
  }

  if (!existing) {
    return (
      <GuardScreen
        title={t("cl.guardProfileTitle")}
        message={t("cl.guardProfileMsg")}
        ctaLabel={t("cl.guardProfileCta")}
        ctaTo="/cadastro/especialista"
      />
    );
  }

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

        <div className="mt-8">
          <h1 className="font-display text-3xl text-foreground">{t("ce.section4Title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("cfg.subtitle")}</p>
        </div>

        <div className="mt-8 space-y-5">
          <div ref={(el) => { fieldRefs.current.platform = el; }}>
            <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("ce.platform")}</label>
            <div className="space-y-2">
              {platformIds.map((p) => {
                const active = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPlatform(p);
                      clearFieldError("platform");
                    }}
                    className={`flex w-full items-center gap-3 rounded-md border px-4 py-4 text-left transition-all ${active ? "border-gold bg-gold/10 shadow-gold" : fieldErrors.platform ? "border-destructive" : "border-border hover:border-gold/40"}`}
                  >
                    <Video className={`size-5 ${active ? "text-gold" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${active ? "text-gold" : "text-foreground"}`}>{p}</div>
                      <div className="text-[11px] text-muted-foreground">{t(platformSubKeys[p])}</div>
                    </div>
                    {active && <Check className="size-4 text-gold" />}
                  </button>
                );
              })}
            </div>
            {fieldErrors.platform && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.platform}</p>}
          </div>

          <Field label={t("ce.duration")}>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </Field>

          <Field label={t("ce.languages")}>
            <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder={t("ce.languagesPlaceholder")} />
          </Field>

          <Field
            label={t("cl.minBid")}
            required
            error={fieldErrors.minBid}
            fieldRef={(el) => { fieldRefs.current.minBid = el; }}
          >
            <Input
              type="number"
              min="0"
              value={minBid}
              onChange={(e) => {
                setMinBid(e.target.value);
                clearFieldError("minBid");
              }}
              placeholder="500"
              className={fieldErrors.minBid ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
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

          <Field
            label={t("ce.pixKey")}
            required
            error={fieldErrors.pixKey}
            fieldRef={(el) => { fieldRefs.current.pixKey = el; }}
          >
            <Input
              value={pixKey}
              onChange={(e) => {
                setPixKey(e.target.value);
                clearFieldError("pixKey");
              }}
              placeholder={t("ce.pixKeyPlaceholder")}
              className={fieldErrors.pixKey ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>

          <div ref={(el) => { fieldRefs.current.truthPledge = el; }}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-[12px] leading-relaxed text-foreground/80 ${
                fieldErrors.truthPledge ? "border-destructive bg-destructive/5" : "border-gold/30 bg-gold/5"
              }`}
            >
              <input
                type="checkbox"
                checked={truthPledge}
                onChange={() => {
                  setTruthPledge((v) => !v);
                  clearFieldError("truthPledge");
                }}
                className="mt-0.5 size-4 accent-[color:var(--gold)]"
              />
              <span>{t("ce.truthPledge")}</span>
            </label>
            {fieldErrors.truthPledge && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.truthPledge}</p>}
          </div>

          <div ref={(el) => { fieldRefs.current.conduct = el; }}>
            <ConductPledge
              accepted={conduct}
              onToggle={() => {
                setConduct(!conduct);
                clearFieldError("conduct");
              }}
              error={!!fieldErrors.conduct}
            />
            {fieldErrors.conduct && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.conduct}</p>}
          </div>

          <div
            ref={(el) => { fieldRefs.current.delinquencyAck = el; }}
            className={`rounded-xl border p-5 ${fieldErrors.delinquencyAck ? "border-destructive bg-destructive/5" : "border-warning/40 bg-warning/5"}`}
          >
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="size-4" />
              <span className="text-[10px] uppercase tracking-[0.3em]">{t("ce.importantTitle")}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-foreground/80">{t("ce.importantIntro")}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-foreground/80">
              <li>{t("ce.importantBullet1")}</li>
              <li>{t("ce.importantBullet2")}</li>
              <li>{t("ce.importantBullet3")}</li>
              <li>{t("ce.importantBullet4")}</li>
            </ul>

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <button
                type="button"
                onClick={() => {
                  setDelinquencyAck((v) => !v);
                  clearFieldError("delinquencyAck");
                }}
                aria-pressed={delinquencyAck}
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  delinquencyAck ? "border-warning bg-warning" : fieldErrors.delinquencyAck ? "border-destructive" : "border-border"
                }`}
              >
                {delinquencyAck && <Check className="size-3 text-primary-foreground" />}
              </button>
              <span className="text-xs leading-relaxed text-foreground/80">{t("ce.delinquencyAck")}</span>
            </label>
            {fieldErrors.delinquencyAck && (
              <p className="mt-1 text-[11px] text-destructive">{fieldErrors.delinquencyAck}</p>
            )}
          </div>

          <div ref={(el) => { fieldRefs.current.ageConfirmed = el; }}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-[12px] leading-relaxed text-foreground/80 ${
                fieldErrors.ageConfirmed ? "border-destructive bg-destructive/5" : "border-gold/30 bg-gold/5"
              }`}
            >
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={() => {
                  setAgeConfirmed((v) => !v);
                  clearFieldError("ageConfirmed");
                }}
                className="mt-0.5 size-4 accent-[color:var(--gold)]"
              />
              <span>{t("cc.ageConfirm")}</span>
            </label>
            {fieldErrors.ageConfirmed && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.ageConfirmed}</p>}
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="group mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
        >
          {submitting ? t("cl.submitting") : t("cfg.submitButton")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link to="/termos" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">{t("footer.terms")}</Link>
          <span className="text-muted-foreground/30">·</span>
          <Link to="/privacidade" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">{t("footer.privacy")}</Link>
        </div>
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
