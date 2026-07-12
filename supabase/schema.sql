-- =====================================================================
-- Valore — Schema Supabase
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
do $$ begin
  create type public.especialista_status as enum ('novo','verificado','suspenso','reprovado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.usuario_tipo as enum ('cliente','especialista');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.feedback_tipo as enum ('sugestao','reclamacao');
exception when duplicate_object then null; end $$;

-- ---------- TABELAS ----------

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique,
  tipo public.usuario_tipo not null default 'cliente',
  created_at timestamptz not null default now()
);

create table if not exists public.especialistas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  nome text not null,
  email text,
  telefone text,
  cidade text,
  nicho text,
  especialidade text,
  bio text,
  credencial text,
  experiencia text,
  plataforma text,
  duracao text,
  idiomas text,
  linkedin_url text,
  registro_profissional text,
  status public.especialista_status not null default 'novo',
  created_at timestamptz not null default now()
);

create table if not exists public.leiloes (
  id uuid primary key default gen_random_uuid(),
  especialista_id uuid references public.especialistas(id) on delete cascade,
  titulo text not null,
  descricao text,
  lance_atual numeric(12,2) not null default 0,
  lance_minimo numeric(12,2) not null default 0,
  data_fim timestamptz,
  status text not null default 'ativo',
  created_at timestamptz not null default now()
);

create table if not exists public.lances (
  id uuid primary key default gen_random_uuid(),
  leilao_id uuid references public.leiloes(id) on delete cascade,
  usuario_id uuid references public.usuarios(id) on delete set null,
  valor numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  especialista_id uuid references public.especialistas(id) on delete cascade,
  especialista_ref text,           -- fallback quando o especialista vem de mock (auction.id)
  usuario_id uuid references public.usuarios(id) on delete set null,
  estrelas int not null check (estrelas between 1 and 5),
  comentario text,
  created_at timestamptz not null default now()
);

create table if not exists public.denuncias (
  id uuid primary key default gen_random_uuid(),
  especialista_id uuid references public.especialistas(id) on delete set null,
  alvo_nome text,                  -- nome do denunciado quando não temos uuid
  usuario_id uuid references public.usuarios(id) on delete set null,
  categoria text,
  motivo text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  tipo public.feedback_tipo not null default 'sugestao',
  mensagem text not null,
  created_at timestamptz not null default now()
);

-- ---------- GRANTS ----------
grant select, insert, update, delete on public.usuarios      to anon, authenticated;
grant select, insert, update, delete on public.especialistas to anon, authenticated;
grant select, insert, update, delete on public.leiloes       to anon, authenticated;
grant select, insert, update, delete on public.lances        to anon, authenticated;
grant select, insert, update, delete on public.avaliacoes    to anon, authenticated;
grant select, insert, update, delete on public.denuncias     to anon, authenticated;
grant select, insert, update, delete on public.feedbacks     to anon, authenticated;

grant all on public.usuarios      to service_role;
grant all on public.especialistas to service_role;
grant all on public.leiloes       to service_role;
grant all on public.lances        to service_role;
grant all on public.avaliacoes    to service_role;
grant all on public.denuncias     to service_role;
grant all on public.feedbacks     to service_role;

-- ---------- RLS (permissivo — MVP sem auth) ----------
alter table public.usuarios      enable row level security;
alter table public.especialistas enable row level security;
alter table public.leiloes       enable row level security;
alter table public.lances        enable row level security;
alter table public.avaliacoes    enable row level security;
alter table public.denuncias     enable row level security;
alter table public.feedbacks     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['usuarios','especialistas','leiloes','lances','avaliacoes','denuncias','feedbacks']
  loop
    execute format('drop policy if exists "public_read"   on public.%I', t);
    execute format('drop policy if exists "public_insert" on public.%I', t);
    execute format('drop policy if exists "public_update" on public.%I', t);

    execute format('create policy "public_read"   on public.%I for select using (true)',      t);
    execute format('create policy "public_insert" on public.%I for insert with check (true)', t);
    execute format('create policy "public_update" on public.%I for update using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- TRIGGER: auto-suspensão após 3 avaliações <= 2 ----------
create or replace function public.auto_suspend_specialist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  neg_count int;
begin
  if new.especialista_id is null then return new; end if;

  select count(*) into neg_count
  from public.avaliacoes
  where especialista_id = new.especialista_id
    and estrelas <= 2;

  if neg_count >= 3 then
    update public.especialistas
       set status = 'suspenso'
     where id = new.especialista_id
       and status <> 'suspenso';
  end if;

  return new;
end $$;

drop trigger if exists trg_auto_suspend on public.avaliacoes;
create trigger trg_auto_suspend
after insert on public.avaliacoes
for each row execute function public.auto_suspend_specialist();
