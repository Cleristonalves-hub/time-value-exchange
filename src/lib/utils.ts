import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mascara o email para exibição na UI (nunca usar para lógica/comparação —
// só para mostrar na tela). "kleriston.alves@gmail.com" -> "kle***@gmail.com".
export function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  return `${local.slice(0, 3)}***${domain}`;
}
