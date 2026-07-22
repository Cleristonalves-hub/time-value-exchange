import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { ValoreLogo } from "@/components/ValoreLogo";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({ meta: [{ title: "Redefinir senha — Valore" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useT();
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // O link do email traz um token de recuperação na URL — o supabase-js
  // processa isso ao carregar e estabelece uma sessão temporária (evento
  // PASSWORD_RECOVERY), que é o que permite chamar updateUser({ password })
  // sem exigir login normal.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const ok = password.length >= 6 && password === confirmPassword;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ok) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
        return;
      }
      setDone(true);
    } catch {
      toast.error(t("resetPw.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) return null;

  if (done) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
          <Check className="size-6" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-foreground">{t("resetPw.doneTitle")}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("resetPw.doneMsg")}</p>
        <Button
          onClick={() => navigate({ to: "/auth", search: { tab: "signin" } })}
          className="mt-8 w-full max-w-xs"
        >
          {t("resetPw.goToLogin")}
        </Button>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl text-foreground">{t("resetPw.invalidTitle")}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("resetPw.invalidMsg")}</p>
        <Link
          to="/auth"
          search={{ tab: "signin" }}
          className="mt-8 rounded-md border border-gold/40 px-8 py-3 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold/5"
        >
          {t("resetPw.invalidCta")}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <ValoreLogo className="text-2xl" />
        </div>
        <h1 className="mt-8 text-center font-display text-3xl text-foreground">{t("resetPw.title")}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{t("resetPw.subtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("resetPw.newPassword")}</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("resetPw.minLenPlaceholder")}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("resetPw.confirmPassword")}
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("resetPw.repeatPlaceholder")}
              className={confirmPassword && password !== confirmPassword ? "border-destructive" : undefined}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-[11px] text-destructive">{t("resetPw.mismatch")}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!ok || submitting}
            className="w-full bg-gradient-gold text-primary-foreground disabled:opacity-30"
          >
            {submitting ? t("resetPw.saving") : t("resetPw.submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
