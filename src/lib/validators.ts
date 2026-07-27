// Validação real de CPF/CNPJ pelo algoritmo oficial dos dígitos verificadores
// (não é só checagem de quantidade de dígitos) — rejeita sequências repetidas
// (111.111.111-11 etc.) e dígitos verificadores incorretos.

function calcDigit(base: number[], weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < base.length; i++) sum += base[i] * weights[i];
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // 111.111.111-11 etc.

  const digits = cpf.split("").map(Number);
  const d1 = calcDigit(digits.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d1 !== digits[9]) return false;
  const d2 = calcDigit(digits.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d2 !== digits[10]) return false;
  return true;
}

export function isValidCNPJ(raw: string): boolean {
  const cnpj = raw.replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const digits = cnpj.split("").map(Number);
  const d1 = calcDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d1 !== digits[12]) return false;
  const d2 = calcDigit(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d2 !== digits[13]) return false;
  return true;
}

// Usado no campo "CPF ou CNPJ" do cadastro de especialista — decide qual dos
// dois algoritmos aplicar pela quantidade de dígitos.
export function isValidCpfCnpj(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) return isValidCPF(raw);
  if (digits.length === 14) return isValidCNPJ(raw);
  return false;
}

// Exige nome e sobrenome (pelo menos duas palavras) — bloqueia cadastro com
// apenas o primeiro nome.
export function isFullName(raw: string): boolean {
  return raw.trim().split(/\s+/).filter(Boolean).length >= 2;
}

// Limites de tamanho para campos de texto livre — usados tanto no atributo
// HTML maxLength quanto na validação antes do submit, para não depender só
// do navegador (alguém pode montar o POST manualmente sem passar pelo input).
export const MAX_LENGTHS = {
  nome: 100,
  bio: 500,
  cidade: 100,
  especialidade: 100,
  credencial: 200,
  experiencia: 500,
  titulo: 100,
  descricao: 1000,
  comentario: 500,
  motivo: 500,
  mensagem: 1000,
} as const;

// Tamanho máximo de foto de perfil aceito antes de enviar ao Supabase
// Storage — checado no client para não gastar upload/banda com um arquivo
// que seria rejeitado de qualquer forma (o bucket em si não tem limite
// configurado, então sem isso um arquivo de qualquer tamanho passaria).
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export function isValidAvatarSize(file: File): boolean {
  return file.size <= MAX_AVATAR_BYTES;
}

// Só permite http/https — usado antes de renderizar um valor vindo do banco
// como `href`. A validação no formulário de cadastro já bloqueia protocolos
// como `javascript:`, mas ela não protege contra uma linha inserida direto
// via API (bypassando o form) nem contra dados legados — então quem renderiza
// o link (ex.: o painel /admin) precisa validar de novo antes de usar como href.
export function isSafeHttpUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
