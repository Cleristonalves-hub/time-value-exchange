import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, BadgeCheck, Sparkles } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { SocialLinks } from "@/components/SocialLinks";
import { useSpecialist } from "@/lib/store";
import { useT, nicheLabel } from "@/lib/i18n";

export const Route = createFileRoute("/especialista/$id")({
  head: () => ({ meta: [{ title: "Perfil do especialista — Valore" }] }),
  component: () => (
    <RequireAuth>
      <SpecialistProfile />
    </RequireAuth>
  ),
});

function SpecialistProfile() {
  const { id } = Route.useParams();
  const { t } = useT();
  const specialist = useSpecialist(id);

  if (!specialist) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-2xl">{t("sp.notFound")}</p>
          <Link to="/explorar" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
            {t("sp.backToExplore")}
          </Link>
        </div>
      </div>
    );
  }

  const verified = specialist.status === "verificado";

  return (
    <main className="min-h-screen pb-24">
      <div className="relative flex h-56 items-end bg-gradient-gold/10 px-5 pb-6">
        <Link
          to="/explorar"
          className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 p-2 text-foreground backdrop-blur hover:border-gold/40 hover:text-gold"
          aria-label={t("sp.back")}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="mx-auto -mt-16 max-w-2xl px-5">
        <div className="flex items-end gap-4">
          {specialist.photoUrl ? (
            <img
              src={specialist.photoUrl}
              alt=""
              className="size-24 shrink-0 rounded-full object-cover ring-4 ring-background"
            />
          ) : (
            <div className="size-24 shrink-0 rounded-full bg-gradient-gold ring-4 ring-background" />
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h1 className="font-display text-3xl leading-tight">{specialist.fullName}</h1>
          {verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-success">
              <BadgeCheck className="size-3" /> {t("ex.verified")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
              <Sparkles className="size-3" /> {t("ex.new")}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gold">
          {nicheLabel(t, specialist.niche)} · {specialist.specialty}
        </p>

        {specialist.bio && (
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{specialist.bio}</p>
        )}

        {specialist.credential && (
          <p className="mt-4 text-xs text-muted-foreground">{specialist.credential}</p>
        )}

        <SocialLinks specialist={specialist} className="mt-6" />
      </div>
    </main>
  );
}
