import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { ConductPledge } from "@/components/ConductPledge";

export const Route = createFileRoute("/cadastro/cliente")({
  head: () => ({
    meta: [
      { title: "Criar conta — Valore" },
      { name: "description", content: "Acesse leilões exclusivos dos profissionais mais admirados do Brasil." },
    ],
  }),
  component: ClientRegistration,
});

function ClientRegistration() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [d, setD] = useState({ name: "", email: "", phone: "", password: "", accept: false });
  const set = (k: keyof typeof d, v: string | boolean) => setD((s) => ({ ...s, [k]: v }));

  const ok = d.name && /\S+@\S+\.\S+/.test(d.email) && d.phone && d.password.length >= 6 && d.accept;

  if (done) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-gold/20 blur-3xl" />
          <div className="flex size-20 items-center justify-center rounded-full border border-gold bg-gold/10">
            <Check className="size-10 text-gold" />
          </div>
        </div>
        <h1 className="mt-8 font-display text-4xl text-gradient-gold">Bem-vindo à Valore</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Sua conta está pronta. Dê seu primeiro lance em um leilão em destaque.
        </p>
        <Link
          to="/home"
          className="mt-10 rounded-md bg-gradient-gold px-10 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-gold"
        >
          Entrar na plataforma
        </Link>
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

        <form onSubmit={(e) => { e.preventDefault(); if (ok) setDone(true); }} className="mt-10 space-y-5">
          <Field label="Nome completo">
            <Input value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Seu nome" />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@dominio.com" />
          </Field>
          <Field label="Telefone / WhatsApp">
            <Input value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(21) 9 0000-0000" />
          </Field>
          <Field label="Senha">
            <Input type="password" value={d.password} onChange={(e) => set("password", e.target.value)} placeholder="Mínimo 6 caracteres" />
          </Field>

          <ConductPledge accepted={d.accept} onToggle={() => set("accept", !d.accept)} />

          <button
            type="submit"
            disabled={!ok}
            className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
          >
            Criar minha conta
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
          <Link to="/home" className="text-gold underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
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
