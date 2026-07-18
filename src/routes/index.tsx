import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Valore — O tempo dos melhores, para quem mais valoriza" }],
  }),
  component: Splash,
});

// Não existe modo visitante: `/` nunca renderiza conteúdo, só decide para onde
// mandar o visitante — /auth se não estiver logado, /home se já estiver.
function Splash() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    navigate({ to: user ? "/home" : "/auth" });
  }, [loading, user, navigate]);

  return null;
}
