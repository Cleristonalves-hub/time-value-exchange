-- Achado por teste manual: um insert em public.especialistas sem nenhuma
-- sessão autenticada (só a chave anon) foi aceito com sucesso (HTTP 201),
-- embora a política "auth_insert" original exija `to authenticated with
-- check (auth.uid() is not null)`. Isso indica que a política de INSERT
-- realmente ativa no banco divergiu da definida aqui no repositório
-- (provavelmente alterada direto pelo Supabase Studio, sem migration).
--
-- Em vez de tentar adivinhar o nome da política divergente, remove
-- dinamicamente QUALQUER política de INSERT existente na tabela e recria só
-- a versão correta, restrita a usuários autenticados.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'especialistas'
      and cmd = 'INSERT'
  loop
    execute format('drop policy %I on public.especialistas', pol.policyname);
  end loop;
end $$;

create policy "auth_insert" on public.especialistas
  for insert to authenticated
  with check (auth.uid() is not null);
