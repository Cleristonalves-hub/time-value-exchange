import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { RequireAuth } from "@/components/RequireAuth";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/lances")({
  head: () => ({ meta: [{ title: "Meus lances — Valore" }] }),
  component: LancesPage,
});

function LancesPage() {
  const { t } = useT();
  return (
    <RequireAuth>
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-2xl px-5 pt-10">
          <h1 className="font-display text-3xl">{t("ln.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("ln.subtitle")}</p>
          <div className="mt-10 rounded-2xl border border-border/60 bg-surface p-10 text-center">
            <p className="font-display text-xl">{t("ln.emptyTitle")}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t("ln.emptyMsg")}</p>
          </div>
        </div>
        <BottomNav />
      </main>
    </RequireAuth>
  );
}
