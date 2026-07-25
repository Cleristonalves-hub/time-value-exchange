// Rate limiting simples por IP, em memória, para as Edge Functions públicas.
//
// LIMITAÇÃO CONHECIDA: cada isolate/instância do Deno Deploy tem seu próprio
// mapa em memória — não é um rate limit distribuído. Sob carga, o runtime
// pode escalar para múltiplas instâncias (cada uma com seu próprio contador)
// e um cold start zera o contador daquela instância. Isso ainda barra abuso
// básico de um único cliente/script simples, mas não substitui um rate limit
// de verdade na borda (ex.: Cloudflare WAF/rate limiting rules, ou um
// KV/Redis compartilhado como Upstash). Ver SECURITY.md.

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();
const WINDOW_MS = 60_000;

function clientIp(req: Request): string {
  // Supabase/Deno Deploy roteia através de um proxy — o IP real do cliente
  // vem em x-forwarded-for (primeiro IP da lista) ou, como fallback, em
  // cf-connecting-ip quando atrás de Cloudflare.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

// Remove entradas expiradas periodicamente para o Map não crescer sem limite
// em instâncias de longa duração.
let lastSweep = Date.now();
function sweepIfNeeded(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [key, w] of buckets) {
    if (now >= w.resetAt) buckets.delete(key);
  }
}

/**
 * Retorna `null` se o request pode prosseguir, ou uma Response 429 pronta
 * para devolver se o limite foi excedido.
 */
export function checkRateLimit(req: Request, maxPerMinute: number, scope: string): Response | null {
  const now = Date.now();
  sweepIfNeeded(now);

  const key = `${scope}:${clientIp(req)}`;
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (existing.count >= maxPerMinute) {
    const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000);
    return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    });
  }

  existing.count += 1;
  return null;
}
