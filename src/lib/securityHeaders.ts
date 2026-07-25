// Headers de segurança aplicados a toda resposta do servidor. Mantidos aqui
// como fonte única — netlify.toml e vercel.json (usados quando o deploy é
// puramente estático, sem passar por src/server.ts) precisam repetir a mesma
// lista manualmente, já que arquivos de config declarativos não podem
// importar TS.
export const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.resend.com https://api.mercadopago.com",
};

// Constrói uma nova Response em vez de mutar `response.headers` diretamente:
// em alguns runtimes (Cloudflare Workers, quando a Response vem de um upstream
// fetch) o objeto Headers é imutável e `.set()` lançaria TypeError.
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
