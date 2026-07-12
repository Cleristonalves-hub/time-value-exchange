# Integração Supabase — Valore

Você forneceu credenciais de um projeto Supabase externo (`sapuvozigtbxowuzwgqq`). Vou usar essas credenciais em vez de ativar o Lovable Cloud, já que você quer conectar ao seu próprio projeto.

> **Importante:** para criar tabelas e políticas RLS eu preciso da **service_role key** (ou que você rode o SQL no painel do Supabase). A anon key sozinha não permite `CREATE TABLE`. Vou entregar o SQL completo pronto para colar no SQL Editor do Supabase e todo o código do app já apontando para essas tabelas.

---

## 1. Client Supabase

- Novo `src/integrations/supabase/client.ts` usando `@supabase/supabase-js` com URL e anon key fornecidas (hardcoded — anon é pública).
- Instalar `@supabase/supabase-js` via `bun add`.

## 2. Schema SQL (para você rodar no SQL Editor)

Gero `supabase/schema.sql` com:

- **usuarios** (`id uuid PK default gen_random_uuid()`, `nome`, `email unique`, `tipo` enum `cliente|especialista`, `created_at`)
- **especialistas** (`id`, `usuario_id fk`, `nome`, `email`, `nicho`, `bio`, `linkedin_url`, `registro_profissional`, `status` enum `novo|verificado|suspenso|reprovado`, `created_at`)
- **leiloes** (`id`, `especialista_id fk`, `titulo`, `descricao`, `lance_atual numeric`, `lance_minimo numeric`, `data_fim timestamptz`, `status`, `created_at`)
- **lances** (`id`, `leilao_id fk`, `usuario_id fk`, `valor numeric`, `created_at`)
- **avaliacoes** (`id`, `especialista_id fk`, `usuario_id fk`, `estrelas int check 1..5`, `comentario`, `created_at`)
- **denuncias** (`id`, `especialista_id fk`, `usuario_id fk`, `motivo`, `created_at`)

Para cada tabela: `GRANT` para `anon`/`authenticated`/`service_role`, `ENABLE ROW LEVEL SECURITY`, políticas permissivas iniciais (SELECT público em especialistas verificados/novos, INSERT público em lances/avaliações/denúncias/cadastros — sem Supabase Auth ainda, tudo roda como `anon`).

Trigger `after insert on avaliacoes`: se ≥3 notas ≤2 para o mesmo especialista, `update especialistas set status='suspenso'`.

## 3. Substituir o store por Supabase

Reescrever `src/lib/store.ts` como wrapper de queries Supabase + React Query:
- `useSpecialists()`, `useReports()`, `useReviews()`, `useFeedbacks()`, `useAuctions()` → `useQuery` contra Supabase.
- `addSpecialist`, `addReport`, `addReview`, `addFeedback`, `addBid`, `setSpecialistStatus` → `insert/update` no Supabase + invalidar cache.
- Manter as constantes `DISCLAIMER`, `REGULATED_NICHES`, `registrationLabel`.

## 4. Migração de dados do localStorage

Novo componente `LocalStorageMigrator` montado no `__root.tsx`:
- No primeiro load, se existir `valore:v1` no localStorage e ainda não foi migrado, faz `insert` em lote para cada coleção e grava flag `valore:migrated=1`.
- Mostra toast discreto "Dados sincronizados com a nuvem".

## 5. Ajustes de UI

- `cadastro.especialista.tsx`, `avaliar.$id.tsx`, `feedback.tsx`, `admin.tsx`, `explorar.tsx`, `leilao.$id.tsx`, `ReportDialog.tsx` continuam usando as mesmas funções exportadas do `store.ts` — a API pública não muda, só a implementação.
- Leilões passam a vir do Supabase (a tabela `leiloes` começa vazia; os mocks em `src/lib/auctions.ts` viram seed opcional no SQL).

## 6. Admin

- `/admin` continua com senha `valore@admin2026` em sessionStorage.
- Como estamos com anon key, todas as ações do admin rodam com as mesmas policies públicas (UPDATE em `especialistas.status` liberado). Não é seguro de verdade — deixo comentário no código explicando que auth real exige Supabase Auth + coluna de admin.

---

## O que você precisa fazer depois de eu terminar

1. Abrir o SQL Editor do projeto Supabase.
2. Colar o conteúdo de `supabase/schema.sql` e executar.
3. Recarregar o app — a migração do localStorage roda automaticamente.

## Arquivos afetados

- **Novos:** `src/integrations/supabase/client.ts`, `supabase/schema.sql`, `src/components/LocalStorageMigrator.tsx`
- **Editados:** `src/lib/store.ts` (reescrito), `src/routes/__root.tsx`, `package.json` (add `@supabase/supabase-js`)

## O que **não** faço nesta versão (a menos que peça)

- Ativar Supabase Auth (login com email/senha ou Google). Hoje todos os inserts rodam como `anon` — qualquer visitante consegue cadastrar, dar lance, avaliar e denunciar sem se autenticar.
- Envio real de email para `contato@valore.services` (continua `mailto:` client-side).
- Realtime (updates ao vivo em leilões via Supabase Realtime) — dá para adicionar depois.