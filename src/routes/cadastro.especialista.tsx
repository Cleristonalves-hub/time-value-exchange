import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Video, Camera, Mail, AlertTriangle } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { niches as allNiches } from "@/lib/auctions";
import { ConductPledge } from "@/components/ConductPledge";
import { addSpecialist, updateSpecialist, registrationLabel, uploadAvatar, useMySpecialist, specialistEmailExists } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { isValidCpfCnpj, isFullName } from "@/lib/validators";
import { toast } from "sonner";


export const Route = createFileRoute("/cadastro/especialista")({
  head: () => ({
    meta: [
      { title: "Cadastro de Especialista — Valore" },
      { name: "description", content: "Disponibilize seu tempo no maior leilão de tempo humano do Brasil." },
    ],
  }),
  component: SpecialistRegistration,
});

type FormData = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  bio: string;
  niche: string;
  specialty: string;
  credential: string;
  experience: string;
  portfolioUrl: string;
  registrationNumber: string;
  platform: "Google Meet" | "Zoom" | "Microsoft Teams" | "";
  duration: string;
  languages: string;
  minBid: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  document: string;
  pixKey: string;
};

type FieldKey =
  | "fullName"
  | "email"
  | "password"
  | "phone"
  | "city"
  | "document"
  | "cpfDeclaration"
  | "niche"
  | "specialty"
  | "bio"
  | "credential"
  | "experience"
  | "portfolioUrl"
  | "registrationNumber"
  | "platform"
  | "minBid"
  | "availableDays"
  | "endTime"
  | "pixKey"
  | "conduct"
  | "truthPledge"
  | "delinquencyAck";

const STEP_FIELD_ORDER: FieldKey[][] = [
  ["fullName", "email", "password", "phone", "city", "document", "cpfDeclaration"],
  ["niche", "specialty", "bio"],
  ["credential", "experience", "portfolioUrl", "registrationNumber"],
  ["platform", "minBid", "availableDays", "endTime", "pixKey", "conduct", "truthPledge", "delinquencyAck"],
];

const STEPS = ["Dados pessoais", "Nicho", "Credenciais", "Videochamada"] as const;
const nicheOptions = allNiches.filter((n) => n !== "Todos");
const platforms: { id: FormData["platform"]; label: string; sub: string }[] = [
  { id: "Zoom", label: "Zoom", sub: "Padrão executivo, gravação em nuvem" },
  { id: "Google Meet", label: "Google Meet", sub: "Integração com Google Workspace" },
  { id: "Microsoft Teams", label: "Microsoft Teams", sub: "Integração com Microsoft 365" },
];

const WEEKDAYS: { code: string; label: string }[] = [
  { code: "seg", label: "Seg" },
  { code: "ter", label: "Ter" },
  { code: "qua", label: "Qua" },
  { code: "qui", label: "Qui" },
  { code: "sex", label: "Sex" },
  { code: "sab", label: "Sáb" },
  { code: "dom", label: "Dom" },
];

const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let mins = 6 * 60; mins <= 23 * 60; mins += 30) {
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    out.push(`${h}:${m}`);
  }
  return out;
})();

const isUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

function SpecialistRegistration() {
  const navigate = useNavigate();
  const { user, signUp, resendConfirmation } = useAuth();
  const existing = useMySpecialist(user?.id, user?.email ?? undefined);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [conduct, setConduct] = useState(false);
  const [truthPledge, setTruthPledge] = useState(false);
  const [cpfDeclaration, setCpfDeclaration] = useState(false);
  const [delinquencyAck, setDelinquencyAck] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});
  const [data, setData] = useState<FormData>({
    fullName: "", email: "", password: "", phone: "", city: "",
    bio: "", niche: "", specialty: "", credential: "", experience: "",
    portfolioUrl: "", registrationNumber: "",
    platform: "", duration: "60", languages: "Português",
    minBid: "", availableDays: [], startTime: "09:00", endTime: "18:00",
    document: "", pixKey: "",
  });

  // Assim que a sessão aparece (confirmou o email — inclusive detectado numa
  // outra aba, o supabase-js sincroniza a sessão entre abas do mesmo navegador
  // via localStorage) e ainda estávamos na tela de espera, retoma o formulário
  // automaticamente na etapa 2 — sem pedir login de novo.
  useEffect(() => {
    if (pendingEmail && user) {
      setPendingEmail(null);
      setStep(1);
    }
  }, [pendingEmail, user]);

  // Enquanto a tela de espera estiver ativa, verifica a cada 3s se o email já
  // foi confirmado — funciona mesmo se a confirmação acontecer em outra aba ou
  // dispositivo, sem depender só da sincronização de sessão entre abas.
  useEffect(() => {
    if (!pendingEmail) return;
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email_confirmed_at) {
        clearInterval(interval);
        setPendingEmail(null);
        setStep(1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pendingEmail]);

  // Se o usuário já tem um cadastro de especialista, entra em modo de edição:
  // pré-preenche o formulário e o envio final vira UPDATE em vez de INSERT.
  useEffect(() => {
    if (!existing || editingId) return;
    setEditingId(existing.id);
    setPhotoUrl(existing.photoUrl ?? "");
    setData({
      fullName: existing.fullName,
      email: existing.email,
      password: "",
      phone: existing.phone,
      city: existing.city,
      bio: existing.bio,
      niche: existing.niche,
      specialty: existing.specialty,
      credential: existing.credential,
      experience: existing.experience,
      portfolioUrl: existing.portfolioUrl,
      registrationNumber: existing.registrationNumber ?? "",
      platform: (existing.platform as FormData["platform"]) || "",
      duration: existing.duration,
      languages: existing.languages,
      minBid: existing.minBid,
      availableDays: existing.availableDays,
      startTime: existing.startTime || "09:00",
      endTime: existing.endTime || "18:00",
      document: existing.document,
      pixKey: existing.pixKey,
    });
  }, [existing, editingId]);

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadAvatar(file, "specialist");
    setUploading(false);
    if (url) setPhotoUrl(url);
  }

  function clearFieldError(key: FieldKey) {
    setFieldErrors((s) => {
      if (!s[key]) return s;
      const next = { ...s };
      delete next[key];
      return next;
    });
  }

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    clearFieldError(k as unknown as FieldKey);
  };

  const toggleDay = (code: string) => {
    setData((d) => ({
      ...d,
      availableDays: d.availableDays.includes(code)
        ? d.availableDays.filter((c) => c !== code)
        : [...d.availableDays, code],
    }));
    clearFieldError("availableDays");
  };

  const regLabel = registrationLabel(data.niche);

  function validateStep(s: number): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {};
    if (s === 0) {
      if (!isFullName(data.fullName)) errs.fullName = "Por favor, insira seu nome completo.";
      if (!/\S+@\S+\.\S+/.test(data.email)) errs.email = "Informe um e-mail válido.";
      if (!user && data.password.length < 6) errs.password = "A senha precisa ter pelo menos 6 caracteres.";
      if (!data.phone.trim()) errs.phone = "Campo obrigatório.";
      if (!data.city.trim()) errs.city = "Campo obrigatório.";
      if (!isValidCpfCnpj(data.document)) {
        errs.document =
          data.document.replace(/\D/g, "").length === 14
            ? "CNPJ inválido. Verifique e tente novamente."
            : "CPF inválido. Verifique e tente novamente.";
      }
      if (!cpfDeclaration) errs.cpfDeclaration = "É necessário confirmar esta declaração para continuar.";
    }
    if (s === 1) {
      if (!data.niche) errs.niche = "Selecione um nicho.";
      if (!data.specialty.trim()) errs.specialty = "Campo obrigatório.";
      if (data.bio.trim().length <= 20) errs.bio = "Escreva pelo menos 21 caracteres sobre sua trajetória.";
    }
    if (s === 2) {
      if (!data.credential.trim()) errs.credential = "Campo obrigatório.";
      if (!data.experience.trim()) errs.experience = "Campo obrigatório.";
      if (!isUrl(data.portfolioUrl)) errs.portfolioUrl = "Informe uma URL válida iniciando com http(s)://";
      if (regLabel && !data.registrationNumber.trim()) errs.registrationNumber = "Campo obrigatório.";
    }
    if (s === 3) {
      if (!data.platform) errs.platform = "Selecione uma plataforma de videochamada.";
      if (!(Number(data.minBid) > 0)) errs.minBid = "Informe um valor mínimo maior que zero.";
      if (data.availableDays.length === 0) errs.availableDays = "Selecione ao menos um dia disponível.";
      if (!(data.startTime < data.endTime)) errs.endTime = "O horário de fim precisa ser depois do horário de início.";
      if (!data.pixKey.trim()) errs.pixKey = "Campo obrigatório.";
      if (!conduct) errs.conduct = "É necessário aceitar o Código de Conduta para continuar.";
      if (!truthPledge) errs.truthPledge = "É necessário confirmar esta declaração para continuar.";
      if (!delinquencyAck) errs.delinquencyAck = "É necessário confirmar esta declaração para continuar.";
    }
    return errs;
  }

  function scrollToFirstError(s: number, errs: Partial<Record<FieldKey, string>>) {
    const firstKey = STEP_FIELD_ORDER[s]?.find((k) => errs[k]);
    if (firstKey) fieldRefs.current[firstKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const next = async () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      scrollToFirstError(step, errs);
      return;
    }
    setFieldErrors({});

    // Etapa 1 (Dados pessoais): se ainda não há sessão, cria a conta agora —
    // antes de deixar avançar para a etapa 2 — e trava o formulário na tela de
    // confirmação de email. Só quando `user` aparecer (email confirmado) o
    // efeito acima libera a etapa 2 automaticamente.
    if (step === 0 && !user) {
      setSubmitting(true);
      const emailTaken = await specialistEmailExists(data.email);
      if (emailTaken) {
        setSubmitting(false);
        const message = "Já existe um perfil cadastrado com este email";
        setFieldErrors((s) => ({ ...s, email: message }));
        fieldRefs.current.email?.scrollIntoView({ behavior: "smooth", block: "center" });
        toast.error(message);
        return;
      }
      const result = await signUp(data.email, data.password, data.fullName, { telefone: data.phone });
      setSubmitting(false);
      if (result.error) {
        if (result.emailExists) {
          setFieldErrors((s) => ({ ...s, email: result.error as string }));
          fieldRefs.current.email?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        toast.error(result.error);
        return;
      }
      if (result.needsEmailConfirmation) {
        setPendingEmail(data.email);
        return; // não avança para a etapa 2 sem confirmar o email
      }
      setStep(1);
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    // Última etapa: salva o perfil (a conta já foi criada na etapa 1) e manda
    // direto para /criar-leilao.
    setSubmitting(true);
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      niche: data.niche,
      specialty: data.specialty,
      bio: data.bio,
      credential: data.credential,
      experience: data.experience,
      platform: data.platform || "",
      duration: data.duration,
      languages: data.languages,
      portfolioUrl: data.portfolioUrl,
      registrationNumber: data.registrationNumber || undefined,
      photoUrl: photoUrl || undefined,
      minBid: data.minBid,
      availableDays: data.availableDays,
      startTime: data.startTime,
      endTime: data.endTime,
      document: data.document,
      pixKey: data.pixKey,
    };
    if (editingId) {
      await updateSpecialist(editingId, payload);
      setSubmitting(false);
      setDone(true);
    } else {
      await addSpecialist(payload);
      setSubmitting(false);
      toast.success("Perfil publicado.");
      navigate({ to: "/criar-leilao" });
    }
  };

  async function onResend() {
    if (!pendingEmail) return;
    setResending(true);
    try {
      const { error } = await resendConfirmation(pendingEmail);
      if (error) toast.error(error);
      else toast.success("E-mail de confirmação reenviado.");
    } catch {
      toast.error("Não foi possível reenviar o e-mail. Tente novamente em instantes.");
    } finally {
      setResending(false);
    }
  }
  const back = () => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1));

  if (pendingEmail) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Mail className="size-6" />
        </div>
        <h1 className="mt-4 font-display text-3xl">Confirme seu email</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Verifique seu email para continuar o cadastro. Clique no link que enviamos para{" "}
          <strong className="text-foreground">{pendingEmail}</strong>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Assim que confirmar, esta tela avança sozinha para o restante do cadastro — não precisa fazer login de
          novo.
        </p>
        <Button onClick={onResend} disabled={resending} className="mt-6 w-full max-w-xs">
          {resending ? "Reenviando…" : "Reenviar email de confirmação"}
        </Button>
      </main>
    );
  }

  if (done) return <SuccessScreen isEdit={!!editingId} />;

  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <button onClick={back} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </button>
          <ValoreLogo className="text-2xl" />
          <span className="w-5" />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Etapa {step + 1} de {STEPS.length}</span>
            <span className="text-gold">{STEPS[step]}</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className="h-px flex-1 overflow-hidden bg-border">
                <div className={`h-full transition-all duration-500 ${i <= step ? "bg-gradient-gold w-full" : "w-0"}`} />
              </div>
            ))}
          </div>
        </div>

        <h1 className="mt-10 font-display text-4xl text-foreground">
          {step === 0 && "Sobre você."}
          {step === 1 && "Sua área de atuação."}
          {step === 2 && "Suas credenciais."}
          {step === 3 && "Como atenderá."}
        </h1>

        <div className="mt-8 space-y-5">
          {step === 0 && (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {photoUrl ? (
                    <img src={photoUrl} alt="" className="h-24 w-24 rounded-full object-cover ring-2 ring-gold/40" />
                  ) : (
                    <div className="h-24 w-24 rounded-full border border-dashed border-gold/40 bg-gold/5" />
                  )}
                  <label className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gold/50 bg-background text-gold hover:bg-gold/10">
                    <Camera className="size-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={onPickPhoto} disabled={uploading} />
                  </label>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {uploading ? "Enviando…" : "Foto de perfil (opcional)"}
                </p>
              </div>
              <Field
                label="Nome completo"
                required
                error={fieldErrors.fullName}
                fieldRef={(el) => { fieldRefs.current.fullName = el; }}
              >
                <Input
                  value={data.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Como deseja ser chamado"
                  className={fieldErrors.fullName ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>

              <Field
                label="E-mail"
                required
                error={fieldErrors.email}
                fieldRef={(el) => { fieldRefs.current.email = el; }}
              >
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="voce@dominio.com"
                  className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              {!editingId && (
                <Field
                  label="Senha"
                  required
                  error={fieldErrors.password}
                  fieldRef={(el) => { fieldRefs.current.password = el; }}
                >
                  <PasswordInput
                    value={data.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : undefined}
                  />
                </Field>
              )}
              <Field
                label="Telefone / WhatsApp"
                required
                error={fieldErrors.phone}
                fieldRef={(el) => { fieldRefs.current.phone = el; }}
              >
                <Input
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="(21) 9 0000-0000"
                  className={fieldErrors.phone ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              <Field
                label="Cidade"
                required
                error={fieldErrors.city}
                fieldRef={(el) => { fieldRefs.current.city = el; }}
              >
                <Input
                  value={data.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Rio de Janeiro, RJ"
                  className={fieldErrors.city ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              <Field
                label="CPF ou CNPJ"
                required
                error={fieldErrors.document}
                fieldRef={(el) => { fieldRefs.current.document = el; }}
              >
                <Input
                  value={data.document}
                  onChange={(e) => set("document", e.target.value)}
                  placeholder="000.000.000-00"
                  className={fieldErrors.document ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>

              <div ref={(el) => { fieldRefs.current.cpfDeclaration = el; }}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-[12px] leading-relaxed text-foreground/80 ${
                    fieldErrors.cpfDeclaration ? "border-destructive bg-destructive/5" : "border-gold/30 bg-gold/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={cpfDeclaration}
                    onChange={() => {
                      setCpfDeclaration((v) => !v);
                      clearFieldError("cpfDeclaration");
                    }}
                    className="mt-0.5 size-4 accent-[color:var(--gold)]"
                  />
                  <span>
                    Declaro que o CPF informado é meu e que todas as informações fornecidas são verdadeiras, sob pena
                    das sanções legais cabíveis.
                  </span>
                </label>
                {fieldErrors.cpfDeclaration && (
                  <p className="mt-1 text-[11px] text-destructive">{fieldErrors.cpfDeclaration}</p>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div ref={(el) => { fieldRefs.current.niche = el; }}>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Selecione seu nicho</label>
                <div className="grid grid-cols-2 gap-2">
                  {nicheOptions.map((n) => {
                    const active = data.niche === n;
                    return (
                      <button key={n} type="button" onClick={() => set("niche", n)}
                        className={`rounded-md border px-4 py-3 text-sm transition-all ${active ? "border-gold bg-gold/10 text-gold shadow-gold" : fieldErrors.niche ? "border-destructive text-foreground/80" : "border-border text-foreground/80 hover:border-gold/40"}`}>
                        {n}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.niche && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.niche}</p>}
              </div>
              <Field
                label="Sua especialidade"
                required
                error={fieldErrors.specialty}
                fieldRef={(el) => { fieldRefs.current.specialty = el; }}
              >
                <Input
                  value={data.specialty}
                  onChange={(e) => set("specialty", e.target.value)}
                  placeholder="Ex: Cardiologista — check-up executivo"
                  className={fieldErrors.specialty ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              <Field
                label="Bio profissional"
                required
                error={fieldErrors.bio}
                fieldRef={(el) => { fieldRefs.current.bio = el; }}
              >
                <Textarea
                  value={data.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Conte sua trajetória em até 3 linhas."
                  className={`min-h-[110px] ${fieldErrors.bio ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">{data.bio.length}/280 caracteres</p>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label="Principal credencial"
                required
                error={fieldErrors.credential}
                fieldRef={(el) => { fieldRefs.current.credential = el; }}
              >
                <Input
                  value={data.credential}
                  onChange={(e) => set("credential", e.target.value)}
                  placeholder="Ex: Pós-doc Harvard, Grammy 2019"
                  className={fieldErrors.credential ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              <Field
                label="Anos de experiência"
                required
                error={fieldErrors.experience}
                fieldRef={(el) => { fieldRefs.current.experience = el; }}
              >
                <Input
                  type="number"
                  value={data.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  placeholder="15"
                  className={fieldErrors.experience ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              <Field
                label="Link do LinkedIn ou portfólio"
                required
                error={fieldErrors.portfolioUrl}
                fieldRef={(el) => { fieldRefs.current.portfolioUrl = el; }}
              >
                <Input
                  value={data.portfolioUrl}
                  onChange={(e) => set("portfolioUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  type="url"
                  className={fieldErrors.portfolioUrl ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">Verificamos o link automaticamente. Se acessível, você recebe selo Verificado.</p>
              </Field>
              {regLabel && (
                <Field
                  label={regLabel}
                  required
                  error={fieldErrors.registrationNumber}
                  fieldRef={(el) => { fieldRefs.current.registrationNumber = el; }}
                >
                  <Input
                    value={data.registrationNumber}
                    onChange={(e) => set("registrationNumber", e.target.value)}
                    placeholder="Ex: 12345/RJ"
                    className={fieldErrors.registrationNumber ? "border-destructive focus-visible:ring-destructive" : undefined}
                  />
                </Field>
              )}
              <div className="rounded-md border border-gold/20 bg-gold/5 p-4">
                <p className="text-xs leading-relaxed text-foreground/70">
                  <span className="text-gold">Verificação Valore.</span> Cadastros aparecem imediatamente com selo Novo. Após verificação do link, o selo é elevado para Verificado. Nichos regulados exigem número de registro profissional.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div ref={(el) => { fieldRefs.current.platform = el; }}>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Plataforma de videochamada</label>
                <div className="space-y-2">
                  {platforms.map((p) => {
                    const active = data.platform === p.id;
                    return (
                      <button key={p.id} type="button" onClick={() => set("platform", p.id)}
                        className={`flex w-full items-center gap-3 rounded-md border px-4 py-4 text-left transition-all ${active ? "border-gold bg-gold/10 shadow-gold" : fieldErrors.platform ? "border-destructive" : "border-border hover:border-gold/40"}`}>
                        <Video className={`size-5 ${active ? "text-gold" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${active ? "text-gold" : "text-foreground"}`}>{p.label}</div>
                          <div className="text-[11px] text-muted-foreground">{p.sub}</div>
                        </div>
                        {active && <Check className="size-4 text-gold" />}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.platform && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.platform}</p>}
              </div>
              <Field label="Duração padrão da sessão (minutos)">
                <Input type="number" value={data.duration} onChange={(e) => set("duration", e.target.value)} />
              </Field>
              <Field label="Idiomas que atende">
                <Input value={data.languages} onChange={(e) => set("languages", e.target.value)} placeholder="Português, Inglês" />
              </Field>
              <Field
                label="Valor mínimo do lance (R$)"
                required
                error={fieldErrors.minBid}
                fieldRef={(el) => { fieldRefs.current.minBid = el; }}
              >
                <Input
                  type="number"
                  min="0"
                  value={data.minBid}
                  onChange={(e) => set("minBid", e.target.value)}
                  placeholder="500"
                  className={fieldErrors.minBid ? "border-destructive focus-visible:ring-destructive" : undefined}
                />
              </Field>
              <div ref={(el) => { fieldRefs.current.availableDays = el; }}>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Dias disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((d) => {
                    const active = data.availableDays.includes(d.code);
                    return (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => toggleDay(d.code)}
                        className={`rounded-md border px-3 py-2 text-xs transition-all ${active ? "border-gold bg-gold/10 text-gold shadow-gold" : fieldErrors.availableDays ? "border-destructive text-foreground/80" : "border-border text-foreground/80 hover:border-gold/40"}`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.availableDays && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.availableDays}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Horário de início" required>
                  <select
                    value={data.startTime}
                    onChange={(e) => set("startTime", e.target.value)}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Horário de fim"
                  required
                  error={fieldErrors.endTime}
                  fieldRef={(el) => { fieldRefs.current.endTime = el; }}
                >
                  <select
                    value={data.endTime}
                    onChange={(e) => set("endTime", e.target.value)}
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${fieldErrors.endTime ? "border-destructive" : "border-border"}`}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field
                label="Chave PIX (para repasse dos seus ganhos)"
                required
                error={fieldErrors.pixKey}
                fieldRef={(el) => { fieldRefs.current.pixKey = el; }}
              >
                <Input
                  value={data.pixKey}
                  onChange={(e) => set("pixKey", e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
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
                  <span>
                    Declaro que as informações fornecidas são verdadeiras e que possuo as credenciais profissionais indicadas. Estou ciente que sou inteiramente responsável pela veracidade dos meus dados conforme os Termos de Uso da Valore.
                  </span>
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
                  <span className="text-[10px] uppercase tracking-[0.3em]">
                    Importante — Leia antes de publicar seu perfil
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-foreground/80">
                  Ao publicar seu perfil na Valore, você está ciente de que:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-foreground/80">
                  <li>Em caso de inadimplência do cliente, a Valore tomará medidas automáticas de cobrança</li>
                  <li>
                    Se não resolvido em 48h, seu leilão será cancelado e reagendado gratuitamente com destaque por
                    7 dias
                  </li>
                  <li>
                    A Valore não se responsabiliza pela inadimplência do cliente, mas age com rapidez e
                    transparência
                  </li>
                  <li>Cancelamentos frequentes ou sem antecedência de 2 horas resultam em penalidades no seu perfil</li>
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
                  <span className="text-xs leading-relaxed text-foreground/80">
                    Li e estou ciente das condições acima
                  </span>
                </label>
                {fieldErrors.delinquencyAck && (
                  <p className="mt-1 text-[11px] text-destructive">{fieldErrors.delinquencyAck}</p>
                )}
              </div>
            </>
          )}
        </div>

        <button
          onClick={next}
          disabled={submitting}
          className="group mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
        >
          {submitting ? "Enviando…" : step === STEPS.length - 1 ? "Finalizar cadastro" : "Continuar"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link to="/termos" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">Termos</Link>
          <span className="text-muted-foreground/30">·</span>
          <Link to="/privacidade" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">Privacidade</Link>
        </div>
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

function SuccessScreen({ isEdit }: { isEdit: boolean }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-gold/20 blur-3xl" />
        <div className="flex size-20 items-center justify-center rounded-full border border-gold bg-gold/10">
          <Check className="size-10 text-gold" />
        </div>
      </div>
      <h1 className="mt-8 font-display text-4xl text-gradient-gold">
        {isEdit ? "Cadastro atualizado" : "Perfil publicado"}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        {isEdit
          ? "Suas informações foram enviadas para uma nova verificação. Você verá o resultado no seu perfil em instantes."
          : <>Seu perfil já está visível com selo <strong className="text-gold">Novo</strong>. Estamos verificando seu link e registro profissional — se ambos forem confirmados, o selo será elevado para <strong className="text-success">Verificado</strong> automaticamente.</>}
      </p>
      <Link to="/perfil" className="mt-10 rounded-md border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold/5">
        {isEdit ? "Ver meu perfil" : "Ver na plataforma"}
      </Link>
    </main>
  );
}
