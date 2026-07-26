-- Campos de redes sociais no cadastro de especialista, todos opcionais
-- (linkedin_url já existia e continua sendo o único obrigatório, validado
-- na aplicação — não há constraint not null aqui porque o campo já existia
-- assim antes desta migration).
alter table public.especialistas
  add column if not exists instagram text,
  add column if not exists twitter text,
  add column if not exists tiktok text,
  add column if not exists youtube text;
