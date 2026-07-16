// Script de teste manual do Trust Engine.
//
// Insere um especialista de teste na tabela `especialistas` (com o anon key, como
// faria o formulário público de cadastro), aguarda 10s para o Database Webhook
// acionar a Edge Function `trust-engine`, e então consulta o registro de novo para
// ver se o campo `status` foi atualizado para "verificado" ou "reprovado".
//
// Uso:
//   npm run test:trust-engine
//   (ou: bunx tsx scripts/test-trust-engine.ts)
//
// Observação: como usamos o anon key, a inserção e a leitura só funcionam se as
// políticas de RLS da tabela `especialistas` permitirem INSERT/SELECT públicos —
// o mesmo que precisa valer para o formulário de cadastro real funcionar.
//
// Este script NÃO apaga a linha de teste ao final (o anon key normalmente não tem
// permissão de DELETE via RLS). Tenta uma limpeza best-effort e avisa se não conseguir.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sapuvozigtbxowuzwgqq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_L9nd4PGSeqbOFTr7QsUTgg_AKskD3kR";

const ESPERA_MS = 10_000;

const ESPECIALISTA_TESTE = {
  nome: "Dr. João Silva Teste",
  email: "teste@valore.services",
  nicho: "Saúde",
  linkedin_url: "https://www.linkedin.com/in/joaosilva",
  registro_profissional: "CRM-RJ 123456",
  status: "novo",
};

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log("Inserindo especialista de teste em `especialistas`...");
  console.log(ESPECIALISTA_TESTE);

  const { data: inserido, error: erroInsercao } = await supabase
    .from("especialistas")
    .insert(ESPECIALISTA_TESTE)
    .select("id, status")
    .single();

  if (erroInsercao || !inserido) {
    console.error("\n❌ Falha ao inserir especialista de teste.");
    console.error(erroInsercao?.message ?? "insert não retornou dados");
    console.error(
      "Dica: se o erro mencionar RLS/permission denied, o anon key não tem policy de INSERT nessa tabela.",
    );
    process.exit(1);
  }

  console.log(`\n✅ Inserido com sucesso. id=${inserido.id} status inicial="${inserido.status}"`);
  console.log(`Aguardando ${ESPERA_MS / 1000}s para o Trust Engine processar via Database Webhook...`);
  await aguardar(ESPERA_MS);

  const { data: atualizado, error: erroConsulta } = await supabase
    .from("especialistas")
    .select("id, status")
    .eq("id", inserido.id)
    .single();

  if (erroConsulta || !atualizado) {
    console.error("\n❌ Falha ao consultar o especialista após a espera.");
    console.error(erroConsulta?.message ?? "select não retornou dados");
    process.exit(1);
  }

  console.log("\n--- Resultado ---");
  console.log(`ID:     ${atualizado.id}`);
  console.log(`Status: ${atualizado.status}`);

  if (atualizado.status === "verificado" || atualizado.status === "reprovado") {
    console.log(`\n✅ Trust Engine processou o cadastro (status final: "${atualizado.status}").`);
    if (atualizado.status === "reprovado") {
      console.log(
        "Nota: reprovado é um resultado plausível para este LinkedIn/CRM fictício — não indica necessariamente um bug.",
      );
    }
  } else {
    console.log(
      `\n⚠️  Status ainda é "${atualizado.status}" — o webhook pode não estar configurado, ou a função ainda está processando. Confira em Database > Webhooks e nos logs da função trust-engine.`,
    );
  }

  // Limpeza best-effort — normalmente falha silenciosamente se o anon key não tiver DELETE.
  const { error: erroLimpeza } = await supabase.from("especialistas").delete().eq("id", inserido.id);
  if (erroLimpeza) {
    console.log(
      `\nℹ️  Não foi possível apagar a linha de teste automaticamente (${erroLimpeza.message}). Remova manualmente se necessário, id=${inserido.id}.`,
    );
  } else {
    console.log("\n🧹 Linha de teste removida.");
  }
}

main().catch((err) => {
  console.error("Erro inesperado:", err);
  process.exit(1);
});
