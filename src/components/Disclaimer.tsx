import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export function Disclaimer({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  const { t } = useT();
  if (variant === "inline") {
    return (
      <div className="mt-6 rounded-md border border-border/60 bg-surface/60 p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-gold">{t("disclaimer.title")}</p>
        {t("disclaimer.body")}
      </div>
    );
  }
  return (
    <footer className="border-t border-border/60 bg-background/60 px-5 py-8 text-center">
      <div className="mx-auto max-w-2xl space-y-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">{t("disclaimer.body")}</p>
        <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <Link to="/termos" className="hover:text-gold">{t("footer.terms")}</Link>
          <span>·</span>
          <Link to="/privacidade" className="hover:text-gold">{t("footer.privacy")}</Link>
          <span>·</span>
          <Link to="/feedback" className="hover:text-gold">{t("footer.feedback")}</Link>
        </div>
      </div>
    </footer>
  );
}
