import { useSyncExternalStore } from "react";

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

type State = {
  specialists: Specialist[];
  reports: Report[];
  reviews: Review[];
  feedbacks: Feedback[];
};

const KEY = "valore:v1";
const CONTACT_EMAIL = "contato@valore.services";

const empty: State = { specialists: [], reports: [], reviews: [], feedbacks: [] };

function load(): State {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return empty;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot()),
  );
}

export function useSpecialists() {
  return useStore((s) => s.specialists);
}
export function useReports() {
  return useStore((s) => s.reports);
}
export function useReviews() {
  return useStore((s) => s.reviews);
}
export function useFeedbacks() {
  return useStore((s) => s.feedbacks);
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function openMailto(subject: string, body: string) {
  if (typeof window === "undefined") return;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  // Non-blocking: open in a new tab so it doesn't hijack navigation
  window.open(href, "_blank", "noopener");
}

export function addSpecialist(input: Omit<Specialist, "id" | "status" | "createdAt">) {
  const s: Specialist = {
    ...input,
    id: uid(),
    status: "novo",
    createdAt: Date.now(),
  };
  state = { ...state, specialists: [s, ...state.specialists] };
  persist();
  // Fire-and-forget link verification
  verifyLink(s.portfolioUrl).then((ok) => {
    if (ok) setSpecialistStatus(s.id, "verificado");
  });
  return s;
}

export function setSpecialistStatus(id: string, status: SpecialistStatus) {
  state = {
    ...state,
    specialists: state.specialists.map((s) =>
      s.id === id ? { ...s, status } : s,
    ),
  };
  persist();
}

async function verifyLink(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return false;
    // no-cors returns opaque response but resolves on reachable hosts
    await fetch(u.toString(), { mode: "no-cors" });
    return true;
  } catch {
    return false;
  }
}

export function addReport(input: Omit<Report, "id" | "createdAt">) {
  const r: Report = { ...input, id: uid(), createdAt: Date.now() };
  state = { ...state, reports: [r, ...state.reports] };
  persist();
  openMailto(
    `Denúncia — ${r.target}`,
    `Denunciado: ${r.target}\nCategoria: ${r.category}\nDetalhes: ${r.details || "(sem detalhes)"}\nData: ${new Date(r.createdAt).toLocaleString("pt-BR")}`,
  );
  return r;
}

export function addReview(input: Omit<Review, "id" | "createdAt">) {
  const r: Review = { ...input, id: uid(), createdAt: Date.now() };
  state = { ...state, reviews: [r, ...state.reviews] };
  persist();

  // Auto-suspend if specialist has >=3 negative reviews
  const negatives = state.reviews.filter(
    (rv) => rv.specialistId === r.specialistId && rv.rating <= 2,
  );
  if (negatives.length >= 3) {
    const sp = state.specialists.find((s) => s.id === r.specialistId);
    if (sp && sp.status !== "suspenso") {
      setSpecialistStatus(sp.id, "suspenso");
      openMailto(
        `Suspensão automática — ${sp.fullName}`,
        `O especialista ${sp.fullName} (${sp.specialty}) foi suspenso automaticamente após ${negatives.length} avaliações negativas.`,
      );
    }
  }
  return r;
}

export function addFeedback(input: Omit<Feedback, "id" | "createdAt">) {
  const f: Feedback = { ...input, id: uid(), createdAt: Date.now() };
  state = { ...state, feedbacks: [f, ...state.feedbacks] };
  persist();
  return f;
}

export const DISCLAIMER =
  "A Valore é uma plataforma de conexão entre profissionais e clientes. Cada especialista é responsável pela veracidade de suas informações e credenciais. Recomendamos verificar o perfil profissional antes de contratar. A Valore não presta os serviços — apenas facilita a conexão.";

export const REGULATED_NICHES = ["Saúde", "Direito", "Finanças"];

export function registrationLabel(niche: string): string | null {
  if (niche === "Saúde") return "Número do CRM";
  if (niche === "Direito") return "Número da OAB";
  if (niche === "Finanças") return "Registro CFA / CVM";
  return null;
}
