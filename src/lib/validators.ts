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
