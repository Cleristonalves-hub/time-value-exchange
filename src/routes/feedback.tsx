import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { addFeedback } from "@/lib/store";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Sugestões e reclamações — Valore" }] }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [kind, setKind] = useState<"sugestao" | "reclamacao">("sugestao");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!name || !message) return;
    addFeedback({ name, email, kind, message });
    setSent(true);
  };

  if (sent) {
    return (
      <RequireAuth>
      <main className="grid min-h-screen place-items-center px-5">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Check className="size-8 text-background" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-gradient-gold">Recebemos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua mensagem foi encaminhada para a curadoria Valore.
          </p>
          <Link
            to="/home"
            className="mt-6 inline-block rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
    <main className="min-h-screen px-5 pt-10 pb-16">
      <div className="mx-auto max-w-md">
        <Link to="/home" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <h1 className="mt-6 font-display text-3xl">Fale com a Valore</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sua opinião nos ajuda a manter o padrão.</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {(["sugestao", "reclamacao"] as const).map((k) => {
            const active = kind === k;
            return (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`rounded-md border py-3 text-xs uppercase tracking-widest transition-all ${active ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}
              >
                {k === "sugestao" ? "Sugestão" : "Reclamação"}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          <Field label="Seu nome">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-gold" />
          </Field>
          <Field label="E-mail (opcional)">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-gold" />
          </Field>
          <Field label="Mensagem">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-gold" />
          </Field>
        </div>

        <button
          onClick={submit}
          disabled={!name || !message}
          className="mt-6 w-full rounded-md bg-gradient-gold py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-30"
        >
          Enviar
        </button>
      </div>
    </main>
    </RequireAuth>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
