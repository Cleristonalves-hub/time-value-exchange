import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { ConductPledge } from "@/components/ConductPledge";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { isValidCPF, isFullName } from "@/lib/validators";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro/cliente")({
  head: () => ({
    meta: [
      { title: "Criar conta — Valore" },
      { name: "description", content: "Acesse leilões exclusivos dos profissionais mais admirados do Brasil." },
    ],
  }),
  component: ClientRegistration,
});

type FieldKey = "name" | "email" | "password" | "cpf" | "phone" | "accept" | "cpfDeclaration";
const FIELD_ORDER: FieldKey[] = ["name", "email", "password", "cpf", "phone", "accept", "cpfDeclaration"];

function ClientRegistration() {
  const navigate = useNavigate();
  const { signUp, resendConfirmation } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});
  const [d, setD] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    phone: "",
    accept: false,
    cpfDeclaration: false,
  });
  const set = (k: keyof typeof d, v: string | boolean) => {
    setD((s) => ({ ...s, [k]: v }));
    if (k === "email") setEmailError(null);
    setFieldErrors((s) => {
      if (!s[k as FieldKey]) return s;
      const next = { ...s };
      delete next[k as FieldKey];
      return next;
    });
  };

  function validate(): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {};
    if (!isFullName(d.name)) errs.name = "Por favor, insira seu nome completo.";
    if (!/\S+@\S+\.\S+/.test(d.email)) errs.email = "Informe um e-mail válido.";
    if (d.password.length < 6) errs.password = "A senha precisa ter pelo menos 6 caracteres.";
    if (!isValidCPF(d.cpf)) errs.cpf = "CPF inválido. Verifique e tente novamente.";
    if (!d.phone.trim()) errs.phone = "Campo obrigatório.";
    if (!d.accept) errs.accept = "É necessário aceitar o Código de Conduta para continuar.";
    if (!d.cpfDeclaration) errs.cpfDeclaration = "É necessário confirmar esta declaração para continuar.";
    return errs;
  }

  function scrollToFirstError(errs: Partial<Record<FieldKey, string>>) {
    const firstKey = FIELD_ORDER.find((k) => errs[k]);
    if (firstKey) fieldRefs.current[firstKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      scrollToFirstError(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const { error, needsEmailConfirmation, emailExists } = await signUp(d.email, d.password, d.name, {
        cpf: d.cpf,
        telefone: d.phone,
      });
      if (error) {
        if (emailExists) {
          setEmailError(error);
          fieldRefs.current.email?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        toast.error(error);
        return;
      }
      if (needsEmailConfirmation) {
        setPendingEmail(d.email);
        return;
      }
      toast.success("Conta criada.");
      navigate({ to: "/home" });
    } catch {
      toast.error("Não foi possível criar a conta. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

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
        navigate({ to: "/home" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pendingEmail, navigate]);

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
        <Button onClick={onResend} disabled={resending} className="mt-6 w-full max-w-xs">
          {resending ? "Reenviando…" : "Reenviar email de confirmação"}
        </Button>
        <button
          onClick={() => setPendingEmail(null)}
          className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Usar outro e-mail
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate({ to: "/" })} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </button>
          <ValoreLogo className="text-2xl" />
          <span className="w-5" />
        </div>

        <div className="mt-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Criar conta</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">
            O tempo dos melhores,<br />
            <span className="italic text-gradient-gold">a um lance.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Acesse leilões exclusivos. Sem mensalidade, sem assinatura.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5">
          <Field
            label="Nome completo"
            required
            error={fieldErrors.name}
            fieldRef={(el) => { fieldRefs.current.name = el; }}
          >
            <Input
              value={d.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Seu nome"
              className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>
          <Field
            label="E-mail"
            required
            error={fieldErrors.email || emailError || undefined}
            fieldRef={(el) => { fieldRefs.current.email = el; }}
          >
            <Input
              type="email"
              value={d.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="voce@dominio.com"
              className={fieldErrors.email || emailError ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>
          <Field
            label="Senha"
            required
            error={fieldErrors.password}
            fieldRef={(el) => { fieldRefs.current.password = el; }}
          >
            <PasswordInput
              value={d.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>
          <Field
            label="CPF"
            required
            error={fieldErrors.cpf}
            fieldRef={(el) => { fieldRefs.current.cpf = el; }}
          >
            <Input
              value={d.cpf}
              onChange={(e) => set("cpf", e.target.value)}
              placeholder="000.000.000-00"
              className={fieldErrors.cpf ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>
          <Field
            label="Telefone / WhatsApp"
            required
            error={fieldErrors.phone}
            fieldRef={(el) => { fieldRefs.current.phone = el; }}
          >
            <Input
              value={d.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(21) 9 0000-0000"
              className={fieldErrors.phone ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </Field>

          <div ref={(el) => { fieldRefs.current.accept = el; }}>
            <ConductPledge accepted={d.accept} onToggle={() => set("accept", !d.accept)} error={!!fieldErrors.accept} />
            {fieldErrors.accept && <p className="mt-1 text-[11px] text-destructive">{fieldErrors.accept}</p>}
          </div>

          <div ref={(el) => { fieldRefs.current.cpfDeclaration = el; }}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-[12px] leading-relaxed text-foreground/80 ${
                fieldErrors.cpfDeclaration ? "border-destructive bg-destructive/5" : "border-gold/30 bg-gold/5"
              }`}
            >
              <button
                type="button"
                onClick={() => set("cpfDeclaration", !d.cpfDeclaration)}
                aria-pressed={d.cpfDeclaration}
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  d.cpfDeclaration
                    ? "border-gold bg-gold"
                    : fieldErrors.cpfDeclaration
                      ? "border-destructive"
                      : "border-border"
                }`}
              >
                {d.cpfDeclaration && <Check className="size-3 text-primary-foreground" />}
              </button>
              <span>
                Declaro que o CPF informado é meu e que todas as informações fornecidas são verdadeiras, sob pena das
                sanções legais cabíveis.
              </span>
            </label>
            {fieldErrors.cpfDeclaration && (
              <p className="mt-1 text-[11px] text-destructive">{fieldErrors.cpfDeclaration}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
          >
            {submitting ? "Criando…" : "Criar minha conta"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/cadastro/especialista"
          className="mt-6 block rounded-md border border-gold/40 px-6 py-4 text-center text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold/5"
        >
          Sou um especialista
        </Link>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/auth" search={{ tab: "signin" }} className="text-gold underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            to="/termos"
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            Termos de Uso
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <Link
            to="/privacidade"
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            Privacidade
          </Link>
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
