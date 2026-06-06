import expert1 from "@/assets/expert-1.jpg";
import expert2 from "@/assets/expert-2.jpg";
import expert3 from "@/assets/expert-3.jpg";
import expert4 from "@/assets/expert-4.jpg";

export type Auction = {
  id: string;
  expert: string;
  photo: string;
  niche: string;
  specialty: string;
  credential: string;
  bio: string;
  currentBid: number;
  minBid: number;
  endsAt: number; // ms epoch
  seats: number;
  duration: number; // minutes
  platform: "Google Meet" | "Zoom" | "Microsoft Teams";
  languages: string[];
  tags: string[];
  included: string;
  history: { value: number; at: string }[];
};

const now = Date.now();
const h = (n: number) => now + n * 3600 * 1000;

export const auctions: Auction[] = [
  {
    id: "1",
    expert: "Dra. Helena Vasconcelos",
    photo: expert1,
    niche: "Saúde",
    specialty: "Cardiologista — check-up executivo",
    credential: "Pós-doc Harvard Medical School",
    bio: "Mais de 22 anos dedicados à cardiologia preventiva de alta performance, atendendo executivos e atletas em São Paulo e Nova York.",
    currentBid: 4800,
    minBid: 2000,
    endsAt: h(3.2),
    seats: 2,
    duration: 60,
    platform: "Zoom",
    languages: ["Português", "Inglês"],
    tags: ["Cardiologia", "Check-up", "Prevenção"],
    included: "Análise completa de exames recentes, plano de acompanhamento personalizado e relatório executivo enviado em até 48h.",
    history: [
      { value: 4800, at: "há 4 min" },
      { value: 4500, at: "há 11 min" },
      { value: 4200, at: "há 28 min" },
      { value: 3900, at: "há 1h" },
    ],
  },
  {
    id: "2",
    expert: "Maestro Ricardo Albano",
    photo: expert2,
    niche: "Música",
    specialty: "Produtor musical — análise de demo",
    credential: "Grammy Latino 2019",
    bio: "Produtor com três décadas no estúdio. Trabalhos com artistas premiados em MPB, jazz e música clássica contemporânea.",
    currentBid: 3200,
    minBid: 1500,
    endsAt: h(7.5),
    seats: 1,
    duration: 90,
    platform: "Google Meet",
    languages: ["Português", "Inglês", "Espanhol"],
    tags: ["Produção", "Demo", "Mixagem"],
    included: "Escuta crítica da sua demo, sugestões de produção e direção artística em sessão de 90 minutos.",
    history: [
      { value: 3200, at: "há 12 min" },
      { value: 2900, at: "há 40 min" },
      { value: 2400, at: "há 2h" },
    ],
  },
  {
    id: "3",
    expert: "Lucas Andrade",
    photo: expert3,
    niche: "Tecnologia",
    specialty: "Arquiteto de software — code review",
    credential: "Ex-Staff Engineer no Google",
    bio: "Especialista em sistemas distribuídos e arquitetura de larga escala. Mentor de fundadores Y Combinator.",
    currentBid: 1850,
    minBid: 800,
    endsAt: h(0.6),
    seats: 3,
    duration: 60,
    platform: "Microsoft Teams",
    languages: ["Português", "Inglês"],
    tags: ["Arquitetura", "Code review", "Mentoria"],
    included: "Code review ao vivo, revisão de arquitetura e roteiro de melhorias priorizadas.",
    history: [
      { value: 1850, at: "há 2 min" },
      { value: 1600, at: "há 18 min" },
      { value: 1400, at: "há 35 min" },
    ],
  },
  {
    id: "4",
    expert: "Beatriz Mendonça",
    photo: expert4,
    niche: "Direito",
    specialty: "Direito empresarial e M&A",
    credential: "Sócia em escritório tier-1",
    bio: "Sócia em um dos maiores escritórios do Brasil, especialista em fusões, aquisições e estruturação societária.",
    currentBid: 5600,
    minBid: 3000,
    endsAt: h(14),
    seats: 1,
    duration: 60,
    platform: "Zoom",
    languages: ["Português", "Inglês"],
    tags: ["M&A", "Societário", "Contratos"],
    included: "Consulta estratégica confidencial com análise prévia dos documentos enviados.",
    history: [
      { value: 5600, at: "há 22 min" },
      { value: 5100, at: "há 1h" },
      { value: 4500, at: "há 3h" },
    ],
  },
];

export const niches = [
  "Todos", "Saúde", "Direito", "Finanças", "Educação",
  "Artes", "Música", "Tecnologia", "Negócios", "Esporte",
];

export const getAuction = (id: string) => auctions.find((a) => a.id === id);

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
