// Edge Function: editar-leilao
//
// Especialista edita título, descrição, data/hora de encerramento e (se ainda
// não houver nenhum lance) o valor mínimo de um leilão próprio que ainda está
// ativo. Passa pelo service_role (não há política de UPDATE para o dono em
// `leiloes`, só para admin — ver 20260725170000_security_audit_rls_hardening.sql)
// e revalida tudo no servidor, nunca confiando nos dados vindos do client.

import { createClient } from "npm:@supabase/supabase-js@2";
import { checkRateLimitDb } from "../_shared/rateLimitDb.ts";
import { checkOrigin } from "../_shared/csrf.ts";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const TITULO_MAX_LEN = 100;
const DESCRICAO_MAX_LEN = 1000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;
  return withCors(req, await handleRequest(req));
});

async function handleRequest(req: Request): Promise<Response> {
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);
  const limited = await checkRateLimitDb(req, admin, "editar-leilao", 10);
  if (limited) return limited;
  const originBlocked = checkOrigin(req);
  if (originBlocked) return originBlocked;

  const authHeader = req.headers.get("Authorization") ?? "";
  const asUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await asUser.auth.getUser();
  if (userError || !userData.user) {
    return jsonResponse({ error: "não autenticado" }, 401);
  }

  let body: { leilao_id?: string; titulo?: string; descricao?: string; data_fim?: string; lance_minimo?: number };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "corpo inválido" }, 400);
  }
  const leilaoId = body.leilao_id;
  const titulo = (body.titulo ?? "").trim();
  const descricao = (body.descricao ?? "").trim();
  const dataFim = body.data_fim;
  const lanceMinimo = body.lance_minimo;

  if (!leilaoId || !titulo || !dataFim) {
    return jsonResponse({ error: "leilao_id, titulo e data_fim são obrigatórios" }, 400);
  }
  if (titulo.length > TITULO_MAX_LEN) {
    return jsonResponse({ error: `título deve ter no máximo ${TITULO_MAX_LEN} caracteres` }, 400);
  }
  if (descricao.length > DESCRICAO_MAX_LEN) {
    return jsonResponse({ error: `descrição deve ter no máximo ${DESCRICAO_MAX_LEN} caracteres` }, 400);
  }
  const novaDataFim = new Date(dataFim);
  if (Number.isNaN(novaDataFim.getTime())) {
    return jsonResponse({ error: "data_fim inválida" }, 400);
  }
  if (lanceMinimo !== undefined && (!Number.isFinite(lanceMinimo) || lanceMinimo <= 0)) {
    return jsonResponse({ error: "O valor mínimo do lance deve ser maior que zero" }, 400);
  }

  const { data: leilao, error: leilaoError } = await admin
    .from("leiloes")
    .select("id, status, data_inicio, lance_atual, especialista_id")
    .eq("id", leilaoId)
    .maybeSingle();
  if (leilaoError || !leilao) return jsonResponse({ error: "leilão não encontrado" }, 404);

  const { data: especialista, error: especialistaError } = await admin
    .from("especialistas")
    .select("id, usuario_id")
    .eq("id", leilao.especialista_id)
    .maybeSingle();
  if (especialistaError || !especialista) return jsonResponse({ error: "especialista não encontrado" }, 404);

  if (especialista.usuario_id !== userData.user.id) {
    return jsonResponse({ error: "você não é o dono deste leilão" }, 403);
  }
  if (leilao.status !== "ativo") {
    return jsonResponse({ error: "este leilão não está mais ativo" }, 409);
  }
  if (novaDataFim.getTime() <= new Date(leilao.data_inicio).getTime()) {
    return jsonResponse({ error: "A data de encerramento deve ser após a data de início" }, 400);
  }
  if (novaDataFim.getTime() <= Date.now()) {
    return jsonResponse({ error: "a data de encerramento precisa ser no futuro" }, 400);
  }
  // O valor mínimo só pode mudar enquanto ninguém deu lance ainda — mudar
  // depois disso seria injusto com quem já apostou com base no valor anterior.
  if (lanceMinimo !== undefined && leilao.lance_atual !== null) {
    return jsonResponse({ error: "não é possível alterar o valor mínimo depois que o leilão já recebeu lances" }, 409);
  }

  const { error: updateError } = await admin
    .from("leiloes")
    .update({
      titulo,
      descricao: descricao || null,
      data_fim: novaDataFim.toISOString(),
      ...(lanceMinimo !== undefined ? { lance_minimo: lanceMinimo } : {}),
    })
    .eq("id", leilaoId);
  if (updateError) {
    console.error("Falha ao editar leilão:", updateError);
    return jsonResponse({ error: "falha ao salvar as alterações" }, 500);
  }

  return jsonResponse({ ok: true });
}
