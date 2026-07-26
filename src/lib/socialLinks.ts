import { isSafeHttpUrl } from "@/lib/validators";

// Instagram/X/TikTok são gravados como handle livre (ex.: "@fulano", "fulano"
// ou às vezes a URL inteira, já que o campo de cadastro não força um formato).
// Normaliza ambos os casos para uma URL de perfil clicável.
function stripHandle(raw: string): string {
  return raw.trim().replace(/^@+/, "").replace(/^\/+/, "");
}

function buildHandleUrl(base: string, raw: string | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  const trimmed = raw.trim();
  if (isSafeHttpUrl(trimmed)) return trimmed;
  const handle = stripHandle(trimmed);
  return handle ? `${base}${handle}` : null;
}

// LinkedIn e YouTube já são gravados como URL completa (validada no cadastro).
function buildUrlField(raw: string | undefined): string | null {
  if (!raw || !isSafeHttpUrl(raw)) return null;
  return raw;
}

export type SocialLink = {
  key: "linkedin" | "instagram" | "twitter" | "tiktok" | "youtube";
  url: string;
};

// Retorna só as redes que o especialista de fato preencheu (e que resultaram
// numa URL válida) — nunca renderiza um link vazio ou quebrado.
export function getSocialLinks(specialist: {
  portfolioUrl?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}): SocialLink[] {
  const links: SocialLink[] = [];
  const linkedin = buildUrlField(specialist.portfolioUrl);
  if (linkedin) links.push({ key: "linkedin", url: linkedin });
  const instagram = buildHandleUrl("https://instagram.com/", specialist.instagram);
  if (instagram) links.push({ key: "instagram", url: instagram });
  const twitter = buildHandleUrl("https://x.com/", specialist.twitter);
  if (twitter) links.push({ key: "twitter", url: twitter });
  const tiktok = buildHandleUrl("https://tiktok.com/@", specialist.tiktok);
  if (tiktok) links.push({ key: "tiktok", url: tiktok });
  const youtube = buildUrlField(specialist.youtube);
  if (youtube) links.push({ key: "youtube", url: youtube });
  return links;
}
