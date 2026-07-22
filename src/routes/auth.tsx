import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
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
      toast.success("Bem-vindo(a) de volta.");
      navigate({ to: "/home" });
    } catch {
      toast.error("Não foi possível entrar. Tente novamente em instantes.");
    } finally {
      setBusy(false);
    }
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error, needsEmailConfirmation } = await signUp(suEmail, suPass, suNome);
      if (error) {
        toast.error(error);
        return;
      }
      if (needsEmailConfirmation) {
        setPendingReason("signup");
        setPendingEmail(suEmail);
        return; // ainda não há sessão — não navega para /home
      }
      toast.success("Conta criada.");
      navigate({ to: "/home" });
    } catch {
      toast.error("Não foi possível criar a conta. Tente novamente em instantes.");
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
      toast.error("Não foi possível enviar o link. Tente novamente em instantes.");
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
      else toast.success("E-mail de confirmação reenviado.");
    } catch {
      toast.error("Não foi possível reenviar o e-mail. Tente novamente em instantes.");
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
              <h1 className="mt-4 text-xl font-semibold">Verifique seu email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enviamos um link de redefinição de senha para{" "}
                <strong className="text-foreground">{forgotEmail}</strong>.
              </p>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSent(false);
                }}
                className="mt-6 text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Voltar para o login
              </button>
            </div>
          ) : (
            <form onSubmit={onForgotPassword} className="space-y-4">
              <div className="text-center">
                <h1 className="text-xl font-semibold">Redefinir senha</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Informe seu e-mail para receber o link de redefinição.
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="forgot-email">E-mail</Label>
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
                {forgotBusy ? "Enviando…" : "Enviar link de redefinição"}
              </Button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="block w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Voltar
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
          <h1 className="mt-4 text-xl font-semibold">Confirme seu email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {pendingReason === "signup"
              ? "Verifique seu email para confirmar o cadastro."
              : "Confirme seu email para continuar."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Verifique sua caixa de entrada e spam.</p>
          <p className="mt-2 text-xs text-muted-foreground">{pendingEmail}</p>
          <Button onClick={onResend} disabled={resending} className="mt-6 w-full">
            {resending ? "Reenviando…" : "Reenviar email de confirmação"}
          </Button>
          <button
            onClick={() => setPendingEmail(null)}
            className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Usar outro e-mail
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
            <TabsTrigger value="signin">Já tenho conta</TabsTrigger>
            <TabsTrigger value="signup">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={onSignIn} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="si-email">E-mail</Label>
                <Input id="si-email" type="email" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="si-pass">Senha</Label>
                <PasswordInput id="si-pass" value={siPass} onChange={(e) => setSiPass(e.target.value)} required autoComplete="current-password" />
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(siEmail);
                    setShowForgotPassword(true);
                  }}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Aguarde…" : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={onSignUp} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="su-nome">Nome</Label>
                <Input id="su-nome" value={suNome} onChange={(e) => setSuNome(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="su-email">E-mail</Label>
                <Input id="su-email" type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="su-pass">Senha</Label>
                <PasswordInput id="su-pass" value={suPass} onChange={(e) => setSuPass(e.target.value)} minLength={6} required autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Aguarde…" : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
