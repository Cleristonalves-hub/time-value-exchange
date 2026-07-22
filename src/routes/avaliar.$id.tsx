import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, Check } from "lucide-react";
import { useState } from "react";
import { auctions } from "@/lib/auctions";
import { addReview } from "@/lib/store";
import { RequireAuth } from "@/components/RequireAuth";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/avaliar/$id")({
  head: () => ({ meta: [{ title: "Avaliar sessão — Valore" }] }),
  component: ReviewPage,
  notFoundComponent: () => {
    const { t } = useT();
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <p className="text-muted-foreground">{t("av.notFound")}</p>
      </main>
    );
  },
  errorComponent: () => {
    const { t } = useT();
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <p className="text-destructive">{t("av.loadError")}</p>
      </main>
    );
  },
  loader: ({ params }) => {
    const a = auctions.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { auction: a };
  },
});

function ReviewPage() {
  const { auction } = Route.useLoaderData();
  const { t } = useT();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!rating) return;
    addReview({
      specialistId: auction.id,
      auctionId: auction.id,
      rating,
      comment,
    });
    setSent(true);
  };

  const ratingLabels = ["", t("av.rating1"), t("av.rating2"), t("av.rating3"), t("av.rating4"), t("av.rating5")];

  if (sent) {
    return (
      <RequireAuth>
      <main className="grid min-h-screen place-items-center px-5">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Check className="size-8 text-background" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-gradient-gold">{t("av.thankYou")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("av.thankYouMsg")}</p>
          <Link
            to="/home"
            className="mt-6 inline-block rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
          >
            {t("av.backHome")}
          </Link>
        </div>
      </main>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
    <main className="min-h-screen px-5 pt-12 pb-16">
      <div className="mx-auto max-w-md text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{t("av.sessionCompleted")}</p>
        <h1 className="mt-2 font-display text-3xl">{t("av.howWasIt", { name: auction.expert.split(" ")[1] || auction.expert })}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{auction.specialty}</p>

        <div className="mt-10 flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n;
            return (
              <button
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110"
                aria-label={t("av.starsAria", { n })}
              >
                <Star
                  className={`size-10 ${active ? "fill-gold text-gold" : "text-muted-foreground"}`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
        {rating > 0 && (
          <p className="mt-3 text-xs uppercase tracking-widest text-gold animate-fade-in">
            {ratingLabels[rating]}
          </p>
        )}

        <div className="mt-8 text-left">
          <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("av.commentOptional")}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder={t("av.commentPlaceholder")}
            className="mt-2 w-full resize-none rounded-md border border-border/60 bg-surface p-3 text-sm outline-none focus:border-gold"
          />
          <p className="mt-1 text-right text-[10px] text-muted-foreground">{comment.length}/500</p>
        </div>

        <button
          disabled={!rating}
          onClick={handleSend}
          className="mt-6 w-full rounded-md bg-gradient-gold py-3 text-sm font-semibold uppercase tracking-widest text-background disabled:opacity-40"
        >
          {t("av.submit")}
        </button>
      </div>
    </main>
    </RequireAuth>
  );
}
