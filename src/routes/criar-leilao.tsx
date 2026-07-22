import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useMySpecialist, createLeilao } from "@/lib/store";
import { useT, nicheLabel } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/criar-leilao")({
  head: () => ({ meta: [{ title: "Criar leilão — Valore" }] }),
  component: CriarLeilaoPage,
});

// Especialistas com cadastro "reprovado" ou "suspenso" não podem publicar leilões.
const ALLOWED_STATUSES = new Set(["novo", "verificado"]);

type FieldKey = "titulo" | "lanceMinimo" | "dataInicio" | "dataFim";
const FIELD_ORDER: FieldKey[] = ["titulo", "lanceMinimo", "dataInicio", "dataFim"];

function CriarLeilaoPage() {
  const { user, loading } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const especialista = useMySpecialist(user?.id, user?.email ?? undefined);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lanceMinimo, setLanceMinimo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});

  // Pré-preenche o valor mínimo com o que o especialista já cadastrou.
  useEffect(() => {
    if (especialista?.minBid && !lanceMinimo) setLanceMinimo(especialista.minBid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialista?.minBid]);

  const podeCriar = !!especialista && ALLOWED_STATUSES.has(especialista.status);

  function clearFieldError(key: FieldKey) {
    setFieldErrors((s) => {
      if (!s[key]) return s;
      const next = { ...s };
      delete next[key];
      return next;
    });
  }

  function validate(): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {};
    if (!titulo.trim()) errs.titulo = t("cl.required");
    if (!(Number(lanceMinimo) > 0)) errs.lanceMinimo = t("cl.minBidRequired");
    if (!dataInicio) errs.dataInicio = t("cl.required");
    if (!dataFim) {
      errs.dataFim = t("cl.required");
    } else if (dataInicio && new Date(dataFim).getTime() <= new Date(dataInicio).getTime()) {
      errs.dataFim = t("cl.endDateBeforeStart");
    }
    return errs;
  }

  function scrollToFirstError(errs: Partial<Record<FieldKey, string>>) {
    const firstKey = FIELD_ORDER.find((k) => errs[k]);
    if (firstKey) fieldRefs.current[firstKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!especialista) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      scrollToFirstError(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    const created = await createLeilao({
      especialistaId: especialista.id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      lanceMinimo: Number(lanceMinimo),
      dataInicio: new Date(dataInicio).getTime(),
      dataFim: new Date(dataFim).getTime(),
    });
    setSubmitting(false);
    if (created) {
      toast.success(t("cl.published"));
      navigate({ to: "/perfil" });
    } else {
      toast.error(t("cl.publishError"));
    }
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

  if (!podeCriar) {
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
              className={fieldErrors.titulo ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>

          <Field label={t("cl.description")}>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={t("cl.descriptionPlaceholder")}
              className="min-h-[110px]"
            />
          </Field>

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
            required
            error={fieldErrors.lanceMinimo}
            fieldRef={(el) => { fieldRefs.current.lanceMinimo = el; }}
          >
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
          </Field>

          <Field
            label={t("cl.startDate")}
            required
            error={fieldErrors.dataInicio}
            fieldRef={(el) => { fieldRefs.current.dataInicio = el; }}
          >
            <Input
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                clearFieldError("dataInicio");
              }}
              className={fieldErrors.dataInicio ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>

          <Field
            label={t("cl.endDate")}
            required
            error={fieldErrors.dataFim}
            fieldRef={(el) => { fieldRefs.current.dataFim = el; }}
          >
            <Input
              type="datetime-local"
              value={dataFim}
              onChange={(e) => {
                setDataFim(e.target.value);
                clearFieldError("dataFim");
              }}
              className={fieldErrors.dataFim ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>

          <Field label={t("cl.platform")}>
            <Input value={especialista.platform || "—"} disabled className="text-muted-foreground" />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("cl.areaDefinedNote")}{" "}
              <Link to="/cadastro/especialista" className="text-gold underline-offset-4 hover:underline">
                {t("cl.editProfile")}
              </Link>
            </p>
          </Field>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-gold py-6 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-30"
          >
            {submitting ? t("cl.submitting") : t("cl.submit")}
          </Button>
        </form>
      </div>
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
