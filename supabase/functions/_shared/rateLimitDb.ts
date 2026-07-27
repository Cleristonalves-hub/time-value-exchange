// Rate limiting por IP com estado compartilhado no banco (função Postgres
// check_rate_limit, ver migration 20260727110000_add_rate_limits.sql) — ao
// contrário de rateLimit.ts (em memória, por instância), este é consistente
// entre instâncias concorrentes e sobrevive a cold start.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

/**
 * Retorna `null` se o request pode prosseguir, ou uma Response 429 pronta
 * para devolver se o limite foi excedido.
 *
 * Se a checagem em si falhar (RPC indisponível, erro de rede) o request
 * passa — decisão deliberada de disponibilidade sobre rigor aqui: um erro de
 * infraestrutura no rate limiter não deve derrubar a função inteira. O erro
 * fica registrado no log da função para investigação.
 */
export async function checkRateLimitDb(
  req: Request,
  supabase: SupabaseClient,
  scope: string,
  maxPerMinute = 10,
): Promise<Response | null> {
  const key = `${scope}:${clientIp(req)}`;
  const { data: allowed, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_max: maxPerMinute,
    p_window_seconds: 60,
  });

  if (error) {
    console.error(`check_rate_limit falhou para "${scope}":`, error);
    return null;
  }

  if (!allowed) {
    return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em 1 minuto." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "60" },
    });
  }

  return null;
}
