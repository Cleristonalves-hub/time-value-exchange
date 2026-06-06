import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Valore" }] }),
  component: () => (
    <main className="min-h-screen pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="font-display text-3xl">Perfil</h1>
        <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-gold" />
          <p className="mt-4 font-display text-xl">Convidado</p>
          <p className="text-xs text-muted-foreground">Crie sua conta para participar dos leilões.</p>
          <Link to="/" className="mt-6 inline-block rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5">
            Entrar ou criar conta
          </Link>
        </div>
      </div>
      <BottomNav />
    </main>
  ),
});
