import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { WarningBadge } from "@/components/ConductPledge";
import { ShieldAlert, Camera, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { uploadAvatar, updateUserAvatar, deleteMyAccount, useMySpecialist, useRejectionReasons } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Valore" }] }),
  component: ProfilePage,
});

const CRITERIO_LABELS: Record<string, string> = {
  link: "LinkedIn não acessível",
  registro_profissional: "Registro profissional não confirmado",
};

function formatDateBR(dateOnly: string): string {
  const [y, m, d] = dateOnly.split("-");
  return `${d}/${m}/${y}`;
}

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const tier: 0 | 1 | 2 | 3 = 0;
  const [nome, setNome] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const especialista = useMySpecialist(user?.id, user?.email ?? undefined);
  const reprovado = especialista?.status === "reprovado";
  const motivos = useRejectionReasons(reprovado ? especialista?.id ?? null : null);

  const hoje = new Date().toISOString().slice(0, 10);
  const suspensaoAtiva = !!especialista?.suspensoAte && especialista.suspensoAte >= hoje;
  const badgeAtivo = !suspensaoAtiva && !!especialista?.badgeCancelamentoAte && especialista.badgeCancelamentoAte >= hoje;
  const penalidadeAtiva = suspensaoAtiva || badgeAtivo;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("usuarios")
      .select("nome, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setNome(data?.nome ?? user.user_metadata?.nome ?? "");
        setAvatar(data?.avatar_url ?? null);
      });
  }, [user]);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setBusy(true);
    const url = await uploadAvatar(file, `user/${user.id}`);
    if (url) {
      await updateUserAvatar(user.id, url);
      setAvatar(url);
      toast.success("Foto atualizada.");
    } else {
      toast.error("Não foi possível enviar a foto.");
    }
    setBusy(false);
  }

  async function onDelete() {
    if (!user) return;
    setBusy(true);
    const ok = await deleteMyAccount(user.id);
    setBusy(false);
    if (ok) {
      toast.success("Conta removida.");
      navigate({ to: "/" });
    } else {
      toast.error("Erro ao remover conta.");
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-2xl px-5 pt-10">
          <h1 className="font-display text-3xl">Perfil</h1>
          <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-gold" />
            <p className="mt-4 font-display text-xl">Convidado</p>
            <p className="text-xs text-muted-foreground">Crie sua conta para participar dos leilões.</p>
            <div className="mt-4 flex justify-center">
              <WarningBadge tier={tier} />
            </div>
            <Link
              to="/auth"
              className="mt-6 inline-block rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
            >
              Entrar ou criar conta
            </Link>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="font-display text-3xl">Perfil</h1>

        <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 text-center">
          <div className="relative mx-auto h-24 w-24">
            {avatar ? (
              <img src={avatar} alt="" className="h-24 w-24 rounded-full object-cover ring-2 ring-gold/40" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-gold" />
            )}
            <label className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gold/50 bg-background text-gold hover:bg-gold/10">
              <Camera className="size-4" />
              <input type="file" accept="image/*" className="hidden" onChange={onPickFile} disabled={busy} />
            </label>
          </div>
          <p className="mt-4 font-display text-xl">{nome || "—"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <div className="mt-4 flex justify-center">
            <WarningBadge tier={tier} />
          </div>
        </div>

        {especialista && !reprovado && (
          <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Cadastro de especialista</h2>
                <p className="mt-1 text-sm text-foreground">
                  Status: <span className="text-gold">{especialista.status === "verificado" ? "Verificado" : especialista.status === "suspenso" ? "Suspenso" : "Novo"}</span>
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/cadastro/especialista" })}
                className="shrink-0 rounded-md border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold hover:bg-gold/5"
              >
                Editar perfil
              </button>
            </div>
            {(especialista.status === "novo" || especialista.status === "verificado") && (
              <button
                onClick={() => navigate({ to: "/criar-leilao" })}
                className="mt-3 w-full rounded-md bg-gradient-gold py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold hover:opacity-90"
              >
                Criar leilão
              </button>
            )}
          </div>
        )}

        {penalidadeAtiva && especialista && (
          <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/5 p-5">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="size-4" />
              <h2 className="text-[10px] uppercase tracking-[0.3em]">
                {suspensaoAtiva ? "Conta suspensa" : 'Badge "Cancelamento recente"'}
              </h2>
            </div>
            <p className="mt-3 text-sm text-foreground">
              {especialista.motivoPenalidade || "Penalidade aplicada ao seu perfil."}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {suspensaoAtiva
                ? "Sua conta está suspensa por 30 dias."
                : "Seu perfil ficará com este badge por 7 dias."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {suspensaoAtiva
                ? `Suspensão encerra em ${formatDateBR(especialista.suspensoAte!)}`
                : `Badge encerra em ${formatDateBR(especialista.badgeCancelamentoAte!)}`}
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Se acredita que houve um erro, entre em contato:{" "}
              <a href="mailto:contato@valore.services" className="text-gold underline-offset-4 hover:underline">
                contato@valore.services
              </a>
            </p>
          </div>
        )}

        {reprovado && (
          <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-4" />
              <h2 className="text-[10px] uppercase tracking-[0.3em]">Cadastro reprovado</h2>
            </div>
            <p className="mt-3 text-sm text-destructive">
              {motivos.length > 0
                ? motivos.map((m) => CRITERIO_LABELS[m.criterio] ?? m.detalhe).join(" e ")
                : "Não foi possível confirmar suas credenciais na verificação automática."}
            </p>
            <p className="mt-2 text-xs text-destructive/80">
              Corrija as informações abaixo e reenvie para uma nova análise.
            </p>
            <button
              onClick={() => navigate({ to: "/cadastro/especialista" })}
              className="mt-4 w-full rounded-md border border-destructive/50 bg-destructive/10 py-2 text-xs font-semibold uppercase tracking-widest text-destructive hover:bg-destructive/20"
            >
              Atualizar informações
            </button>
          </div>
        )}

        <section className="mt-6 space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Configurações</h2>
          <Button variant="outline" className="w-full justify-start" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
            <LogOut className="mr-2 size-4" /> Sair da conta
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="mr-2 size-4" /> Deletar minha conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deletar conta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é permanente. Seus dados de perfil e cadastro como especialista serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={busy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <section className="mt-8 rounded-2xl border border-border/60 bg-surface p-6">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="size-4" />
            <h2 className="text-[10px] uppercase tracking-[0.3em]">Sistema de reputação</h2>
          </div>
          <p className="mt-3 font-display text-xl leading-snug">
            Seja cordial ou seja cancelado.<br />
            <span className="italic text-gradient-gold">A escolha é sua.</span>
          </p>

          <ul className="mt-5 space-y-3 text-sm">
            <Step n={1} tone="border-gold/40 text-gold" title="Advertência" desc="Aviso público no seu perfil, visível a todos." />
            <Step n={2} tone="border-warning/40 text-warning" title="Suspensão temporária" desc="Sua conta é congelada e leilões são pausados." />
            <Step n={3} tone="border-destructive/40 text-destructive" title="Banimento permanente" desc="Perfil removido e impedido de retornar à plataforma." />
          </ul>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function Step({ n, tone, title, desc }: { n: number; tone: string; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3">
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${tone}`}>
        {n}
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
