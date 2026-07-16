// Edge Function: trust-engine
//
// Acionada automaticamente por um Database Webhook do Supabase (Database > Webhooks)
// configurado para disparar em INSERT na tabela public.especialistas, com destino
// "Supabase Edge Functions" apontando para esta função. O Dashboard já preenche o
// header Authorization com o service_role key ao criar esse tipo de webhook.
//
// Critérios de aprovação (independentes, sem uso de IA — checagem determinística):
//   1. linkedin_url existe e está acessível (campo único: pode conter LinkedIn, site
//      pessoal, portfólio ou qualquer outro link — só verificamos que responde).
//   2. registro_profissional é confirmado em um dos órgãos oficiais (OAB, CRM/CFM, CREA).
// Regra: status = "verificado" somente se os DOIS critérios passarem (AND).
// Se qualquer um falhar, status = "reprovado" e é criada uma notificação em
// admin_notifications para revisão manual.
//
// ATENÇÃO — limitação conhecida do critério 2 (registro profissional):
// OAB (cna.oab.org.br), CRM/CFM (portal.cfm.org.br) e CREA (consultaprofissional.confea.org.br)
// não expõem uma API pública documentada para busca via GET/querystring — são formulários
// interativos (prováveis SPA/JS ou POST com sessão). A via oficial confiável para CRM é um
// webservice PAGO mediante contrato com o CFM (Resolução CFM nº 2.129/15), que este código
// não usa. A consulta abaixo é best-effort: tenta um fetch direto e procura sinais no HTML
// retornado; se não conseguir confirmar com um sinal positivo claro, o critério conta como
// NÃO CONFIRMADO (reprova esse critério — nunca aprova por omissão/ambiguidade). Recomenda-se
// revisão humana enquanto uma integração mais robusta (webservice oficial do CFM, ou scraping
// com browser headless) não for implementada.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT = "Mozilla/5.0 (compatible; ValoreTrustEngine/1.0)";

interface EspecialistaRecord {
  id: string;
  linkedin_url: string | null;
  registro_profissional: string | null;
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

// Critério 1: o link (linkedin_url) só precisa existir e estar acessível —
// pode ser LinkedIn, Instagram, site pessoal ou portfólio, tratamos todos igual.
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

  const res = await fetchComTimeout(parsed.toString());
  if (!res || !res.ok) {
    return { criterio, passou: false, detalhe: `link inacessível (HTTP ${res?.status ?? "sem resposta"})` };
  }
  return { criterio, passou: true, detalhe: `Link acessível (HTTP ${res.status})` };
}

type TipoRegistro = "OAB" | "CRM" | "CREA" | "desconhecido";

function detectarTipoRegistro(registro: string): TipoRegistro {
  const upper = registro.toUpperCase();
  if (upper.includes("OAB")) return "OAB";
  if (upper.includes("CRM")) return "CRM";
  if (upper.includes("CREA")) return "CREA";
  return "desconhecido";
}

function extrairNumeroEUf(registro: string): { numero: string | null; uf: string | null } {
  // Ex.: "OAB/SP 123456", "CRM-RJ 12345", "CREA-SP 123456"
  const numero = /(\d{2,10})/.exec(registro)?.[1] ?? null;
  const uf = /\b([A-Z]{2})\b/.exec(registro.toUpperCase())?.[1] ?? null;
  return { numero, uf };
}

const SINAL_POSITIVO = /\b(ativ[oa]|regular)\b/i;
const SINAL_NEGATIVO = /não encontrad|nenhum resultado|no results|not found/i;

// Tentativas best-effort — ver aviso no cabeçalho do arquivo sobre a falta de API pública.
async function consultarOAB(numero: string): Promise<CriterioResultado> {
  const criterio = "registro_profissional";
  const url = `https://cna.oab.org.br/?numero=${encodeURIComponent(numero)}`;
  const res = await fetchComTimeout(url);
  if (!res || !res.ok) {
    return { criterio, passou: false, detalhe: `CNA/OAB indisponível (HTTP ${res?.status ?? "sem resposta"})` };
  }
  const html = await res.text();
  const confirmado = SINAL_POSITIVO.test(html) && !SINAL_NEGATIVO.test(html);
  return {
    criterio,
    passou: confirmado,
    detalhe: confirmado
      ? "Registro OAB aparentemente confirmado no CNA"
      : "Não foi possível confirmar o registro na OAB (site não expõe API pública de busca — verificação manual recomendada)",
  };
}

async function consultarCRM(numero: string, uf: string | null): Promise<CriterioResultado> {
  const criterio = "registro_profissional";
  const url = `https://portal.cfm.org.br/busca-medicos/?crm=${encodeURIComponent(numero)}${
    uf ? `&uf=${uf}` : ""
  }`;
  const res = await fetchComTimeout(url);
  if (!res || !res.ok) {
    return { criterio, passou: false, detalhe: `CFM indisponível (HTTP ${res?.status ?? "sem resposta"})` };
  }
  const html = await res.text();
  const confirmado = SINAL_POSITIVO.test(html) && !SINAL_NEGATIVO.test(html);
  return {
    criterio,
    passou: confirmado,
    detalhe: confirmado
      ? "Registro CRM aparentemente confirmado no CFM"
      : "Não foi possível confirmar o registro no CFM (busca oficial confiável exige webservice pago via contrato — verificação manual recomendada)",
  };
}

async function consultarCREA(numero: string): Promise<CriterioResultado> {
  const criterio = "registro_profissional";
  const url = `https://consultaprofissional.confea.org.br/?registro=${encodeURIComponent(numero)}`;
  const res = await fetchComTimeout(url);
  if (!res || !res.ok) {
    return { criterio, passou: false, detalhe: `Confea/CREA indisponível (HTTP ${res?.status ?? "sem resposta"})` };
  }
  const html = await res.text();
  const confirmado = SINAL_POSITIVO.test(html) && !SINAL_NEGATIVO.test(html);
  return {
    criterio,
    passou: confirmado,
    detalhe: confirmado
      ? "Registro CREA aparentemente confirmado no Confea"
      : "Não foi possível confirmar o registro no CREA (site não expõe API pública de busca — verificação manual recomendada)",
  };
}

// Critério 2: consulta o órgão oficial correspondente ao tipo de registro declarado.
async function verificarRegistroProfissional(registro: string | null): Promise<CriterioResultado> {
  const criterio = "registro_profissional";
  if (!registro) {
    return { criterio, passou: false, detalhe: "registro_profissional ausente" };
  }
  const tipo = detectarTipoRegistro(registro);
  const { numero, uf } = extrairNumeroEUf(registro);
  if (!numero) {
    return { criterio, passou: false, detalhe: "não foi possível extrair o número do registro" };
  }

  switch (tipo) {
    case "OAB":
      return await consultarOAB(numero);
    case "CRM":
      return await consultarCRM(numero, uf);
    case "CREA":
      return await consultarCREA(numero);
    default:
      return {
        criterio,
        passou: false,
        detalhe: `tipo de registro não reconhecido em "${registro}" (esperado OAB, CRM ou CREA)`,
      };
  }
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

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405);
  }

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

  const [linkResultado, registroResultado] = await Promise.all([
    verificarLink(record.linkedin_url),
    verificarRegistroProfissional(record.registro_profissional),
  ]);

  const resultados = [linkResultado, registroResultado];
  const aprovado = resultados.every((r) => r.passou);
  const novoStatus = aprovado ? "verificado" : "reprovado";

  const { error } = await supabase
    .from("especialistas")
    .update({ status: novoStatus })
    .eq("id", record.id);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  if (!aprovado) {
    await notificarAdmin(record.id, resultados);
  }

  return jsonResponse({ status: novoStatus, resultados });
});
