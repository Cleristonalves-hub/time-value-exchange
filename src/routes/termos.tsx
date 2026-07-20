import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Valore" },
      { name: "description", content: "Termos de Uso da Valore. Regras e condições para uso da plataforma de leilão de tempo humano." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <FileText className="size-5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Legal</span>
        </div>

        <h1 className="mt-8 font-display text-4xl text-foreground">
          Termos de <span className="text-gradient-gold">Uso</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Última atualização: 8 de junho de 2026
        </p>

        <div className="mt-10 space-y-10">
          <Section title="1. Aceitação dos Termos">
            Ao acessar, navegar ou utilizar a Valore, você concorda em cumprir integralmente estes Termos de Uso, nossa Política de Privacidade e o Código de Conduta da comunidade. Se não concordar com qualquer parte destes termos, não utilize a plataforma.
          </Section>

          <Section title="2. Definições">
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li><strong className="text-foreground">Plataforma:</strong> o site e os serviços da Valore.</li>
              <li><strong className="text-foreground">Especialista:</strong> profissional cadastrado que disponibiliza seu tempo em leilão.</li>
              <li><strong className="text-foreground">Cliente:</strong> usuário que dá lances para agendar sessões com especialistas.</li>
              <li><strong className="text-foreground">Leilão:</strong> processo de oferta pública de tempo humano conduzido na plataforma.</li>
              <li><strong className="text-foreground">Sessão:</strong> encontro virtual de 30 a 120 minutos entre cliente e especialista, realizado por videochamada.</li>
            </ul>
          </Section>

          <Section title="3. Cadastro e Conta">
            Você deve fornecer informações verdadeiras, completas e atualizadas. É proibido criar contas em nome de terceiros sem autorização expressa. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta. A Valore se reserva o direito de suspender ou encerrar contas que violem estes termos.
          </Section>

          <Section title="4. Funcionamento dos Leilões">
            Os leilões na Valore operam em regime de oferta ascendente. O cliente com o lance mais alto no encerramento do leilão ganha o direito de agendar uma sessão com o especialista. O valor mínimo de lance é definido pelo especialista. A plataforma cobra uma comissão de 20% sobre o valor final do lance vencedor. O pagamento é processado no momento da confirmação da vitória.
          </Section>

          <Section title="5. Sessões e Cancelamentos">
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li>O vencedor deve agendar a sessão em até 7 dias após o encerramento do leilão.</li>
              <li>Cancelamentos feitos pelo cliente com mais de 24h de antecedência garantem reembolso integral.</li>
              <li>Cancelamentos com menos de 24h ou não-comparecimento do cliente resultam na retenção total do valor pago.</li>
              <li>Não-comparecimento do especialista sem comunicação prévia acarreta suspensão imediata da conta e reembolso integral ao cliente.</li>
            </ul>
          </Section>

          <Section title="5.1 Inadimplência do Cliente Vencedor">
            A Valore não garante o pagamento pelo cliente vencedor. Em caso de inadimplência, tomaremos
            as medidas de cobrança disponíveis e notificaremos o especialista imediatamente. Em caso de
            não resolução em 48h, o leilão será reagendado gratuitamente com destaque na plataforma por
            7 dias.
          </Section>

          <Section title="6. Comissão da Plataforma">
            A Valore retém 20% do valor bruto de cada lance vencedor como comissão de intermediação. O especialista recebe 80% líquido, sujeito às regras fiscais aplicáveis. Saque dos valores disponíveis pode ser solicitado a qualquer momento, com prazo de processamento de até 5 dias úteis.
          </Section>

          <Section title="7. Conduta do Usuário">
            Todos os usuários devem tratar uns aos outros com respeito e cordialidade. É estritamente proibido:
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li>Comportamento ofensivo, discriminatório ou assédio de qualquer natureza;</li>
              <li>Divulgação de conteúdo ilegal, obsceno ou que viole direitos autorais;</li>
              <li>Tentativas de fraude, manipulação de lances ou uso de bots;</li>
              <li>Compartilhamento de dados de contato fora da plataforma antes do pagamento;</li>
              <li>Gravação de sessões sem consentimento expresso de ambas as partes.</li>
            </ul>
          </Section>

          <Section title="8. Sistema de Reputação e Sanções">
            A Valore monitora a conduta dos usuários por meio de avaliações e denúncias. O sistema de sanções é escalonado:
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li><strong className="text-foreground">1ª infração:</strong> advertência pública no perfil.</li>
              <li><strong className="text-foreground">2ª infração:</strong> suspensão temporária de 30 dias.</li>
              <li><strong className="text-foreground">3ª infração:</strong> banimento permanente da plataforma, sem direito a reembolso de valores pendentes.</li>
            </ul>
          </Section>

          <Section title="9. Propriedade Intelectual">
            Todo o conteúdo da plataforma — logos, design, código, textos e marcas — é de propriedade exclusiva da Valore ou de seus licenciadores. Você não pode copiar, modificar, distribuir ou criar obras derivadas sem autorização prévia e por escrito.
          </Section>

          <Section title="10. Limitação de Responsabilidade">
            A Valore atua como intermediadora entre clientes e especialistas. Não nos responsabilizamos pela qualidade do conteúdo das sessões, nem pelos resultados profissionais obtidos pelo cliente. Nosso limite de responsabilidade está restrito ao valor da comissão recebida em relação à transação disputada.
          </Section>

          <Section title="11. Rescisão">
            Podemos suspender ou encerrar seu acesso à plataforma a qualquer momento, com ou sem aviso prévio, em caso de violação destes termos ou por decisão estratégica da empresa. Você pode encerrar sua conta a qualquer momento, mediante solicitação por e-mail.
          </Section>

          <Section title="12. Disposições Gerais">
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca da Capital do Estado do Rio de Janeiro para resolver quaisquer controvérsias. A tolerância de qualquer violação não constituirá renúncia ao direito de exigir o cumprimento futuro.
          </Section>

          <Section title="13. Contato">
            Para dúvidas sobre estes Termos de Uso, entre em contato:
            <p className="mt-3 text-sm text-foreground/80">
              E-mail: <span className="text-gold">legal@valore.app</span><br />
              Endereço: Av. Rio Branco, 1 — Centro, Rio de Janeiro — RJ, 20090-003
            </p>
          </Section>
        </div>

        <div className="mt-16 flex items-center gap-4 border-t border-border pt-8">
          <Link to="/privacidade" className="text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
            Política de Privacidade
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <Link to="/" className="text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground/70">
        {children}
      </div>
    </section>
  );
}
