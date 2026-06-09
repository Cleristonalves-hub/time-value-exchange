import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "pt-BR", label: "Português (Brasil)", short: "PT" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "it", label: "Italiano", short: "IT" },
  { code: "ja", label: "日本語", short: "JA" },
  { code: "zh", label: "中文", short: "ZH" },
  { code: "ar", label: "العربية", short: "AR" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const translations: Record<LangCode, Dict> = {
  "pt-BR": {
    "splash.tagline.1": "O tempo dos melhores,",
    "splash.tagline.2": "para quem mais valoriza.",
    "splash.subtitle": "Leilão de tempo humano",
    "splash.cta.client": "Quero contratar um especialista",
    "splash.cta.expert": "Sou um especialista",
    "splash.login": "Já tenho conta — entrar",
    "footer.terms": "Termos de Uso",
    "footer.privacy": "Privacidade",
    "home.greeting": "Boa noite.",
    "home.subgreeting": "Quatro leilões aguardam seus lances esta noite.",
    "home.featured": "◆ Leilão em destaque",
    "home.currentBid": "Lance atual",
    "home.endsIn": "Encerra em",
    "home.search": "Buscar por especialidade ou nome",
    "home.activeAuctions": "Leilões ativos",
    "home.results": "resultados",
    "home.empty": "Nenhum leilão para esta combinação.",
    "nav.home": "Início",
    "nav.explore": "Explorar",
    "nav.bids": "Lances",
    "nav.profile": "Perfil",
    "lang.label": "Idioma",
  },
  en: {
    "splash.tagline.1": "The time of the finest,",
    "splash.tagline.2": "for those who value most.",
    "splash.subtitle": "Human time auction",
    "splash.cta.client": "I want to hire a specialist",
    "splash.cta.expert": "I am a specialist",
    "splash.login": "I already have an account — sign in",
    "footer.terms": "Terms of Use",
    "footer.privacy": "Privacy",
    "home.greeting": "Good evening.",
    "home.subgreeting": "Four auctions await your bids tonight.",
    "home.featured": "◆ Featured auction",
    "home.currentBid": "Current bid",
    "home.endsIn": "Ends in",
    "home.search": "Search by specialty or name",
    "home.activeAuctions": "Active auctions",
    "home.results": "results",
    "home.empty": "No auctions for this combination.",
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.bids": "Bids",
    "nav.profile": "Profile",
    "lang.label": "Language",
  },
  es: {
    "splash.tagline.1": "El tiempo de los mejores,",
    "splash.tagline.2": "para quienes más lo valoran.",
    "splash.subtitle": "Subasta de tiempo humano",
    "splash.cta.client": "Quiero contratar a un especialista",
    "splash.cta.expert": "Soy un especialista",
    "splash.login": "Ya tengo cuenta — entrar",
    "footer.terms": "Términos de uso",
    "footer.privacy": "Privacidad",
    "home.greeting": "Buenas noches.",
    "home.subgreeting": "Cuatro subastas esperan tus pujas esta noche.",
    "home.featured": "◆ Subasta destacada",
    "home.currentBid": "Puja actual",
    "home.endsIn": "Finaliza en",
    "home.search": "Buscar por especialidad o nombre",
    "home.activeAuctions": "Subastas activas",
    "home.results": "resultados",
    "home.empty": "No hay subastas para esta combinación.",
    "nav.home": "Inicio",
    "nav.explore": "Explorar",
    "nav.bids": "Pujas",
    "nav.profile": "Perfil",
    "lang.label": "Idioma",
  },
  fr: {
    "splash.tagline.1": "Le temps des meilleurs,",
    "splash.tagline.2": "pour ceux qui le valorisent le plus.",
    "splash.subtitle": "Enchère de temps humain",
    "splash.cta.client": "Je veux engager un spécialiste",
    "splash.cta.expert": "Je suis un spécialiste",
    "splash.login": "J'ai déjà un compte — se connecter",
    "footer.terms": "Conditions d'utilisation",
    "footer.privacy": "Confidentialité",
    "home.greeting": "Bonsoir.",
    "home.subgreeting": "Quatre enchères attendent vos offres ce soir.",
    "home.featured": "◆ Enchère en vedette",
    "home.currentBid": "Offre actuelle",
    "home.endsIn": "Se termine dans",
    "home.search": "Rechercher par spécialité ou nom",
    "home.activeAuctions": "Enchères actives",
    "home.results": "résultats",
    "home.empty": "Aucune enchère pour cette combinaison.",
    "nav.home": "Accueil",
    "nav.explore": "Explorer",
    "nav.bids": "Offres",
    "nav.profile": "Profil",
    "lang.label": "Langue",
  },
  de: {
    "splash.tagline.1": "Die Zeit der Besten,",
    "splash.tagline.2": "für die, die sie am meisten schätzen.",
    "splash.subtitle": "Auktion menschlicher Zeit",
    "splash.cta.client": "Ich möchte einen Spezialisten beauftragen",
    "splash.cta.expert": "Ich bin Spezialist",
    "splash.login": "Ich habe bereits ein Konto — anmelden",
    "footer.terms": "Nutzungsbedingungen",
    "footer.privacy": "Datenschutz",
    "home.greeting": "Guten Abend.",
    "home.subgreeting": "Vier Auktionen erwarten heute Abend Ihre Gebote.",
    "home.featured": "◆ Empfohlene Auktion",
    "home.currentBid": "Aktuelles Gebot",
    "home.endsIn": "Endet in",
    "home.search": "Suche nach Spezialität oder Name",
    "home.activeAuctions": "Aktive Auktionen",
    "home.results": "Ergebnisse",
    "home.empty": "Keine Auktionen für diese Kombination.",
    "nav.home": "Start",
    "nav.explore": "Entdecken",
    "nav.bids": "Gebote",
    "nav.profile": "Profil",
    "lang.label": "Sprache",
  },
  it: {
    "splash.tagline.1": "Il tempo dei migliori,",
    "splash.tagline.2": "per chi lo apprezza di più.",
    "splash.subtitle": "Asta di tempo umano",
    "splash.cta.client": "Voglio assumere uno specialista",
    "splash.cta.expert": "Sono uno specialista",
    "splash.login": "Ho già un account — accedi",
    "footer.terms": "Termini di utilizzo",
    "footer.privacy": "Privacy",
    "home.greeting": "Buonasera.",
    "home.subgreeting": "Quattro aste attendono le tue offerte stasera.",
    "home.featured": "◆ Asta in evidenza",
    "home.currentBid": "Offerta attuale",
    "home.endsIn": "Termina tra",
    "home.search": "Cerca per specialità o nome",
    "home.activeAuctions": "Aste attive",
    "home.results": "risultati",
    "home.empty": "Nessuna asta per questa combinazione.",
    "nav.home": "Home",
    "nav.explore": "Esplora",
    "nav.bids": "Offerte",
    "nav.profile": "Profilo",
    "lang.label": "Lingua",
  },
  ja: {
    "splash.tagline.1": "一流の時間を、",
    "splash.tagline.2": "最も価値を見出す方へ。",
    "splash.subtitle": "人の時間のオークション",
    "splash.cta.client": "専門家を依頼したい",
    "splash.cta.expert": "私は専門家です",
    "splash.login": "アカウントをお持ちの方 — ログイン",
    "footer.terms": "利用規約",
    "footer.privacy": "プライバシー",
    "home.greeting": "こんばんは。",
    "home.subgreeting": "今夜、4つのオークションがあなたの入札を待っています。",
    "home.featured": "◆ 注目のオークション",
    "home.currentBid": "現在の入札",
    "home.endsIn": "終了まで",
    "home.search": "専門分野または名前で検索",
    "home.activeAuctions": "開催中のオークション",
    "home.results": "件",
    "home.empty": "この条件に一致するオークションはありません。",
    "nav.home": "ホーム",
    "nav.explore": "探す",
    "nav.bids": "入札",
    "nav.profile": "プロフィール",
    "lang.label": "言語",
  },
  zh: {
    "splash.tagline.1": "顶尖人才的时间，",
    "splash.tagline.2": "献给最懂珍惜的人。",
    "splash.subtitle": "人类时间拍卖",
    "splash.cta.client": "我想聘请专家",
    "splash.cta.expert": "我是专家",
    "splash.login": "我已有账户 — 登录",
    "footer.terms": "使用条款",
    "footer.privacy": "隐私",
    "home.greeting": "晚上好。",
    "home.subgreeting": "今晚有四场拍卖等待您的出价。",
    "home.featured": "◆ 精选拍卖",
    "home.currentBid": "当前出价",
    "home.endsIn": "结束于",
    "home.search": "按专业或姓名搜索",
    "home.activeAuctions": "进行中的拍卖",
    "home.results": "个结果",
    "home.empty": "没有符合此组合的拍卖。",
    "nav.home": "首页",
    "nav.explore": "探索",
    "nav.bids": "出价",
    "nav.profile": "我的",
    "lang.label": "语言",
  },
  ar: {
    "splash.tagline.1": "وقت الأفضل،",
    "splash.tagline.2": "لمن يقدّره أكثر.",
    "splash.subtitle": "مزاد الوقت البشري",
    "splash.cta.client": "أريد توظيف مختص",
    "splash.cta.expert": "أنا مختص",
    "splash.login": "لديّ حساب — تسجيل الدخول",
    "footer.terms": "شروط الاستخدام",
    "footer.privacy": "الخصوصية",
    "home.greeting": "مساء الخير.",
    "home.subgreeting": "أربعة مزادات بانتظار عروضك الليلة.",
    "home.featured": "◆ مزاد مميّز",
    "home.currentBid": "العرض الحالي",
    "home.endsIn": "ينتهي خلال",
    "home.search": "ابحث حسب التخصص أو الاسم",
    "home.activeAuctions": "مزادات نشطة",
    "home.results": "نتائج",
    "home.empty": "لا توجد مزادات لهذه التركيبة.",
    "nav.home": "الرئيسية",
    "nav.explore": "استكشف",
    "nav.bids": "العروض",
    "nav.profile": "الملف",
    "lang.label": "اللغة",
  },
};

const RTL: LangCode[] = ["ar"];
const STORAGE_KEY = "valore.lang";
const DEFAULT: LangCode = "pt-BR";

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (stored && translations[stored]) setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (l: LangCode) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const t = (key: string) =>
    translations[lang]?.[key] ?? translations[DEFAULT][key] ?? key;

  return (
    <LangCtx.Provider
      value={{ lang, setLang, t, dir: RTL.includes(lang) ? "rtl" : "ltr" }}
    >
      {children}
    </LangCtx.Provider>
  );
}

export function useT() {
  const ctx = useContext(LangCtx);
  if (!ctx) {
    // SSR / outside provider fallback
    return {
      lang: DEFAULT,
      setLang: () => {},
      t: (k: string) => translations[DEFAULT][k] ?? k,
      dir: "ltr" as const,
    };
  }
  return ctx;
}
