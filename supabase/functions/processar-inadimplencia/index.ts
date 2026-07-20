// Edge Function: processar-inadimplencia
//
// Não é chamada pelo app — roda periodicamente via pg_cron (ver migration
// 20260723100000_cron_processar_inadimplencia.sql). Faz duas coisas a cada
// execução:
//
//   A) Leilões que acabaram de encerrar (data_fim passou, status='ativo' e
//      ainda sem linha em `pagamentos`): descobre o vencedor pelo maior lance,
//      cria o registro de pagamento e tenta cobrar via Mercado Pago. Notifica
//      o especialista com "Pagamento em análise — aguarde".
//
//   B) Pagamentos pendentes/em análise há mais de 48h: marca como falhou,
//      cancela o leilão, cria um leilão substituto com destaque grátis por 7
//      dias (sem contar como cancelamento do especialista — iniciado_por
//      'sistema' não entra na regra dos 3 cancelamentos/mês), notifica o
//      especialista e bloqueia o cliente inadimplente.
//
// LIMITAÇÃO CONHECIDA: a tentativa de cobrança real via Mercado Pago exige
// MERCADOPAGO_ACCESS_TOKEN (não configurado ainda — só temos a Public Key).
// Sem o Access Token, todo pagamento fica em "pendente" indefinidamente até
// o timeout de 48h, que então cancela e reagenda automaticamente. O
// state machine funciona; só a cobrança de fato precisa do Access Token.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = "contato@valore.services";
// Chamada só pelo pg_cron com esta chave compartilhada — não é uma rota pública.
const CRON_SECRET = Deno.env.get("PROCESSAR_INADIMPLENCIA_SECRET");

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const QUARENTA_OITO_HORAS_MS = 48 * 60 * 60 * 1000;
const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function enviarEmail(to: string, subject: string, html: string, text: string) {
  if (!RESEND_API_KEY || !to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`Resend HTTP ${res.status}:`, await res.text());
  } catch (err) {
    console.error("Falha ao enviar email:", err);
  }
}

// Tenta cobrar o vencedor usando o cartão salvo (Customer + Card no Mercado
// Pago). Retorna "pago" se a cobrança foi aprovada, "pendente" em qualquer
// outro caso (sem Access Token, cartão recusado, etc.) — nunca lança.
async function tentarCobrar(params: {
  customerId: string;
  cardId: string;
  valor: number;
  email: string;
  descricao: string;
}): Promise<{ status: "pago" | "pendente"; mpPaymentId: string | null }> {
  if (!MP_ACCESS_TOKEN) {
    console.error("MERCADOPAGO_ACCESS_TOKEN não configurada — cobrança fica pendente.");
    return { status: "pendente", mpPaymentId: null };
  }
  try {
    // Um card_token novo precisa ser gerado a partir do card_id salvo antes de
    // cada cobrança — o token do momento da tokenização original já expirou.
    const tokenRes = await fetch("https://api.mercadopago.com/v1/card_tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card_id: params.cardId, customer_id: params.customerId }),
      signal: AbortSignal.timeout(10000),
    });
    const tokenBody = await tokenRes.json().catch(() => null);
    if (!tokenRes.ok || !tokenBody?.id) {
      console.error("Falha ao gerar card_token a partir do cartão salvo:", tokenBody);
      return { status: "pendente", mpPaymentId: null };
    }

    const paymentRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_amount: params.valor,
        token: tokenBody.id,
        description: params.descricao,
        installments: 1,
        payer: { email: params.email },
      }),
      signal: AbortSignal.timeout(15000),
    });
    const paymentBody = await paymentRes.json().catch(() => null);
    if (paymentRes.ok && paymentBody?.status === "approved") {
      return { status: "pago", mpPaymentId: paymentBody.id?.toString() ?? null };
    }
    console.error("Cobrança não aprovada:", paymentBody);
    return { status: "pendente", mpPaymentId: paymentBody?.id?.toString() ?? null };
  } catch (err) {
    console.error("Erro ao tentar cobrar via Mercado Pago:", err);
    return { status: "pendente", mpPaymentId: null };
  }
}

async function processarLeiloesEncerrados() {
  const { data: leiloes, error } = await admin
    .from("leiloes")
    .select("id, titulo, lance_atual, especialista_id, especialistas(nome, email)")
    .eq("status", "ativo")
    .lt("data_fim", new Date().toISOString());
  if (error || !leiloes) {
    console.error("Falha ao buscar leilões encerrados:", error);
    return;
  }

  for (const leilao of leiloes) {
    const especialista = leilao.especialistas as unknown as { nome: string | null; email: string | null } | null;

    const { data: existingPagamento } = await admin
      .from("pagamentos")
      .select("id")
      .eq("leilao_id", leilao.id)
      .maybeSingle();
    if (existingPagamento) continue; // já processado

    const { data: topLance } = await admin
      .from("lances")
      .select("usuario_id, valor")
      .eq("leilao_id", leilao.id)
      .order("valor", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!topLance) {
      // Ninguém deu lance — encerra sem vencedor, nada a cobrar.
      await admin.from("leiloes").update({ status: "encerrado" }).eq("id", leilao.id);
      continue;
    }

    await admin
      .from("leiloes")
      .update({ status: "encerrado", vencedor_usuario_id: topLance.usuario_id })
      .eq("id", leilao.id);

    const { data: usuario } = await admin
      .from("usuarios")
      .select("email")
      .eq("id", topLance.usuario_id)
      .maybeSingle();
    const { data: cartao } = await admin
      .from("cartoes")
      .select("mp_customer_id, mp_card_id")
      .eq("usuario_id", topLance.usuario_id)
      .maybeSingle();

    let statusPagamento: "pago" | "pendente" = "pendente";
    let mpPaymentId: string | null = null;
    if (cartao?.mp_customer_id && cartao?.mp_card_id && usuario?.email) {
      const resultado = await tentarCobrar({
        customerId: cartao.mp_customer_id,
        cardId: cartao.mp_card_id,
        valor: topLance.valor,
        email: usuario.email,
        descricao: `Valore — ${leilao.titulo}`,
      });
      statusPagamento = resultado.status;
      mpPaymentId = resultado.mpPaymentId;
    }

    await admin.from("pagamentos").insert({
      leilao_id: leilao.id,
      usuario_id: topLance.usuario_id,
      valor: topLance.valor,
      status: statusPagamento,
      mp_payment_id: mpPaymentId,
      tentativa_iniciada_em: new Date().toISOString(),
    });

    if (statusPagamento === "pendente" && especialista?.email) {
      await enviarEmail(
        especialista.email,
        "Pagamento em análise — aguarde",
        `<p>Olá${especialista.nome ? `, ${especialista.nome}` : ""},</p><p>O leilão <strong>${leilao.titulo}</strong> encerrou e o pagamento do vencedor está em análise. Vamos tentar processar a cobrança nas próximas 48h e te avisamos assim que houver novidade.</p>`,
        `Pagamento em análise — aguarde.\n\nO leilão "${leilao.titulo}" encerrou e o pagamento do vencedor está em análise. Vamos tentar processar a cobrança nas próximas 48h.`,
      );
      await admin.from("admin_notifications").insert({
        especialista_id: leilao.especialista_id,
        motivo: `Pagamento do leilão "${leilao.titulo}" em análise.`,
        criterios: [{ criterio: "pagamento_pendente", passou: false, detalhe: `leilao_id=${leilao.id}` }],
      });
    }
  }
}

async function processarPagamentosVencidos() {
  const limite = new Date(Date.now() - QUARENTA_OITO_HORAS_MS).toISOString();
  const { data: pagamentos, error } = await admin
    .from("pagamentos")
    .select("id, leilao_id, usuario_id, valor")
    .in("status", ["pendente", "em_analise"])
    .lt("tentativa_iniciada_em", limite);
  if (error || !pagamentos) {
    console.error("Falha ao buscar pagamentos vencidos:", error);
    return;
  }

  for (const pagamento of pagamentos) {
    await admin.from("pagamentos").update({ status: "falhou", updated_at: new Date().toISOString() }).eq("id", pagamento.id);

    const { data: leilao } = await admin
      .from("leiloes")
      .select("id, titulo, descricao, lance_minimo, especialista_id, especialistas(nome, email)")
      .eq("id", pagamento.leilao_id)
      .maybeSingle();
    if (!leilao) continue;
    const especialista = leilao.especialistas as unknown as { nome: string | null; email: string | null } | null;

    await admin.from("leiloes").update({ status: "cancelado" }).eq("id", leilao.id);

    // Reagenda gratuitamente com destaque por 7 dias — não conta como
    // cancelamento do especialista (iniciado_por = 'sistema').
    const agora = Date.now();
    const { data: novoLeilao } = await admin
      .from("leiloes")
      .insert({
        especialista_id: leilao.especialista_id,
        titulo: leilao.titulo,
        descricao: leilao.descricao,
        lance_minimo: leilao.lance_minimo,
        data_inicio: new Date(agora).toISOString(),
        data_fim: new Date(agora + SETE_DIAS_MS).toISOString(),
        status: "ativo",
        destaque_ate: new Date(agora + SETE_DIAS_MS).toISOString().slice(0, 10),
        criado_por_sistema: true,
        leilao_original_id: leilao.id,
      })
      .select("id")
      .single();

    await admin.from("cancelamentos_leilao").insert({
      leilao_id: leilao.id,
      especialista_id: leilao.especialista_id,
      motivo: "Cancelado automaticamente por inadimplência do cliente vencedor (sem cobrança em 48h).",
      penalizado: false,
      iniciado_por: "sistema",
    });

    await admin.from("usuarios").update({ bloqueado: true }).eq("id", pagamento.usuario_id);

    if (especialista?.email) {
      await enviarEmail(
        especialista.email,
        "Leilão cancelado e reagendado - Valore",
        `<p>Olá${especialista.nome ? `, ${especialista.nome}` : ""},</p><p>O pagamento do leilão <strong>${leilao.titulo}</strong> não foi confirmado em 48h e o leilão foi cancelado. Reagendamos automaticamente um novo leilão para você, com destaque gratuito na plataforma por 7 dias.${novoLeilao ? ` (novo leilão: ${novoLeilao.id})` : ""}</p>`,
        `O pagamento do leilão "${leilao.titulo}" não foi confirmado em 48h e foi cancelado. Reagendamos automaticamente um novo leilão com destaque gratuito por 7 dias.`,
      );
    }
    await admin.from("admin_notifications").insert({
      especialista_id: leilao.especialista_id,
      motivo: `Leilão "${leilao.titulo}" cancelado por inadimplência e reagendado automaticamente.`,
      criterios: [{ criterio: "inadimplencia_reagendamento", passou: false, detalhe: `pagamento_id=${pagamento.id}` }],
    });
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);
  if (CRON_SECRET) {
    const provided = req.headers.get("x-cron-secret");
    if (provided !== CRON_SECRET) return jsonResponse({ error: "unauthorized" }, 401);
  }

  try {
    await processarLeiloesEncerrados();
    await processarPagamentosVencidos();
  } catch (err) {
    console.error("Erro ao processar inadimplência:", err);
    return jsonResponse({ error: "falha no processamento" }, 500);
  }

  return jsonResponse({ ok: true });
});
