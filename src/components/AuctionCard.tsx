import { Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import type { Auction } from "@/lib/auctions";
import { formatBRL } from "@/lib/auctions";
import { Countdown } from "./Countdown";

export function AuctionCard({ a }: { a: Auction }) {
  return (
    <Link
      to="/leilao/$id"
      params={{ id: a.id }}
      className="group block overflow-hidden rounded-xl border border-border/60 bg-surface transition-all hover:border-gold/50 hover:shadow-gold"
    >
      <div className="flex gap-4 p-4">
        <img
          src={a.photo}
          alt={a.expert}
          width={96}
          height={96}
          loading="lazy"
          className="h-24 w-24 flex-none rounded-lg object-cover grayscale transition-all group-hover:grayscale-0"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 inline-block rounded-sm border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
            {a.niche}
          </div>
          <h3 className="font-display text-lg leading-tight text-foreground">
            {a.expert}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{a.specialty}</p>
          <p className="mt-1 truncate text-[11px] text-gold/80">★ {a.credential}</p>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Lance atual
              </div>
              <div className="font-display text-xl text-gradient-gold">
                {formatBRL(a.currentBid)}
              </div>
            </div>
            <div className="text-right">
              <Countdown endsAt={a.endsAt} className="text-sm" />
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                <Users className="h-3 w-3" /> {a.seats} {a.seats === 1 ? "vaga" : "vagas"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
