-- Achados da auditoria de segurança (RLS):
--
-- 1) public.admin_notifications nunca teve RLS habilitada desde sua criação
--    (20260715120000_create_admin_notifications.sql) — confirmado ao vivo:
--    um select via chave anon, sem sessão, retornou HTTP 200 (a tabela
--    simplesmente não tinha RLS bloqueando nada). Guarda motivo de reprovação
--    de especialistas — dado interno que não deveria ser público.
--
-- 2) public.usuarios e public.especialistas nunca tiveram política de DELETE.
--    Isso quebra silenciosamente a funcionalidade já existente de "excluir
--    minha conta" (deleteMyAccount em src/lib/store.ts faz
--    `.from("especialistas").delete()...` e `.from("usuarios").delete()...`
--    direto do client) — sem policy, o RLS filtra tudo e o delete afeta 0
--    linhas, mas não gera erro, então o app mostra sucesso sem apagar nada.
--
-- 3) public.leiloes: a política de INSERT ("Usuarios autenticados podem
--    criar leiloes", em 20260720100000) usa `with check (true)` — o próprio
--    comentário da migration já registrava isso como pendente: "não valida
--    que o especialista_id pertence ao usuário logado". Qualquer usuário
--    autenticado podia criar um leilão em nome de QUALQUER especialista_id.
--    Isso só pode ser corrigido agora porque especialistas.usuario_id passou
--    a ser preenchido corretamente numa correção anterior desta sessão.
--
-- 4) public.lances: a policy antiga da schema.sql base ("auth_insert",
--    `check (auth.uid() is not null)`) continuou coexistindo com a policy
--    mais estrita criada depois em 20260723090000 ("Usuarios autenticados
--    podem dar lance", `check (usuario_id = auth.uid())`). Como o Postgres
--    faz OR entre políticas permissivas do mesmo comando, a mais fraca
--    ainda vale — um usuário autenticado podia inserir um lance atribuído a
--    OUTRO usuario_id. Removida a policy antiga.
--
-- 5) storage.objects (bucket avatars): as policies de UPDATE/DELETE só
--    checavam `bucket_id = 'avatars'`, sem checar dono — qualquer usuário
--    autenticado podia sobrescrever ou apagar a foto de perfil de QUALQUER
--    outro usuário. Restrito ao dono do objeto (owner_id).
--
-- Não alteradas (avaliadas e mantidas de propósito): as políticas de INSERT
-- de public.denuncias e public.avaliacoes continuam exigindo só
-- `auth.uid() is not null` (sem checar usuario_id) porque addReport/addReview
-- em src/lib/store.ts nunca preenchem usuario_id — são submissões anônimas
-- por design hoje. Apertar essa policy quebraria a funcionalidade atual.
-- public.feedbacks continua com insert 100% público (`any_insert`) de
-- propósito — é o formulário de contato, pensado para visitantes sem conta.

-- ---------- 1) admin_notifications: habilita RLS + leitura restrita ----------
alter table public.admin_notifications enable row level security;

create policy "admin_read" on public.admin_notifications
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- O próprio especialista pode ler os motivos da sua reprovação (usado em
-- useRejectionReasons / tela de perfil).
create policy "self_read" on public.admin_notifications
  for select to authenticated
  using (
    especialista_id in (
      select id from public.especialistas where usuario_id = auth.uid()
    )
  );

-- ---------- 2) self_delete para usuarios e especialistas ----------
create policy "self_delete" on public.usuarios
  for delete to authenticated
  using (id = auth.uid());

create policy "self_delete" on public.especialistas
  for delete to authenticated
  using (usuario_id = auth.uid());

-- ---------- 3) leiloes: aperta INSERT para exigir dono do especialista_id ----------
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'leiloes' and cmd = 'INSERT'
  loop
    execute format('drop policy %I on public.leiloes', pol.policyname);
  end loop;
end $$;

create policy "own_especialista_insert" on public.leiloes
  for insert to authenticated
  with check (
    especialista_id in (
      select id from public.especialistas where usuario_id = auth.uid()
    )
  );

-- ---------- 4) lances: remove a policy de INSERT antiga e mais fraca ----------
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'lances' and cmd = 'INSERT'
  loop
    execute format('drop policy %I on public.lances', pol.policyname);
  end loop;
end $$;

create policy "own_usuario_insert" on public.lances
  for insert to authenticated
  with check (usuario_id = auth.uid());

-- ---------- 5) storage.objects (avatars): restringe update/delete ao dono ----------
-- Checa owner_id (text, coluna atual) e owner (uuid, legado) com OR — cobre
-- qualquer versão do Storage sem depender de qual das duas está populada.
drop policy if exists "avatars_auth_update" on storage.objects;
create policy "avatars_auth_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (owner_id = (auth.uid())::text or owner = auth.uid()));

drop policy if exists "avatars_auth_delete" on storage.objects;
create policy "avatars_auth_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (owner_id = (auth.uid())::text or owner = auth.uid()));
