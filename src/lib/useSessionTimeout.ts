import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutos
const WARNING_LEAD_MS = 2 * 60 * 1000; // avisa 2 minutos antes de expirar
const ACTIVITY_EVENTS = ["click", "scroll", "keydown", "mousemove", "touchstart"] as const;

// Monitora inatividade (clique, scroll, teclado, mouse, toque) e desloga
// automaticamente após 30 minutos sem nenhuma delas. Mostra um aviso 2
// minutos antes — enquanto o aviso estiver visível, atividade "passiva"
// (mousemove) não reresseta o timer sozinha, só o botão explícito "Continuar
// logado" (senão o aviso nunca ficaria visível por tempo suficiente para o
// usuário ler e decidir).
export function useSessionTimeout(enabled: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const showWarningRef = useRef(false);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  const clearTimers = useCallback(() => {
    clearTimeout(warningTimer.current);
    clearTimeout(logoutTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    if (!enabled) return;
    warningTimer.current = setTimeout(() => setShowWarning(true), INACTIVITY_LIMIT_MS - WARNING_LEAD_MS);
    logoutTimer.current = setTimeout(() => {
      supabase.auth.signOut();
    }, INACTIVITY_LIMIT_MS);
  }, [enabled, clearTimers]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setShowWarning(false);
      return;
    }
    resetTimers();
    const onActivity = () => {
      if (showWarningRef.current) return; // só o botão "Continuar logado" resseta a partir daqui
      resetTimers();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const continueSession = useCallback(() => resetTimers(), [resetTimers]);

  return { showWarning, continueSession };
}
