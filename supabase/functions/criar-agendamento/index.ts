// Edge Function: criar-agendamento
//
// O vencedor de um leilão encerrado escolhe um horário (dentro da
// disponibilidade declarada pelo especialista) e confirma a sessão. Passa por
// aqui em vez de um insert direto do client porque precisamos: validar que
// quem está chamando é de fato o vencedor do leilão, revalidar o horário
// contra a disponibilidade do especialista (nunca confiar no grid que o
// client mostrou), garantir atomicamente que o horário não foi tomado por
// outro agendamento, e disparar os dois e-mails (especialista + cliente) via
// Resend — nada disso é possível só com RLS.

import { createClient } from "npm:@supabase/supabase-js@2";
import { checkRateLimitDb } from "../_shared/rateLimitDb.ts";
import { checkOrigin } from "../_shared/csrf.ts";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = "contato@valore.services";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Plataforma é sempre a de um especialista brasileiro — a disponibilidade
// semanal (dias_disponibilidade/horario_inicio/horario_fim) é declarada e
// interpretada no horário de Brasília, então a validação do slot escolhido
// também precisa converter o instante absoluto para esse fuso, não usar o
// fuso do servidor (Deno Deploy roda em UTC).
const FUSO_BRASIL = "America/Sao_Paulo";

const WEEKDAY_EN_TO_CODIGO: Record<string, string> = {
  Mon: "seg",
  Tue: "ter",
  Wed: "qua",
  Thu: "qui",
  Fri: "sex",
  Sat: "sab",
  Sun: "dom",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function horarioBrasileiro(data: Date): { codigoDia: string; horaMinuto: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO_BRASIL,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(data);
  const weekdayEn = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = (parts.find((p) => p.type === "hour")?.value ?? "00").padStart(2, "0").slice(-2);
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { codigoDia: WEEKDAY_EN_TO_CODIGO[weekdayEn] ?? "", horaMinuto: `${hour}:${minute}` };
}

function formatarDataHoraBR(data: Date): { data: string; hora: string } {
  const dataFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO_BRASIL, dateStyle: "full" }).format(data);
  const horaFmt = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO_BRASIL, timeStyle: "short" }).format(data);
  return { data: dataFmt, hora: horaFmt };
}

async function enviarEmail(to: string, subject: string, html: string, text: string) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada — pulando envio de e-mail.");
    return;
  }
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
    console.error("Falha ao enviar e-mail via Resend:", err);
  }
}

Deno.serve(async (req: Request) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;
  return withCors(req, await handleRequest(req));
});

async function handleRequest(req: Request): Promise<Response> {
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);
  const limited = await checkRateLimitDb(req, admin, "criar-agendamento", 10);
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
  const clienteId = userData.user.id;

  let body: { leilao_id?: string; data_hora?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "corpo inválido" }, 400);
  }
  const leilaoId = body.leilao_id;
  const dataHoraStr = body.data_hora;
  if (!leilaoId || !dataHoraStr) {
    return jsonResponse({ error: "leilao_id e data_hora são obrigatórios" }, 400);
  }
  const dataHora = new Date(dataHoraStr);
  if (Number.isNaN(dataHora.getTime())) {
    return jsonResponse({ error: "data_hora inválida" }, 400);
  }
  if (dataHora.getTime() <= Date.now()) {
    return jsonResponse({ error: "o horário escolhido precisa ser no futuro" }, 400);
  }

  const { data: leilao, error: leilaoError } = await admin
    .from("leiloes")
    .select("id, titulo, status, vencedor_usuario_id, especialista_id")
    .eq("id", leilaoId)
    .maybeSingle();
  if (leilaoError || !leilao) return jsonResponse({ error: "leilão não encontrado" }, 404);
  if (leilao.status !== "encerrado") {
    return jsonResponse({ error: "este leilão ainda não foi encerrado" }, 409);
  }
  if (leilao.vencedor_usuario_id !== clienteId) {
    return jsonResponse({ error: "você não é o vencedor deste leilão" }, 403);
  }

  const { data: existente } = await admin
    .from("agendamentos")
    .select("id")
    .eq("leilao_id", leilaoId)
    .eq("status", "confirmado")
    .maybeSingle();
  if (existente) {
    return jsonResponse({ error: "este leilão já tem um agendamento confirmado" }, 409);
  }

  const { data: especialista, error: especialistaError } = await admin
    .from("especialistas")
    .select("id, nome, email, plataforma, dias_disponibilidade, horario_inicio, horario_fim")
    .eq("id", leilao.especialista_id)
    .maybeSingle();
  if (especialistaError || !especialista) return jsonResponse({ error: "especialista não encontrado" }, 404);

  const dias = especialista.dias_disponibilidade as string[] | null;
  if (!dias || dias.length === 0 || !especialista.horario_inicio || !especialista.horario_fim) {
    return jsonResponse({ error: "especialista sem disponibilidade cadastrada" }, 409);
  }

  const { codigoDia, horaMinuto } = horarioBrasileiro(dataHora);
  if (!dias.includes(codigoDia)) {
    return jsonResponse({ error: "o especialista não atende neste dia da semana" }, 409);
  }
  if (horaMinuto < especialista.horario_inicio || horaMinuto >= especialista.horario_fim) {
    return jsonResponse({ error: "o horário escolhido está fora da disponibilidade do especialista" }, 409);
  }

  const { data: cliente } = await admin
    .from("usuarios")
    .select("nome, email")
    .eq("id", clienteId)
    .maybeSingle();

  const { error: insertError } = await admin.from("agendamentos").insert({
    leilao_id: leilaoId,
    cliente_id: clienteId,
    especialista_id: especialista.id,
    data_hora: dataHora.toISOString(),
    plataforma: especialista.plataforma || null,
  });
  if (insertError) {
    // 23505 = unique_violation — o índice parcial (especialista_id, data_hora)
    // ou (leilao_id) barrou uma corrida (dois agendamentos quase simultâneos).
    if ((insertError as { code?: string }).code === "23505") {
      return jsonResponse({ error: "esse horário acabou de ser reservado, escolha outro" }, 409);
    }
    console.error("Falha ao criar agendamento:", insertError);
    return jsonResponse({ error: "falha ao criar o agendamento" }, 500);
  }

  const { data: dataFmt, hora: horaFmt } = { ...formatarDataHoraBR(dataHora) };
  const plataforma = especialista.plataforma || "a combinar";
  const clienteNome = cliente?.nome || "Um cliente";

  const emailPromises: Promise<void>[] = [];
  if (especialista.email) {
    emailPromises.push(
      enviarEmail(
        especialista.email,
        "Novo agendamento - Valore",
        `<p>Olá${especialista.nome ? `, ${especialista.nome}` : ""},</p><p><strong>${clienteNome}</strong> agendou uma sessão para <strong>${dataFmt}</strong> às <strong>${horaFmt}</strong>.</p><p>Plataforma: ${plataforma}.</p>`,
        `${clienteNome} agendou uma sessão para ${dataFmt} às ${horaFmt}. Plataforma: ${plataforma}.`,
      ),
    );
  }
  if (cliente?.email) {
    emailPromises.push(
      enviarEmail(
        cliente.email,
        "Sessão confirmada - Valore",
        `<p>Olá${cliente.nome ? `, ${cliente.nome}` : ""},</p><p>Sua sessão com <strong>${especialista.nome ?? "o especialista"}</strong> está confirmada para <strong>${dataFmt}</strong> às <strong>${horaFmt}</strong>.</p><p>Plataforma: ${plataforma}.</p>`,
        `Sua sessão com ${especialista.nome ?? "o especialista"} está confirmada para ${dataFmt} às ${horaFmt}. Plataforma: ${plataforma}.`,
      ),
    );
  }
  await Promise.all(emailPromises);

  return jsonResponse({ ok: true });
}
