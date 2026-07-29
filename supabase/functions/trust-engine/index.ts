// Edge Function: trust-engine
//
// Acionada automaticamente por um Database Webhook do Supabase (Database > Webhooks)
// configurado para disparar em INSERT na tabela public.especialistas, com destino
// "Supabase Edge Functions" apontando para esta função. O Dashboard já preenche o
// header Authorization com o service_role key ao criar esse tipo de webhook.
//
// Critérios de aprovação (independentes, sem uso de IA — checagem determinística):
//   1. Link (linkedin_url) — domínio linkedin.com é aprovado automaticamente, sem
//      fetch: o LinkedIn bloqueia requests automatizados (retorna HTTP 999 para
//      qualquer coisa que não pareça um navegador real), então tentar acessá-lo
//      reprovava especialistas legítimos por um bloqueio do LinkedIn, não por
//      problema real no link. Qualquer outro domínio (site pessoal, portfólio)
//      continua exigindo uma resposta HTTP 200.
//   2. Registro profissional — só é exigido em nichos regulamentados (Saúde/CRM,
//      Direito/OAB, Finanças/CFA-CVM). Em nichos não regulamentados o critério é
//      ignorado por completo se o campo estiver vazio (não conta nem a favor nem
//      contra); se o especialista preencheu mesmo assim, o formato é validado do
//      mesmo jeito. A validação é só de FORMATO (prefixo do tipo + número, e UF
//      quando aplicável) — não há confirmação ao vivo no órgão oficial: OAB
//      (cna.oab.org.br), CRM/CFM (portal.cfm.org.br) e CREA
//      (consultaprofissional.confea.org.br) não expõem API pública de busca via
//      GET/querystring, e a via oficial confiável para CRM é um webservice PAGO
//      mediante contrato com o CFM (Resolução CFM nº 2.129/15). Checar só o
//      formato é deliberado: é determinístico e não depende da disponibilidade
//      de um site de terceiro. Revisão humana (admin_notifications) continua
//      sendo a rede de segurança para o que o formato sozinho não pega.
//
// Regra: status = "verificado" quando todos os critérios AVALIADOS passarem —
// para nichos não regulamentados sem registro informado, isso equivale a "só
// precisa do link válido". Se qualquer critério avaliado falhar, status =
// "reprovado" e é criada uma notificação em admin_notifications para revisão
// manual.
//
// Além do status, esta função recalcula especialistas.trust_score (0-100) a
// cada verificação, incluindo um bônus de até +10 por presença em redes sociais
// (Instagram/X/TikTok/YouTube) além do LinkedIn — ver calcularTrustScore() mais
// abaixo. O bônus nunca reprova ninguém, só aumenta o score.

import { createClient } from "npm:@supabase/supabase-js@2";
import { checkRateLimitDb } from "../_shared/rateLimitDb.ts";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Configure com: supabase secrets set RESEND_API_KEY=re_... — nunca hardcode a chave no código.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = "contato@valore.services";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT = "Mozilla/5.0 (compatible; ValoreTrustEngine/1.0)";

interface EspecialistaRecord {
  id: string;
  email: string | null;
  nicho: string | null;
  linkedin_url: string | null;
  registro_profissional: string | null;
  instagram: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  status?: string | null;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: EspecialistaRecord;
  old_record: EspecialistaRecord | null;
}

interface CriterioResultado {
  criterio: string;
  passou: boolean;
  detalhe: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fetchComTimeout(url: string): Promise<Response | null> {
  try {
    return await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    console.error(`Falha ao acessar ${url}:`, err);
    return null;
  }
}

// Critério 1: domínio linkedin.com (ou subdomínio, ex. www.linkedin.com) é
// aprovado sem fetch — o LinkedIn responde HTTP 999 a qualquer request que não
// pareça um navegador real, então tentar acessá-lo só reprovaria por causa do
// próprio bloqueio do LinkedIn, não por um problema real no link. Qualquer
// outro domínio (site pessoal, portfólio) continua exigindo resposta HTTP 200.
function isLinkedInUrl(parsed: URL): boolean {
  const host = parsed.hostname.toLowerCase();
  return host === "linkedin.com" || host.endsWith(".linkedin.com");
}

async function verificarLink(url: string | null): Promise<CriterioResultado> {
  const criterio = "link";
  if (!url) {
    return { criterio, passou: false, detalhe: "linkedin_url ausente" };
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { criterio, passou: false, detalhe: "linkedin_url inválida" };
  }

  if (isLinkedInUrl(parsed)) {
    return { criterio, passou: true, detalhe: "Domínio linkedin.com — aprovado automaticamente" };
  }

  const res = await fetchComTimeout(parsed.toString());
  if (!res || !res.ok) {
    return { criterio, passou: false, detalhe: `link inacessível (HTTP ${res?.status ?? "sem resposta"})` };
  }
  return { criterio, passou: true, detalhe: `Link acessível (HTTP ${res.status})` };
}

type TipoRegistro = "OAB" | "CRM" | "CREA" | "CFA" | "CVM" | "desconhecido";

// Nichos regulamentados: exigem registro profissional. Qualquer nicho fora
// deste mapa (Tecnologia, Educação, Artes, Música, Negócios, Esporte, ou um
// nicho desconhecido/futuro) é tratado como não regulamentado — o registro
// vira opcional para eles.
const NICHOS_REGULAMENTADOS: Record<string, TipoRegistro[]> = {
  "Saúde": ["CRM"],
  "Direito": ["OAB"],
  "Finanças": ["CFA", "CVM"],
};

function nichoRequerRegistro(nicho: string | null): boolean {
  return !!nicho && nicho in NICHOS_REGULAMENTADOS;
}

function detectarTipoRegistro(registro: string): TipoRegistro {
  const upper = registro.toUpperCase();
  if (upper.includes("OAB")) return "OAB";
  if (upper.includes("CRM")) return "CRM";
  if (upper.includes("CREA")) return "CREA";
  if (upper.includes("CFA")) return "CFA";
  if (upper.includes("CVM")) return "CVM";
  return "desconhecido";
}

function extrairNumeroEUf(registro: string): { numero: string | null; uf: string | null } {
  // Ex.: "OAB/SP 123456", "CRM-RJ 12345", "CREA-SP 123456", "CFA 12345"
  const numero = /(\d{2,10})/.exec(registro)?.[1] ?? null;
  const uf = /\b([A-Z]{2})\b/.exec(registro.toUpperCase())?.[1] ?? null;
  return { numero, uf };
}

// OAB/CRM/CREA são conselhos estaduais — exigem UF no registro. CFA/CVM são
// federais e não têm variação por estado.
const TIPOS_COM_UF = new Set<TipoRegistro>(["OAB", "CRM", "CREA"]);

// Valida só o FORMATO do registro (prefixo do tipo reconhecido + número, e UF
// quando o tipo é estadual) — não confirma ao vivo no órgão oficial. Ver
// cabeçalho do arquivo para o porquê dessa escolha.
function formatoDeRegistroValido(registro: string): CriterioResultado {
  const criterio = "registro_profissional";
  const tipo = detectarTipoRegistro(registro);
  if (tipo === "desconhecido") {
    return {
      criterio,
      passou: false,
      detalhe: `tipo de registro não reconhecido em "${registro}" (esperado OAB, CRM, CREA, CFA ou CVM)`,
    };
  }
  const { numero, uf } = extrairNumeroEUf(registro);
  if (!numero) {
    return { criterio, passou: false, detalhe: "não foi possível extrair o número do registro" };
  }
  if (TIPOS_COM_UF.has(tipo) && !uf) {
    return { criterio, passou: false, detalhe: `não foi possível extrair a UF do registro ${tipo} (formato esperado: ex. "${tipo}/SP 123456")` };
  }
  return { criterio, passou: true, detalhe: `Registro ${tipo} em formato válido` };
}

// Critério 2: só é avaliado se o nicho exigir registro OU se o especialista
// preencheu o campo mesmo em nicho não regulamentado (nesse caso o formato
// ainda precisa ser válido). Em nicho não regulamentado com o campo vazio,
// retorna null — o critério é ignorado, não conta nem a favor nem contra.
function verificarRegistroProfissional(nicho: string | null, registro: string | null): CriterioResultado | null {
  const criterio = "registro_profissional";
  const regulamentado = nichoRequerRegistro(nicho);
  const preenchido = !!registro && registro.trim().length > 0;

  if (!regulamentado && !preenchido) {
    return null;
  }
  if (!preenchido) {
    return { criterio, passou: false, detalhe: `registro profissional é obrigatório para o nicho "${nicho}"` };
  }
  return formatoDeRegistroValido(registro!.trim());
}

// Bônus de presença online: +10 no trust_score se o especialista tem pelo
// menos 2 redes sociais preenchidas além do LinkedIn (Instagram, X/Twitter,
// TikTok, YouTube). É só um bônus — nunca reprova ninguém, só soma.
const REDES_SOCIAIS_MINIMO_PARA_BONUS = 2;
const BONUS_REDES_SOCIAIS = 10;

function contarRedesSociais(record: EspecialistaRecord): number {
  return [record.instagram, record.twitter, record.tiktok, record.youtube].filter(
    (v) => !!v && v.trim().length > 0,
  ).length;
}

// trust_score (0-100, default 50 no cadastro): parte do valor neutro e
// soma/subtrai por critério conforme ele passa ou falha nesta verificação.
// registro_profissional pesa mais que o link por ser o critério mais difícil
// de falsificar (depende do formato de um registro oficial, não só de uma URL
// responder). Quando o nicho não exige registro e o especialista não o
// preencheu, esse critério nem entra na conta (nem soma nem subtrai) — só o
// link é considerado. Dois critérios aprovados = 100 (mesmo teto do status
// "verificado"); os dois reprovados = 0; o bônus de redes sociais pode levar
// o score acima do que os critérios sozinhos dariam, sempre limitado a 100.
// Persistido pelo próprio Trust Engine via service_role — o trigger
// protect_especialistas_trust_fields (migration 20260729130000) impede que o
// especialista ou qualquer outra sessão autenticada sobrescreva esse valor
// diretamente.
const PESO_CRITERIO: Record<string, number> = {
  link: 20,
  registro_profissional: 30,
};

function calcularTrustScore(resultados: CriterioResultado[], bonusRedesSociais: number): number {
  let score = 50;
  for (const r of resultados) {
    const peso = PESO_CRITERIO[r.criterio] ?? 10;
    score += r.passou ? peso : -peso;
  }
  score += bonusRedesSociais;
  return Math.max(0, Math.min(100, score));
}

async function notificarAdmin(especialistaId: string, resultados: CriterioResultado[]) {
  const motivo = resultados
    .filter((r) => !r.passou)
    .map((r) => `${r.criterio}: ${r.detalhe}`)
    .join(" | ");
  const { error } = await supabase.from("admin_notifications").insert({
    especialista_id: especialistaId,
    motivo: motivo || "Falha não especificada na verificação automática",
    criterios: resultados,
  });
  if (error) console.error("Falha ao criar notificação para o admin:", error.message);
}

const EXPLICACAO_CRITERIO: Record<string, string> = {
  link: "Não conseguimos acessar o link (site/portfólio) informado no seu cadastro. Confira se a URL está correta e se a página está publicamente acessível (sem exigir login).",
  registro_profissional:
    "Seu nicho exige registro profissional (OAB para Direito, CRM para Saúde, ou CFA/CVM para Finanças) e não conseguimos validar o formato do que foi informado. Confira se o número e a UF estão corretos, no formato \"OAB/UF número\", \"CRM-UF número\" ou similar.",
};

function montarCorpoEmail(resultados: CriterioResultado[]): { html: string; text: string } {
  const falhas = resultados.filter((r) => !r.passou);
  const itens = falhas.map(
    (f) => EXPLICACAO_CRITERIO[f.criterio] ?? `${f.criterio}: ${f.detalhe}`,
  );

  const text = [
    "Olá,",
    "",
    "Analisamos seu cadastro como especialista na Valore e, no momento, não conseguimos aprová-lo automaticamente pelos seguintes motivos:",
    "",
    ...itens.map((i) => `- ${i}`),
    "",
    "Para corrigir, acesse seu perfil no app Valore e clique em \"Atualizar informações\" para revisar e reenviar seus dados. Assim que atualizar, faremos uma nova verificação.",
    "",
    "Equipe Valore",
  ].join("\n");

  const html = `
    <p>Olá,</p>
    <p>Analisamos seu cadastro como especialista na Valore e, no momento, não conseguimos aprová-lo automaticamente pelos seguintes motivos:</p>
    <ul>${itens.map((i) => `<li>${i}</li>`).join("")}</ul>
    <p>Para corrigir, acesse seu perfil no app Valore e clique em <strong>"Atualizar informações"</strong> para revisar e reenviar seus dados. Assim que atualizar, faremos uma nova verificação.</p>
    <p>Equipe Valore</p>
  `;

  return { html, text };
}

async function enviarEmailReprovacao(email: string | null, resultados: CriterioResultado[]) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada — pulando envio de e-mail de reprovação.");
    return;
  }
  if (!email) {
    console.error("Especialista sem e-mail cadastrado — não foi possível enviar aviso de reprovação.");
    return;
  }

  const { html, text } = montarCorpoEmail(resultados);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [email],
        subject: "Sobre seu cadastro na Valore",
        html,
        text,
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`Falha ao enviar e-mail via Resend (HTTP ${res.status}):`, await res.text());
    }
  } catch (err) {
    console.error("Erro ao chamar a API do Resend:", err);
  }
}

Deno.serve(async (req: Request) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;
  return withCors(req, await handleRequest(req));
});

async function handleRequest(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405);
  }
  const limited = await checkRateLimitDb(req, supabase, "trust-engine", 10);
  if (limited) return limited;

  // Defesa extra: a chamada deve vir autenticada com o service_role key
  // (é o que o Database Webhook do Supabase envia por padrão).
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid JSON body" }, 400);
  }

  const record = payload.record;
  if (!record?.id) {
    return jsonResponse({ error: "missing record.id" }, 400);
  }

  const linkResultado = await verificarLink(record.linkedin_url);
  const registroResultado = verificarRegistroProfissional(record.nicho, record.registro_profissional);

  // registroResultado é null quando o nicho não exige registro e o campo
  // ficou vazio — nesse caso o critério é ignorado por completo (nem entra na
  // conta de aprovação, nem no cálculo do trust_score).
  const resultados = registroResultado ? [linkResultado, registroResultado] : [linkResultado];
  const aprovado = resultados.every((r) => r.passou);
  const novoStatus = aprovado ? "verificado" : "reprovado";
  const bonusRedesSociais = contarRedesSociais(record) >= REDES_SOCIAIS_MINIMO_PARA_BONUS ? BONUS_REDES_SOCIAIS : 0;
  const trustScore = calcularTrustScore(resultados, bonusRedesSociais);

  const { error } = await supabase
    .from("especialistas")
    .update({ status: novoStatus, trust_score: trustScore })
    .eq("id", record.id);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  if (!aprovado) {
    await Promise.all([
      notificarAdmin(record.id, resultados),
      enviarEmailReprovacao(record.email, resultados),
    ]);
  }

  return jsonResponse({ status: novoStatus, trustScore, resultados });
}
