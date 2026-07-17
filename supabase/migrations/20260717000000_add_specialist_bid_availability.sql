-- Adiciona valor mínimo do lance e disponibilidade semanal ao cadastro de especialista
alter table public.especialistas add column if not exists lance_minimo text;
alter table public.especialistas add column if not exists disponibilidade_semanal text;
