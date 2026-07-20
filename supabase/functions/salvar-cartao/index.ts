// Edge Function: salvar-cartao
//
// Recebe um card_token gerado no navegador pelo SDK client-side do Mercado
// Pago (que fala direto com os servidores do MP — o dado bruto do cartão
// nunca passa por aqui) e o transforma num cartão REUTILIZÁVEL, anexado a um
// Customer do Mercado Pago. Isso exige o Access Token (chave secreta,
// server-side) do Mercado Pago — só temos a Public Key até este momento, então
// esta função retorna um erro claro enquanto MERCADOPAGO_ACCESS_TOKEN não for
// configurado como secret (supabase secrets set MERCADOPAGO_ACCESS_TOKEN=...).
//
// Sem essa etapa, o card_token do SDK é de uso único / curta duração — não dá
// pra cobrar depois, quando o leilão terminar dias mais tarde. É essa etapa
// (Customer + Card na API do MP) que resolve isso.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function mpFetch(path: string, init: RequestInit) {
  const res = await fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(10000),
  });
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

async function buscarOuCriarCustomer(email: string): Promise<string> {
  const search = await mpFetch(`/v1/customers/search?email=${encodeURIComponent(email)}`, { method: "GET" });
  const existing = search.body?.results?.[0]?.id;
  if (existing) return existing as string;

  const created = await mpFetch("/v1/customers", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!created.ok || !created.body?.id) {
    throw new Error(`Falha ao criar customer no Mercado Pago: ${JSON.stringify(created.body)}`);
  }
  return created.body.id as string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);

  if (!MP_ACCESS_TOKEN) {
    return jsonResponse(
      { error: "MERCADOPAGO_ACCESS_TOKEN não configurado no servidor. Peça ao suporte técnico para configurar." },
      500,
    );
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const asUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await asUser.auth.getUser();
  if (userError || !userData.user?.email) {
    return jsonResponse({ error: "não autenticado" }, 401);
  }
  const usuarioId = userData.user.id;
  const email = userData.user.email;

  let body: { card_token?: string; ultimos_digitos?: string; bandeira?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "corpo inválido" }, 400);
  }
  if (!body.card_token) return jsonResponse({ error: "card_token é obrigatório" }, 400);

  try {
    const customerId = await buscarOuCriarCustomer(email);

    const cardResult = await mpFetch(`/v1/customers/${customerId}/cards`, {
      method: "POST",
      body: JSON.stringify({ token: body.card_token }),
    });
    if (!cardResult.ok) {
      console.error("Falha ao anexar cartão no Mercado Pago:", cardResult.body);
      return jsonResponse({ error: "Não foi possível validar o cartão junto ao Mercado Pago." }, 502);
    }

    const cardId = cardResult.body?.id ?? null;
    const ultimosDigitos = cardResult.body?.last_four_digits ?? body.ultimos_digitos ?? null;
    const bandeira = cardResult.body?.payment_method?.name ?? body.bandeira ?? null;

    const { error: upsertError } = await admin
      .from("cartoes")
      .upsert(
        {
          usuario_id: usuarioId,
          mp_customer_id: customerId,
          mp_card_id: cardId,
          ultimos_digitos: ultimosDigitos,
          bandeira,
        },
        { onConflict: "usuario_id" },
      );
    if (upsertError) {
      console.error("Falha ao salvar cartão no Supabase:", upsertError);
      return jsonResponse({ error: "falha ao salvar cartão" }, 500);
    }

    return jsonResponse({ ok: true, ultimos_digitos: ultimosDigitos, bandeira });
  } catch (err) {
    console.error("Erro ao salvar cartão:", err);
    return jsonResponse({ error: err instanceof Error ? err.message : "erro desconhecido" }, 500);
  }
});
