import valoreMark from "@/assets/valore-mark.png";

export function ValoreLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-gradient-gold tracking-[0.2em] font-light ${className}`}
    >
      VALORE
    </span>
  );
}

export function ValoreMark({
  className = "",
  size = 64,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src={valoreMark}
      alt="Valore"
      width={size}
      height={size}
      className={`select-none object-contain ${className}`}
      style={{
        filter:
          "drop-shadow(0 0 24px oklch(0.78 0.13 85 / 0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
      }}
      draggable={false}
    />
  );
}
