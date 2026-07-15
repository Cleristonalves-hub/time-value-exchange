import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SpecialistStatus = "novo" | "verificado" | "suspenso" | "reprovado";

export type Specialist = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
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
  status: SpecialistStatus;
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
  status: SpecialistStatus;
  created_at: string;
};

const toSpecialist = (r: SpecialistRow): Specialist => ({
  id: r.id,
  fullName: r.nome ?? "",
  email: r.email ?? "",
  phone: r.telefone ?? "",
  city: r.cidade ?? "",
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
  status: r.status,
  createdAt: new Date(r.created_at).getTime(),
});

// ------- Query keys -------
const K = {
  specialists: ["specialists"] as const,
  reports: ["reports"] as const,
  reviews: ["reviews"] as const,
  feedbacks: ["feedbacks"] as const,
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
  input: Omit<Specialist, "id" | "status" | "createdAt">,
): Promise<Specialist | null> {
  const { data, error } = await supabase
    .from("especialistas")
    .insert({
      nome: input.fullName,
      email: input.email,
      telefone: input.phone,
      cidade: input.city,
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

  verifyLink(created.portfolioUrl).then((ok) => {
    if (ok) setSpecialistStatus(created.id, "verificado");
  });
  return created;
}

export async function setSpecialistStatus(id: string, status: SpecialistStatus) {
  const { error } = await supabase.from("especialistas").update({ status }).eq("id", id);
  if (error) console.error("setSpecialistStatus:", error);
  invalidate(K.specialists);
}

async function verifyLink(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return false;
    await fetch(u.toString(), { mode: "no-cors" });
    return true;
  } catch {
    return false;
  }
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

export function registrationLabel(niche: string): string | null {
  if (niche === "Saúde") return "Número do CRM";
  if (niche === "Direito") return "Número da OAB";
  if (niche === "Finanças") return "Registro CFA / CVM";
  return null;
}
