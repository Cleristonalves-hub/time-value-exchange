// Edge Function: send-auth-email
//
// Configurada como Supabase Auth Hook "Send Email" (ver supabase/config.toml,
// seção [auth.hook.send_email]) — intercepta TODOS os emails que o Supabase Auth
// enviaria via SMTP (signup, recovery, magic link, troca de email, reautenticação
// etc.) e envia via API HTTP do Resend em vez disso, contornando o SMTP do
// Supabase que estava travando.
//
// IMPORTANTE: habilitar esse hook afeta TODOS os tipos de email do Auth, não só
// confirmação de cadastro. Se eu tratasse só "signup" e retornasse 200 para os
// demais tipos sem enviar nada, recuperação de senha / magic link ficariam
// silenciosamente quebrados (o Supabase acha que o hook cuidou do envio). Por
// isso trato os principais tipos com assunto/corpo próprios, e uso um texto
// genérico como fallback para qualquer tipo não listado.
//
// Segurança: o payload vem assinado (Standard Webhooks) com o secret configurado
// no Dashboard ao habilitar o hook (Authentication > Hooks > Send Email Hook).
// Verificamos a assinatura antes de fazer qualquer coisa — sem isso, qualquer
// pessoa poderia forjar chamadas e gastar sua cota do Resend.

import { Webhook } from "npm:standardwebhooks@1.0.0";

// Formato do secret gerado pelo Dashboard: "v1,whsec_<base64>". A lib
// standardwebhooks espera só a parte base64, sem o prefixo "v1,whsec_".
const HOOK_SECRET = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "").replace("v1,whsec_", "");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = "contato@valore.services";
// Injetada automaticamente em toda Edge Function pelo runtime do Supabase.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

interface HookUser {
  email: string;
}

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
  token_new: string;
  token_hash_new: string;
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: { http_code: status, message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildVerifyUrl(emailData: EmailData): string {
  const params = new URLSearchParams({
    token: emailData.token_hash,
    type: emailData.email_action_type,
    redirect_to: emailData.redirect_to || "",
  });
  return `${SUPABASE_URL}/auth/v1/verify?${params.toString()}`;
}

type Template = { subject: string; heading: string; cta: string; intro: string };

const TEMPLATES: Record<string, Template> = {
  signup: {
    subject: "Confirme seu email - Valore",
    heading: "Confirme seu email",
    intro: "Falta pouco para acessar a Valore. Clique no botão abaixo para confirmar seu email.",
    cta: "Confirmar email",
  },
  recovery: {
    subject: "Redefinir senha - Valore",
    heading: "Redefinir sua senha",
    intro: "Recebemos um pedido para redefinir sua senha na Valore. Clique no botão abaixo para continuar.",
    cta: "Redefinir senha",
  },
  invite: {
    subject: "Você foi convidado - Valore",
    heading: "Você foi convidado para a Valore",
    intro: "Clique no botão abaixo para aceitar o convite e criar sua conta.",
    cta: "Aceitar convite",
  },
  magiclink: {
    subject: "Seu link de acesso - Valore",
    heading: "Entrar na Valore",
    intro: "Clique no botão abaixo para entrar na sua conta.",
    cta: "Entrar",
  },
  email_change: {
    subject: "Confirme a troca de email - Valore",
    heading: "Confirme a troca de email",
    intro: "Confirme a alteração do email da sua conta clicando no botão abaixo.",
    cta: "Confirmar troca de email",
  },
};

const DEFAULT_TEMPLATE: Template = {
  subject: "Ação necessária na sua conta - Valore",
  heading: "Ação necessária",
  intro: "Clique no botão abaixo para continuar.",
  cta: "Continuar",
};

function montarEmail(user: HookUser, emailData: EmailData): { subject: string; html: string; text: string } {
  // Reautenticação usa um código numérico digitado no app, não um link.
  if (emailData.email_action_type === "reauthentication") {
    return {
      subject: "Seu código de confirmação - Valore",
      html: `<p>Seu código de confirmação é:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${emailData.token}</p><p>Se não foi você quem solicitou, ignore este email.</p>`,
      text: `Seu código de confirmação é: ${emailData.token}\nSe não foi você quem solicitou, ignore este email.`,
    };
  }

  const template = TEMPLATES[emailData.email_action_type] ?? DEFAULT_TEMPLATE;
  const verifyUrl = buildVerifyUrl(emailData);

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>${template.heading}</h2>
      <p>${template.intro}</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
          ${template.cta}
        </a>
      </p>
      <p style="color:#666;font-size:12px;">Se o botão não funcionar, copie e cole este link no navegador:<br>${verifyUrl}</p>
      <p style="color:#666;font-size:12px;">Se não foi você quem solicitou, ignore este email.</p>
    </div>
  `;
  const text = `${template.heading}\n\n${template.intro}\n\n${verifyUrl}\n\nSe não foi você quem solicitou, ignore este email.`;

  return { subject: template.subject, html, text };
}

async function enviarViaResend(to: string, subject: string, html: string, text: string) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY não configurada");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html, text }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend respondeu HTTP ${res.status}: ${body}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("method not allowed", 405);
  }
  if (!HOOK_SECRET) {
    console.error("SEND_EMAIL_HOOK_SECRET não configurada.");
    return errorResponse("hook not configured", 500);
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  let user: HookUser;
  let emailData: EmailData;
  try {
    const wh = new Webhook(HOOK_SECRET);
    const verified = wh.verify(payload, headers) as { user: HookUser; email_data: EmailData };
    user = verified.user;
    emailData = verified.email_data;
  } catch (err) {
    console.error("Falha ao verificar assinatura do Auth Hook:", err);
    return errorResponse("invalid signature", 401);
  }

  try {
    const { subject, html, text } = montarEmail(user, emailData);
    await enviarViaResend(user.email, subject, html, text);
  } catch (err) {
    console.error("Falha ao enviar email via Resend:", err);
    return errorResponse(err instanceof Error ? err.message : "falha ao enviar email", 500);
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
