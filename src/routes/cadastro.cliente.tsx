import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConductPledge } from "@/components/ConductPledge";
import { useAuth } from "@/lib/auth";
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

const isValidCpf = (s: string) => s.replace(/\D/g, "").length === 11;

function ClientRegistration() {
  const navigate = useNavigate();
  const { signUp, resendConfirmation } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [d, setD] = useState({ name: "", email: "", password: "", cpf: "", phone: "", accept: false });
  const set = (k: keyof typeof d, v: string | boolean) => setD((s) => ({ ...s, [k]: v }));

  const ok =
    d.name.trim() &&
    /\S+@\S+\.\S+/.test(d.email) &&
    d.password.length >= 6 &&
    isValidCpf(d.cpf) &&
    d.phone.trim() &&
    d.accept;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ok) return;
    setSubmitting(true);
    try {
      const { error, needsEmailConfirmation } = await signUp(d.email, d.password, d.name, {
        cpf: d.cpf,
        telefone: d.phone,
      });
      if (error) {
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

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <Field label="Nome completo">
            <Input value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Seu nome" />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@dominio.com" />
          </Field>
          <Field label="Senha">
            <Input type="password" value={d.password} onChange={(e) => set("password", e.target.value)} placeholder="Mínimo 6 caracteres" />
          </Field>
          <Field label="CPF">
            <Input value={d.cpf} onChange={(e) => set("cpf", e.target.value)} placeholder="000.000.000-00" />
            {d.cpf && !isValidCpf(d.cpf) && (
              <p className="mt-1 text-[11px] text-destructive">Informe um CPF válido (11 dígitos).</p>
            )}
          </Field>
          <Field label="Telefone / WhatsApp">
            <Input value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(21) 9 0000-0000" />
          </Field>

          <ConductPledge accepted={d.accept} onToggle={() => set("accept", !d.accept)} />

          <button
            type="submit"
            disabled={!ok || submitting}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
