import { Globe, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useT, type LangCode } from "@/lib/i18n";

export function LanguageSelector({ variant = "ghost" }: { variant?: "ghost" | "bordered" }) {
  const { lang, setLang, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("lang.label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full ${
          variant === "bordered" ? "border border-gold/30" : "border border-border/60"
        } px-2.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold`}
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="font-medium">{current.short}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-gold/20 bg-surface-elevated/95 shadow-gold backdrop-blur-xl"
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("lang.label")}
          </div>
          <div className="h-px hairline-gold opacity-40" />
          <ul className="max-h-80 overflow-y-auto py-1">
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLang(l.code as LangCode);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-gold/5 text-gold"
                        : "text-foreground/80 hover:bg-gold/5 hover:text-gold"
                    }`}
                  >
                    <span className="font-display">{l.label}</span>
                    {active && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
