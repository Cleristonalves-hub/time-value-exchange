// Máscaras de digitação para CPF, CNPJ e telefone — formatam progressivamente
// enquanto o usuário digita. Caracteres não numéricos são sempre descartados
// antes de reaplicar a máscara, então colar um valor já pontuado também funciona.

export function maskCPF(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

export function maskCNPJ(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 14);
  if (d.length > 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length > 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  if (d.length > 5) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length > 2) return `${d.slice(0, 2)}.${d.slice(2)}`;
  return d;
}

// Campo "CPF ou CNPJ" do cadastro de especialista: até 11 dígitos formata como
// CPF; a partir do 12º dígito passa a formatar como CNPJ.
export function maskCpfCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 11 ? maskCNPJ(raw) : maskCPF(raw);
}

// DDD obrigatório: (00) 00000-0000 para celular (9 dígitos) ou
// (00) 0000-0000 para fixo (8 dígitos) enquanto o número ainda está incompleto.
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length > 10) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 0) return `(${d}`;
  return d;
}

// Data no formato DD/MM/AAAA (8 dígitos, "/" inserido automaticamente) — usada
// em campos de data em texto simples (sem <input type="date"> nativo), no
// máximo 10 caracteres formatados.
export function maskDateBR(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}

// Hora no formato HH:MM (4 dígitos, ":" inserido automaticamente) — no máximo
// 5 caracteres formatados.
export function maskTimeHM(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length > 2) return `${d.slice(0, 2)}:${d.slice(2)}`;
  return d;
}
