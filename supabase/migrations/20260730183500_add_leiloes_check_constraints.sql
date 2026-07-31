-- BUG encontrado ao aplicar esta migration: "column leiloes.data_inicio does
-- not exist". Causa raiz: supabase/schema.sql (o baseline aplicado primeiro no
-- projeto) já criava public.leiloes SEM a coluna data_inicio. A migration
-- 20260720100000_add_disponibilidade_estruturada_and_leiloes.sql tentava
-- adicioná-la via `create table if not exists public.leiloes (..., data_inicio
-- timestamptz not null, ...)` — mas como a tabela já existia (criada pelo
-- schema.sql), o `IF NOT EXISTS` faz o CREATE TABLE inteiro virar no-op, e
-- data_inicio nunca foi de fato criada. Migrations posteriores que só usavam
-- `alter table ... add column if not exists` (vencedor_usuario_id,
-- destaque_ate, etc.) funcionaram normalmente — só data_inicio ficou de fora
-- por ter sido declarada apenas dentro de um CREATE TABLE. Confirmado direto
-- na tabela ao vivo via PostgREST: data_fim existe, data_inicio não.
--
-- Corrigido abaixo com um ALTER TABLE ADD COLUMN IF NOT EXISTS dedicado (que
-- não sofre do mesmo problema, independentemente de a tabela já existir).
-- A tabela está vazia hoje (confirmado), então dá para adicionar como NOT NULL
-- direto; ainda assim, o backfill abaixo é uma rede de segurança caso alguma
-- linha apareça entre a checagem e a aplicação desta migration.
alter table public.leiloes
  add column if not exists data_inicio timestamptz;

update public.leiloes
  set data_inicio = created_at
  where data_inicio is null;

alter table public.leiloes
  alter column data_inicio set not null;

-- Defesa em profundidade: até agora nada no banco impedia um leilão com
-- lance_minimo = 0 ou com data_fim <= data_inicio — a única validação era em
-- código de aplicação (criar-leilao.tsx / editar-leilao). Estas constraints
-- barram esses dois casos mesmo que um bug futuro em alguma tela pule a
-- validação da aplicação.
--
-- NOT VALID: não revalida linhas já existentes (podem já ter lance_minimo = 0
-- de antes desta migration) — só passa a valer para novos inserts/updates a
-- partir de agora. Sem isso, a migration falharia caso já exista alguma linha
-- violando a regra.
alter table public.leiloes
  add constraint leiloes_lance_minimo_positivo check (lance_minimo > 0) not valid;

alter table public.leiloes
  add constraint leiloes_data_fim_apos_inicio check (data_fim > data_inicio) not valid;
