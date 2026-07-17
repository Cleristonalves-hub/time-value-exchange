import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/lances")({
  head: () => ({ meta: [{ title: "Meus lances — Valore" }] }),
  component: () => (
    <RequireAuth>
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-2xl px-5 pt-10">
          <h1 className="font-display text-3xl">Meus lances</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe seus lances ativos e sessões agendadas.
          </p>
          <div className="mt-10 rounded-2xl border border-border/60 bg-surface p-10 text-center">
            <p className="font-display text-xl">Nenhum lance ativo</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Quando você participar de um leilão, ele aparecerá aqui.
            </p>
          </div>
        </div>
        <BottomNav />
      </main>
    </RequireAuth>
  ),
});
