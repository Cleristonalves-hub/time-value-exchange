import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { useT } from "@/lib/i18n";
import { TERMOS, type LegalSection } from "@/lib/legalContent";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Valore" },
      { name: "description", content: "Termos de Uso da Valore. Regras e condições para uso da plataforma de leilão de tempo humano." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { lang } = useT();
  const doc = TERMOS[lang];

  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <FileText className="size-5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{doc.pageLabel}</span>
        </div>

        <h1 className="mt-8 font-display text-4xl text-foreground">
          {doc.heading} <span className="text-gradient-gold">{doc.headingAccent}</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{doc.updated}</p>

        <div className="mt-10 space-y-10">
          {doc.sections.map((s) => (
            <Section key={s.title} section={s} />
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4 border-t border-border pt-8">
          <Link to="/privacidade" className="text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
            {doc.otherDocLink}
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <Link to="/" className="text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
            {doc.homeLink}
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-foreground">{section.title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground/70">
        {section.listIntro && <p>{section.listIntro}</p>}
        {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        {section.list && (
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {section.list.map((item, i) => (
              <li key={i}>
                {item.label && <strong className="text-foreground">{item.label}: </strong>}
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
