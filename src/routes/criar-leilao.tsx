import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useMySpecialist, createLeilao } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/criar-leilao")({
  head: () => ({ meta: [{ title: "Criar leilão — Valore" }] }),
  component: CriarLeilaoPage,
});

// Especialistas com cadastro "reprovado" ou "suspenso" não podem publicar leilões.
const ALLOWED_STATUSES = new Set(["novo", "verificado"]);

function CriarLeilaoPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const especialista = useMySpecialist(user?.id, user?.email ?? undefined);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lanceMinimo, setLanceMinimo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pré-preenche o valor mínimo com o que o especialista já cadastrou.
  useEffect(() => {
    if (especialista?.minBid && !lanceMinimo) setLanceMinimo(especialista.minBid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialista?.minBid]);

  const podeCriar = !!especialista && ALLOWED_STATUSES.has(especialista.status);

  const canSubmit =
    podeCriar &&
    titulo.trim().length > 0 &&
    Number(lanceMinimo) > 0 &&
    !!dataInicio &&
    !!dataFim &&
    new Date(dataFim).getTime() > new Date(dataInicio).getTime();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!especialista || !canSubmit) return;
    setSubmitting(true);
    const created = await createLeilao({
      especialistaId: especialista.id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      lanceMinimo: Number(lanceMinimo),
      dataInicio: new Date(dataInicio).getTime(),
      dataFim: new Date(dataFim).getTime(),
    });
    setSubmitting(false);
    if (created) {
      toast.success("Leilão publicado.");
      navigate({ to: "/perfil" });
    } else {
      toast.error("Não foi possível publicar o leilão.");
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <GuardScreen
        title="Entre na sua conta"
        message="Você precisa estar logado como especialista para criar um leilão."
        ctaLabel="Entrar ou criar conta"
        ctaTo="/auth"
      />
    );
  }

  if (!especialista) {
    return (
      <GuardScreen
        title="Cadastro necessário"
        message="Você ainda não tem um cadastro de especialista. Cadastre-se para poder criar leilões."
        ctaLabel="Cadastrar-se como especialista"
        ctaTo="/cadastro/especialista"
      />
    );
  }

  if (!podeCriar) {
    return (
      <GuardScreen
        title="Cadastro não aprovado"
        message="Seu cadastro precisa estar com status Novo ou Verificado para criar leilões. Revise suas informações no seu perfil."
        ctaLabel="Ver meu perfil"
        ctaTo="/perfil"
      />
    );
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate({ to: "/perfil" })} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </button>
          <ValoreLogo className="text-2xl" />
          <span className="w-5" />
        </div>

        <h1 className="mt-10 font-display text-4xl text-foreground">Criar leilão.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Publique uma nova sessão para receber lances.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Título do leilão">
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Consultoria financeira - 1 hora"
            />
          </Field>

          <Field label="Descrição">
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="O que está incluso na sessão, formato, pré-requisitos…"
              className="min-h-[110px]"
            />
          </Field>

          <Field label="Valor mínimo do lance (R$)">
            <Input
              type="number"
              min="0"
              value={lanceMinimo}
              onChange={(e) => setLanceMinimo(e.target.value)}
              placeholder="500"
            />
          </Field>

          <Field label="Data e hora de início">
            <Input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </Field>

          <Field label="Data e hora de encerramento">
            <Input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </Field>
          {dataInicio && dataFim && new Date(dataFim).getTime() <= new Date(dataInicio).getTime() && (
            <p className="text-[11px] text-destructive">O encerramento precisa ser depois do início.</p>
          )}

          <Button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full bg-gradient-gold py-6 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-30"
          >
            {submitting ? "Publicando…" : "Publicar leilão"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function GuardScreen({
  title,
  message,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  message: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl text-foreground">{title}</h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Link
        to={ctaTo}
        className="mt-8 rounded-md border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold/5"
      >
        {ctaLabel}
      </Link>
    </main>
  );
}
