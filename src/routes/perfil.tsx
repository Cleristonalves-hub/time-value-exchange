import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { WarningBadge } from "@/components/ConductPledge";
import { ShieldAlert, Camera, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { uploadAvatar, updateUserAvatar, updateUserProfile, deleteMyAccount, useMySpecialist, useRejectionReasons } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
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

const CRITERIO_KEYS: Record<string, string> = {
  link: "pf.criterioLink",
  registro_profissional: "pf.criterioRegistro",
};

function formatDateBR(dateOnly: string): string {
  const [y, m, d] = dateOnly.split("-");
  return `${d}/${m}/${y}`;
}

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const tier: 0 | 1 | 2 | 3 = 0;
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingClient, setEditingClient] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

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
      .select("nome, avatar_url, telefone, cidade")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setNome(data?.nome ?? user.user_metadata?.nome ?? "");
        setAvatar(data?.avatar_url ?? null);
        setTelefone(data?.telefone ?? "");
        setCidade(data?.cidade ?? "");
      });
  }, [user]);

  function onOpenEditProfile() {
    if (especialista) {
      navigate({ to: "/cadastro/especialista" });
      return;
    }
    setEditNome(nome);
    setEditTelefone(telefone);
    setEditCidade(cidade);
    setEditingClient(true);
  }

  async function onSaveClientProfile() {
    if (!user) return;
    setSavingProfile(true);
    const ok = await updateUserProfile(user.id, {
      nome: editNome,
      telefone: editTelefone,
      cidade: editCidade,
    });
    setSavingProfile(false);
    if (ok) {
      setNome(editNome);
      setTelefone(editTelefone);
      setCidade(editCidade);
      setEditingClient(false);
      toast.success(t("pf.profileUpdated"));
    } else {
      toast.error(t("pf.profileUpdateError"));
    }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setBusy(true);
    const url = await uploadAvatar(file, `user/${user.id}`);
    if (url) {
      await updateUserAvatar(user.id, url);
      setAvatar(url);
      toast.success(t("pf.photoUpdated"));
    } else {
      toast.error(t("pf.photoError"));
    }
    setBusy(false);
  }

  async function onDelete() {
    if (!user) return;
    setBusy(true);
    const ok = await deleteMyAccount(user.id);
    setBusy(false);
    if (ok) {
      toast.success(t("pf.accountRemoved"));
      navigate({ to: "/" });
    } else {
      toast.error(t("pf.accountRemoveError"));
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-2xl px-5 pt-10">
          <h1 className="font-display text-3xl">{t("pf.title")}</h1>
          <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-6 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-gold" />
            <p className="mt-4 font-display text-xl">{t("pf.guest")}</p>
            <p className="text-xs text-muted-foreground">{t("pf.guestMsg")}</p>
            <div className="mt-4 flex justify-center">
              <WarningBadge tier={tier} />
            </div>
            <Link
              to="/auth"
              className="mt-6 inline-block rounded-md border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/5"
            >
              {t("pf.loginOrCreate")}
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
        <h1 className="font-display text-3xl">{t("pf.title")}</h1>

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
          <button
            onClick={onOpenEditProfile}
            className="mt-4 rounded-md border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold hover:bg-gold/5"
          >
            {t("pf.editProfile")}
          </button>
        </div>

        {editingClient && (
          <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-5">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("pf.editProfile")}</h2>
            <div className="mt-4 space-y-4">
              <EditField label={t("cc.fullName")}>
                <Input value={editNome} onChange={(e) => setEditNome(e.target.value)} />
              </EditField>
              <EditField label={t("cc.phone")}>
                <Input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} placeholder={t("cc.phonePlaceholder")} />
              </EditField>
              <EditField label={t("cc.city")}>
                <Input value={editCidade} onChange={(e) => setEditCidade(e.target.value)} placeholder={t("cc.cityPlaceholder")} />
              </EditField>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={onSaveClientProfile}
                disabled={savingProfile}
                className="flex-1 rounded-md bg-gradient-gold py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold disabled:opacity-50"
              >
                {savingProfile ? t("common.saving") : t("common.save")}
              </button>
              <button
                onClick={() => setEditingClient(false)}
                className="flex-1 rounded-md border border-border py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        )}

        {especialista && !reprovado && (
          <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-5">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("pf.specialistRegistration")}</h2>
            <p className="mt-1 text-sm text-foreground">
              {t("pf.status")}:{" "}
              <span className="text-gold">
                {especialista.status === "verificado"
                  ? t("pf.statusVerified")
                  : especialista.status === "suspenso"
                    ? t("pf.statusSuspended")
                    : t("pf.statusNew")}
              </span>
            </p>
            {/* Visível para qualquer status que não seja suspenso (reprovado já é
                filtrado pelo `!reprovado` acima) — não usar allow-list aqui para
                não esconder o botão silenciosamente se um novo status for
                introduzido no futuro. */}
            {especialista.status !== "suspenso" && (
              <button
                onClick={() => navigate({ to: "/criar-leilao" })}
                className="mt-3 w-full rounded-md bg-gradient-gold py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold hover:opacity-90"
              >
                {t("pf.createAuction")}
              </button>
            )}
          </div>
        )}

        {penalidadeAtiva && especialista && (
          <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/5 p-5">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="size-4" />
              <h2 className="text-[10px] uppercase tracking-[0.3em]">
                {suspensaoAtiva ? t("pf.suspendedAccount") : t("pf.recentCancellationBadge")}
              </h2>
            </div>
            <p className="mt-3 text-sm text-foreground">
              {especialista.motivoPenalidade || t("pf.defaultPenalty")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {suspensaoAtiva ? t("pf.suspended30") : t("pf.badge7")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {suspensaoAtiva
                ? t("pf.suspensionEnds", { date: formatDateBR(especialista.suspensoAte!) })
                : t("pf.badgeEnds", { date: formatDateBR(especialista.badgeCancelamentoAte!) })}
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {t("pf.contactIfError")}{" "}
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
              <h2 className="text-[10px] uppercase tracking-[0.3em]">{t("pf.rejectedTitle")}</h2>
            </div>
            <p className="mt-3 text-sm text-destructive">
              {motivos.length > 0
                ? motivos.map((m) => (CRITERIO_KEYS[m.criterio] ? t(CRITERIO_KEYS[m.criterio]) : m.detalhe)).join(" e ")
                : t("pf.rejectedDefault")}
            </p>
            <p className="mt-2 text-xs text-destructive/80">{t("pf.rejectedFix")}</p>
            <button
              onClick={() => navigate({ to: "/cadastro/especialista" })}
              className="mt-4 w-full rounded-md border border-destructive/50 bg-destructive/10 py-2 text-xs font-semibold uppercase tracking-widest text-destructive hover:bg-destructive/20"
            >
              {t("pf.updateInfo")}
            </button>
          </div>
        )}

        <section className="mt-6 space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("pf.settings")}</h2>
          <Button variant="outline" className="w-full justify-start" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
            <LogOut className="mr-2 size-4" /> {t("pf.signOut")}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="mr-2 size-4" /> {t("pf.deleteAccount")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("pf.deleteConfirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>{t("pf.deleteConfirmMsg")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("pf.deleteCancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={busy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t("pf.deleteConfirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <section className="mt-8 rounded-2xl border border-border/60 bg-surface p-6">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="size-4" />
            <h2 className="text-[10px] uppercase tracking-[0.3em]">{t("pf.reputationSystem")}</h2>
          </div>
          <p className="mt-3 font-display text-xl leading-snug">
            {t("pf.reputationQuote1")}<br />
            <span className="italic text-gradient-gold">{t("pf.reputationQuote2")}</span>
          </p>

          <ul className="mt-5 space-y-3 text-sm">
            <Step n={1} tone="border-gold/40 text-gold" title={t("pf.warnTitle")} desc={t("pf.warnDesc")} />
            <Step n={2} tone="border-warning/40 text-warning" title={t("pf.suspTitle")} desc={t("pf.suspDesc")} />
            <Step n={3} tone="border-destructive/40 text-destructive" title={t("pf.banTitle")} desc={t("pf.banDesc")} />
          </ul>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
    </div>
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
