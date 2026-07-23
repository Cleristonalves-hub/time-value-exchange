import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SpecialistStatus = "novo" | "verificado" | "suspenso" | "reprovado";

export type Specialist = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  niche: string;
  specialty: string;
  bio: string;
  credential: string;
  experience: string;
  platform: string;
  duration: string;
  languages: string;
  portfolioUrl: string;
  registrationNumber?: string;
  photoUrl?: string;
  minBid: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  document: string;
  pixKey: string;
  status: SpecialistStatus;
  badgeCancelamentoAte: string | null;
  suspensoAte: string | null;
  motivoPenalidade: string | null;
  createdAt: number;
};

export type LeilaoStatus = "ativo" | "encerrado" | "cancelado";

export type Leilao = {
  id: string;
  especialistaId: string;
  titulo: string;
  descricao: string;
  lanceMinimo: number;
  lanceAtual: number | null;
  dataInicio: number;
  dataFim: number;
  status: LeilaoStatus;
  vencedorUsuarioId: string | null;
  destaqueAte: string | null;
  criadoPorSistema: boolean;
  createdAt: number;
};

// Leilão real com os dados do especialista já embutidos (para exibir nome,
// área de atuação e foto sem uma segunda consulta).
export type LeilaoComEspecialista = Leilao & {
  especialista: { nome: string; nicho: string; especialidade: string; avatarUrl?: string } | null;
};

export type Lance = {
  id: string;
  leilaoId: string;
  usuarioId: string;
  valor: number;
  createdAt: number;
};

export type Cartao = {
  id: string;
  usuarioId: string;
  ultimosDigitos: string | null;
  bandeira: string | null;
  createdAt: number;
};

export type Report = {
  id: string;
  target: string;
  category: string;
  details: string;
  createdAt: number;
};

export type Review = {
  id: string;
  specialistId: string;
  auctionId: string;
  rating: number;
  comment: string;
  createdAt: number;
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  kind: "sugestao" | "reclamacao";
  message: string;
  createdAt: number;
};

// ------- Row mappers -------
type SpecialistRow = {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  nicho: string | null;
  especialidade: string | null;
  bio: string | null;
  credencial: string | null;
  experiencia: string | null;
  plataforma: string | null;
  duracao: string | null;
  idiomas: string | null;
  linkedin_url: string | null;
  registro_profissional: string | null;
  avatar_url: string | null;
  lance_minimo: string | null;
  disponibilidade_semanal: string | null;
  dias_disponibilidade: string[] | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  cpf_cnpj: string | null;
  chave_pix: string | null;
  status: SpecialistStatus;
  badge_cancelamento_ate: string | null;
  suspenso_ate: string | null;
  motivo_penalidade: string | null;
  created_at: string;
};

type LeilaoRow = {
  id: string;
  especialista_id: string;
  titulo: string;
  descricao: string | null;
  lance_minimo: number;
  lance_atual: number | null;
  data_inicio: string;
  data_fim: string;
  status: LeilaoStatus;
  vencedor_usuario_id: string | null;
  destaque_ate: string | null;
  criado_por_sistema: boolean;
  created_at: string;
};

type LeilaoComEspecialistaRow = LeilaoRow & {
  especialistas: { nome: string | null; nicho: string | null; especialidade: string | null; avatar_url: string | null } | null;
};

type LanceRow = {
  id: string;
  leilao_id: string;
  usuario_id: string;
  valor: number;
  created_at: string;
};

type CartaoRow = {
  id: string;
  usuario_id: string;
  ultimos_digitos: string | null;
  bandeira: string | null;
  created_at: string;
};

const toLeilao = (r: LeilaoRow): Leilao => ({
  id: r.id,
  especialistaId: r.especialista_id,
  titulo: r.titulo,
  descricao: r.descricao ?? "",
  lanceMinimo: r.lance_minimo,
  lanceAtual: r.lance_atual,
  dataInicio: new Date(r.data_inicio).getTime(),
  dataFim: new Date(r.data_fim).getTime(),
  status: r.status,
  vencedorUsuarioId: r.vencedor_usuario_id,
  destaqueAte: r.destaque_ate,
  criadoPorSistema: r.criado_por_sistema,
  createdAt: new Date(r.created_at).getTime(),
});

const toLeilaoComEspecialista = (r: LeilaoComEspecialistaRow): LeilaoComEspecialista => ({
  ...toLeilao(r),
  especialista: r.especialistas
    ? {
        nome: r.especialistas.nome ?? "",
        nicho: r.especialistas.nicho ?? "",
        especialidade: r.especialistas.especialidade ?? "",
        avatarUrl: r.especialistas.avatar_url ?? undefined,
      }
    : null,
});

const toLance = (r: LanceRow): Lance => ({
  id: r.id,
  leilaoId: r.leilao_id,
  usuarioId: r.usuario_id,
  valor: r.valor,
  createdAt: new Date(r.created_at).getTime(),
});

const toCartao = (r: CartaoRow): Cartao => ({
  id: r.id,
  usuarioId: r.usuario_id,
  ultimosDigitos: r.ultimos_digitos,
  bandeira: r.bandeira,
  createdAt: new Date(r.created_at).getTime(),
});

const toSpecialist = (r: SpecialistRow): Specialist => ({
  id: r.id,
  fullName: r.nome ?? "",
  email: r.email ?? "",
  phone: r.telefone ?? "",
  city: r.cidade ?? "",
  state: r.estado ?? "",
  niche: r.nicho ?? "",
  specialty: r.especialidade ?? "",
  bio: r.bio ?? "",
  credential: r.credencial ?? "",
  experience: r.experiencia ?? "",
  platform: r.plataforma ?? "",
  duration: r.duracao ?? "",
  languages: r.idiomas ?? "",
  portfolioUrl: r.linkedin_url ?? "",
  registrationNumber: r.registro_profissional ?? undefined,
  photoUrl: r.avatar_url ?? undefined,
  minBid: r.lance_minimo ?? "",
  availableDays: r.dias_disponibilidade ?? [],
  startTime: r.horario_inicio ?? "",
  endTime: r.horario_fim ?? "",
  document: r.cpf_cnpj ?? "",
  pixKey: r.chave_pix ?? "",
  status: r.status,
  badgeCancelamentoAte: r.badge_cancelamento_ate,
  suspensoAte: r.suspenso_ate,
  motivoPenalidade: r.motivo_penalidade,
  createdAt: new Date(r.created_at).getTime(),
});

export type RejectionCriterion = {
  criterio: string;
  passou: boolean;
  detalhe: string;
};

// ------- Query keys -------
const K = {
  specialists: ["specialists"] as const,
  reports: ["reports"] as const,
  reviews: ["reviews"] as const,
  feedbacks: ["feedbacks"] as const,
  mySpecialist: ["my-specialist"] as const,
  rejectionReasons: ["rejection-reasons"] as const,
  activeLeiloes: ["active-leiloes"] as const,
  leilao: ["leilao"] as const,
  lances: ["lances"] as const,
  myCard: ["my-card"] as const,
};

// ------- Hooks -------
export function useSpecialists(): Specialist[] {
  const { data } = useQuery({
    queryKey: K.specialists,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("especialistas")
        .select("*")
        .in("status", ["novo", "verificado"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as SpecialistRow[]).map(toSpecialist);
    },
    staleTime: 15_000,
  });
  return data ?? [];
}

// Leilões reais ativos, com os dados do especialista embutidos — usados na
// parte inferior da home ("Especialistas disponíveis agora").
export function useActiveLeiloes(): LeilaoComEspecialista[] {
  const { data } = useQuery({
    queryKey: K.activeLeiloes,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leiloes")
        .select("*, especialistas(nome, nicho, especialidade, avatar_url)")
        .eq("status", "ativo")
        .gt("data_fim", new Date().toISOString())
        .order("data_fim", { ascending: true });
      if (error) throw error;
      return (data as LeilaoComEspecialistaRow[]).map(toLeilaoComEspecialista);
    },
    staleTime: 10_000,
  });
  return data ?? [];
}

export function useLeilao(id: string | undefined): LeilaoComEspecialista | null {
  const { data } = useQuery({
    queryKey: [...K.leilao, id ?? ""],
    enabled: !!id,
    staleTime: 5_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leiloes")
        .select("*, especialistas(nome, nicho, especialidade, avatar_url)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? toLeilaoComEspecialista(data as LeilaoComEspecialistaRow) : null;
    },
  });
  return data ?? null;
}

export function useLances(leilaoId: string | undefined): Lance[] {
  const { data } = useQuery({
    queryKey: [...K.lances, leilaoId ?? ""],
    enabled: !!leilaoId,
    staleTime: 5_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lances")
        .select("*")
        .eq("leilao_id", leilaoId)
        .order("valor", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data as LanceRow[]).map(toLance);
    },
  });
  return data ?? [];
}

// Cartão tokenizado do usuário logado — acesso a leilões é bloqueado sem um.
export function useMyCard(usuarioId: string | undefined): Cartao | null {
  const { data } = useQuery({
    queryKey: [...K.myCard, usuarioId ?? ""],
    enabled: !!usuarioId,
    staleTime: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cartoes")
        .select("*")
        .eq("usuario_id", usuarioId)
        .maybeSingle();
      if (error) throw error;
      return data ? toCartao(data as CartaoRow) : null;
    },
  });
  return data ?? null;
}

// Verifica se já existe um especialista cadastrado com este e-mail (usado para
// bloquear cadastro duplicado). `excludeId` permite ignorar o próprio registro
// ao validar uma edição.
export async function specialistEmailExists(email: string, excludeId?: string): Promise<boolean> {
  let query = supabase.from("especialistas").select("id").eq("email", email).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) {
    console.error("specialistEmailExists:", error);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

// Busca o cadastro de especialista do usuário logado (por usuario_id ou, como
// fallback, pelo e-mail — nem todo fluxo de insert popula usuario_id hoje).
export function useMySpecialist(usuarioId: string | undefined, email: string | undefined) {
  const { data } = useQuery({
    queryKey: [...K.mySpecialist, usuarioId ?? "", email ?? ""],
    enabled: !!usuarioId || !!email,
    staleTime: 15_000,
    queryFn: async () => {
      let query = supabase.from("especialistas").select("*").order("created_at", { ascending: false }).limit(1);
      if (usuarioId && email) {
        query = query.or(`usuario_id.eq.${usuarioId},email.eq.${email}`);
      } else if (usuarioId) {
        query = query.eq("usuario_id", usuarioId);
      } else if (email) {
        query = query.eq("email", email);
      }
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data ? toSpecialist(data as SpecialistRow) : null;
    },
  });
  return data ?? null;
}

// Busca os critérios que reprovaram um especialista, gravados pelo Trust Engine
// na tabela admin_notifications.
export function useRejectionReasons(especialistaId: string | null): RejectionCriterion[] {
  const { data } = useQuery({
    queryKey: [...K.rejectionReasons, especialistaId ?? ""],
    enabled: !!especialistaId,
    staleTime: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_notifications")
        .select("criterios")
        .eq("especialista_id", especialistaId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      const criterios = (data?.criterios ?? []) as RejectionCriterion[];
      return criterios.filter((c) => !c.passou);
    },
  });
  return data ?? [];
}

export function useReports(): Report[] {
  const { data } = useQuery({
    queryKey: K.reports,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("denuncias")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        target: r.alvo_nome ?? r.especialista_id ?? "—",
        category: r.categoria ?? "",
        details: r.motivo ?? "",
        createdAt: new Date(r.created_at).getTime(),
      })) as Report[];
    },
    staleTime: 30_000,
  });
  return data ?? [];
}

export function useReviews(): Review[] {
  const { data } = useQuery({
    queryKey: K.reviews,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        specialistId: r.especialista_id ?? r.especialista_ref ?? "",
        auctionId: r.especialista_ref ?? r.especialista_id ?? "",
        rating: r.estrelas,
        comment: r.comentario ?? "",
        createdAt: new Date(r.created_at).getTime(),
      })) as Review[];
    },
    staleTime: 30_000,
  });
  return data ?? [];
}

export function useFeedbacks(): Feedback[] {
  const { data } = useQuery({
    queryKey: K.feedbacks,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        name: r.nome,
        email: r.email ?? "",
        kind: r.tipo,
        message: r.mensagem,
        createdAt: new Date(r.created_at).getTime(),
      })) as Feedback[];
    },
    staleTime: 30_000,
  });
  return data ?? [];
}

// ------- Cache invalidation helper -------
let _qc: ReturnType<typeof useQueryClient> | null = null;
export function useBindQueryClient() {
  _qc = useQueryClient();
}
function invalidate(key: readonly unknown[]) {
  _qc?.invalidateQueries({ queryKey: key });
}

// ------- Mutations -------
const CONTACT_EMAIL = "contato@valore.services";
function openMailto(subject: string, body: string) {
  if (typeof window === "undefined") return;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(href, "_blank", "noopener");
}

export async function uploadAvatar(file: File, prefix = "user"): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (error) {
    console.error("uploadAvatar:", error);
    return null;
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function addSpecialist(
  input: Omit<Specialist, "id" | "status" | "createdAt" | "badgeCancelamentoAte" | "suspensoAte" | "motivoPenalidade">,
  usuarioId?: string,
): Promise<Specialist | null> {
  const { data, error } = await supabase
    .from("especialistas")
    .insert({
      // Sem isso, a linha nunca fica vinculada ao usuário autenticado — o que
      // quebra tanto a política de RLS de auto-edição ("self_update", que
      // depende de usuario_id = auth.uid()) quanto a busca em useMySpecialist.
      usuario_id: usuarioId ?? null,
      nome: input.fullName,
      email: input.email,
      telefone: input.phone,
      cidade: input.city,
      estado: input.state,
      nicho: input.niche,
      especialidade: input.specialty,
      bio: input.bio,
      credencial: input.credential,
      experiencia: input.experience,
      plataforma: input.platform,
      duracao: input.duration,
      idiomas: input.languages,
      linkedin_url: input.portfolioUrl,
      registro_profissional: input.registrationNumber ?? null,
      avatar_url: input.photoUrl ?? null,
      lance_minimo: input.minBid || null,
      dias_disponibilidade: input.availableDays.length ? input.availableDays : null,
      horario_inicio: input.startTime || null,
      horario_fim: input.endTime || null,
      cpf_cnpj: input.document || null,
      chave_pix: input.pixKey || null,
      status: "novo",
    })
    .select("*")
    .single();

  if (error) {
    console.error("addSpecialist:", error);
    return null;
  }
  const created = toSpecialist(data as SpecialistRow);
  invalidate(K.specialists);
  invalidate(K.mySpecialist);
  // Status permanece "novo" — quem decide verificado/reprovado é o Trust Engine
  // (Edge Function acionada pelo Database Webhook no INSERT desta linha).
  return created;
}

export async function updateSpecialist(
  id: string,
  input: Omit<Specialist, "id" | "status" | "createdAt" | "badgeCancelamentoAte" | "suspensoAte" | "motivoPenalidade">,
): Promise<Specialist | null> {
  const { data, error } = await supabase
    .from("especialistas")
    .update({
      nome: input.fullName,
      email: input.email,
      telefone: input.phone,
      cidade: input.city,
      estado: input.state,
      nicho: input.niche,
      especialidade: input.specialty,
      bio: input.bio,
      credencial: input.credential,
      experiencia: input.experience,
      plataforma: input.platform,
      duracao: input.duration,
      idiomas: input.languages,
      linkedin_url: input.portfolioUrl,
      registro_profissional: input.registrationNumber ?? null,
      avatar_url: input.photoUrl ?? null,
      lance_minimo: input.minBid || null,
      dias_disponibilidade: input.availableDays.length ? input.availableDays : null,
      horario_inicio: input.startTime || null,
      horario_fim: input.endTime || null,
      cpf_cnpj: input.document || null,
      chave_pix: input.pixKey || null,
      // Volta para "novo" para deixar claro que precisa ser reavaliado — o
      // Trust Engine só reavalia automaticamente se o Database Webhook também
      // estiver configurado para o evento Update (hoje só dispara no Insert).
      status: "novo",
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("updateSpecialist:", error);
    return null;
  }
  const updated = toSpecialist(data as SpecialistRow);
  invalidate(K.specialists);
  invalidate(K.mySpecialist);
  invalidate(K.rejectionReasons);
  return updated;
}

export async function setSpecialistStatus(id: string, status: SpecialistStatus) {
  const { error } = await supabase.from("especialistas").update({ status }).eq("id", id);
  if (error) console.error("setSpecialistStatus:", error);
  invalidate(K.specialists);
}

type NovoLeilaoInput = Omit<
  Leilao,
  "id" | "status" | "createdAt" | "lanceAtual" | "vencedorUsuarioId" | "destaqueAte" | "criadoPorSistema"
>;

export async function createLeilao(input: NovoLeilaoInput): Promise<Leilao | null> {
  const { data, error } = await supabase
    .from("leiloes")
    .insert({
      especialista_id: input.especialistaId,
      titulo: input.titulo,
      descricao: input.descricao || null,
      lance_minimo: input.lanceMinimo,
      data_inicio: new Date(input.dataInicio).toISOString(),
      data_fim: new Date(input.dataFim).toISOString(),
      status: "ativo",
    })
    .select("*")
    .single();

  if (error) {
    console.error("createLeilao:", error);
    return null;
  }
  invalidate(K.activeLeiloes);
  return toLeilao(data as LeilaoRow);
}

// Dá um lance em um leilão real. Passa pela Edge Function `dar-lance` (não faz
// update direto no client) porque a validação precisa ser atômica no servidor:
// confirmar que o usuário tem cartão cadastrado, que o lance supera o atual, e
// atualizar leiloes.lance_atual + inserir em lances sem race condition entre
// dois lances simultâneos.
export async function darLance(
  leilaoId: string,
  valor: number,
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.functions.invoke("dar-lance", {
    body: { leilao_id: leilaoId, valor },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    return { error: message };
  }
  invalidate(K.leilao);
  invalidate(K.lances);
  invalidate(K.activeLeiloes);
  return { error: null };
}

// Cancela um leilão (ação do especialista). Passa pela Edge Function
// `cancelar-leilao` porque a regra de penalidade (menos de 2h de antecedência,
// contagem de cancelamentos no mês, suspensão automática) precisa ser aplicada
// de forma consistente no servidor, com service_role para atualizar o status
// do especialista.
export async function cancelarLeilao(
  leilaoId: string,
  motivo: string,
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.functions.invoke("cancelar-leilao", {
    body: { leilao_id: leilaoId, motivo },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    return { error: message };
  }
  invalidate(K.leilao);
  invalidate(K.activeLeiloes);
  invalidate(K.mySpecialist);
  return { error: null };
}

// Salva o cartão tokenizado (token de uso único gerado pelo SDK do Mercado
// Pago no navegador) via Edge Function — o token vira um cartão reutilizável
// (Customer + Card na API do Mercado Pago) do lado do servidor, que é o único
// lugar com o Access Token necessário para essa chamada.
export async function salvarCartao(
  cardToken: string,
  ultimosDigitos: string,
  bandeira: string,
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.functions.invoke("salvar-cartao", {
    body: { card_token: cardToken, ultimos_digitos: ultimosDigitos, bandeira },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    return { error: message };
  }
  invalidate(K.myCard);
  return { error: null };
}

export async function addReport(input: Omit<Report, "id" | "createdAt">) {
  const { error } = await supabase.from("denuncias").insert({
    alvo_nome: input.target,
    categoria: input.category,
    motivo: input.details || input.category,
  });
  if (error) console.error("addReport:", error);
  invalidate(K.reports);
  openMailto(
    `Denúncia — ${input.target}`,
    `Denunciado: ${input.target}\nCategoria: ${input.category}\nDetalhes: ${input.details || "(sem detalhes)"}`,
  );
}

export async function addReview(input: Omit<Review, "id" | "createdAt">) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    input.specialistId,
  );
  const { error } = await supabase.from("avaliacoes").insert({
    especialista_id: isUuid ? input.specialistId : null,
    especialista_ref: isUuid ? null : input.specialistId,
    estrelas: input.rating,
    comentario: input.comment,
  });
  if (error) console.error("addReview:", error);
  invalidate(K.reviews);
  invalidate(K.specialists);
}

export async function addFeedback(input: Omit<Feedback, "id" | "createdAt">) {
  const { error } = await supabase.from("feedbacks").insert({
    nome: input.name,
    email: input.email,
    tipo: input.kind,
    mensagem: input.message,
  });
  if (error) console.error("addFeedback:", error);
  invalidate(K.feedbacks);
}

export async function updateUserAvatar(userId: string, url: string) {
  const { error } = await supabase.from("usuarios").update({ avatar_url: url }).eq("id", userId);
  if (error) console.error("updateUserAvatar:", error);
}

// Edição de perfil para clientes (usuários sem cadastro de especialista) —
// especialistas editam via o formulário completo em /cadastro/especialista.
export async function updateUserProfile(
  userId: string,
  input: { nome: string; telefone: string; cidade: string },
): Promise<boolean> {
  const { error } = await supabase
    .from("usuarios")
    .update({ nome: input.nome, telefone: input.telefone, cidade: input.cidade })
    .eq("id", userId);
  if (error) {
    console.error("updateUserProfile:", error);
    return false;
  }
  return true;
}

export async function deleteMyAccount(userId: string): Promise<boolean> {
  // Remove especialistas ligados a este usuário
  await supabase.from("especialistas").delete().eq("usuario_id", userId);
  // Remove linha em usuarios (cascade cuida do restante quando aplicável)
  const { error } = await supabase.from("usuarios").delete().eq("id", userId);
  if (error) {
    console.error("deleteMyAccount:", error);
    return false;
  }
  await supabase.auth.signOut();
  invalidate(K.specialists);
  return true;
}

// ------- Constantes -------
export const DISCLAIMER =
  "A Valore é uma plataforma de conexão entre profissionais e clientes. Cada especialista é responsável pela veracidade de suas informações e credenciais. Recomendamos verificar o perfil profissional antes de contratar. A Valore não presta os serviços — apenas facilita a conexão.";

export const REGULATED_NICHES = ["Saúde", "Direito", "Finanças"];

// Retorna a CHAVE de tradução (não o texto), pois este arquivo não tem acesso
// ao idioma ativo — quem chama deve passar o retorno por t().
export function registrationLabel(niche: string): string | null {
  if (niche === "Saúde") return "reg.crm";
  if (niche === "Direito") return "reg.oab";
  if (niche === "Finanças") return "reg.cfa";
  return null;
}
