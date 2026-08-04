import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isValidAvatarSize, MAX_AVATAR_BYTES } from "@/lib/validators";

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
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  photoUrl?: string;
  minBid: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  document: string;
  pixKey: string;
  banco: string;
  agencia: string;
  numeroConta: string;
  tipoConta: string;
  status: SpecialistStatus;
  badgeCancelamentoAte: string | null;
  suspensoAte: string | null;
  motivoPenalidade: string | null;
  trustScore: number;
  premium: boolean;
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

export type AgendamentoStatus = "confirmado" | "cancelado";

export type Agendamento = {
  id: string;
  leilaoId: string;
  clienteId: string;
  especialistaId: string;
  dataHora: number;
  plataforma: string | null;
  status: AgendamentoStatus;
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
  instagram: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  avatar_url: string | null;
  lance_minimo: string | null;
  disponibilidade_semanal: string | null;
  dias_disponibilidade: string[] | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  cpf_cnpj: string | null;
  chave_pix: string | null;
  banco: string | null;
  agencia: string | null;
  numero_conta: string | null;
  tipo_conta: string | null;
  status: SpecialistStatus;
  badge_cancelamento_ate: string | null;
  suspenso_ate: string | null;
  motivo_penalidade: string | null;
  trust_score: number | null;
  premium: boolean | null;
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

type AgendamentoRow = {
  id: string;
  leilao_id: string;
  cliente_id: string;
  especialista_id: string;
  data_hora: string;
  plataforma: string | null;
  status: AgendamentoStatus;
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

const toAgendamento = (r: AgendamentoRow): Agendamento => ({
  id: r.id,
  leilaoId: r.leilao_id,
  clienteId: r.cliente_id,
  especialistaId: r.especialista_id,
  dataHora: new Date(r.data_hora).getTime(),
  plataforma: r.plataforma,
  status: r.status,
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
  instagram: r.instagram ?? undefined,
  twitter: r.twitter ?? undefined,
  tiktok: r.tiktok ?? undefined,
  youtube: r.youtube ?? undefined,
  photoUrl: r.avatar_url ?? undefined,
  minBid: r.lance_minimo ?? "",
  availableDays: r.dias_disponibilidade ?? [],
  startTime: r.horario_inicio ?? "",
  endTime: r.horario_fim ?? "",
  document: r.cpf_cnpj ?? "",
  pixKey: r.chave_pix ?? "",
  banco: r.banco ?? "",
  agencia: r.agencia ?? "",
  numeroConta: r.numero_conta ?? "",
  tipoConta: r.tipo_conta ?? "",
  status: r.status,
  badgeCancelamentoAte: r.badge_cancelamento_ate,
  suspensoAte: r.suspenso_ate,
  motivoPenalidade: r.motivo_penalidade,
  trustScore: r.trust_score ?? 50,
  premium: r.premium ?? false,
  createdAt: new Date(r.created_at).getTime(),
});

export type RejectionCriterion = {
  criterio: string;
  passou: boolean;
  detalhe: string;
};

export type AuditLog = {
  id: string;
  adminId: string | null;
  acao: string;
  alvoTipo: string;
  alvoId: string | null;
  detalhes: unknown;
  createdAt: number;
};

type AuditLogRow = {
  id: string;
  admin_id: string | null;
  acao: string;
  alvo_tipo: string;
  alvo_id: string | null;
  detalhes: unknown;
  created_at: string;
};

const toAuditLog = (r: AuditLogRow): AuditLog => ({
  id: r.id,
  adminId: r.admin_id,
  acao: r.acao,
  alvoTipo: r.alvo_tipo,
  alvoId: r.alvo_id,
  detalhes: r.detalhes,
  createdAt: new Date(r.created_at).getTime(),
});

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
  myLeiloes: ["my-leiloes"] as const,
  auditLogs: ["audit-logs"] as const,
  agendamento: ["agendamento"] as const,
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

// Perfil público de um especialista específico, usado na tela de perfil
// acessada a partir de /explorar ou de um leilão.
export function useSpecialist(id: string | undefined): Specialist | null {
  const { data } = useQuery({
    queryKey: [...K.specialists, "one", id ?? ""],
    enabled: !!id,
    staleTime: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("especialistas")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? toSpecialist(data as SpecialistRow) : null;
    },
  });
  return data ?? null;
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

// Agendamento confirmado de UM leilão, se o vencedor já tiver marcado um
// horário — usado em /vitoria/$id para saber se mostra o calendário de
// escolha ou a tela de confirmação. RLS já restringe a leitura ao cliente/
// especialista da linha, então esta consulta simples por leilao_id nunca
// vaza o agendamento de outra pessoa.
export function useMyAgendamento(leilaoId: string | undefined): Agendamento | null {
  const { data } = useQuery({
    queryKey: [...K.agendamento, leilaoId ?? ""],
    enabled: !!leilaoId,
    staleTime: 10_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("leilao_id", leilaoId)
        .eq("status", "confirmado")
        .maybeSingle();
      if (error) throw error;
      return data ? toAgendamento(data as AgendamentoRow) : null;
    },
  });
  return data ?? null;
}

export type MyLeiloesStats = {
  leiloes: Leilao[];
  totalLancesRecebidos: number;
  totalGanho: number;
};

// Leilões (em qualquer status) criados pelo especialista logado, usados na
// "Área do Profissional" de /lances — junto com estatísticas básicas
// (total de lances recebidos em todos os leilões, e total ganho nos leilões
// já encerrados com vencedor).
export function useMyLeiloes(especialistaId: string | undefined): MyLeiloesStats {
  const { data } = useQuery({
    queryKey: [...K.myLeiloes, especialistaId ?? ""],
    enabled: !!especialistaId,
    staleTime: 10_000,
    queryFn: async (): Promise<MyLeiloesStats> => {
      const { data: leiloesData, error: leiloesError } = await supabase
        .from("leiloes")
        .select("*")
        .eq("especialista_id", especialistaId)
        .order("created_at", { ascending: false });
      if (leiloesError) throw leiloesError;
      const leiloes = (leiloesData as LeilaoRow[]).map(toLeilao);

      const leilaoIds = leiloes.map((l) => l.id);
      let totalLancesRecebidos = 0;
      if (leilaoIds.length > 0) {
        const { count, error: lancesError } = await supabase
          .from("lances")
          .select("id", { count: "exact", head: true })
          .in("leilao_id", leilaoIds);
        if (lancesError) throw lancesError;
        totalLancesRecebidos = count ?? 0;
      }

      const totalGanho = leiloes
        .filter((l) => l.status === "encerrado" && l.vencedorUsuarioId)
        .reduce((sum, l) => sum + (l.lanceAtual ?? 0), 0);

      return { leiloes, totalLancesRecebidos, totalGanho };
    },
  });
  return data ?? { leiloes: [], totalLancesRecebidos: 0, totalGanho: 0 };
}

// Leilão ativo do especialista logado, se houver — usado em /perfil (decidir
// entre "Publicar leilão" e "Editar leilão") e em /criar-leilao (agora tela
// de edição, que carrega este leilão para pré-preencher o formulário).
export function useMyActiveLeilao(especialistaId: string | undefined): Leilao | null {
  const { data } = useQuery({
    queryKey: [...K.myLeiloes, "active", especialistaId ?? ""],
    enabled: !!especialistaId,
    staleTime: 10_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leiloes")
        .select("*")
        .eq("especialista_id", especialistaId)
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ? toLeilao(data as LeilaoRow) : null;
    },
  });
  return data ?? null;
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
  let query = supabase.from("especialistas").select("id").ilike("email", email).limit(1);
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
// O e-mail usa `ilike` (case-insensitive) porque o Supabase Auth sempre
// normaliza `auth.users.email` para minúsculas, mas `especialistas.email` é
// gravado com a capitalização exata que o especialista digitou no cadastro —
// um `.eq` exato aqui faria o fallback falhar silenciosamente sempre que a
// linha não tiver usuario_id preenchido e o e-mail tiver alguma letra maiúscula.
export function useMySpecialist(usuarioId: string | undefined, email: string | undefined) {
  const { data } = useQuery({
    queryKey: [...K.mySpecialist, usuarioId ?? "", email ?? ""],
    enabled: !!usuarioId || !!email,
    staleTime: 15_000,
    queryFn: async () => {
      let query = supabase.from("especialistas").select("*").order("created_at", { ascending: false }).limit(1);
      if (usuarioId && email) {
        query = query.or(`usuario_id.eq.${usuarioId},email.ilike.${email}`);
      } else if (usuarioId) {
        query = query.eq("usuario_id", usuarioId);
      } else if (email) {
        query = query.ilike("email", email);
      }
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data ? toSpecialist(data as SpecialistRow) : null;
    },
  });
  return data ?? null;
}

// Segunda tentativa, só por e-mail — rede de segurança para telas como
// /lances: se useMySpecialist(usuarioId, email) vier null (por exemplo, uma
// linha antiga sem usuario_id vinculado e cujo e-mail por algum motivo não
// bateu no fallback embutido), esta consulta independente ainda encontra o
// cadastro do especialista pelo e-mail da sessão. Só dispara quando `email`
// é passado — o chamador deve passar `undefined` se já tiver um resultado.
export function useSpecialistByEmail(email: string | undefined) {
  const { data } = useQuery({
    queryKey: [...K.mySpecialist, "by-email", email ?? ""],
    enabled: !!email,
    staleTime: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("especialistas")
        .select("*")
        .ilike("email", email!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
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

export type SpecialistReputation = { average: number; count: number };

// Selo "Reputação" do perfil público: média de estrelas + total de
// avaliações de UM especialista específico (diferente de useReviews, que
// traz todas as avaliações da plataforma, usadas no painel admin).
export function useSpecialistReputation(specialistId: string | undefined): SpecialistReputation {
  const { data } = useQuery({
    queryKey: ["specialist-reputation", specialistId ?? ""],
    enabled: !!specialistId,
    staleTime: 30_000,
    queryFn: async (): Promise<SpecialistReputation> => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("estrelas")
        .eq("especialista_id", specialistId);
      if (error) throw error;
      const rows = (data ?? []) as { estrelas: number }[];
      const count = rows.length;
      const average = count > 0 ? rows.reduce((sum, r) => sum + r.estrelas, 0) / count : 0;
      return { average, count };
    },
  });
  return data ?? { average: 0, count: 0 };
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
  // Segunda linha de defesa — as telas já checam isto antes de chamar esta
  // função (para dar um erro específico sem gastar upload), mas qualquer
  // chamador futuro que esquecer a checagem ainda fica protegido aqui.
  if (!isValidAvatarSize(file)) {
    console.error("uploadAvatar: arquivo maior que o limite de", MAX_AVATAR_BYTES, "bytes");
    return null;
  }
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
  input: Omit<Specialist, "id" | "status" | "createdAt" | "badgeCancelamentoAte" | "suspensoAte" | "motivoPenalidade" | "trustScore" | "premium">,
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
      email: input.email.trim().toLowerCase(),
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
      instagram: input.instagram ?? null,
      twitter: input.twitter ?? null,
      tiktok: input.tiktok ?? null,
      youtube: input.youtube ?? null,
      avatar_url: input.photoUrl ?? null,
      lance_minimo: input.minBid || null,
      dias_disponibilidade: input.availableDays.length ? input.availableDays : null,
      horario_inicio: input.startTime || null,
      horario_fim: input.endTime || null,
      cpf_cnpj: input.document || null,
      chave_pix: input.pixKey || null,
      banco: input.banco || null,
      agencia: input.agencia || null,
      numero_conta: input.numeroConta || null,
      tipo_conta: input.tipoConta || null,
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
  input: Omit<Specialist, "id" | "status" | "createdAt" | "badgeCancelamentoAte" | "suspensoAte" | "motivoPenalidade" | "trustScore" | "premium">,
): Promise<Specialist | null> {
  const { data, error } = await supabase
    .from("especialistas")
    .update({
      nome: input.fullName,
      email: input.email.trim().toLowerCase(),
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
      instagram: input.instagram ?? null,
      twitter: input.twitter ?? null,
      tiktok: input.tiktok ?? null,
      youtube: input.youtube ?? null,
      avatar_url: input.photoUrl ?? null,
      lance_minimo: input.minBid || null,
      dias_disponibilidade: input.availableDays.length ? input.availableDays : null,
      horario_inicio: input.startTime || null,
      horario_fim: input.endTime || null,
      cpf_cnpj: input.document || null,
      chave_pix: input.pixKey || null,
      banco: input.banco || null,
      agencia: input.agencia || null,
      numero_conta: input.numeroConta || null,
      tipo_conta: input.tipoConta || null,
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

// Atualiza só a disponibilidade semanal (dias/horário) do especialista — usada
// em /criar-leilao, que agora é o único lugar onde esses campos são editáveis
// (fora do formulário completo de cadastro/edição de perfil). RLS
// "self_update" já permite o dono do cadastro alterar qualquer coluna da
// própria linha, então um update direto do client é suficiente aqui (sem
// necessidade de Edge Function — não há efeito colateral sensível envolvido,
// diferente de trust_score/premium).
export async function updateSpecialistAvailability(
  especialistaId: string,
  input: { availableDays: string[]; startTime: string; endTime: string },
): Promise<boolean> {
  const { error } = await supabase
    .from("especialistas")
    .update({
      dias_disponibilidade: input.availableDays.length ? input.availableDays : null,
      horario_inicio: input.startTime || null,
      horario_fim: input.endTime || null,
    })
    .eq("id", especialistaId);
  if (error) {
    console.error("updateSpecialistAvailability:", error);
    return false;
  }
  invalidate(K.mySpecialist);
  invalidate(K.specialists);
  return true;
}

// Registra uma ação do painel admin em audit_logs. Nunca lança — uma falha
// ao logar não deve impedir a ação em si (já concluída quando isto roda).
async function logAdminAction(
  acao: string,
  alvoTipo: string,
  alvoId: string,
  detalhes?: Record<string, unknown>,
) {
  const { data: userData } = await supabase.auth.getUser();
  const adminId = userData.user?.id;
  if (!adminId) return;
  const { error } = await supabase.from("audit_logs").insert({
    admin_id: adminId,
    acao,
    alvo_tipo: alvoTipo,
    alvo_id: alvoId,
    detalhes: detalhes ?? null,
  });
  if (error) console.error("logAdminAction:", error);
}

const SPECIALIST_STATUS_ACAO: Record<SpecialistStatus, string> = {
  novo: "atualizar_status_especialista",
  verificado: "aprovar_especialista",
  reprovado: "reprovar_especialista",
  suspenso: "suspender_especialista",
};

export async function setSpecialistStatus(
  id: string,
  status: SpecialistStatus,
  previousStatus?: SpecialistStatus,
) {
  const { error } = await supabase.from("especialistas").update({ status }).eq("id", id);
  if (error) {
    console.error("setSpecialistStatus:", error);
    return;
  }
  invalidate(K.specialists);
  await logAdminAction(SPECIALIST_STATUS_ACAO[status], "especialista", id, {
    status_anterior: previousStatus ?? null,
    status_novo: status,
  });
}

// Histórico de ações do painel admin, com filtros opcionais por ação e
// intervalo de datas (created_at, formato ISO).
export function useAuditLogs(filters?: { acao?: string; from?: string; to?: string }): AuditLog[] {
  const { data } = useQuery({
    queryKey: [...K.auditLogs, filters?.acao ?? "", filters?.from ?? "", filters?.to ?? ""],
    queryFn: async () => {
      let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
      if (filters?.acao) query = query.eq("acao", filters.acao);
      if (filters?.from) query = query.gte("created_at", filters.from);
      if (filters?.to) query = query.lte("created_at", filters.to);
      const { data, error } = await query;
      if (error) throw error;
      return (data as AuditLogRow[]).map(toAuditLog);
    },
    staleTime: 10_000,
  });
  return data ?? [];
}

type NovoLeilaoInput = Omit<
  Leilao,
  "id" | "status" | "createdAt" | "lanceAtual" | "vencedorUsuarioId" | "destaqueAte" | "criadoPorSistema"
>;

export async function createLeilao(input: NovoLeilaoInput): Promise<{ leilao: Leilao | null; error: string | null }> {
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
    return { leilao: null, error: error.message };
  }
  invalidate(K.activeLeiloes);
  invalidate(K.myLeiloes);
  return { leilao: toLeilao(data as LeilaoRow), error: null };
}

// Edita título, descrição e data de encerramento de um leilão ativo do
// próprio especialista. Passa pela Edge Function `editar-leilao` porque não
// há política de UPDATE para o dono em `leiloes` (só admin) — ver
// 20260725170000_security_audit_rls_hardening.sql.
export async function editarLeilao(
  leilaoId: string,
  input: { titulo: string; descricao: string; dataFim: number; lanceMinimo?: number },
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.functions.invoke("editar-leilao", {
    body: {
      leilao_id: leilaoId,
      titulo: input.titulo,
      descricao: input.descricao,
      data_fim: new Date(input.dataFim).toISOString(),
      ...(input.lanceMinimo !== undefined ? { lance_minimo: input.lanceMinimo } : {}),
    },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    return { error: message };
  }
  invalidate(K.leilao);
  invalidate(K.activeLeiloes);
  invalidate(K.myLeiloes);
  return { error: null };
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

// Vencedor de um leilão encerrado marca o horário da sessão. Passa pela Edge
// Function `criar-agendamento` porque precisa: confirmar que quem chama é
// mesmo o vencedor, revalidar o horário contra a disponibilidade do
// especialista, garantir atomicamente que ninguém mais reservou o mesmo
// horário, e disparar os e-mails de notificação — nada disso dá pra fazer só
// com um insert direto via RLS.
export async function criarAgendamento(
  leilaoId: string,
  dataHora: number,
): Promise<{ error: string | null }> {
  const { data, error } = await supabase.functions.invoke("criar-agendamento", {
    body: { leilao_id: leilaoId, data_hora: new Date(dataHora).toISOString() },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    return { error: message };
  }
  invalidate(K.agendamento);
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
  invalidate(K.myLeiloes);
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

export async function updateUserAvatar(userId: string, url: string | null) {
  const { error } = await supabase.from("usuarios").update({ avatar_url: url }).eq("id", userId);
  if (error) console.error("updateUserAvatar:", error);
}

// Extrai o caminho dentro do bucket "avatars" a partir da URL pública salva
// em avatar_url — supabase.storage.remove() espera o path, não a URL inteira.
function avatarPathFromUrl(url: string): string | null {
  const marker = "/avatars/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

// Remove o arquivo do Storage (best-effort — se a URL não bater no padrão
// esperado, ou o arquivo já não existir, apenas loga e segue: o objetivo
// principal do fluxo de "remover foto" é sempre limpar avatar_url no banco,
// mesmo que a limpeza do Storage falhe).
export async function deleteAvatarFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const path = avatarPathFromUrl(url);
  if (!path) return;
  const { error } = await supabase.storage.from("avatars").remove([path]);
  if (error) console.error("deleteAvatarFile:", error);
}

// Edição de perfil para clientes (usuários sem cadastro de especialista) —
// especialistas editam via o formulário completo em /cadastro/especialista.
export async function updateUserProfile(
  userId: string,
  input: { nome: string; telefone: string; cidade: string; estado: string },
): Promise<boolean> {
  const { error } = await supabase
    .from("usuarios")
    .update({ nome: input.nome, telefone: input.telefone, cidade: input.cidade, estado: input.estado })
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
