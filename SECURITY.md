# Segurança — Valore

Este documento registra a auditoria de segurança realizada em 2026-07-25 e as
medidas implementadas. Serve como referência viva: atualize-o sempre que uma
política de RLS, header ou Edge Function mudar.

## 1. Segredos e credenciais

**Varredura feita** em todo o repositório (`src/`, `supabase/`, arquivos de
config) por padrões de chave/token: `sk-`, `APP_USR-`, `re_`, `eyJ`, `Bearer
<token>` hardcoded, URLs com `?key=`/`?token=`/`?secret=`.

**Resultado:** nenhum segredo real exposto. O único hit foi
`src/routes/cartao.tsx:19` — a **Public Key** de produção do Mercado Pago
(`APP_USR-...`), que é projetada para ficar no client (equivalente à
publishable key do Stripe) e cujo par secreto (`MERCADOPAGO_ACCESS_TOKEN`) já
vive só como `Deno.env.get(...)` nas Edge Functions, nunca hardcoded. Mesmo
padrão para `RESEND_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` — sempre lidas de
variável de ambiente nas funções, nunca escritas em texto no código.

A Supabase URL e a **anon/publishable key** também estão hardcoded em
`src/integrations/supabase/client.ts` — isso é seguro e intencional (é a
chave pública do projeto, protegida por RLS), e segue o mesmo padrão já usado
para a chave do Mercado Pago.

**`.gitignore`** atualizado para incluir `.env`, `.env.local`,
`.env.production`, `*.secret` e `supabase/.temp/` (nenhum desses arquivos
existia no repo, mas agora ficam bloqueados por padrão).

## 2. Edge Functions

| Função | Quem pode chamar | Auth | Rate limit adicionado |
|---|---|---|---|
| `trust-engine` | Só o Database Webhook do Supabase | Compara `Authorization` com `SUPABASE_SERVICE_ROLE_KEY` | 30/min/IP |
| `send-auth-email` | Só o Auth Hook do Supabase | Verifica assinatura Standard Webhooks (`SEND_EMAIL_HOOK_SECRET`) | 30/min/IP |
| `processar-inadimplencia` | Só o pg_cron interno | Header `x-cron-secret` == `PROCESSAR_INADIMPLENCIA_SECRET` | 5/min/IP |
| `dar-lance` | Usuário autenticado (browser) | JWT via `supabase.auth.getUser()` | 20/min/IP |
| `cancelar-leilao` | Especialista autenticado, dono do leilão | JWT + checagem de `usuario_id` | 10/min/IP |
| `salvar-cartao` | Usuário autenticado (browser) | JWT via `supabase.auth.getUser()` | 5/min/IP |

**Bug corrigido — `processar-inadimplencia` estava fail-open:** o código
antigo só checava o header `x-cron-secret` **se** `PROCESSAR_INADIMPLENCIA_SECRET`
estivesse configurada (`if (CRON_SECRET) {...}`). Se o secret nunca tivesse
sido definido no ambiente, a checagem inteira era pulada e **qualquer um**
podia chamar a função sem autenticação. Corrigido para fail-closed: ausência
do secret agora também bloqueia (`if (!CRON_SECRET || provided !== CRON_SECRET)`).
⚠️ Isso significa que, se `PROCESSAR_INADIMPLENCIA_SECRET` não estiver
configurada via `supabase secrets set`, o cron **para de funcionar** (em vez
de funcionar de forma insegura). Confirme que o secret está setado e que o
header hardcoded na migration `20260723100000_cron_processar_inadimplencia.sql`
foi trocado do placeholder `TROQUE_PELO_MESMO_VALOR_DE_...` pelo valor real.

**Rate limiting — limitação conhecida:** implementado em
`supabase/functions/_shared/rateLimit.ts`, em memória, por IP, por função.
Isso barra abuso básico de um script simples, mas **não é um rate limit
distribuído**: cada instância do Deno Deploy tem seu próprio contador, e um
cold start zera esse contador. Para proteção robusta de verdade, configure
rate limiting na borda (Cloudflare WAF/Rate Limiting Rules) — ver seção 7.

## 3. Headers HTTP de segurança

Aplicados em três lugares, porque o projeto tem três configs de deploy
coexistindo (`wrangler.jsonc`, `netlify.toml`, `vercel.json`) e não ficou
claro qual está realmente em produção:

- **`src/server.ts`** — via `applySecurityHeaders()` em
  `src/lib/securityHeaders.ts`, aplicado a toda resposta do Worker Cloudflare
  (caminho real, por-request — cobre SSR e qualquer rota dinâmica).
- **`netlify.toml`** — bloco `[[headers]]` para `/*` (deploy estático).
- **`vercel.json`** — array `"headers"` para `/(.*)` (deploy estático).

Headers aplicados: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()`,
`Strict-Transport-Security: max-age=31536000; includeSubDomains`, e a CSP
especificada (`default-src 'self'; script-src 'self' 'unsafe-inline'; ...`).

**Ressalva sobre a CSP:** `'unsafe-inline'` em `script-src`/`style-src` reduz
bastante a proteção contra XSS que uma CSP normalmente daria (permite
qualquer `<script>`/`style` inline rodar, inclusive um injetado por XSS).
Foi implementada exatamente como especificado, mas o ideal a médio prazo é
migrar para nonces ou hashes por build e remover `'unsafe-inline'`.

**Ação manual:** descubra qual dos três deploys é o real e desative/remova os
outros dois configs para não manter infraestrutura morta.

## 4. RLS (Row Level Security)

### Tabela sem RLS nenhuma — corrigido

`public.admin_notifications` **nunca teve RLS habilitada** desde sua criação.
Confirmado ao vivo: um `select` via chave anon, sem sessão nenhuma, retornou
HTTP 200 (tabela sem nenhuma barreira). Essa tabela guarda os motivos de
reprovação de especialistas pelo Trust Engine — dado interno que não deveria
ser público. Corrigido em `20260725170000_security_audit_rls_hardening.sql`:
RLS habilitada + policy `admin_read` (só admin) + policy `self_read` (o
próprio especialista lê os motivos da sua reprovação, preservando a feature
existente `useRejectionReasons`).

⚠️ **Se você já tinha especialistas reprovados antes de 2026-07-25, os
motivos deles ficaram publicamente legíveis via API todo esse tempo.**
Reveja se isso importa para o seu caso (não é dado extremamente sensível,
mas é interno).

### Política de INSERT divergente ao vivo — corrigido

Um teste direto (insert não-autenticado, só com a chave anon) em
`public.especialistas` teve **sucesso** (HTTP 201), embora a policy no
repositório exija `to authenticated`. Isso prova que **a policy realmente
ativa no banco divergiu do que está versionado aqui** — provavelmente uma
alteração feita direto pelo Supabase Studio, nunca capturada em migration.
Corrigido em `20260725160000_fix_especialistas_rls.sql`, que remove
dinamicamente qualquer policy de INSERT existente (sem depender do nome) e
recria só a correta.

**Lição/processo recomendado:** trate qualquer alteração de RLS feita direto
no Dashboard como proibida — todas as mudanças de schema/policy devem
acontecer via migration. Rode `supabase db diff` periodicamente para detectar
esse tipo de drift antes que vire um incidente.

### Policies de INSERT fracas demais — corrigidas

- **`public.leiloes`**: a policy criada em `20260720100000` usava
  `with check (true)` — o próprio comentário da migration já registrava isso
  como pendente ("não valida que o especialista_id pertence ao usuário
  logado"). Qualquer usuário autenticado podia criar um leilão em nome de
  **qualquer** especialista. Corrigido para exigir
  `especialista_id in (select id from especialistas where usuario_id = auth.uid())`.
  Só foi possível apertar agora porque `especialistas.usuario_id` passou a
  ser preenchido corretamente numa correção anterior desta sessão.
- **`public.lances`**: a policy antiga da base (`auth_insert`,
  `auth.uid() is not null`) continuava coexistindo com a policy mais estrita
  criada depois (`usuario_id = auth.uid()`). Como políticas permissivas do
  mesmo comando são combinadas com OR, a mais fraca ainda valia — um usuário
  podia inserir um lance atribuído a outro `usuario_id`. A policy antiga foi
  removida.

### Deliberadamente **não** alteradas

- **`public.denuncias`** e **`public.avaliacoes`**: o INSERT exige só
  `auth.uid() is not null`, sem checar `usuario_id`. Isso é porque
  `addReport`/`addReview` em `src/lib/store.ts` **nunca preenchem
  `usuario_id`** — são submissões anônimas por design hoje. Apertar essa
  policy quebraria a funcionalidade atual.
- **`public.feedbacks`**: INSERT 100% público (`any_insert`, `check (true)`,
  sem `to authenticated`) — de propósito, é o formulário de contato, pensado
  para visitantes sem conta.

### DELETE — política de "usuário só apaga o próprio dado"

`public.usuarios` e `public.especialistas` **nunca tiveram policy de
DELETE**. Isso é mais grave do que parece: `deleteMyAccount()` em
`src/lib/store.ts` já tentava fazer esse delete direto do client
(`.from("especialistas").delete()...` / `.from("usuarios").delete()...`), mas
sem policy o RLS filtra tudo — o delete afeta 0 linhas **sem gerar erro**, e
o app mostrava "conta excluída com sucesso" sem apagar nada de fato.
Corrigido com policies `self_delete` (usuario dono, `id = auth.uid()` /
`usuario_id = auth.uid()`) — isso não é só uma correção de segurança, é a
correção que faz a funcionalidade de exclusão de conta funcionar pela
primeira vez.

`public.cartoes` já tinha essa policy desde antes (`usuario_id = auth.uid()`)
— sem mudança.

Tabelas onde **não** foi adicionado self-delete, de propósito: `leiloes`
(cancelamento tem regras de penalidade que vivem só na Edge Function
`cancelar-leilao` — um DELETE direto via RLS pularia essas regras),
`lances`/`pagamentos`/`cancelamentos_leilao`/`admin_notifications` (registro
de auditoria — deletar apagaria histórico/evidência), `avaliacoes`/`denuncias`/
`feedbacks` (sem feature de "apagar minha avaliação/denúncia/feedback" hoje).

### Storage (bucket `avatars`) — corrigido

As policies de UPDATE/DELETE em `storage.objects` só checavam
`bucket_id = 'avatars'`, **sem checar dono** — qualquer usuário autenticado
podia sobrescrever ou apagar a foto de perfil de **qualquer outro usuário**.
Corrigido para exigir `owner_id = auth.uid()` (com fallback para a coluna
legada `owner`, cobrindo qualquer versão do Storage).

Nota à parte (não é bug de segurança, é inconsistência de convenção):
`uploadAvatar()` usa prefixo `user/${user.id}/...` para clientes mas só
`specialist/...` (sem id) para especialistas — a correção acima funciona
para os dois casos porque usa a coluna `owner_id` do objeto, não o path, mas
vale padronizar os dois prefixos no futuro.

## 5. Validação de input / XSS / SQL injection / CSRF

**SQL injection:** não se aplica ao código atual — todo acesso a dados passa
pelo cliente Supabase (`supabase.from(...).select/insert/update`), que usa
queries parametrizadas via PostgREST. Não há nenhum lugar concatenando SQL
cru com input do usuário. Verificado por grep em `src/` e
`supabase/functions/` — nenhuma ocorrência.

**XSS — vulnerabilidade real encontrada e corrigida:**
`src/routes/admin.tsx:186` renderizava `<a href={s.portfolioUrl}>` direto,
sem validar o protocolo. A validação de formulário
(`isSafeHttpUrl`/antigo `isUrl` em `cadastro.especialista.tsx`) só roda no
cadastro normal — não protege contra uma linha inserida direto via API
(exatamente o que provamos ser possível na seção 4) nem contra dado legado.
Um `href="javascript:..."` executa ao clicar. Como é o painel **admin**, o
alvo seria a sessão de um administrador — impacto alto. Corrigido: o link só
é renderizado como `<a href>` clicável se passar em `isSafeHttpUrl()` (só
http/https); caso contrário aparece como texto simples, sem virar link.
`isSafeHttpUrl` agora mora em `src/lib/validators.ts` e é reusada tanto na
validação do formulário quanto na hora de renderizar.

Outros `dangerouslySetInnerHTML` (só um, em `src/components/ui/chart.tsx`) —
boilerplate do shadcn/ui, gera `<style>` a partir de config de cores
controlada pelo dev, nunca de input do usuário. Revisado, não é um vetor.

**Limites de tamanho de campo** adicionados (`maxLength` no input + constante
em `src/lib/validators.ts::MAX_LENGTHS`):

| Campo | Limite | Onde |
|---|---|---|
| nome (cliente/especialista) | 100 | `cadastro.cliente.tsx`, `cadastro.especialista.tsx`, `perfil.tsx` |
| cidade | 100 | idem |
| especialidade | 100 | `cadastro.especialista.tsx` |
| credencial | 200 | `cadastro.especialista.tsx` |
| bio | 500 | `cadastro.especialista.tsx` |
| título do leilão | 100 | `criar-leilao.tsx` |
| descrição do leilão | 1000 | `criar-leilao.tsx` |
| comentário de avaliação | 500 | `avaliar.$id.tsx` (já existia) |
| detalhes de denúncia | 500 | `ReportDialog.tsx` |
| mensagem de feedback | 1000 | `feedback.tsx` |

CPF/CNPJ/telefone já são efetivamente limitados pela máscara de digitação
(`src/lib/masks.ts`), que trava a quantidade de dígitos aceitos.

Esses limites são só HTML `maxLength` (client-side) — não há constraint de
tamanho no banco. Alguém montando o POST manualmente (bypassando o form,
como provamos ser possível) ainda pode mandar um campo maior. Se isso for
uma preocupação real, adicione `check (char_length(bio) <= 500)` etc. via
migration nas colunas correspondentes.

**CSRF:** implementado como checagem de `Origin` (defesa em profundidade) em
`supabase/functions/_shared/csrf.ts`, aplicado às 3 funções chamadas
diretamente pelo navegador com o JWT do usuário (`dar-lance`,
`cancelar-leilao`, `salvar-cartao`). CSRF **clássico** (token de formulário)
não se aplica bem aqui: essas funções usam Bearer token explícito no header
Authorization (via `supabase.functions.invoke()`), não cookie de sessão — um
site de terceiros não consegue forjar esse header sozinho. A checagem de
Origin barra uma classe menor de abuso (chamada direta do browser a partir de
um domínio não reconhecido) sem quebrar chamadas server-to-server (que não
mandam `Origin`).

## 6. Sessão, auditoria e hardening adicional (2026-07-27)

### Timeout de sessão por inatividade

`src/lib/useSessionTimeout.ts` monitora clique, scroll, teclado, mouse e
toque. Sem nenhum deles por 30 minutos, chama `supabase.auth.signOut()`
automaticamente. 2 minutos antes, mostra um aviso ("Sua sessão expirará em 2
minutos por inatividade.") com botão "Continuar logado" — a partir do
momento em que o aviso aparece, atividade passiva (ex.: o mouse encostar sem
querer) **não** reresseta o timer sozinha, só o clique explícito no botão
(senão o aviso nunca ficaria na tela tempo suficiente para alguém notar).
A UI do aviso foi extraída para `src/components/SessionTimeoutWarning.tsx`
para poder ser reusada em mais de um lugar. Descobri que nem toda página
protegida usa `RequireAuth` — `admin.tsx`, `perfil.tsx`, `criar-leilao.tsx` e
a tela de perfil de especialista logado (`cadastro.especialista.tsx`) têm
cada uma seu próprio gate de autenticação (checagens `if (!user)`/`isAdmin`
inline, com telas de "convidado"/"acesso negado" próprias) em vez de usar o
componente compartilhado. Por isso o timeout foi aplicado em 5 lugares, não
só um: `RequireAuth` (cobre a maioria das rotas) + as 4 páginas com gate
próprio, cada uma chamando `useSessionTimeout` e renderizando
`<SessionTimeoutWarning>` diretamente. Se uma página nova for criada com seu
próprio gate de auth em vez de `RequireAuth`, lembre de repetir esse padrão.

### Logs de auditoria no admin

Nova tabela `public.audit_logs` (`admin_id`, `acao`, `alvo_tipo`, `alvo_id`,
`detalhes` jsonb, `created_at`) — ver
`supabase/migrations/20260727100000_add_audit_logs.sql`. RLS habilitada com
só duas policies: `admin_read` (só quem tem role admin lê) e `admin_insert`
(só admin insere, e só atribuído a si mesmo — `admin_id = auth.uid()`); sem
policy de UPDATE/DELETE, então o log é imutável mesmo para o próprio admin.

`setSpecialistStatus()` em `src/lib/store.ts` agora grava um log a cada
chamada (aprovar/reprovar/suspender/reativar especialista) — é a única ação
administrativa que de fato existe hoje no painel. A aba "Leilões" do
`/admin` só lista dados fictícios sem nenhum botão de ação, então **não
existe hoje uma função real de "admin cancela leilão" para logar** — não
inventei uma para não misturar uma feature nova com esta tarefa de
auditoria. Se essa função for adicionada depois, aplique o mesmo padrão
(`logAdminAction` já é reutilizável).

Nova aba "Logs de Auditoria" em `/admin` (`AuditLogsTab` em
`src/routes/admin.tsx`), com filtro por tipo de ação e por intervalo de
datas — filtragem feita no client sobre os últimos 200 logs (não há
paginação ainda; se o volume crescer muito, vale mover o filtro para a query
do Supabase).

### Rate limiting real, com estado no banco

O rate limiting anterior (`_shared/rateLimit.ts`) era só em memória, por
instância — um cold start zerava o contador e instâncias concorrentes nem
compartilhavam contagem. Para as 4 funções citadas no pedido
(`trust-engine`, `send-auth-email`, `dar-lance`, `salvar-cartao`), troquei
por um limitador real: tabela `public.rate_limits` + função Postgres
`check_rate_limit()` (`security definer`, upsert atômico via `ON CONFLICT`
— duas requisições concorrentes para a mesma chave nunca perdem incremento
porque o Postgres toma um lock de linha na chave durante o upsert). Limite:
10 requisições por IP por minuto; ao exceder, HTTP 429 com
`"Muitas requisições. Tente novamente em 1 minuto."` — ver
`supabase/functions/_shared/rateLimitDb.ts` e a migration
`20260727110000_add_rate_limits.sql`.

`cancelar-leilao` e `processar-inadimplencia` **não** foram citadas no
pedido e continuam no limitador antigo em memória (10/min e 5/min,
respectivamente) — não migradas para evitar mudar comportamento não pedido.
Isso deixa duas mecânicas de rate limit coexistindo no projeto; se fizer
sentido, migrar as duas restantes para `rateLimitDb` depois é só trocar o
import e adicionar `await`.

Se a chamada RPC falhar (erro de infraestrutura), a função **deixa passar**
— decisão deliberada de disponibilidade sobre rigor: um bug no rate limiter
não deve derrubar `dar-lance`/`salvar-cartao` inteiras. O erro fica no log
da função.

### Sanitização de HTML em bio/descrição

`src/lib/sanitize.ts` usa `DOMPurify` (dependência nova, `npm install
dompurify`) para remover **toda** marcação HTML (não só `<script>`/`<iframe>`
— um campo de bio/descrição em textarea simples não tem motivo legítimo para
conter qualquer tag) antes de enviar ao Supabase. Aplicado em `data.bio` (as
duas telas de cadastro de especialista) e `descricao` do leilão
(`criar-leilao.tsx`).

Importante: hoje isso é **defesa em profundidade, não correção de um bug
explorável** — o React já escapa esses valores por padrão ao renderizar
(`{bio}` como children de JSX nunca executa HTML), e o único
`dangerouslySetInnerHTML` do projeto (`chart.tsx`) não usa dado do usuário.
O valor real aqui é garantir que o dado GRAVADO já vem limpo, para o caso de
uma tela futura passar a renderizar como HTML de verdade. Confirmei que
`dompurify` não quebra o SSR do TanStack Start (só é chamado dentro de
handlers de submit, nunca no top-level do módulo nem durante a renderização
inicial) — testado ao vivo em `/cadastro/especialista` e `/criar-leilao`.

### Limite de 5MB no upload de foto

`src/lib/validators.ts::isValidAvatarSize()` (constante `MAX_AVATAR_BYTES =
5 * 1024 * 1024`) — checado nas 3 telas que fazem upload de avatar
(`perfil.tsx`, e as duas variantes de `cadastro.especialista.tsx`) antes de
sequer começar o upload, mostrando um erro específico ("A foto deve ter no
máximo 5MB.") em vez de gastar banda com um arquivo que seria rejeitado.
Também reforçado dentro de `uploadAvatar()` em `store.ts` como segunda linha
de defesa, para qualquer chamador futuro que esqueça a checagem na tela. O
bucket do Storage em si não tem limite de tamanho configurado — este
controle é só client-side.

### Duas partes do pedido original que **não** foram implementadas como pedido

- **"Rejeitar caracteres como `'`, `--`, `;` em campos de texto livre"**:
  não implementado. SQL injection não se aplica a este projeto — todo
  acesso a dado passa por `supabase-js`/PostgREST, que já usa queries
  parametrizadas (confirmado por grep em `src/` e `supabase/functions/`,
  nenhuma SQL concatenada em lugar nenhum). Bloquear esses caracteres
  quebraria texto legítimo (nomes como "O'Brien", bios com "segunda-feira --
  horário especial", etc.) sem adicionar proteção real — seria só um falso
  senso de segurança. Confirmado com o usuário antes de pular esta parte.
- **Subresource Integrity no script do Mercado Pago**
  (`https://sdk.mercadopago.com/js/v2`, em `src/routes/cartao.tsx`): não
  implementado. SRI exige que o hash bata exatamente com os bytes do
  arquivo servido; essa URL não é versionada — o Mercado Pago pode
  atualizar o conteúdo a qualquer momento sem aviso, e um hash fixo faria o
  SDK parar de carregar (quebrando o fluxo de pagamento) assim que isso
  acontecesse. Não tenho como calcular o hash real de um arquivo que muda
  sem versão fixa, então inventar um valor seria pior que não ter SRI
  nenhum. Se o Mercado Pago algum dia expuser uma URL versionada/imutável
  para o SDK, SRI passa a fazer sentido ali. Confirmado com o usuário antes
  de pular esta parte.

## 7. O que ainda precisa de ação manual

- [ ] **Rodar `supabase db push --linked`** para aplicar as migrations
      novas: `20260725150000_backfill_usuario_id_especialistas.sql`,
      `20260725160000_fix_especialistas_rls.sql`,
      `20260725170000_security_audit_rls_hardening.sql`,
      `20260727100000_add_audit_logs.sql`,
      `20260727110000_add_rate_limits.sql`.
- [ ] **Apagar o registro de teste** criado durante o diagnóstico do bug de
      INSERT: `delete from public.especialistas where id = '6e307f8f-bfed-4197-8e56-251ab1792a9a';`
- [ ] **Confirmar `PROCESSAR_INADIMPLENCIA_SECRET`** está configurada
      (`supabase secrets set ...`) e que o header hardcoded na migration do
      cron não é mais o placeholder — senão o cron para de funcionar depois
      do fix do fail-open.
- [ ] **Descobrir qual deploy está realmente em produção** (Cloudflare via
      wrangler, Netlify ou Vercel) e desativar os outros dois.
- [ ] **Configurar WAF / Rate Limiting Rules no Cloudflare** (ou equivalente
      no provedor real) — o rate limit em memória das Edge Functions é só
      uma primeira barreira, não substitui proteção na borda.
- [ ] ~~Considerar um rate limit distribuído de verdade~~ — feito para
      `trust-engine`/`send-auth-email`/`dar-lance`/`salvar-cartao` (tabela
      `rate_limits` + `check_rate_limit()`, ver seção 6). `cancelar-leilao` e
      `processar-inadimplencia` ainda usam o limitador em memória — migrar
      também se fizer sentido.
- [ ] **`rate_limits` não tem limpeza automática** — a tabela só cresce (uma
      linha por chave `função:IP` já vista). Para tráfego alto, considere um
      job periódico (`pg_cron`) apagando linhas com `window_start` antigo, ou
      um índice/rotina de limpeza.
- [ ] **Rodar `supabase db diff` periodicamente** para pegar drift entre o
      que está commitado e o que está de fato no banco — a própria auditoria
      encontrou uma policy que já tinha divergido silenciosamente.
- [ ] **Revisar se algum especialista reprovado teve o motivo exposto**
      enquanto `admin_notifications` estava sem RLS (a tabela está vazia no
      momento desta auditoria, mas pode ter tido dados antes).
- [ ] Avaliar migrar a CSP de `'unsafe-inline'` para nonces/hashes.
- [ ] Padronizar o prefixo de upload de avatar (`user/<id>/...` vs
      `specialist/...`) por consistência (não é falha de segurança após o
      fix do owner_id, só organização).
- [ ] **Adicionar paginação em "Logs de Auditoria"** (`/admin`) se o volume
      de ações passar dos 200 registros hoje buscados de uma vez.
- [ ] Pentest/revisão de segurança externa antes de qualquer lançamento
      maior — esta auditoria foi feita por leitura de código e testes
      pontuais via API, não substitui uma revisão profissional completa.
