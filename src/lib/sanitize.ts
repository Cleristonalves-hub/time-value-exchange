import DOMPurify from "dompurify";

// Usado nos campos de texto livre mais longos (bio do especialista, descrição
// do leilão) antes de enviar ao banco. O React já escapa esses valores por
// padrão ao renderizar (nunca usamos dangerouslySetInnerHTML para eles), então
// isto é defesa em profundidade — garante que o dado gravado já vem limpo,
// mesmo que uma tela futura passe a renderizar como HTML. Como são campos de
// texto simples (textarea, sem editor rico), não há motivo legítimo para
// conter qualquer marcação — por isso remove TODAS as tags (não só
// <script>/<iframe>) e todos os atributos, não apenas onload/onerror.
export function sanitizeText(raw: string): string {
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}
