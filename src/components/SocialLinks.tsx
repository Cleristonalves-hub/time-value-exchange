import { Linkedin, Instagram, X as XIcon, Youtube } from "lucide-react";
import { getSocialLinks, type SocialLink } from "@/lib/socialLinks";
import { useT } from "@/lib/i18n";

// O lucide-react não tem ícone de TikTok — usamos um SVG próprio (traço da
// logo oficial) para não deixar essa rede sem ícone reconhecível.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.62h-3.14v13.44c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .58.05.85.13v-3.2a6.1 6.1 0 0 0-.85-.06 6.05 6.05 0 1 0 6.05 6.05V9.4a7.6 7.6 0 0 0 4.44 1.42V7.68a4.28 4.28 0 0 1-3.05-1.86z" />
    </svg>
  );
}

const ICONS: Record<SocialLink["key"], React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: XIcon,
  tiktok: TikTokIcon,
  youtube: Youtube,
};

const LABEL_KEY: Record<SocialLink["key"], string> = {
  linkedin: "sl.linkedin",
  instagram: "ce.instagram",
  twitter: "ce.twitter",
  tiktok: "ce.tiktok",
  youtube: "ce.youtube",
};

export function SocialLinks({
  specialist,
  className,
}: {
  specialist: Parameters<typeof getSocialLinks>[0];
  className?: string;
}) {
  const { t } = useT();
  const links = getSocialLinks(specialist);
  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {links.map(({ key, url }) => {
        const Icon = ICONS[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t(LABEL_KEY[key])}
            title={t(LABEL_KEY[key])}
            className="flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}
