import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ValoreLogo, ValoreMark } from "@/components/ValoreLogo";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Valore — O tempo dos melhores, para quem mais valoriza" },
      {
        name: "description",
        content:
          "A maior plataforma de leilão de tempo humano do Brasil. Dê lances e agende sessões exclusivas com os profissionais mais admirados do país.",
      },
      { property: "og:title", content: "Valore — Leilão de tempo humano" },
      {
        property: "og:description",
        content: "O tempo dos melhores, para quem mais valoriza.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { t } = useT();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Só quem já está logado é levado direto para /home. Visitante sem conta
  // continua vendo a capa normalmente (não existe redirecionamento forçado
  // para /auth aqui — isso só se aplica às áreas internas do app).
  useEffect(() => {
    if (!loading && user) navigate({ to: "/home" });
  }, [loading, user, navigate]);

  if (loading || user) return null;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-6 py-16">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="flex w-full justify-center pt-8">
        <div className="h-px w-24 hairline-gold" />
      </div>

      <div className="flex flex-col items-center text-center">
        <ValoreMark
          size={180}
          className="mb-4 h-40 w-40 md:h-48 md:w-48 animate-in fade-in zoom-in-95 duration-1000"
        />
        <ValoreLogo className="text-5xl md:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000" />
        <div className="mt-6 h-px w-16 hairline-gold opacity-60" />
        <p className="mt-6 max-w-sm font-display text-xl italic text-foreground/80 md:text-2xl">
          {t("splash.tagline.1")}
          <br />
          {t("splash.tagline.2")}
        </p>
        <p className="mt-4 max-w-xs text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("splash.subtitle")}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link
          to="/cadastro/cliente"
          className="group relative overflow-hidden rounded-md bg-gradient-gold px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98]"
        >
          {t("splash.cta.client")}
        </Link>
        <Link
          to="/cadastro/especialista"
          className="rounded-md border border-gold/40 px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/5"
        >
          {t("splash.cta.expert")}
        </Link>
        <Link
          to="/auth"
          search={{ tab: "signin" }}
          className="mt-2 text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("splash.login")}
        </Link>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            to="/termos"
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            {t("footer.terms")}
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <Link
            to="/privacidade"
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </main>
  );
}
