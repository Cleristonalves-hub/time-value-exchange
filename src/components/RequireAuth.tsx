import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

// Guard 100% client-side. Não usamos `beforeLoad` no router porque a sessão do
// Supabase só existe no localStorage do navegador (sem cookie) — o servidor
// nunca a vê durante o SSR, e o TanStack Router não roda `beforeLoad` de novo
// no cliente para páginas já hidratadas a partir do SSR. Um `beforeLoad`
// bloquearia até usuários realmente logados a cada refresh de página.
// Este componente roda no efeito do React, sempre no navegador, então
// funciona tanto em navegação client-side quanto em refresh/link direto.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { tab: "signin" } });
    }
  }, [loading, user, navigate]);

  if (loading || !user) return null;
  return <>{children}</>;
}
