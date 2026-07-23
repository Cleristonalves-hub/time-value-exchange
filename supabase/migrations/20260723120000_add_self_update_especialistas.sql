-- BUG: a única política de UPDATE em public.especialistas era "admin_update"
-- (restrita a admins). Não existia nenhuma política permitindo que o próprio
-- especialista atualizasse seu cadastro — toda tentativa de edição feita pelo
-- especialista (via /cadastro/especialista em modo de edição) era
-- silenciosamente bloqueada pelo RLS, então nenhuma alteração era persistida.
--
-- Esta política permite que o dono do cadastro (usuario_id = auth.uid())
-- atualize seu próprio registro. Segue o mesmo padrão de "self_update" já
-- usado em public.usuarios.
create policy "self_update" on public.especialistas
  for update to authenticated
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());
