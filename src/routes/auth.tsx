import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

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
    const { error } = await signIn(siEmail, siPass);
    setBusy(false);
    if (error) return toast.error(error);
    toast.success("Bem-vindo(a) de volta.");
    navigate({ to: "/home" });
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signUp(suEmail, suPass, suNome);
    setBusy(false);
    if (error) return toast.error(error);
    toast.success("Conta criada.");
    navigate({ to: "/home" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Valore</h1>
        <Tabs defaultValue="signin" className="w-full">
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
                <Input id="si-pass" type="password" value={siPass} onChange={(e) => setSiPass(e.target.value)} required autoComplete="current-password" />
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
                <Input id="su-pass" type="password" value={suPass} onChange={(e) => setSuPass(e.target.value)} minLength={6} required autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Aguarde…" : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-muted-foreground">Voltar</Link>
        </div>
      </div>
    </div>
  );
}
