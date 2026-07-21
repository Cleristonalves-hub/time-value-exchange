import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    nome: string,
    extra?: { cpf?: string; telefone?: string },
  ) => Promise<{ error: string | null; needsEmailConfirmation?: boolean; emailExists?: boolean }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
};

const Ctx = createContext<AuthCtx | null>(null);

const EMAIL_ALREADY_REGISTERED_MESSAGE = "Este email já está cadastrado. Faça login ou use outro email.";

// Fixo por instrução do produto: depois de confirmar o email, o usuário deve
// cair sempre em https://valore.services/home, independente do ambiente em
// que o cadastro foi feito. Precisa estar também na allowlist de Redirect URLs
// do Supabase (Authentication > URL Configuration), senão o Supabase ignora
// esse valor e usa o Site URL padrão.
const EMAIL_REDIRECT_TO = "https://valore.services/home";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthCtx = {
    user: session?.user ?? null,
    session,
    loading,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    async signUp(email, password, nome, extra) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: EMAIL_REDIRECT_TO, data: { nome } },
      });
      if (error) {
        if (/already registered|already exists|user already/i.test(error.message)) {
          return { error: EMAIL_ALREADY_REGISTERED_MESSAGE, emailExists: true };
        }
        return { error: error.message };
      }
      // Sinal documentado do Supabase: quando o email já tem conta, signUp
      // "sucede" (sem erro, HTTP 200) mas retorna identities vazio — proteção
      // contra enumeração de emails cadastrados. Sem essa checagem, um email
      // já existente pareceria um cadastro novo bem-sucedido.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: EMAIL_ALREADY_REGISTERED_MESSAGE, emailExists: true };
      }
      // Cria linha em usuarios (best-effort; RLS permite pelo próprio id)
      if (data.user) {
        await supabase.from("usuarios").insert({
          id: data.user.id,
          nome,
          email,
          tipo: "cliente",
          cpf: extra?.cpf || null,
          telefone: extra?.telefone || null,
        });
      }
      return { error: null, needsEmailConfirmation: !data.session };
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async resendConfirmation(email) {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: EMAIL_REDIRECT_TO },
      });
      return { error: error?.message ?? null };
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return v;
}
