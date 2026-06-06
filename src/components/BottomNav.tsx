import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Gavel, User } from "lucide-react";

const items = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/lances", label: "Lances", icon: Gavel },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-md py-2 text-[10px] uppercase tracking-widest transition-colors ${
                active ? "text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
