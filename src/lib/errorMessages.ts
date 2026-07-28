// Traduz mensagens de erro técnicas (Supabase Auth/GoTrue, falhas de rede ao
// invocar Edge Functions) para chaves i18n. Essas mensagens vêm em inglês por
// padrão do SDK e, sem isso, vazariam texto em inglês para o usuário mesmo em
// telas totalmente traduzidas.
//
// Mensagens que já vêm das nossas próprias Edge Functions (regras de negócio,
// sempre escritas em pt-BR) não batem em nenhum destes padrões e são
// devolvidas como estão — só o inglês do SDK é reescrito.
type Translate = (key: string, params?: Record<string, string | number>) => string;

const PATTERNS: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "err.invalidCredentials"],
  [/user already registered|already registered|already exists/i, "common.emailAlreadyRegistered"],
  [/password should be at least|password.*at least \d+ characters|signup requires a valid password/i, "err.weakPassword"],
  [/unable to validate email address|invalid email/i, "err.invalidEmailFormat"],
  [/rate limit|too many requests|only request this after/i, "err.rateLimited"],
  [/token has expired or is invalid|invalid refresh token|otp expired/i, "err.expiredToken"],
  [/failed to fetch|network ?error|load failed|failed to send a request/i, "err.network"],
  [/unauthorized|not authorized|permission denied|jwt/i, "err.unauthorized"],
];

export function translateErrorMessage(message: string | null | undefined, t: Translate): string {
  if (!message) return t("err.generic");
  for (const [pattern, key] of PATTERNS) {
    if (pattern.test(message)) return t(key);
  }
  return message;
}
