import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, nome);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (mode === "signup") {
      toast.success("Conta criada. Verifique seu e-mail se a confirmação estiver ativada.");
    } else {
      toast.success("Bem-vindo(a) de volta.");
    }
    navigate({ to: "/home" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-2xl font-semibold">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        {mode === "signup" && (
          <div className="space-y-1">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-muted-foreground underline w-full text-center"
        >
          {mode === "signin" ? "Não tenho conta — criar" : "Já tenho conta — entrar"}
        </button>
        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
