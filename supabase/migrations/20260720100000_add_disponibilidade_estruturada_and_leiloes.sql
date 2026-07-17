-- 1) Disponibilidade estruturada no cadastro de especialista, substituindo o
-- antigo campo de texto livre `disponibilidade_semanal` (mantido na tabela,
-- mas não é mais escrito/lido pelo app a partir de agora).
alter table public.especialistas
  add column if not exists dias_disponibilidade text[],
  add column if not exists horario_inicio text,
  add column if not exists horario_fim text;

-- 2) Tabela de leilões criados pelos especialistas.
create table if not exists public.leiloes (
  id uuid primary key default gen_random_uuid(),
  especialista_id uuid not null references public.especialistas (id) on delete cascade,
  titulo text not null,
  descricao text,
  lance_minimo numeric not null,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  status text not null default 'ativo',
  created_at timestamptz not null default now()
);

create index if not exists leiloes_especialista_id_idx on public.leiloes (especialista_id);

alter table public.leiloes enable row level security;

-- Leitura pública (leilões aparecem para qualquer visitante, como os especialistas).
create policy "Leiloes sao publicos para leitura"
  on public.leiloes for select
  using (true);

-- Só usuários autenticados podem publicar. Isso não valida ainda que o
-- especialista_id pertence ao usuário logado — se quiser essa checagem mais
-- rígida via RLS, precisa confirmar como usuario_id/especialistas se relacionam
-- com auth.uid() neste projeto.
create policy "Usuarios autenticados podem criar leiloes"
  on public.leiloes for insert
  to authenticated
  with check (true);
