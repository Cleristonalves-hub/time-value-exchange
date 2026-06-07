import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { WarningBadge } from "@/components/ConductPledge";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Valore" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  // Mock — in production read from the user's record.
  const tier: 0 | 1 | 2 | 3 = 0;

  return (
    <main className="min-h-screen pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="font-display text-3xl">Perfil</h1>

        <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-gold" />
          <p className="mt-4 font-display text-xl">Convidado</p>
          <p className="text-xs text-muted-foreground">Crie sua conta para participar dos leilões.</p>
          <div className="mt-4 flex justify-center">
            <WarningBadge tier={tier} />
          </div>
          <Link
            to="/"
            className="mt-6 inline-block rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
          >
            Entrar ou criar conta
          </Link>
        </div>

        <section className="mt-8 rounded-2xl border border-border/60 bg-surface p-6">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="size-4" />
            <h2 className="text-[10px] uppercase tracking-[0.3em]">Sistema de reputação</h2>
          </div>
          <p className="mt-3 font-display text-xl leading-snug">
            Seja cordial ou seja cancelado.<br />
            <span className="italic text-gradient-gold">A escolha é sua.</span>
          </p>

          <ul className="mt-5 space-y-3 text-sm">
            <Step n={1} tone="border-gold/40 text-gold" title="Advertência" desc="Aviso público no seu perfil, visível a todos." />
            <Step n={2} tone="border-warning/40 text-warning" title="Suspensão temporária" desc="Sua conta é congelada e leilões são pausados." />
            <Step n={3} tone="border-destructive/40 text-destructive" title="Banimento permanente" desc="Perfil removido e impedido de retornar à plataforma." />
          </ul>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function Step({ n, tone, title, desc }: { n: number; tone: string; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3">
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${tone}`}>
        {n}
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
