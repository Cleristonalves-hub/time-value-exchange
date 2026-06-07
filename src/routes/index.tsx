import { createFileRoute, Link } from "@tanstack/react-router";
import { ValoreLogo } from "@/components/ValoreLogo";

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
        <ValoreLogo className="text-5xl md:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000" />
        <div className="mt-6 h-px w-16 hairline-gold opacity-60" />
        <p className="mt-6 max-w-sm font-display text-xl italic text-foreground/80 md:text-2xl">
          O tempo dos melhores,
          <br />
          para quem mais valoriza.
        </p>
        <p className="mt-4 max-w-xs text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Leilão de tempo humano
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link
          to="/cadastro/cliente"
          className="group relative overflow-hidden rounded-md bg-gradient-gold px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform active:scale-[0.98]"
        >
          Quero contratar um especialista
        </Link>
        <Link
          to="/cadastro/especialista"
          className="rounded-md border border-gold/40 px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/5"
        >
          Sou um especialista
        </Link>
        <Link
          to="/home"
          className="mt-2 text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Já tenho conta — entrar
        </Link>
      </div>
    </main>
  );
}
