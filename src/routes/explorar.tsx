import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { AuctionCard } from "@/components/AuctionCard";
import { auctions } from "@/lib/auctions";

export const Route = createFileRoute("/explorar")({
  head: () => ({ meta: [{ title: "Explorar — Valore" }] }),
  component: () => (
    <main className="min-h-screen pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="font-display text-3xl">Explorar</h1>
        <p className="text-sm text-muted-foreground">Curadoria Valore — especialistas em destaque.</p>
        <div className="mt-6 space-y-3">
          {auctions.map((a) => <AuctionCard key={a.id} a={a} />)}
        </div>
      </div>
      <BottomNav />
    </main>
  ),
});
