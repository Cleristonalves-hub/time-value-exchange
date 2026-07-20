// Edge Function: cancelar-leilao
//
// Especialista cancela um leilão que ele mesmo criou. Regras (item 7):
//   - Cancelamento até 2h antes do início: sem penalidade.
//   - Cancelamento com menos de 2h de antecedência: badge "Cancelamento
//     recente" por 7 dias.
//   - 3º cancelamento penalizado no mesmo mês: suspensão automática de 30
//     dias.
// Em qualquer penalidade: notificação por email + admin_notifications, e a
// mensagem (tipo, motivo, duração, data de encerramento) fica disponível no
// perfil do especialista via os campos badge_cancelamento_ate / suspenso_ate /
// motivo_penalidade lidos direto da tabela especialistas.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = "contato@valore.services";
const SUPPORT_EMAIL = "contato@valore.services";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DUAS_HORAS_MS = 2 * 60 * 60 * 1000;
const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;
const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function toDateOnly(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function formatDateBR(dateOnly: string): string {
  const [y, m, d] = dateOnly.split("-");
  return `${d}/${m}/${y}`;
}

async function enviarEmailPenalidade(
  email: string,
  tipo: "badge" | "suspensao",
  motivo: string,
  duracaoTexto: string,
  dataEncerramento: string,
) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada — pulando envio de email de penalidade.");
    return;
  }
  const tipoLabel = tipo === "badge" ? 'Badge "Cancelamento recente"' : "Suspensão de conta";
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Penalidade aplicada ao seu perfil</h2>
      <p><strong>Tipo:</strong> ${tipoLabel}</p>
      <p><strong>Motivo:</strong> ${motivo}</p>
      <p><strong>Duração:</strong> ${duracaoTexto}</p>
      <p><strong>Encerra em:</strong> ${formatDateBR(dataEncerramento)}</p>
      <p>Se acredita que houve um erro, entre em contato: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
    </div>
  `;
  const text = `Penalidade aplicada ao seu perfil\n\nTipo: ${tipoLabel}\nMotivo: ${motivo}\nDuração: ${duracaoTexto}\nEncerra em: ${formatDateBR(dataEncerramento)}\n\nSe acredita que houve um erro, entre em contato: ${SUPPORT_EMAIL}`;

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
        subject: "Penalidade aplicada ao seu perfil - Valore",
        html,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`Resend HTTP ${res.status}:`, await res.text());
  } catch (err) {
    console.error("Falha ao enviar email de penalidade:", err);
  }
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

  let body: { leilao_id?: string; motivo?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "corpo inválido" }, 400);
  }
  const leilaoId = body.leilao_id;
  if (!leilaoId) return jsonResponse({ error: "leilao_id é obrigatório" }, 400);

  const { data: leilao, error: leilaoError } = await admin
    .from("leiloes")
    .select("id, status, data_inicio, especialista_id")
    .eq("id", leilaoId)
    .maybeSingle();
  if (leilaoError || !leilao) return jsonResponse({ error: "leilão não encontrado" }, 404);

  const { data: especialista, error: especialistaError } = await admin
    .from("especialistas")
    .select("id, usuario_id, email, nome")
    .eq("id", leilao.especialista_id)
    .maybeSingle();
  if (especialistaError || !especialista) return jsonResponse({ error: "especialista não encontrado" }, 404);

  if (especialista.usuario_id !== userData.user.id) {
    return jsonResponse({ error: "você não é o dono deste leilão" }, 403);
  }
  if (leilao.status !== "ativo") {
    return jsonResponse({ error: "este leilão não pode mais ser cancelado" }, 409);
  }

  const now = Date.now();
  const inicio = new Date(leilao.data_inicio).getTime();
  const penalizado = inicio - now < DUAS_HORAS_MS;

  const { error: updateLeilaoError } = await admin
    .from("leiloes")
    .update({ status: "cancelado" })
    .eq("id", leilaoId);
  if (updateLeilaoError) {
    console.error("Falha ao cancelar leilão:", updateLeilaoError);
    return jsonResponse({ error: "falha ao cancelar leilão" }, 500);
  }

  await admin.from("cancelamentos_leilao").insert({
    leilao_id: leilaoId,
    especialista_id: especialista.id,
    motivo: body.motivo || null,
    penalizado,
    iniciado_por: "especialista",
  });

  await admin.from("admin_notifications").insert({
    especialista_id: especialista.id,
    motivo: `Leilão cancelado pelo especialista${penalizado ? " (com menos de 2h de antecedência — penalizado)" : ""}.`,
    criterios: [{ criterio: "cancelamento_leilao", passou: !penalizado, detalhe: body.motivo || "sem motivo informado" }],
  });

  if (!penalizado) {
    return jsonResponse({ ok: true, penalizado: false });
  }

  // Conta cancelamentos "penalizados" iniciados pelo especialista neste mês
  // (cancelamentos por inadimplência do cliente, iniciado_por='sistema', não contam).
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const { count } = await admin
    .from("cancelamentos_leilao")
    .select("id", { count: "exact", head: true })
    .eq("especialista_id", especialista.id)
    .eq("iniciado_por", "especialista")
    .eq("penalizado", true)
    .gte("created_at", inicioMes.toISOString());

  const totalCancelamentosMes = count ?? 1;

  if (totalCancelamentosMes >= 3) {
    const suspensoAte = toDateOnly(now + TRINTA_DIAS_MS);
    const motivo = "Você atingiu 3 cancelamentos de leilão com menos de 2 horas de antecedência no mesmo mês.";
    await admin
      .from("especialistas")
      .update({ status: "suspenso", suspenso_ate: suspensoAte, motivo_penalidade: motivo })
      .eq("id", especialista.id);
    await admin.from("admin_notifications").insert({
      especialista_id: especialista.id,
      motivo: "Especialista suspenso automaticamente por 3 cancelamentos no mês.",
      criterios: [{ criterio: "suspensao_automatica", passou: false, detalhe: motivo }],
    });
    if (especialista.email) {
      await enviarEmailPenalidade(especialista.email, "suspensao", motivo, "30 dias", suspensoAte);
    }
    return jsonResponse({ ok: true, penalizado: true, suspenso: true });
  }

  const badgeAte = toDateOnly(now + SETE_DIAS_MS);
  const motivo = "Você cancelou um leilão com menos de 2 horas de antecedência.";
  await admin
    .from("especialistas")
    .update({ badge_cancelamento_ate: badgeAte, motivo_penalidade: motivo })
    .eq("id", especialista.id);
  if (especialista.email) {
    await enviarEmailPenalidade(especialista.email, "badge", motivo, "7 dias", badgeAte);
  }

  return jsonResponse({ ok: true, penalizado: true, suspenso: false });
});
