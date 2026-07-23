-- Adiciona cidade/estado ao cadastro de cliente (usuarios) e estado ao
-- cadastro de especialista (especialistas já tinha cidade) — usados no
-- formulário de cadastro (campo de localização dividido em Cidade + Estado)
-- e na edição de perfil do cliente.
alter table public.usuarios
  add column if not exists cidade text,
  add column if not exists estado text;

alter table public.especialistas
  add column if not exists estado text;
