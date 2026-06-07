import { useEffect, useState } from "react";

type Variant = "auto" | "live";

export function Countdown({
  endsAt,
  className,
  variant = "auto",
}: {
  endsAt: number;
  className?: string;
  variant?: Variant;
}) {
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
  const color =
    variant === "live" ? "text-destructive" : urgent ? "text-destructive" : "text-gold";

  return (
    <span className={`font-mono tabular-nums ${color} ${className ?? ""}`}>
      {variant === "live" && (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive align-middle" />
      )}
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
