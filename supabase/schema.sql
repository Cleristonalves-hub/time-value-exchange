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

do $$ begin
  create type public.app_role as enum ('admin','moderator','user');
exception when duplicate_object then null; end $$;

-- ---------- TABELAS ----------
create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique,
  avatar_url text,
  tipo public.usuario_tipo not null default 'cliente',
  created_at timestamptz not null default now()
);
alter table public.usuarios add column if not exists avatar_url text;

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
  avatar_url text,
  status public.especialista_status not null default 'novo',
  created_at timestamptz not null default now()
);
alter table public.especialistas add column if not exists avatar_url text;


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
  especialista_ref text,
  usuario_id uuid references public.usuarios(id) on delete set null,
  estrelas int not null check (estrelas between 1 and 5),
  comentario text,
  created_at timestamptz not null default now()
);

create table if not exists public.denuncias (
  id uuid primary key default gen_random_uuid(),
  especialista_id uuid references public.especialistas(id) on delete set null,
  alvo_nome text,
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

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

-- ---------- GRANTS ----------
grant select, insert, update, delete on public.usuarios      to anon, authenticated;
grant select, insert, update, delete on public.especialistas to anon, authenticated;
grant select, insert, update, delete on public.leiloes       to anon, authenticated;
grant select, insert, update, delete on public.lances        to anon, authenticated;
grant select, insert, update, delete on public.avaliacoes    to anon, authenticated;
grant select, insert, update, delete on public.denuncias     to anon, authenticated;
grant select, insert, update, delete on public.feedbacks     to anon, authenticated;
grant select on public.user_roles to authenticated;

grant all on public.usuarios      to service_role;
grant all on public.especialistas to service_role;
grant all on public.leiloes       to service_role;
grant all on public.lances        to service_role;
grant all on public.avaliacoes    to service_role;
grant all on public.denuncias     to service_role;
grant all on public.feedbacks     to service_role;
grant all on public.user_roles    to service_role;

-- ---------- has_role (security definer, evita recursão RLS) ----------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ---------- RLS ----------
alter table public.usuarios      enable row level security;
alter table public.especialistas enable row level security;
alter table public.leiloes       enable row level security;
alter table public.lances        enable row level security;
alter table public.avaliacoes    enable row level security;
alter table public.denuncias     enable row level security;
alter table public.feedbacks     enable row level security;
alter table public.user_roles    enable row level security;

-- Limpa policies legadas
do $$
declare t text;
begin
  foreach t in array array['usuarios','especialistas','leiloes','lances','avaliacoes','denuncias','feedbacks','user_roles']
  loop
    execute format('drop policy if exists "public_read"   on public.%I', t);
    execute format('drop policy if exists "public_insert" on public.%I', t);
    execute format('drop policy if exists "public_update" on public.%I', t);
    execute format('drop policy if exists "read_all"      on public.%I', t);
    execute format('drop policy if exists "auth_insert"   on public.%I', t);
    execute format('drop policy if exists "admin_read"    on public.%I', t);
    execute format('drop policy if exists "admin_update"  on public.%I', t);
    execute format('drop policy if exists "self_update"   on public.%I', t);
    execute format('drop policy if exists "self_insert"   on public.%I', t);
    execute format('drop policy if exists "any_insert"    on public.%I', t);
    execute format('drop policy if exists "own_roles_read" on public.%I', t);
  end loop;
end $$;

-- LEITURA pública: qualquer visitante navega especialistas, leilões, lances e avaliações
create policy "read_all" on public.especialistas for select using (true);
create policy "read_all" on public.leiloes       for select using (true);
create policy "read_all" on public.lances        for select using (true);
create policy "read_all" on public.avaliacoes    for select using (true);

-- ESCRITA exige autenticação
create policy "auth_insert" on public.especialistas
  for insert to authenticated with check (auth.uid() is not null);
create policy "auth_insert" on public.lances
  for insert to authenticated with check (auth.uid() is not null);
create policy "auth_insert" on public.denuncias
  for insert to authenticated with check (auth.uid() is not null);
create policy "auth_insert" on public.avaliacoes
  for insert to authenticated with check (auth.uid() is not null);
create policy "auth_insert" on public.leiloes
  for insert to authenticated with check (auth.uid() is not null);

-- Feedback: qualquer um pode enviar; só admin lê
create policy "any_insert" on public.feedbacks for insert with check (true);
create policy "admin_read" on public.feedbacks
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Denúncias: só admin lê
create policy "admin_read" on public.denuncias
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Usuários: dono lê/edita o próprio; admin lê todos
create policy "admin_read" on public.usuarios
  for select to authenticated using (public.has_role(auth.uid(), 'admin') or id = auth.uid());
create policy "self_insert" on public.usuarios
  for insert to authenticated with check (id = auth.uid());
create policy "self_update" on public.usuarios
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Só admin aprova/suspende especialistas e edita leilões
create policy "admin_update" on public.especialistas
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_update" on public.leiloes
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- user_roles: usuário lê os próprios; ninguém escreve pelo cliente (use service_role)
create policy "own_roles_read" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

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

-- ---------- AUTH: cria linha em usuarios ao criar conta ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, nome, email, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email,
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =====================================================================
-- Para promover um usuário a admin, rode manualmente:
--   insert into public.user_roles (user_id, role)
--   values ('<uuid-do-usuario>', 'admin');
-- =====================================================================

-- =====================================================================
-- STORAGE: bucket público "avatars" para fotos de perfil
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_auth_upload" on storage.objects;
drop policy if exists "avatars_auth_update" on storage.objects;
drop policy if exists "avatars_auth_delete" on storage.objects;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_auth_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars');

create policy "avatars_auth_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars');

create policy "avatars_auth_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars');
