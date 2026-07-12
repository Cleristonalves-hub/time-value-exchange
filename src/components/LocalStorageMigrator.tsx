import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBindQueryClient } from "@/lib/store";

const OLD_KEY = "valore:v1";
const MIGRATED_KEY = "valore:migrated";

type OldSpecialist = {
  id: string;
  fullName: string; email: string; phone: string; city: string;
  niche: string; specialty: string; bio: string;
  credential: string; experience: string; platform: string;
  duration: string; languages: string; portfolioUrl: string;
  registrationNumber?: string;
  status: "novo" | "verificado" | "suspenso" | "reprovado";
  createdAt: number;
};

type OldReport = { id: string; target: string; category: string; details: string; createdAt: number };
type OldReview = { id: string; specialistId: string; auctionId: string; rating: number; comment: string; createdAt: number };
type OldFeedback = { id: string; name: string; email: string; kind: "sugestao"|"reclamacao"; message: string; createdAt: number };

export function LocalStorageMigrator() {
  useBindQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(MIGRATED_KEY) === "1") return;
    const raw = localStorage.getItem(OLD_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATED_KEY, "1");
      return;
    }

    (async () => {
      try {
        const parsed = JSON.parse(raw) as {
          specialists?: OldSpecialist[];
          reports?: OldReport[];
          reviews?: OldReview[];
          feedbacks?: OldFeedback[];
        };

        if (parsed.specialists?.length) {
          await supabase.from("especialistas").insert(
            parsed.specialists.map((s) => ({
              nome: s.fullName, email: s.email, telefone: s.phone, cidade: s.city,
              nicho: s.niche, especialidade: s.specialty, bio: s.bio,
              credencial: s.credential, experiencia: s.experience,
              plataforma: s.platform, duracao: s.duration, idiomas: s.languages,
              linkedin_url: s.portfolioUrl,
              registro_profissional: s.registrationNumber ?? null,
              status: s.status,
            })),
          );
        }
        if (parsed.reports?.length) {
          await supabase.from("denuncias").insert(
            parsed.reports.map((r) => ({
              alvo_nome: r.target,
              categoria: r.category,
              motivo: r.details || r.category,
            })),
          );
        }
        if (parsed.reviews?.length) {
          await supabase.from("avaliacoes").insert(
            parsed.reviews.map((r) => ({
              especialista_ref: r.specialistId,
              estrelas: r.rating,
              comentario: r.comment,
            })),
          );
        }
        if (parsed.feedbacks?.length) {
          await supabase.from("feedbacks").insert(
            parsed.feedbacks.map((f) => ({
              nome: f.name, email: f.email, tipo: f.kind, mensagem: f.message,
            })),
          );
        }

        localStorage.setItem(MIGRATED_KEY, "1");
        console.info("[Valore] Migração localStorage → Supabase concluída.");
      } catch (err) {
        console.error("[Valore] Falha na migração:", err);
      }
    })();
  }, []);

  return null;
}
