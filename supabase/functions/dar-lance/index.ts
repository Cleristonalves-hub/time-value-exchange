// Edge Function: dar-lance
//
// Recebe um lance de um cliente autenticado e valida tudo no servidor (nunca
// confia em lance_atual vindo do client): usuário tem cartão cadastrado
// (item 4 — obrigatório para dar lance), leilão está ativo e dentro da janela
// de tempo, e o valor supera o lance atual. Insere em `lances` e atualiza
// `leiloes.lance_atual` com o service_role, evitando que dois lances
// simultâneos criem uma condição de corrida.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const asUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await asUser.auth.getUser();
  if (userError || !userData.user) {
    return jsonResponse({ error: "não autenticado" }, 401);
  }
  const usuarioId = userData.user.id;

  let body: { leilao_id?: string; valor?: number };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "corpo inválido" }, 400);
  }
  const leilaoId = body.leilao_id;
  const valor = Number(body.valor);
  if (!leilaoId || !Number.isFinite(valor) || valor <= 0) {
    return jsonResponse({ error: "leilao_id e valor são obrigatórios" }, 400);
  }

  // Item 4 — cartão tokenizado é obrigatório antes de qualquer lance.
  const { data: cartao } = await admin
    .from("cartoes")
    .select("id")
    .eq("usuario_id", usuarioId)
    .maybeSingle();
  if (!cartao) {
    return jsonResponse({ error: "Cadastre um cartão de crédito antes de dar lances." }, 403);
  }

  const { data: usuario } = await admin
    .from("usuarios")
    .select("bloqueado")
    .eq("id", usuarioId)
    .maybeSingle();
  if (usuario?.bloqueado) {
    return jsonResponse({ error: "Sua conta está bloqueada por inadimplência. Contate o suporte." }, 403);
  }

  const { data: leilao, error: leilaoError } = await admin
    .from("leiloes")
    .select("id, status, lance_minimo, lance_atual, data_inicio, data_fim")
    .eq("id", leilaoId)
    .maybeSingle();
  if (leilaoError || !leilao) {
    return jsonResponse({ error: "leilão não encontrado" }, 404);
  }
  const now = Date.now();
  if (leilao.status !== "ativo") {
    return jsonResponse({ error: "este leilão não está mais ativo" }, 409);
  }
  if (now < new Date(leilao.data_inicio).getTime() || now > new Date(leilao.data_fim).getTime()) {
    return jsonResponse({ error: "este leilão não está na janela de lances" }, 409);
  }
  const minimoParaLance = leilao.lance_atual ?? leilao.lance_minimo;
  if (valor <= minimoParaLance) {
    return jsonResponse({ error: `o lance precisa ser maior que ${minimoParaLance}` }, 409);
  }

  const { error: insertError } = await admin.from("lances").insert({
    leilao_id: leilaoId,
    usuario_id: usuarioId,
    valor,
  });
  if (insertError) {
    console.error("Falha ao inserir lance:", insertError);
    return jsonResponse({ error: "falha ao registrar o lance" }, 500);
  }

  // Reconfirma o maior lance no momento do update, para não perder uma corrida
  // com outro lance inserido entre o SELECT acima e este UPDATE. lance_atual
  // pode ser NULL (primeiro lance do leilão), por isso o "or" com is.null.
  const { error: updateError } = await admin
    .from("leiloes")
    .update({ lance_atual: valor })
    .eq("id", leilaoId)
    .or(`lance_atual.is.null,lance_atual.lt.${valor}`);
  if (updateError) {
    console.error("Falha ao atualizar lance_atual:", updateError);
  }

  return jsonResponse({ ok: true });
});
