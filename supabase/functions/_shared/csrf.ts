// Defesa contra CSRF nas Edge Functions chamadas pelo navegador com o JWT do
// usuário no header Authorization.
//
// IMPORTANTE: isso não é um CSRF "clássico" com token de formulário, porque
// não se aplica aqui — CSRF clássico explora credenciais AMBIENTAIS que o
// navegador anexa sozinho (cookies de sessão). Estas funções são chamadas via
// `supabase.functions.invoke()`, que manda o JWT explicitamente no header
// Authorization; um site malicioso não consegue ler o localStorage/sessionStorage
// da Valore nem forjar esse header em modo cross-origin sem antes já ter
// comprometido o navegador da vítima de outra forma. Ainda assim, como defesa
// em profundidade, exigimos que o header Origin (quando presente) bata com um
// domínio conhecido — isso barra chamadas feitas diretamente do browser a
// partir de uma página de terceiros (ex.: um <script> ou <img>/fetch em site
// malicioso tentando abusar de credenciais expostas por outro bug).
const ALLOWED_ORIGINS = [
  "https://valore.services",
  "https://www.valore.services",
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Ambientes de preview/dev locais (Vite, Cloudflare Pages preview, etc.).
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || /\.pages\.dev$/.test(new URL(origin).hostname);
}

/**
 * Retorna `null` se a origem é aceitável, ou uma Response 403 pronta para
 * devolver caso contrário. Requests sem header Origin (chamadas
 * server-to-server, curl, cron) passam — o Origin só é enviado pelo
 * navegador em requests cross-site.
 */
export function checkOrigin(req: Request): Response | null {
  const origin = req.headers.get("Origin");
  if (!origin) return null;
  try {
    if (isAllowedOrigin(origin)) return null;
  } catch {
    // Origin malformado — trata como não permitido.
  }
  return new Response(JSON.stringify({ error: "origem não permitida" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}
