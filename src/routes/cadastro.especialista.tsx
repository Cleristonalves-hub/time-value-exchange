import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Video, Camera, Mail } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { niches as allNiches } from "@/lib/auctions";
import { ConductPledge } from "@/components/ConductPledge";
import { addSpecialist, updateSpecialist, registrationLabel, uploadAvatar, useMySpecialist, specialistEmailExists } from "@/lib/store";
import { useAuth } from "@/lib/auth";
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

const isValidCpfCnpj = (s: string) => {
  const digits = s.replace(/\D/g, "");
  return digits.length === 11 || digits.length === 14;
};

function SpecialistRegistration() {
  const navigate = useNavigate();
  const { user, signUp, resendConfirmation } = useAuth();
  const existing = useMySpecialist(user?.id, user?.email ?? undefined);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [conduct, setConduct] = useState(false);
  const [truthPledge, setTruthPledge] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [data, setData] = useState<FormData>({
    fullName: "", email: "", password: "", phone: "", city: "",
    bio: "", niche: "", specialty: "", credential: "", experience: "",
    portfolioUrl: "", registrationNumber: "",
    platform: "", duration: "60", languages: "Português",
    minBid: "", availableDays: [], startTime: "09:00", endTime: "18:00",
    document: "", pixKey: "",
  });

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


  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const toggleDay = (code: string) =>
    setData((d) => ({
      ...d,
      availableDays: d.availableDays.includes(code)
        ? d.availableDays.filter((c) => c !== code)
        : [...d.availableDays, code],
    }));

  const regLabel = registrationLabel(data.niche);

  const canProceed = () => {
    if (step === 0)
      return (
        data.fullName &&
        data.email &&
        (editingId || data.password.length >= 6) &&
        data.phone &&
        data.city &&
        isValidCpfCnpj(data.document)
      );
    if (step === 1) return data.niche && data.specialty && data.bio.length > 20;
    if (step === 2) {
      if (!data.credential || !data.experience) return false;
      if (!isUrl(data.portfolioUrl)) return false;
      if (regLabel && !data.registrationNumber.trim()) return false;
      return true;
    }
    if (step === 3)
      return (
        data.platform &&
        Number(data.minBid) > 0 &&
        data.availableDays.length > 0 &&
        data.startTime < data.endTime &&
        data.pixKey.trim() &&
        conduct &&
        truthPledge
      );
    return false;
  };

  const next = async () => {
    setEmailError(null);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      const emailTaken = await specialistEmailExists(data.email, editingId ?? undefined);
      if (emailTaken) {
        setSubmitting(false);
        setEmailError("Já existe um perfil cadastrado com este email");
        toast.error("Já existe um perfil cadastrado com este email");
        setStep(0);
        return;
      }

      // Cadastro novo: cria a conta real no Supabase Auth antes de salvar o
      // perfil — login e senha fazem parte deste mesmo formulário, nunca uma
      // tela separada depois.
      let needsEmailConfirmation = false;
      if (!editingId) {
        const result = await signUp(data.email, data.password, data.fullName, { telefone: data.phone });
        if (result.error) {
          setSubmitting(false);
          toast.error(result.error);
          setStep(0);
          return;
        }
        needsEmailConfirmation = !!result.needsEmailConfirmation;
      }

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
      // O perfil é salvo agora independente de precisar confirmar o email —
      // a confirmação só é necessária para depois logar e acessar o app.
      if (editingId) {
        await updateSpecialist(editingId, payload);
      } else {
        await addSpecialist(payload);
      }
      setSubmitting(false);
      if (needsEmailConfirmation) {
        setPendingEmail(data.email);
      } else {
        setDone(true);
      }
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
          Verifique seu email para confirmar o cadastro.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Verifique sua caixa de entrada e spam.</p>
        <p className="mt-2 text-xs text-muted-foreground">{pendingEmail}</p>
        <p className="mt-4 max-w-sm text-xs text-muted-foreground">
          Seu perfil de especialista já foi salvo com selo <strong className="text-gold">Novo</strong> — assim
          que confirmar o email, você já pode entrar e acompanhar a verificação.
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
              <Field label="Nome completo">
                <Input value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Como deseja ser chamado" />
              </Field>

              <Field label="E-mail">
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => {
                    set("email", e.target.value);
                    setEmailError(null);
                  }}
                  placeholder="voce@dominio.com"
                />
                {emailError && <p className="mt-1 text-[11px] text-destructive">{emailError}</p>}
              </Field>
              {!editingId && (
                <Field label="Senha">
                  <Input
                    type="password"
                    value={data.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                </Field>
              )}
              <Field label="Telefone / WhatsApp">
                <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(21) 9 0000-0000" />
              </Field>
              <Field label="Cidade">
                <Input value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="Rio de Janeiro, RJ" />
              </Field>
              <Field label="CPF ou CNPJ">
                <Input value={data.document} onChange={(e) => set("document", e.target.value)} placeholder="000.000.000-00" />
                {data.document && !isValidCpfCnpj(data.document) && (
                  <p className="mt-1 text-[11px] text-destructive">Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.</p>
                )}
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Selecione seu nicho</label>
                <div className="grid grid-cols-2 gap-2">
                  {nicheOptions.map((n) => {
                    const active = data.niche === n;
                    return (
                      <button key={n} type="button" onClick={() => set("niche", n)}
                        className={`rounded-md border px-4 py-3 text-sm transition-all ${active ? "border-gold bg-gold/10 text-gold shadow-gold" : "border-border text-foreground/80 hover:border-gold/40"}`}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Field label="Sua especialidade">
                <Input value={data.specialty} onChange={(e) => set("specialty", e.target.value)} placeholder="Ex: Cardiologista — check-up executivo" />
              </Field>
              <Field label="Bio profissional">
                <Textarea value={data.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Conte sua trajetória em até 3 linhas." className="min-h-[110px]" />
                <p className="mt-1 text-[11px] text-muted-foreground">{data.bio.length}/280 caracteres</p>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Principal credencial">
                <Input value={data.credential} onChange={(e) => set("credential", e.target.value)} placeholder="Ex: Pós-doc Harvard, Grammy 2019" />
              </Field>
              <Field label="Anos de experiência">
                <Input type="number" value={data.experience} onChange={(e) => set("experience", e.target.value)} placeholder="15" />
              </Field>
              <Field label="Link do LinkedIn ou portfólio (obrigatório)">
                <Input
                  value={data.portfolioUrl}
                  onChange={(e) => set("portfolioUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  type="url"
                />
                {data.portfolioUrl && !isUrl(data.portfolioUrl) && (
                  <p className="mt-1 text-[11px] text-destructive">Informe uma URL válida iniciando com http(s)://</p>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">Verificamos o link automaticamente. Se acessível, você recebe selo Verificado.</p>
              </Field>
              {regLabel && (
                <Field label={`${regLabel} (obrigatório para este nicho)`}>
                  <Input
                    value={data.registrationNumber}
                    onChange={(e) => set("registrationNumber", e.target.value)}
                    placeholder="Ex: 12345/RJ"
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
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Plataforma de videochamada</label>
                <div className="space-y-2">
                  {platforms.map((p) => {
                    const active = data.platform === p.id;
                    return (
                      <button key={p.id} type="button" onClick={() => set("platform", p.id)}
                        className={`flex w-full items-center gap-3 rounded-md border px-4 py-4 text-left transition-all ${active ? "border-gold bg-gold/10 shadow-gold" : "border-border hover:border-gold/40"}`}>
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
              </div>
              <Field label="Duração padrão da sessão (minutos)">
                <Input type="number" value={data.duration} onChange={(e) => set("duration", e.target.value)} />
              </Field>
              <Field label="Idiomas que atende">
                <Input value={data.languages} onChange={(e) => set("languages", e.target.value)} placeholder="Português, Inglês" />
              </Field>
              <Field label="Valor mínimo do lance (R$)">
                <Input
                  type="number"
                  min="0"
                  value={data.minBid}
                  onChange={(e) => set("minBid", e.target.value)}
                  placeholder="500"
                />
              </Field>
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Dias disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((d) => {
                    const active = data.availableDays.includes(d.code);
                    return (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => toggleDay(d.code)}
                        className={`rounded-md border px-3 py-2 text-xs transition-all ${active ? "border-gold bg-gold/10 text-gold shadow-gold" : "border-border text-foreground/80 hover:border-gold/40"}`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Horário de início">
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
                <Field label="Horário de fim">
                  <select
                    value={data.endTime}
                    onChange={(e) => set("endTime", e.target.value)}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
              {data.startTime >= data.endTime && (
                <p className="text-[11px] text-destructive">O horário de fim precisa ser depois do horário de início.</p>
              )}
              <Field label="Chave PIX (para repasse dos seus ganhos)">
                <Input
                  value={data.pixKey}
                  onChange={(e) => set("pixKey", e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-gold/30 bg-gold/5 p-4 text-[12px] leading-relaxed text-foreground/80">
                <input
                  type="checkbox"
                  checked={truthPledge}
                  onChange={() => setTruthPledge((v) => !v)}
                  className="mt-0.5 size-4 accent-[color:var(--gold)]"
                />
                <span>
                  Declaro que as informações fornecidas são verdadeiras e que possuo as credenciais profissionais indicadas. Estou ciente que sou inteiramente responsável pela veracidade dos meus dados conforme os Termos de Uso da Valore.
                </span>
              </label>

              <ConductPledge accepted={conduct} onToggle={() => setConduct(!conduct)} />
            </>
          )}
        </div>

        <button
          onClick={next}
          disabled={!canProceed() || submitting}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
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
