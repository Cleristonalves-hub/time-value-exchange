// CORS restrito a uma lista fixa de origens — nenhuma outra origem recebe
// Access-Control-Allow-Origin, então o navegador bloqueia a leitura da
// resposta para qualquer site fora desta lista (chamadas server-to-server,
// que não mandam header Origin, não são afetadas por CORS de qualquer forma).
const ALLOWED_ORIGINS = new Set([
  "https://valore.services",
  "https://www.valore.services",
  "https://sapuvozigtbxowuzwgqq.supabase.co",
]);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
    // Sinaliza para caches/CDNs que a resposta varia por Origin — sem isso,
    // uma resposta cacheada para uma origem permitida poderia ser servida
    // (com o Allow-Origin errado) para uma origem diferente.
    Vary: "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

// Chame no topo do handler, antes de qualquer outra lógica: requests OPTIONS
// (preflight do navegador) precisam de resposta imediata só com os headers,
// sem passar pela checagem de auth/rate-limit/etc.
export function handleCorsPreflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

// Aplica os headers de CORS a uma Response já pronta, sem mutar o objeto
// original (que pode ter headers imutáveis dependendo do runtime).
export function withCors(req: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(req))) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}
