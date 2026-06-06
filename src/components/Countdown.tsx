import { useEffect, useState } from "react";

export function Countdown({ endsAt, className }: { endsAt: number; className?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const diff = Math.max(0, endsAt - now);
  const h = Math.floor(diff / 3.6e6);
  const m = Math.floor((diff % 3.6e6) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const urgent = diff < 60 * 60 * 1000;

  return (
    <span
      className={`font-mono tabular-nums ${urgent ? "text-destructive" : "text-gold"} ${className ?? ""}`}
    >
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
