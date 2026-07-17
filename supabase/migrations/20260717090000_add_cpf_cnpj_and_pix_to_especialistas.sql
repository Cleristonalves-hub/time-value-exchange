-- Campos novos do formulário de cadastro de especialista: documento (CPF/CNPJ)
-- na etapa 1 e chave PIX (para repasse dos ganhos) na etapa 4.
alter table public.especialistas
  add column if not exists cpf_cnpj text,
  add column if not exists chave_pix text;
