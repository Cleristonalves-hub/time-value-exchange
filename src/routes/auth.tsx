import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { tab?: "signin" | "signup" } => ({
    tab: search.tab === "signin" ? "signin" : search.tab === "signup" ? "signup" : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, resendConfirmation, resetPasswordForEmail } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const { tab } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  // Tela de "esqueci minha senha" — sobrepõe o formulário de login/cadastro
  // enquanto ativa.
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotBusy, setForgotBusy] = useState(false);

  // E-mail pendente de confirmação — enquanto setado, mostramos a tela de espera
  // em vez do formulário, e nenhuma navegação para /home acontece.
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  // Distingue as duas origens possíveis, que têm mensagens diferentes:
  // "signup" = acabou de criar a conta; "signin" = tentou entrar mas o email
  // dessa conta (já existente) ainda não foi confirmado.
  const [pendingReason, setPendingReason] = useState<"signin" | "signup">("signup");

  // Sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");
  // Sign up
  const [suNome, setSuNome] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await signIn(siEmail, siPass);
      if (error) {
        if (/email not confirmed/i.test(error)) {
          setPendingReason("signin");
          setPendingEmail(siEmail);
          return;
        }
        toast.error(error);
        return;
      }
      toast.success(t("auth.welcomeBack"));
      navigate({ to: "/home" });
    } catch {
      toast.error(t("auth.signInError"));
    } finally {
      setBusy(false);
    }
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error, needsEmailConfirmation, emailExists } = await signUp(suEmail, suPass, suNome);
      if (error) {
        toast.error(emailExists ? t("common.emailAlreadyRegistered") : error);
        return;
      }
      if (needsEmailConfirmation) {
        setPendingReason("signup");
        setPendingEmail(suEmail);
        return; // ainda não há sessão — não navega para /home
      }
      toast.success(t("auth.accountCreated"));
      navigate({ to: "/home" });
    } catch {
      toast.error(t("auth.signUpError"));
    } finally {
      setBusy(false);
    }
  }

  async function onForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotBusy(true);
    try {
      const { error } = await resetPasswordForEmail(forgotEmail);
      if (error) {
        toast.error(error);
        return;
      }
      setForgotSent(true);
    } catch {
      toast.error(t("auth.resetError"));
    } finally {
      setForgotBusy(false);
    }
  }

  async function onResend() {
    if (!pendingEmail) return;
    setResending(true);
    try {
      const { error } = await resendConfirmation(pendingEmail);
      if (error) toast.error(error);
      else toast.success(t("auth.resendSuccess"));
    } catch {
      toast.error(t("auth.resendError"));
    } finally {
      setResending(false);
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border p-6">
          {forgotSent ? (
            <div className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Mail className="size-6" />
              </div>
              <h1 className="mt-4 text-xl font-semibold">{t("auth.resetCheckEmailTitle")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("auth.resetCheckEmailMsg")} <strong className="text-foreground">{forgotEmail}</strong>.
              </p>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSent(false);
                }}
                className="mt-6 text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                {t("auth.backToLogin")}
              </button>
            </div>
          ) : (
            <form onSubmit={onForgotPassword} className="space-y-4">
              <div className="text-center">
                <h1 className="text-xl font-semibold">{t("auth.resetTitle")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{t("auth.resetSubtitle")}</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="forgot-email">{t("auth.email")}</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={forgotBusy || !forgotEmail}>
                {forgotBusy ? t("auth.resending") : t("auth.resetSend")}
              </Button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="block w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                {t("auth.back")}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (pendingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border p-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Mail className="size-6" />
          </div>
          <h1 className="mt-4 text-xl font-semibold">{t("auth.confirmEmailTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {pendingReason === "signup" ? t("auth.confirmEmailSignup") : t("auth.confirmEmailSignin")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t("auth.checkInboxSpam")}</p>
          <p className="mt-2 text-xs text-muted-foreground">{pendingEmail}</p>
          <Button onClick={onResend} disabled={resending} className="mt-6 w-full">
            {resending ? t("auth.resending") : t("auth.resend")}
          </Button>
          <button
            onClick={() => setPendingEmail(null)}
            className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("auth.useOtherEmail")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Valore</h1>
        <Tabs defaultValue={tab === "signup" ? "signup" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">{t("auth.tabSignin")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.tabSignup")}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={onSignIn} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="si-email">{t("auth.email")}</Label>
                <Input id="si-email" type="email" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="si-pass">{t("auth.password")}</Label>
                <PasswordInput id="si-pass" value={siPass} onChange={(e) => setSiPass(e.target.value)} required autoComplete="current-password" />
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(siEmail);
                    setShowForgotPassword(true);
                  }}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? t("auth.busy") : t("auth.signIn")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={onSignUp} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="su-nome">{t("auth.name")}</Label>
                <Input id="su-nome" value={suNome} onChange={(e) => setSuNome(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="su-email">{t("auth.email")}</Label>
                <Input id="su-email" type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="su-pass">{t("auth.password")}</Label>
                <PasswordInput id="su-pass" value={suPass} onChange={(e) => setSuPass(e.target.value)} minLength={6} required autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? t("auth.busy") : t("auth.tabSignup")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
