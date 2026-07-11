
# Plano de melhorias — Valore

Vou implementar tudo como **frontend-only** com persistência em `localStorage` (sem backend), já que o app ainda não tem Lovable Cloud ativado. Se preferir persistência real em banco de dados + envio de emails reais para `contato@valore.services`, me avise que eu ativo o Lovable Cloud antes.

---

## 1. Painel Admin protegido (`/admin`)

- Tela de login simples com senha `valore@admin2026` (guardada em sessionStorage após acerto).
- Substituir o `admin.tsx` atual por painel com 5 abas:
  - **Especialistas** — lista com status `Novo` / `Verificado` / `Suspenso`; ações Aprovar / Reprovar / Suspender / Reativar.
  - **Denúncias** — lista de denúncias recebidas (denunciado + motivo + data).
  - **Leilões & pagamentos** — lista dos leilões ativos vindos de `src/lib/auctions.ts`.
  - **Sugestões & reclamações** — mensagens enviadas pelos usuários.
- Fonte única de dados: novo `src/lib/store.ts` (Zustand-like via `useSyncExternalStore` + localStorage) para especialistas, denúncias, avaliações e mensagens.

## 2. Cadastro de especialistas

Editar `src/routes/cadastro.especialista.tsx`:
- Adicionar na etapa 2 (Credenciais):
  - Campo obrigatório **Link do LinkedIn ou portfólio** (URL válida).
  - Campo condicional obrigatório **Número de registro profissional** quando nicho ∈ {Saúde, Direito, Finanças}, com label dinâmico (CRM / OAB / CFA).
- Adicionar checkbox obrigatório com o texto exato de declaração de veracidade antes do botão final.
- Ao finalizar: cria especialista no store com selo **Novo**, roda verificação do link (`fetch` HEAD/no-cors — se o link parsear como URL válida e responder sem erro de rede, marca **Verificado** automaticamente).

## 3. Avaliação e proteção

- Editar `src/routes/avaliar.$id.tsx` para gravar avaliação (1–5 + comentário) no store, vinculada ao especialista.
- Após salvar, se o especialista tiver ≥ 3 avaliações com nota ≤ 2: marca status **Suspenso** e dispara um `mailto:contato@valore.services` (sem backend, é o que dá pra fazer client-side; um email real exige Lovable Cloud + email domain).
- Novo componente `ReportButton` no perfil do especialista (`src/routes/leilao.$id.tsx` e/ou tela de perfil) — abre dialog, salva denúncia no store e dispara `mailto:contato@valore.services` com nome + motivo.

## 4. Busca

- Corrigir `src/routes/explorar.tsx` para filtrar por **nome do especialista** e **nicho**, unindo os mocks de `auctions.ts` com os especialistas cadastrados no store.
- Ocultar especialistas com status **Suspenso**; mostrar **Novo** e **Verificado** (com badge visual do selo).

## 5. Isenção de responsabilidade

- Novo componente `<Disclaimer />` em `src/components/Disclaimer.tsx` com o texto exato pedido.
- Renderizar:
  - No rodapé global (dentro de `__root.tsx` ou de um layout compartilhado).
  - Na página de cada especialista (`leilao.$id.tsx`).
- Novo formulário de "Enviar sugestão / reclamação" acessível do rodapé, gravando no store para aparecer no admin.

---

## Detalhes técnicos

- **Store**: `src/lib/store.ts` com tipos `Specialist`, `Report`, `Review`, `Feedback`; API `subscribe/get/set` + hooks `useSpecialists()`, `useReports()`, etc. Persistência via `localStorage` chave `valore:v1`.
- **Verificação de link**: `new URL(link)` valida sintaxe; `fetch(link, { mode: "no-cors" })` para checar alcance; em erro → mantém `Novo`.
- **Emails**: apenas `window.location.href = "mailto:..."` (client-side). Envio automático real exige Cloud — sinalizo isso na UI do admin.
- **Auth admin**: `sessionStorage["valore:admin"] === "1"` após acertar senha; senha comparada com constante (não é seguro, mas condiz com o pedido “senha simples”).

## Arquivos afetados

- Novos: `src/lib/store.ts`, `src/components/Disclaimer.tsx`, `src/components/ReportButton.tsx`, `src/routes/feedback.tsx`
- Editados: `src/routes/admin.tsx`, `src/routes/cadastro.especialista.tsx`, `src/routes/avaliar.$id.tsx`, `src/routes/explorar.tsx`, `src/routes/leilao.$id.tsx`, `src/routes/__root.tsx`

## O que **não** faço nesta versão (a menos que você peça)

- Ativar Lovable Cloud + banco real + envio real de email para `contato@valore.services` (hoje será `mailto:` que abre o cliente de email do usuário).
- Hash de senha admin / auth de verdade (usa senha em constante, conforme pedido).
