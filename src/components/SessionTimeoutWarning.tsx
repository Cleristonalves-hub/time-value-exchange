import { AlertTriangle } from "lucide-react";
import { useT } from "@/lib/i18n";

// Aviso de expiração por inatividade — compartilhado entre RequireAuth e as
// páginas protegidas que usam seu próprio gate de autenticação em vez de
// RequireAuth (admin, perfil, criar-leilão, cadastro de especialista
// logado). Renderiza junto com useSessionTimeout(enabled) em cada uma delas.
export function SessionTimeoutWarning({ show, onContinue }: { show: boolean; onContinue: () => void }) {
  const { t } = useT();
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 backdrop-blur-md sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl border border-warning/40 bg-surface p-6 text-center shadow-gold sm:rounded-2xl animate-in slide-in-from-bottom-8 duration-300">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-warning bg-warning/10 text-warning">
          <AlertTriangle className="size-5" />
        </div>
        <p className="mt-4 text-sm text-foreground">{t("session.timeoutWarning")}</p>
        <button
          onClick={onContinue}
          className="mt-5 w-full rounded-md bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold hover:opacity-90"
        >
          {t("session.continueLoggedIn")}
        </button>
      </div>
    </div>
  );
}
