import type { LangCode } from "@/lib/i18n";

export type LegalListItem = { label?: string; text: string };
export type LegalSection = {
  title: string;
  paragraphs?: string[];
  listIntro?: string;
  list?: LegalListItem[];
};
export type LegalDoc = {
  pageLabel: string; // "Legal"
  heading: string; // full heading, e.g. "Termos de Uso"
  headingAccent: string; // the emphasized part rendered in gold
  updated: string;
  sections: LegalSection[];
  otherDocLink: string;
  homeLink: string;
};

const CONTACT_EMAIL = "contato@valore.services";
const RAZAO_SOCIAL = "67.226.051 CLERISTON ALVES DOS SANTOS";
const CNPJ = "67.226.051/0001-07";

export const TERMOS: Record<LangCode, LegalDoc> = {
  "pt-BR": {
    pageLabel: "Legal",
    heading: "Termos de",
    headingAccent: "Uso",
    updated: "Última atualização: 8 de junho de 2026",
    otherDocLink: "Política de Privacidade",
    homeLink: "Voltar ao início",
    sections: [
      {
        title: "Identificação",
        list: [
          { label: "Razão social", text: RAZAO_SOCIAL },
          { label: "CNPJ", text: CNPJ },
          { label: "Contato", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Aceitação dos Termos",
        paragraphs: [
          "Ao acessar, navegar ou utilizar a Valore, você concorda em cumprir integralmente estes Termos de Uso, nossa Política de Privacidade e o Código de Conduta da comunidade. Se não concordar com qualquer parte destes termos, não utilize a plataforma.",
        ],
      },
      {
        title: "2. Definições",
        list: [
          { label: "Plataforma", text: "o site e os serviços da Valore." },
          { label: "Especialista", text: "profissional cadastrado que disponibiliza seu tempo em leilão." },
          { label: "Cliente", text: "usuário que dá lances para agendar sessões com especialistas." },
          { label: "Leilão", text: "processo de oferta pública de tempo humano conduzido na plataforma." },
          { label: "Sessão", text: "encontro virtual de 30 a 120 minutos entre cliente e especialista, realizado por videochamada." },
        ],
      },
      {
        title: "3. Cadastro e Conta",
        paragraphs: [
          "Você deve fornecer informações verdadeiras, completas e atualizadas. É proibido criar contas em nome de terceiros sem autorização expressa. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta. A Valore se reserva o direito de suspender ou encerrar contas que violem estes termos.",
        ],
      },
      {
        title: "4. Funcionamento dos Leilões",
        paragraphs: [
          "Os leilões na Valore operam em regime de oferta ascendente. O cliente com o lance mais alto no encerramento do leilão ganha o direito de agendar uma sessão com o especialista. O valor mínimo de lance é definido pelo especialista. A plataforma cobra uma comissão de 20% sobre o valor final do lance vencedor. O pagamento é processado no momento da confirmação da vitória.",
        ],
      },
      {
        title: "4.1 Irretratabilidade do Lance",
        paragraphs: [
          "Ao confirmar um lance, o cliente assume compromisso de compra irrevogável e irretratável. A desistência após a confirmação do lance vencedor sujeita o cliente a uma multa de 20% (vinte por cento) sobre o valor do lance, sem prejuízo das demais medidas de cobrança previstas nestes Termos.",
        ],
      },
      {
        title: "5. Sessões e Cancelamentos",
        list: [
          { text: "O vencedor deve agendar a sessão em até 7 dias após o encerramento do leilão." },
          { text: "Cancelamentos feitos pelo cliente com mais de 24h de antecedência garantem reembolso integral." },
          { text: "Cancelamentos com menos de 24h ou não-comparecimento do cliente resultam na retenção total do valor pago." },
          { text: "Não-comparecimento do especialista sem comunicação prévia acarreta suspensão imediata da conta e reembolso integral ao cliente." },
        ],
      },
      {
        title: "5.1 Inadimplência do Cliente Vencedor",
        paragraphs: [
          "A Valore não garante o pagamento pelo cliente vencedor. Em caso de inadimplência, tomaremos as medidas de cobrança disponíveis e notificaremos o especialista imediatamente. Em caso de não resolução em 48h, o leilão será reagendado gratuitamente com destaque na plataforma por 7 dias.",
        ],
      },
      {
        title: "5.2 Responsabilidade em Caso de Inadimplência",
        paragraphs: [
          "A Valore atua como intermediadora tecnológica entre especialistas e clientes. Em caso de inadimplência do cliente vencedor do leilão, a Valore tomará todas as medidas disponíveis de cobrança automática, incluindo débito no cartão cadastrado e bloqueio de conta. O especialista será notificado imediatamente sobre qualquer intercorrência. Caso o pagamento não seja regularizado em 48 horas, o leilão será cancelado sem custo e o especialista receberá prioridade para reagendamento com destaque gratuito por 7 dias. A Valore não se responsabiliza pela inadimplência do cliente, mas compromete-se a agir com rapidez e transparência em todos os casos.",
        ],
      },
      {
        title: "5.3 Cancelamento pelo Especialista e Penalidades",
        paragraphs: [
          "O especialista pode cancelar um leilão já publicado. Cancelamentos feitos com mais de 2 horas de antecedência do início da sessão não geram penalidade. Cancelamentos com menos de 2 horas de antecedência resultam na aplicação do selo \"Cancelamento recente\" no perfil do especialista por 7 dias. Ao acumular 3 cancelamentos penalizados dentro do mesmo mês, o especialista terá a conta suspensa automaticamente por 30 dias.",
        ],
      },
      {
        title: "6. Comissão da Plataforma",
        paragraphs: [
          "A Valore retém 20% do valor bruto de cada lance vencedor como comissão de intermediação. O especialista recebe 80% líquido, sujeito às regras fiscais aplicáveis. Saque dos valores disponíveis pode ser solicitado a qualquer momento, com prazo de processamento de até 5 dias úteis.",
        ],
      },
      {
        title: "7. Conduta do Usuário",
        listIntro: "Todos os usuários devem tratar uns aos outros com respeito e cordialidade. É estritamente proibido:",
        list: [
          { text: "Comportamento ofensivo, discriminatório ou assédio de qualquer natureza;" },
          { text: "Divulgação de conteúdo ilegal, obsceno ou que viole direitos autorais;" },
          { text: "Tentativas de fraude, manipulação de lances ou uso de bots;" },
          { text: "Compartilhamento de dados de contato fora da plataforma antes do pagamento;" },
          { text: "Gravação de sessões sem consentimento expresso de ambas as partes." },
        ],
      },
      {
        title: "7.1 Conteúdo Publicado pelo Usuário",
        paragraphs: [
          "O usuário é inteiramente responsável pelo conteúdo que publica na plataforma, incluindo fotos e informações profissionais. A Valore se reserva o direito de remover conteúdo que viole direitos de terceiros mediante notificação.",
        ],
      },
      {
        title: "8. Sistema de Reputação e Sanções",
        listIntro: "A Valore monitora a conduta dos usuários por meio de avaliações e denúncias. O sistema de sanções é escalonado:",
        list: [
          { label: "1ª infração", text: "advertência pública no perfil." },
          { label: "2ª infração", text: "suspensão temporária de 30 dias." },
          { label: "3ª infração", text: "banimento permanente da plataforma, sem direito a reembolso de valores pendentes." },
        ],
      },
      {
        title: "9. Propriedade Intelectual",
        paragraphs: [
          "Todo o conteúdo da plataforma — logos, design, código, textos e marcas — é de propriedade exclusiva da Valore ou de seus licenciadores. Você não pode copiar, modificar, distribuir ou criar obras derivadas sem autorização prévia e por escrito.",
        ],
      },
      {
        title: "10. Limitação de Responsabilidade",
        paragraphs: [
          "A Valore atua como intermediadora entre clientes e especialistas. Não nos responsabilizamos pela qualidade do conteúdo das sessões, nem pelos resultados profissionais obtidos pelo cliente. Nosso limite de responsabilidade está restrito ao valor da comissão recebida em relação à transação disputada.",
        ],
      },
      {
        title: "11. Rescisão",
        paragraphs: [
          "Podemos suspender ou encerrar seu acesso à plataforma a qualquer momento, com ou sem aviso prévio, em caso de violação destes termos ou por decisão estratégica da empresa. Você pode encerrar sua conta a qualquer momento, mediante solicitação por e-mail.",
        ],
      },
      {
        title: "12. Disposições Gerais",
        paragraphs: [
          "Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Salvador, Bahia, Brasil, para resolver quaisquer controvérsias. A tolerância de qualquer violação não constituirá renúncia ao direito de exigir o cumprimento futuro.",
        ],
      },
      {
        title: "13. Contato",
        listIntro: "Para dúvidas sobre estes Termos de Uso, entre em contato:",
        paragraphs: [`E-mail: ${CONTACT_EMAIL}`],
      },
    ],
  },
  en: {
    pageLabel: "Legal",
    heading: "Terms of",
    headingAccent: "Use",
    updated: "Last updated: June 8, 2026",
    otherDocLink: "Privacy Policy",
    homeLink: "Back to home",
    sections: [
      {
        title: "Operator Identification",
        list: [
          { label: "Legal name", text: RAZAO_SOCIAL },
          { label: "Tax ID (CNPJ)", text: CNPJ },
          { label: "Contact", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Acceptance of Terms",
        paragraphs: [
          "By accessing, browsing, or using Valore, you agree to fully comply with these Terms of Use, our Privacy Policy, and the community Code of Conduct. If you do not agree with any part of these terms, do not use the platform.",
        ],
      },
      {
        title: "2. Definitions",
        list: [
          { label: "Platform", text: "the Valore website and services." },
          { label: "Specialist", text: "a registered professional who offers their time in auction." },
          { label: "Client", text: "a user who places bids to schedule sessions with specialists." },
          { label: "Auction", text: "the public bidding process for human time conducted on the platform." },
          { label: "Session", text: "a 30 to 120-minute virtual meeting between client and specialist, held via video call." },
        ],
      },
      {
        title: "3. Registration and Account",
        paragraphs: [
          "You must provide true, complete, and up-to-date information. Creating accounts on behalf of third parties without express authorization is prohibited. You are responsible for keeping your password confidential and for all activity on your account. Valore reserves the right to suspend or terminate accounts that violate these terms.",
        ],
      },
      {
        title: "4. How Auctions Work",
        paragraphs: [
          "Auctions on Valore operate on an ascending-bid basis. The client with the highest bid when the auction closes wins the right to schedule a session with the specialist. The minimum bid amount is set by the specialist. The platform charges a 20% commission on the final winning bid amount. Payment is processed at the moment the win is confirmed.",
        ],
      },
      {
        title: "4.1 Bid Irrevocability",
        paragraphs: [
          "By confirming a bid, the client assumes an irrevocable and non-retractable purchase commitment. Withdrawal after a winning bid has been confirmed subjects the client to a penalty of 20% (twenty percent) of the bid amount, without prejudice to the other collection measures set out in these Terms.",
        ],
      },
      {
        title: "5. Sessions and Cancellations",
        list: [
          { text: "The winner must schedule the session within 7 days after the auction closes." },
          { text: "Cancellations made by the client more than 24h in advance guarantee a full refund." },
          { text: "Cancellations with less than 24h notice, or client no-shows, result in full forfeiture of the amount paid." },
          { text: "A specialist no-show without prior notice results in immediate account suspension and a full refund to the client." },
        ],
      },
      {
        title: "5.1 Winning Client Non-Payment",
        paragraphs: [
          "Valore does not guarantee payment by the winning client. In case of non-payment, we will take the available collection measures and notify the specialist immediately. If unresolved within 48h, the auction will be rescheduled free of charge with featured placement on the platform for 7 days.",
        ],
      },
      {
        title: "5.2 Liability in Case of Non-Payment",
        paragraphs: [
          "Valore acts as a technology intermediary between specialists and clients. In the event of non-payment by the winning client, Valore will take all available automatic collection measures, including debiting the registered card and blocking the account. The specialist will be notified immediately of any such incident. If payment is not settled within 48 hours, the auction will be cancelled at no cost and the specialist will receive priority for rescheduling with free featured placement for 7 days. Valore is not liable for client non-payment, but commits to acting quickly and transparently in all cases.",
        ],
      },
      {
        title: "5.3 Cancellation by the Specialist and Penalties",
        paragraphs: [
          "The specialist may cancel an already published auction. Cancellations made more than 2 hours before the session's start time incur no penalty. Cancellations made less than 2 hours in advance result in a \"Recent Cancellation\" badge on the specialist's profile for 7 days. Upon accumulating 3 penalized cancellations within the same month, the specialist's account will be automatically suspended for 30 days.",
        ],
      },
      {
        title: "6. Platform Commission",
        paragraphs: [
          "Valore retains 20% of the gross value of each winning bid as an intermediation commission. The specialist receives a net 80%, subject to applicable tax rules. Withdrawal of available funds may be requested at any time, with processing taking up to 5 business days.",
        ],
      },
      {
        title: "7. User Conduct",
        listIntro: "All users must treat each other with respect and courtesy. The following is strictly prohibited:",
        list: [
          { text: "Offensive, discriminatory behavior, or harassment of any kind;" },
          { text: "Sharing illegal, obscene, or copyright-infringing content;" },
          { text: "Attempts at fraud, bid manipulation, or use of bots;" },
          { text: "Sharing contact information off-platform before payment;" },
          { text: "Recording sessions without the express consent of both parties." },
        ],
      },
      {
        title: "7.1 User-Published Content",
        paragraphs: [
          "The user is fully responsible for the content they publish on the platform, including photos and professional information. Valore reserves the right to remove content that violates third-party rights upon notification.",
        ],
      },
      {
        title: "8. Reputation System and Sanctions",
        listIntro: "Valore monitors user conduct through reviews and reports. The sanctions system is tiered:",
        list: [
          { label: "1st violation", text: "public warning on the profile." },
          { label: "2nd violation", text: "temporary 30-day suspension." },
          { label: "3rd violation", text: "permanent ban from the platform, with no right to a refund of pending amounts." },
        ],
      },
      {
        title: "9. Intellectual Property",
        paragraphs: [
          "All platform content — logos, design, code, text, and trademarks — is the exclusive property of Valore or its licensors. You may not copy, modify, distribute, or create derivative works without prior written authorization.",
        ],
      },
      {
        title: "10. Limitation of Liability",
        paragraphs: [
          "Valore acts as an intermediary between clients and specialists. We are not responsible for the quality of session content, nor for the professional outcomes obtained by the client. Our liability is limited to the value of the commission received in relation to the disputed transaction.",
        ],
      },
      {
        title: "11. Termination",
        paragraphs: [
          "We may suspend or terminate your access to the platform at any time, with or without prior notice, in case of violation of these terms or as a strategic business decision. You may close your account at any time by email request.",
        ],
      },
      {
        title: "12. General Provisions",
        paragraphs: [
          "These Terms are governed by the laws of the Federative Republic of Brazil. The courts of Salvador, Bahia, Brazil, are elected to resolve any disputes. Tolerance of any violation does not constitute a waiver of the right to demand future compliance.",
        ],
      },
      {
        title: "13. Contact",
        listIntro: "For questions about these Terms of Use, please contact us:",
        paragraphs: [`Email: ${CONTACT_EMAIL}`],
      },
    ],
  },
  es: {
    pageLabel: "Legal",
    heading: "Términos de",
    headingAccent: "Uso",
    updated: "Última actualización: 8 de junio de 2026",
    otherDocLink: "Política de Privacidad",
    homeLink: "Volver al inicio",
    sections: [
      {
        title: "Identificación del Operador",
        list: [
          { label: "Razón social", text: RAZAO_SOCIAL },
          { label: "CNPJ", text: CNPJ },
          { label: "Contacto", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Aceptación de los Términos",
        paragraphs: [
          "Al acceder, navegar o utilizar Valore, aceptas cumplir íntegramente estos Términos de Uso, nuestra Política de Privacidad y el Código de Conducta de la comunidad. Si no estás de acuerdo con alguna parte de estos términos, no utilices la plataforma.",
        ],
      },
      {
        title: "2. Definiciones",
        list: [
          { label: "Plataforma", text: "el sitio web y los servicios de Valore." },
          { label: "Especialista", text: "profesional registrado que ofrece su tiempo en subasta." },
          { label: "Cliente", text: "usuario que puja para agendar sesiones con especialistas." },
          { label: "Subasta", text: "proceso de oferta pública de tiempo humano llevado a cabo en la plataforma." },
          { label: "Sesión", text: "encuentro virtual de 30 a 120 minutos entre cliente y especialista, realizado por videollamada." },
        ],
      },
      {
        title: "3. Registro y Cuenta",
        paragraphs: [
          "Debes proporcionar información verdadera, completa y actualizada. Está prohibido crear cuentas en nombre de terceros sin autorización expresa. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas en tu cuenta. Valore se reserva el derecho de suspender o cerrar cuentas que infrinjan estos términos.",
        ],
      },
      {
        title: "4. Funcionamiento de las Subastas",
        paragraphs: [
          "Las subastas en Valore operan bajo el régimen de oferta ascendente. El cliente con la puja más alta al cierre de la subasta obtiene el derecho de agendar una sesión con el especialista. El valor mínimo de puja lo define el especialista. La plataforma cobra una comisión del 20% sobre el valor final de la puja ganadora. El pago se procesa en el momento de la confirmación de la victoria.",
        ],
      },
      {
        title: "4.1 Irretractabilidad de la Puja",
        paragraphs: [
          "Al confirmar una puja, el cliente asume un compromiso de compra irrevocable e irretractable. El desistimiento después de la confirmación de la puja ganadora somete al cliente a una multa del 20% (veinte por ciento) sobre el valor de la puja, sin perjuicio de las demás medidas de cobro previstas en estos Términos.",
        ],
      },
      {
        title: "5. Sesiones y Cancelaciones",
        list: [
          { text: "El ganador debe agendar la sesión dentro de los 7 días posteriores al cierre de la subasta." },
          { text: "Las cancelaciones realizadas por el cliente con más de 24h de antelación garantizan reembolso total." },
          { text: "Las cancelaciones con menos de 24h o la ausencia del cliente resultan en la retención total del valor pagado." },
          { text: "La ausencia del especialista sin aviso previo conlleva la suspensión inmediata de la cuenta y el reembolso total al cliente." },
        ],
      },
      {
        title: "5.1 Impago del Cliente Ganador",
        paragraphs: [
          "Valore no garantiza el pago por parte del cliente ganador. En caso de impago, tomaremos las medidas de cobro disponibles y notificaremos al especialista de inmediato. Si no se resuelve en 48h, la subasta se reprogramará gratuitamente con destaque en la plataforma durante 7 días.",
        ],
      },
      {
        title: "5.2 Responsabilidad en Caso de Impago",
        paragraphs: [
          "Valore actúa como intermediaria tecnológica entre especialistas y clientes. En caso de impago del cliente ganador de la subasta, Valore tomará todas las medidas disponibles de cobro automático, incluido el débito en la tarjeta registrada y el bloqueo de la cuenta. El especialista será notificado de inmediato sobre cualquier incidencia. Si el pago no se regulariza en 48 horas, la subasta se cancelará sin costo y el especialista recibirá prioridad para reprogramación con destaque gratuito durante 7 días. Valore no se responsabiliza por el impago del cliente, pero se compromete a actuar con rapidez y transparencia en todos los casos.",
        ],
      },
      {
        title: "5.3 Cancelación por el Especialista y Penalizaciones",
        paragraphs: [
          "El especialista puede cancelar una subasta ya publicada. Las cancelaciones realizadas con más de 2 horas de antelación al inicio de la sesión no generan penalización. Las cancelaciones con menos de 2 horas de antelación resultan en la aplicación del distintivo \"Cancelación reciente\" en el perfil del especialista durante 7 días. Al acumular 3 cancelaciones penalizadas dentro del mismo mes, la cuenta del especialista será suspendida automáticamente por 30 días.",
        ],
      },
      {
        title: "6. Comisión de la Plataforma",
        paragraphs: [
          "Valore retiene el 20% del valor bruto de cada puja ganadora como comisión de intermediación. El especialista recibe el 80% neto, sujeto a las normas fiscales aplicables. El retiro de los valores disponibles puede solicitarse en cualquier momento, con un plazo de procesamiento de hasta 5 días hábiles.",
        ],
      },
      {
        title: "7. Conducta del Usuario",
        listIntro: "Todos los usuarios deben tratarse con respeto y cordialidad. Está estrictamente prohibido:",
        list: [
          { text: "Comportamiento ofensivo, discriminatorio o acoso de cualquier naturaleza;" },
          { text: "Difusión de contenido ilegal, obsceno o que infrinja derechos de autor;" },
          { text: "Intentos de fraude, manipulación de pujas o uso de bots;" },
          { text: "Compartir datos de contacto fuera de la plataforma antes del pago;" },
          { text: "Grabar sesiones sin el consentimiento expreso de ambas partes." },
        ],
      },
      {
        title: "7.1 Contenido Publicado por el Usuario",
        paragraphs: [
          "El usuario es enteramente responsable del contenido que publica en la plataforma, incluidas fotos e información profesional. Valore se reserva el derecho de eliminar contenido que infrinja derechos de terceros mediante notificación.",
        ],
      },
      {
        title: "8. Sistema de Reputación y Sanciones",
        listIntro: "Valore monitorea la conducta de los usuarios mediante evaluaciones y denuncias. El sistema de sanciones es escalonado:",
        list: [
          { label: "1ª infracción", text: "advertencia pública en el perfil." },
          { label: "2ª infracción", text: "suspensión temporal de 30 días." },
          { label: "3ª infracción", text: "expulsión permanente de la plataforma, sin derecho a reembolso de valores pendientes." },
        ],
      },
      {
        title: "9. Propiedad Intelectual",
        paragraphs: [
          "Todo el contenido de la plataforma — logotipos, diseño, código, textos y marcas — es propiedad exclusiva de Valore o de sus licenciantes. No puedes copiar, modificar, distribuir ni crear obras derivadas sin autorización previa y por escrito.",
        ],
      },
      {
        title: "10. Limitación de Responsabilidad",
        paragraphs: [
          "Valore actúa como intermediaria entre clientes y especialistas. No nos responsabilizamos por la calidad del contenido de las sesiones, ni por los resultados profesionales obtenidos por el cliente. Nuestro límite de responsabilidad se restringe al valor de la comisión recibida en relación con la transacción en disputa.",
        ],
      },
      {
        title: "11. Rescisión",
        paragraphs: [
          "Podemos suspender o cerrar tu acceso a la plataforma en cualquier momento, con o sin aviso previo, en caso de infracción de estos términos o por decisión estratégica de la empresa. Puedes cerrar tu cuenta en cualquier momento mediante solicitud por correo electrónico.",
        ],
      },
      {
        title: "12. Disposiciones Generales",
        paragraphs: [
          "Estos Términos se rigen por las leyes de la República Federativa de Brasil. Se elige el fuero de la Comarca de Salvador, Bahía, Brasil, para resolver cualquier controversia. La tolerancia de cualquier infracción no constituirá una renuncia al derecho de exigir el cumplimiento futuro.",
        ],
      },
      {
        title: "13. Contacto",
        listIntro: "Para dudas sobre estos Términos de Uso, ponte en contacto:",
        paragraphs: [`Correo electrónico: ${CONTACT_EMAIL}`],
      },
    ],
  },
  fr: {
    pageLabel: "Mentions légales",
    heading: "Conditions",
    headingAccent: "d'utilisation",
    updated: "Dernière mise à jour : 8 juin 2026",
    otherDocLink: "Politique de confidentialité",
    homeLink: "Retour à l'accueil",
    sections: [
      {
        title: "Identification de l'Exploitant",
        list: [
          { label: "Raison sociale", text: RAZAO_SOCIAL },
          { label: "CNPJ", text: CNPJ },
          { label: "Contact", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Acceptation des Conditions",
        paragraphs: [
          "En accédant, en naviguant ou en utilisant Valore, vous acceptez de vous conformer pleinement à ces Conditions d'utilisation, à notre Politique de confidentialité et au Code de conduite de la communauté. Si vous n'acceptez pas une partie de ces conditions, n'utilisez pas la plateforme.",
        ],
      },
      {
        title: "2. Définitions",
        list: [
          { label: "Plateforme", text: "le site et les services de Valore." },
          { label: "Spécialiste", text: "professionnel inscrit qui met son temps aux enchères." },
          { label: "Client", text: "utilisateur qui enchérit pour planifier des sessions avec des spécialistes." },
          { label: "Enchère", text: "processus d'offre publique de temps humain mené sur la plateforme." },
          { label: "Session", text: "rencontre virtuelle de 30 à 120 minutes entre client et spécialiste, réalisée par appel vidéo." },
        ],
      },
      {
        title: "3. Inscription et Compte",
        paragraphs: [
          "Vous devez fournir des informations véridiques, complètes et à jour. Il est interdit de créer des comptes au nom de tiers sans autorisation expresse. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sur votre compte. Valore se réserve le droit de suspendre ou de résilier les comptes qui enfreignent ces conditions.",
        ],
      },
      {
        title: "4. Fonctionnement des Enchères",
        paragraphs: [
          "Les enchères sur Valore fonctionnent en régime d'offre croissante. Le client ayant l'offre la plus élevée à la clôture de l'enchère obtient le droit de planifier une session avec le spécialiste. Le montant minimum de l'offre est fixé par le spécialiste. La plateforme prélève une commission de 20 % sur le montant final de l'offre gagnante. Le paiement est traité au moment de la confirmation de la victoire.",
        ],
      },
      {
        title: "4.1 Irrévocabilité de l'Offre",
        paragraphs: [
          "En confirmant une offre, le client assume un engagement d'achat irrévocable et non rétractable. Tout désistement après la confirmation de l'offre gagnante soumet le client à une pénalité de 20 % (vingt pour cent) du montant de l'offre, sans préjudice des autres mesures de recouvrement prévues dans les présentes Conditions.",
        ],
      },
      {
        title: "5. Sessions et Annulations",
        list: [
          { text: "Le gagnant doit planifier la session dans les 7 jours suivant la clôture de l'enchère." },
          { text: "Les annulations effectuées par le client plus de 24h à l'avance garantissent un remboursement intégral." },
          { text: "Les annulations avec moins de 24h de préavis, ou l'absence du client, entraînent la rétention totale du montant payé." },
          { text: "L'absence du spécialiste sans communication préalable entraîne la suspension immédiate du compte et le remboursement intégral au client." },
        ],
      },
      {
        title: "5.1 Défaut de Paiement du Client Gagnant",
        paragraphs: [
          "Valore ne garantit pas le paiement par le client gagnant. En cas de défaut, nous prendrons les mesures de recouvrement disponibles et informerons immédiatement le spécialiste. Si non résolu sous 48h, l'enchère sera reprogrammée gratuitement avec mise en avant sur la plateforme pendant 7 jours.",
        ],
      },
      {
        title: "5.2 Responsabilité en Cas de Défaut de Paiement",
        paragraphs: [
          "Valore agit en tant qu'intermédiaire technologique entre spécialistes et clients. En cas de défaut de paiement du client gagnant de l'enchère, Valore prendra toutes les mesures de recouvrement automatique disponibles, y compris le débit sur la carte enregistrée et le blocage du compte. Le spécialiste sera informé immédiatement de tout incident. Si le paiement n'est pas régularisé sous 48 heures, l'enchère sera annulée sans frais et le spécialiste bénéficiera d'une priorité de reprogrammation avec mise en avant gratuite pendant 7 jours. Valore n'est pas responsable du défaut de paiement du client, mais s'engage à agir rapidement et en toute transparence dans tous les cas.",
        ],
      },
      {
        title: "5.3 Annulation par le Spécialiste et Pénalités",
        paragraphs: [
          "Le spécialiste peut annuler une enchère déjà publiée. Les annulations effectuées plus de 2 heures avant le début de la session n'entraînent aucune pénalité. Les annulations effectuées moins de 2 heures à l'avance entraînent l'application du badge « Annulation récente » sur le profil du spécialiste pendant 7 jours. Après 3 annulations pénalisées au cours du même mois, le compte du spécialiste sera automatiquement suspendu pendant 30 jours.",
        ],
      },
      {
        title: "6. Commission de la Plateforme",
        paragraphs: [
          "Valore retient 20 % de la valeur brute de chaque offre gagnante à titre de commission d'intermédiation. Le spécialiste reçoit 80 % nets, sous réserve des règles fiscales applicables. Le retrait des fonds disponibles peut être demandé à tout moment, avec un délai de traitement pouvant aller jusqu'à 5 jours ouvrés.",
        ],
      },
      {
        title: "7. Conduite de l'Utilisateur",
        listIntro: "Tous les utilisateurs doivent se traiter mutuellement avec respect et courtoisie. Il est strictement interdit de :",
        list: [
          { text: "Adopter un comportement offensant, discriminatoire ou tout type de harcèlement ;" },
          { text: "Diffuser du contenu illégal, obscène ou portant atteinte aux droits d'auteur ;" },
          { text: "Tenter de frauder, de manipuler les offres ou d'utiliser des robots ;" },
          { text: "Partager des coordonnées hors plateforme avant le paiement ;" },
          { text: "Enregistrer des sessions sans le consentement exprès des deux parties." },
        ],
      },
      {
        title: "7.1 Contenu Publié par l'Utilisateur",
        paragraphs: [
          "L'utilisateur est entièrement responsable du contenu qu'il publie sur la plateforme, y compris les photos et les informations professionnelles. Valore se réserve le droit de supprimer tout contenu portant atteinte aux droits de tiers sur notification.",
        ],
      },
      {
        title: "8. Système de Réputation et Sanctions",
        listIntro: "Valore surveille la conduite des utilisateurs via les avis et les signalements. Le système de sanctions est échelonné :",
        list: [
          { label: "1re infraction", text: "avertissement public sur le profil." },
          { label: "2e infraction", text: "suspension temporaire de 30 jours." },
          { label: "3e infraction", text: "bannissement permanent de la plateforme, sans droit au remboursement des montants en attente." },
        ],
      },
      {
        title: "9. Propriété Intellectuelle",
        paragraphs: [
          "Tout le contenu de la plateforme — logos, design, code, textes et marques — est la propriété exclusive de Valore ou de ses concédants. Vous ne pouvez pas copier, modifier, distribuer ou créer des œuvres dérivées sans autorisation écrite préalable.",
        ],
      },
      {
        title: "10. Limitation de Responsabilité",
        paragraphs: [
          "Valore agit en tant qu'intermédiaire entre clients et spécialistes. Nous ne sommes pas responsables de la qualité du contenu des sessions, ni des résultats professionnels obtenus par le client. Notre limite de responsabilité est restreinte à la valeur de la commission perçue en lien avec la transaction contestée.",
        ],
      },
      {
        title: "11. Résiliation",
        paragraphs: [
          "Nous pouvons suspendre ou résilier votre accès à la plateforme à tout moment, avec ou sans préavis, en cas de violation de ces conditions ou pour une décision stratégique de l'entreprise. Vous pouvez fermer votre compte à tout moment sur demande par e-mail.",
        ],
      },
      {
        title: "12. Dispositions Générales",
        paragraphs: [
          "Les présentes Conditions sont régies par les lois de la République fédérative du Brésil. Le for de Salvador, Bahia, Brésil, est élu pour résoudre tout litige. La tolérance d'une violation ne constitue pas une renonciation au droit d'exiger le respect futur.",
        ],
      },
      {
        title: "13. Contact",
        listIntro: "Pour toute question sur ces Conditions d'utilisation, contactez-nous :",
        paragraphs: [`E-mail : ${CONTACT_EMAIL}`],
      },
    ],
  },
  de: {
    pageLabel: "Rechtliches",
    heading: "Nutzungs-",
    headingAccent: "bedingungen",
    updated: "Zuletzt aktualisiert: 8. Juni 2026",
    otherDocLink: "Datenschutzerklärung",
    homeLink: "Zurück zur Startseite",
    sections: [
      {
        title: "Angaben zum Betreiber",
        list: [
          { label: "Firmenname", text: RAZAO_SOCIAL },
          { label: "CNPJ (brasilianische Steuernummer)", text: CNPJ },
          { label: "Kontakt", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Annahme der Bedingungen",
        paragraphs: [
          "Durch den Zugriff, das Durchsuchen oder die Nutzung von Valore stimmen Sie zu, diese Nutzungsbedingungen, unsere Datenschutzerklärung und den Verhaltenskodex der Community vollständig einzuhalten. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, nutzen Sie die Plattform nicht.",
        ],
      },
      {
        title: "2. Begriffsbestimmungen",
        list: [
          { label: "Plattform", text: "die Website und Dienste von Valore." },
          { label: "Spezialist", text: "ein registrierter Fachmann, der seine Zeit zur Auktion anbietet." },
          { label: "Kunde", text: "ein Nutzer, der Gebote abgibt, um Sitzungen mit Spezialisten zu vereinbaren." },
          { label: "Auktion", text: "der öffentliche Bietprozess für menschliche Zeit auf der Plattform." },
          { label: "Sitzung", text: "ein 30- bis 120-minütiges virtuelles Treffen zwischen Kunde und Spezialist per Videoanruf." },
        ],
      },
      {
        title: "3. Registrierung und Konto",
        paragraphs: [
          "Sie müssen wahrheitsgemäße, vollständige und aktuelle Informationen angeben. Die Erstellung von Konten im Namen Dritter ohne ausdrückliche Genehmigung ist untersagt. Sie sind verantwortlich für die Geheimhaltung Ihres Passworts und für alle Aktivitäten auf Ihrem Konto. Valore behält sich das Recht vor, Konten zu sperren oder zu kündigen, die gegen diese Bedingungen verstoßen.",
        ],
      },
      {
        title: "4. Funktionsweise der Auktionen",
        paragraphs: [
          "Auktionen auf Valore funktionieren nach dem Prinzip des aufsteigenden Gebots. Der Kunde mit dem höchsten Gebot bei Auktionsende erhält das Recht, eine Sitzung mit dem Spezialisten zu vereinbaren. Der Mindestgebotsbetrag wird vom Spezialisten festgelegt. Die Plattform erhebt eine Provision von 20 % auf den endgültigen Betrag des Gewinnergebots. Die Zahlung wird bei Bestätigung des Gewinns verarbeitet.",
        ],
      },
      {
        title: "4.1 Unwiderruflichkeit des Gebots",
        paragraphs: [
          "Mit der Bestätigung eines Gebots geht der Kunde eine unwiderrufliche und nicht rücktrittsfähige Kaufverpflichtung ein. Ein Rücktritt nach Bestätigung des Gewinnergebots führt zu einer Vertragsstrafe von 20 % (zwanzig Prozent) des Gebotsbetrags, unbeschadet der übrigen in diesen Bedingungen vorgesehenen Inkassomaßnahmen.",
        ],
      },
      {
        title: "5. Sitzungen und Stornierungen",
        list: [
          { text: "Der Gewinner muss die Sitzung innerhalb von 7 Tagen nach Auktionsende vereinbaren." },
          { text: "Stornierungen durch den Kunden mit mehr als 24 Stunden Vorlauf garantieren eine vollständige Rückerstattung." },
          { text: "Stornierungen mit weniger als 24 Stunden Vorlauf oder Nichterscheinen des Kunden führen zum vollständigen Einbehalt des gezahlten Betrags." },
          { text: "Nichterscheinen des Spezialisten ohne vorherige Mitteilung führt zur sofortigen Kontosperrung und vollständigen Rückerstattung an den Kunden." },
        ],
      },
      {
        title: "5.1 Zahlungsverzug des Gewinnerkunden",
        paragraphs: [
          "Valore garantiert nicht die Zahlung durch den Gewinnerkunden. Bei Zahlungsverzug ergreifen wir die verfügbaren Inkassomaßnahmen und benachrichtigen den Spezialisten unverzüglich. Wird dies nicht innerhalb von 48 Stunden gelöst, wird die Auktion kostenlos mit 7 Tagen hervorgehobener Platzierung auf der Plattform neu geplant.",
        ],
      },
      {
        title: "5.2 Haftung bei Zahlungsverzug",
        paragraphs: [
          "Valore fungiert als technologischer Vermittler zwischen Spezialisten und Kunden. Bei Zahlungsverzug des Gewinnerkunden der Auktion ergreift Valore alle verfügbaren automatischen Inkassomaßnahmen, einschließlich der Belastung der registrierten Karte und der Kontosperrung. Der Spezialist wird über jeden Vorfall unverzüglich informiert. Wird die Zahlung nicht innerhalb von 48 Stunden geregelt, wird die Auktion kostenlos storniert und der Spezialist erhält Vorrang für eine Neuplanung mit 7 Tagen kostenloser hervorgehobener Platzierung. Valore haftet nicht für den Zahlungsverzug des Kunden, verpflichtet sich jedoch, in allen Fällen schnell und transparent zu handeln.",
        ],
      },
      {
        title: "5.3 Stornierung durch den Spezialisten und Sanktionen",
        paragraphs: [
          "Der Spezialist kann eine bereits veröffentlichte Auktion stornieren. Stornierungen, die mehr als 2 Stunden vor Sitzungsbeginn erfolgen, ziehen keine Strafe nach sich. Stornierungen mit weniger als 2 Stunden Vorlauf führen dazu, dass 7 Tage lang das Abzeichen „Kürzliche Stornierung“ im Profil des Spezialisten angezeigt wird. Bei 3 bestraften Stornierungen innerhalb desselben Monats wird das Konto des Spezialisten automatisch für 30 Tage gesperrt.",
        ],
      },
      {
        title: "6. Plattformprovision",
        paragraphs: [
          "Valore behält 20 % des Bruttowerts jedes Gewinnergebots als Vermittlungsprovision ein. Der Spezialist erhält netto 80 %, vorbehaltlich der geltenden Steuervorschriften. Die Auszahlung verfügbarer Beträge kann jederzeit beantragt werden, mit einer Bearbeitungszeit von bis zu 5 Werktagen.",
        ],
      },
      {
        title: "7. Nutzerverhalten",
        listIntro: "Alle Nutzer müssen einander mit Respekt und Höflichkeit behandeln. Streng untersagt ist:",
        list: [
          { text: "Beleidigendes, diskriminierendes Verhalten oder Belästigung jeder Art;" },
          { text: "Die Verbreitung illegaler, obszöner oder urheberrechtsverletzender Inhalte;" },
          { text: "Betrugsversuche, Gebotsmanipulation oder die Verwendung von Bots;" },
          { text: "Der Austausch von Kontaktdaten außerhalb der Plattform vor der Zahlung;" },
          { text: "Die Aufzeichnung von Sitzungen ohne die ausdrückliche Zustimmung beider Parteien." },
        ],
      },
      {
        title: "7.1 Vom Nutzer Veröffentlichte Inhalte",
        paragraphs: [
          "Der Nutzer ist allein verantwortlich für die von ihm auf der Plattform veröffentlichten Inhalte, einschließlich Fotos und beruflicher Informationen. Valore behält sich das Recht vor, Inhalte, die Rechte Dritter verletzen, nach entsprechender Benachrichtigung zu entfernen.",
        ],
      },
      {
        title: "8. Reputationssystem und Sanktionen",
        listIntro: "Valore überwacht das Nutzerverhalten durch Bewertungen und Meldungen. Das Sanktionssystem ist gestuft:",
        list: [
          { label: "1. Verstoß", text: "öffentliche Verwarnung auf dem Profil." },
          { label: "2. Verstoß", text: "vorübergehende Sperrung für 30 Tage." },
          { label: "3. Verstoß", text: "dauerhafte Sperrung von der Plattform, ohne Anspruch auf Rückerstattung ausstehender Beträge." },
        ],
      },
      {
        title: "9. Geistiges Eigentum",
        paragraphs: [
          "Alle Inhalte der Plattform — Logos, Design, Code, Texte und Marken — sind ausschließliches Eigentum von Valore oder seinen Lizenzgebern. Sie dürfen keine abgeleiteten Werke kopieren, ändern, verbreiten oder erstellen ohne vorherige schriftliche Genehmigung.",
        ],
      },
      {
        title: "10. Haftungsbeschränkung",
        paragraphs: [
          "Valore fungiert als Vermittler zwischen Kunden und Spezialisten. Wir sind nicht verantwortlich für die Qualität der Sitzungsinhalte oder für die vom Kunden erzielten beruflichen Ergebnisse. Unsere Haftung ist auf den Wert der im Zusammenhang mit der strittigen Transaktion erhaltenen Provision beschränkt.",
        ],
      },
      {
        title: "11. Kündigung",
        paragraphs: [
          "Wir können Ihren Zugang zur Plattform jederzeit mit oder ohne vorherige Ankündigung sperren oder beenden, im Falle eines Verstoßes gegen diese Bedingungen oder aufgrund einer strategischen Unternehmensentscheidung. Sie können Ihr Konto jederzeit per E-Mail-Anfrage kündigen.",
        ],
      },
      {
        title: "12. Allgemeine Bestimmungen",
        paragraphs: [
          "Diese Bedingungen unterliegen den Gesetzen der Föderativen Republik Brasilien. Als Gerichtsstand zur Beilegung von Streitigkeiten wird Salvador, Bahia, Brasilien, vereinbart. Die Duldung eines Verstoßes stellt keinen Verzicht auf das Recht dar, künftig die Einhaltung zu verlangen.",
        ],
      },
      {
        title: "13. Kontakt",
        listIntro: "Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns:",
        paragraphs: [`E-Mail: ${CONTACT_EMAIL}`],
      },
    ],
  },
  it: {
    pageLabel: "Legale",
    heading: "Termini di",
    headingAccent: "Utilizzo",
    updated: "Ultimo aggiornamento: 8 giugno 2026",
    otherDocLink: "Informativa sulla Privacy",
    homeLink: "Torna alla home",
    sections: [
      {
        title: "Identificazione del Gestore",
        list: [
          { label: "Ragione sociale", text: RAZAO_SOCIAL },
          { label: "CNPJ (codice fiscale brasiliano)", text: CNPJ },
          { label: "Contatto", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Accettazione dei Termini",
        paragraphs: [
          "Accedendo, navigando o utilizzando Valore, accetti di rispettare integralmente questi Termini di Utilizzo, la nostra Informativa sulla Privacy e il Codice di Condotta della community. Se non accetti una parte di questi termini, non utilizzare la piattaforma.",
        ],
      },
      {
        title: "2. Definizioni",
        list: [
          { label: "Piattaforma", text: "il sito e i servizi di Valore." },
          { label: "Specialista", text: "professionista registrato che mette a disposizione il proprio tempo all'asta." },
          { label: "Cliente", text: "utente che fa offerte per prenotare sessioni con gli specialisti." },
          { label: "Asta", text: "processo di offerta pubblica di tempo umano condotto sulla piattaforma." },
          { label: "Sessione", text: "incontro virtuale da 30 a 120 minuti tra cliente e specialista, tramite videochiamata." },
        ],
      },
      {
        title: "3. Registrazione e Account",
        paragraphs: [
          "Devi fornire informazioni veritiere, complete e aggiornate. È vietato creare account per conto di terzi senza autorizzazione espressa. Sei responsabile della riservatezza della tua password e di tutte le attività svolte sul tuo account. Valore si riserva il diritto di sospendere o chiudere account che violino questi termini.",
        ],
      },
      {
        title: "4. Funzionamento delle Aste",
        paragraphs: [
          "Le aste su Valore operano con offerta al rialzo. Il cliente con l'offerta più alta alla chiusura dell'asta ottiene il diritto di prenotare una sessione con lo specialista. Il valore minimo dell'offerta è definito dallo specialista. La piattaforma applica una commissione del 20% sul valore finale dell'offerta vincente. Il pagamento viene elaborato al momento della conferma della vittoria.",
        ],
      },
      {
        title: "4.1 Irrevocabilità dell'Offerta",
        paragraphs: [
          "Confermando un'offerta, il cliente assume un impegno di acquisto irrevocabile e non recedibile. Il recesso dopo la conferma dell'offerta vincente comporta per il cliente una penale del 20% (venti per cento) sul valore dell'offerta, fatte salve le altre misure di recupero previste nei presenti Termini.",
        ],
      },
      {
        title: "5. Sessioni e Cancellazioni",
        list: [
          { text: "Il vincitore deve prenotare la sessione entro 7 giorni dalla chiusura dell'asta." },
          { text: "Le cancellazioni effettuate dal cliente con più di 24h di anticipo garantiscono il rimborso integrale." },
          { text: "Le cancellazioni con meno di 24h di anticipo o la mancata presentazione del cliente comportano la trattenuta totale dell'importo pagato." },
          { text: "La mancata presentazione dello specialista senza preavviso comporta la sospensione immediata dell'account e il rimborso integrale al cliente." },
        ],
      },
      {
        title: "5.1 Inadempienza del Cliente Vincitore",
        paragraphs: [
          "Valore non garantisce il pagamento da parte del cliente vincitore. In caso di inadempienza, adotteremo le misure di recupero disponibili e informeremo immediatamente lo specialista. Se non risolto entro 48h, l'asta sarà riprogrammata gratuitamente in evidenza sulla piattaforma per 7 giorni.",
        ],
      },
      {
        title: "5.2 Responsabilità in Caso di Inadempienza",
        paragraphs: [
          "Valore agisce come intermediario tecnologico tra specialisti e clienti. In caso di inadempienza del cliente vincitore dell'asta, Valore adotterà tutte le misure disponibili di recupero automatico, incluso l'addebito sulla carta registrata e il blocco dell'account. Lo specialista sarà informato immediatamente di qualsiasi incidente. Se il pagamento non viene regolarizzato entro 48 ore, l'asta sarà annullata senza costi e lo specialista riceverà priorità per la riprogrammazione con evidenza gratuita per 7 giorni. Valore non è responsabile dell'inadempienza del cliente, ma si impegna ad agire con rapidità e trasparenza in tutti i casi.",
        ],
      },
      {
        title: "5.3 Cancellazione da Parte dello Specialista e Penali",
        paragraphs: [
          "Lo specialista può annullare un'asta già pubblicata. Gli annullamenti effettuati con più di 2 ore di anticipo rispetto all'inizio della sessione non comportano penali. Gli annullamenti con meno di 2 ore di anticipo comportano l'applicazione del badge \"Annullamento recente\" sul profilo dello specialista per 7 giorni. Al raggiungimento di 3 annullamenti penalizzati nello stesso mese, l'account dello specialista sarà sospeso automaticamente per 30 giorni.",
        ],
      },
      {
        title: "6. Commissione della Piattaforma",
        paragraphs: [
          "Valore trattiene il 20% del valore lordo di ogni offerta vincente come commissione di intermediazione. Lo specialista riceve l'80% netto, soggetto alle norme fiscali applicabili. Il prelievo degli importi disponibili può essere richiesto in qualsiasi momento, con tempi di elaborazione fino a 5 giorni lavorativi.",
        ],
      },
      {
        title: "7. Condotta dell'Utente",
        listIntro: "Tutti gli utenti devono trattarsi reciprocamente con rispetto e cordialità. È severamente vietato:",
        list: [
          { text: "Comportamento offensivo, discriminatorio o molestie di qualsiasi natura;" },
          { text: "Diffusione di contenuti illegali, osceni o che violino il copyright;" },
          { text: "Tentativi di frode, manipolazione delle offerte o uso di bot;" },
          { text: "Condivisione di dati di contatto fuori dalla piattaforma prima del pagamento;" },
          { text: "Registrazione delle sessioni senza il consenso espresso di entrambe le parti." },
        ],
      },
      {
        title: "7.1 Contenuto Pubblicato dall'Utente",
        paragraphs: [
          "L'utente è interamente responsabile dei contenuti che pubblica sulla piattaforma, comprese foto e informazioni professionali. Valore si riserva il diritto di rimuovere contenuti che violino i diritti di terzi previa notifica.",
        ],
      },
      {
        title: "8. Sistema di Reputazione e Sanzioni",
        listIntro: "Valore monitora la condotta degli utenti tramite recensioni e segnalazioni. Il sistema di sanzioni è a livelli:",
        list: [
          { label: "1ª infrazione", text: "avvertimento pubblico sul profilo." },
          { label: "2ª infrazione", text: "sospensione temporanea di 30 giorni." },
          { label: "3ª infrazione", text: "bando permanente dalla piattaforma, senza diritto al rimborso di importi in sospeso." },
        ],
      },
      {
        title: "9. Proprietà Intellettuale",
        paragraphs: [
          "Tutti i contenuti della piattaforma — loghi, design, codice, testi e marchi — sono di proprietà esclusiva di Valore o dei suoi licenzianti. Non puoi copiare, modificare, distribuire o creare opere derivate senza previa autorizzazione scritta.",
        ],
      },
      {
        title: "10. Limitazione di Responsabilità",
        paragraphs: [
          "Valore agisce come intermediario tra clienti e specialisti. Non siamo responsabili della qualità dei contenuti delle sessioni, né dei risultati professionali ottenuti dal cliente. Il nostro limite di responsabilità è ristretto al valore della commissione ricevuta in relazione alla transazione contestata.",
        ],
      },
      {
        title: "11. Risoluzione",
        paragraphs: [
          "Possiamo sospendere o chiudere il tuo accesso alla piattaforma in qualsiasi momento, con o senza preavviso, in caso di violazione di questi termini o per decisione strategica dell'azienda. Puoi chiudere il tuo account in qualsiasi momento tramite richiesta via email.",
        ],
      },
      {
        title: "12. Disposizioni Generali",
        paragraphs: [
          "Questi Termini sono regolati dalle leggi della Repubblica Federativa del Brasile. Viene eletto il foro di Salvador, Bahia, Brasile, per risolvere eventuali controversie. La tolleranza di qualsiasi violazione non costituirà rinuncia al diritto di esigere il rispetto futuro.",
        ],
      },
      {
        title: "13. Contatto",
        listIntro: "Per domande su questi Termini di Utilizzo, contattaci:",
        paragraphs: [`Email: ${CONTACT_EMAIL}`],
      },
    ],
  },
  ja: {
    pageLabel: "法的情報",
    heading: "利用",
    headingAccent: "規約",
    updated: "最終更新日：2026年6月8日",
    otherDocLink: "プライバシーポリシー",
    homeLink: "ホームに戻る",
    sections: [
      {
        title: "運営者情報",
        list: [
          { label: "商号", text: RAZAO_SOCIAL },
          { label: "CNPJ（ブラジル法人番号）", text: CNPJ },
          { label: "連絡先", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. 規約への同意",
        paragraphs: [
          "Valoreにアクセス、閲覧、または利用することにより、本利用規約、プライバシーポリシー、およびコミュニティ行動規範を完全に遵守することに同意したものとみなされます。本規約のいずれかの部分に同意しない場合は、本プラットフォームを利用しないでください。",
        ],
      },
      {
        title: "2. 定義",
        list: [
          { label: "プラットフォーム", text: "Valoreのウェブサイトおよびサービス。" },
          { label: "専門家", text: "自身の時間をオークションに出品する登録済みの専門職。" },
          { label: "クライアント", text: "専門家とのセッションを予約するために入札するユーザー。" },
          { label: "オークション", text: "プラットフォーム上で行われる人の時間の公開入札プロセス。" },
          { label: "セッション", text: "クライアントと専門家の間で行われる30分から120分のビデオ通話による仮想面談。" },
        ],
      },
      {
        title: "3. 登録とアカウント",
        paragraphs: [
          "真実、完全、かつ最新の情報を提供する必要があります。明示的な許可なく第三者名義でアカウントを作成することは禁止されています。パスワードの機密保持およびアカウント上のすべての活動について責任を負うものとします。Valoreは本規約に違反するアカウントを停止または終了する権利を留保します。",
        ],
      },
      {
        title: "4. オークションの仕組み",
        paragraphs: [
          "Valoreのオークションは上昇入札方式で運営されます。オークション終了時に最高額を入札したクライアントが専門家とのセッション予約権を得ます。最低入札額は専門家が設定します。プラットフォームは落札額に対して20%の手数料を課します。支払いは落札確定時に処理されます。",
        ],
      },
      {
        title: "4.1 入札の取り消し不可性",
        paragraphs: [
          "入札を確定することにより、クライアントは取り消し不可能かつ撤回不可能な購入義務を負います。落札確定後の取り消しは、入札額の20％（二十パーセント）の違約金の対象となり、これは本規約に定めるその他の督促措置を妨げるものではありません。",
        ],
      },
      {
        title: "5. セッションとキャンセル",
        list: [
          { text: "落札者はオークション終了後7日以内にセッションを予約する必要があります。" },
          { text: "24時間以上前のクライアントによるキャンセルは全額返金が保証されます。" },
          { text: "24時間未満のキャンセルまたはクライアントの無断欠席は、支払い額全額の没収となります。" },
          { text: "事前連絡のない専門家の無断欠席は、アカウントの即時停止とクライアントへの全額返金につながります。" },
        ],
      },
      {
        title: "5.1 落札クライアントの支払い不履行",
        paragraphs: [
          "Valoreは落札クライアントによる支払いを保証しません。支払い不履行の場合、利用可能な督促措置を講じ、専門家に直ちに通知します。48時間以内に解決しない場合、オークションは無料で再スケジュールされ、7日間プラットフォームで特集掲載されます。",
        ],
      },
      {
        title: "5.2 支払い不履行時の責任",
        paragraphs: [
          "Valoreは専門家とクライアントの間の技術的な仲介者として機能します。オークション落札クライアントによる支払い不履行の場合、Valoreは登録済みカードへの請求やアカウントの凍結を含む、利用可能なすべての自動督促措置を講じます。専門家はいかなる問題についても直ちに通知を受けます。48時間以内に支払いが解決しない場合、オークションは無償でキャンセルされ、専門家は7日間の無料特集掲載付きで優先的に再スケジュールされます。Valoreはクライアントの支払い不履行について責任を負いませんが、すべての場合において迅速かつ透明性を持って対応することを約束します。",
        ],
      },
      {
        title: "5.3 専門家によるキャンセルとペナルティ",
        paragraphs: [
          "専門家はすでに公開されたオークションをキャンセルできます。セッション開始の2時間以上前に行われたキャンセルにはペナルティは発生しません。2時間未満の前にキャンセルした場合、専門家のプロフィールに7日間「最近のキャンセル」バッジが表示されます。同一月内に3回のペナルティ対象キャンセルが累積した場合、専門家のアカウントは自動的に30日間停止されます。",
        ],
      },
      {
        title: "6. プラットフォーム手数料",
        paragraphs: [
          "Valoreは各落札額の総額から仲介手数料として20%を差し引きます。専門家は該当する税務規則に従い、純額80%を受け取ります。利用可能な資金の出金はいつでも申請可能で、処理には最大5営業日かかります。",
        ],
      },
      {
        title: "7. ユーザーの行動",
        listIntro: "すべてのユーザーは互いに敬意と礼儀を持って接する必要があります。以下は厳しく禁止されています：",
        list: [
          { text: "攻撃的、差別的な行為、またはあらゆる種類のハラスメント" },
          { text: "違法、わいせつ、または著作権を侵害するコンテンツの公開" },
          { text: "詐欺行為、入札操作、またはボットの使用" },
          { text: "支払い前にプラットフォーム外で連絡先情報を共有すること" },
          { text: "両当事者の明示的な同意なしにセッションを録画すること" },
        ],
      },
      {
        title: "7.1 ユーザーが公開するコンテンツ",
        paragraphs: [
          "ユーザーは、写真や職業情報を含め、プラットフォーム上に公開するコンテンツについて全責任を負います。Valoreは、通知を受けた場合、第三者の権利を侵害するコンテンツを削除する権利を留保します。",
        ],
      },
      {
        title: "8. 評判システムと制裁",
        listIntro: "Valoreはレビューと通報を通じてユーザーの行動を監視します。制裁システムは段階的です：",
        list: [
          { label: "1回目の違反", text: "プロフィールへの公開警告。" },
          { label: "2回目の違反", text: "30日間の一時停止。" },
          { label: "3回目の違反", text: "プラットフォームからの永久追放。未払い金額の返金は行われません。" },
        ],
      },
      {
        title: "9. 知的財産権",
        paragraphs: [
          "ロゴ、デザイン、コード、テキスト、商標を含むプラットフォームのすべてのコンテンツは、Valoreまたはそのライセンサーの独占的財産です。事前の書面による許可なく、複製、変更、配布、または二次的著作物の作成を行うことはできません。",
        ],
      },
      {
        title: "10. 責任の制限",
        paragraphs: [
          "Valoreはクライアントと専門家の仲介者として機能します。当社はセッション内容の質、またはクライアントが得た専門的な成果について責任を負いません。当社の責任は、紛争となった取引に関連して受け取った手数料の額に限定されます。",
        ],
      },
      {
        title: "11. 解約",
        paragraphs: [
          "本規約への違反または会社の戦略的判断により、事前通知の有無にかかわらず、いつでもプラットフォームへのアクセスを停止または終了する場合があります。メールでの申請により、いつでもアカウントを閉鎖することができます。",
        ],
      },
      {
        title: "12. 一般規定",
        paragraphs: [
          "本規約はブラジル連邦共和国の法律に準拠します。紛争解決の管轄はブラジル、バイーア州サルバドールの裁判所とします。違反行為を容認したとしても、将来の遵守を求める権利の放棄とはみなされません。",
        ],
      },
      {
        title: "13. お問い合わせ",
        listIntro: "本利用規約に関するご質問は、以下までご連絡ください：",
        paragraphs: [`メール：${CONTACT_EMAIL}`],
      },
    ],
  },
  zh: {
    pageLabel: "法律信息",
    heading: "使用",
    headingAccent: "条款",
    updated: "最后更新：2026年6月8日",
    otherDocLink: "隐私政策",
    homeLink: "返回首页",
    sections: [
      {
        title: "运营者信息",
        list: [
          { label: "商号", text: RAZAO_SOCIAL },
          { label: "CNPJ（巴西税号）", text: CNPJ },
          { label: "联系方式", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. 条款的接受",
        paragraphs: [
          "访问、浏览或使用 Valore 即表示您同意完全遵守本使用条款、我们的隐私政策以及社区行为准则。如果您不同意本条款的任何部分，请勿使用本平台。",
        ],
      },
      {
        title: "2. 定义",
        list: [
          { label: "平台", text: "Valore 的网站及服务。" },
          { label: "专家", text: "在平台上以拍卖方式提供其时间的注册专业人士。" },
          { label: "客户", text: "出价以预约与专家会话的用户。" },
          { label: "拍卖", text: "在平台上进行的关于人类时间的公开竞价流程。" },
          { label: "会话", text: "客户与专家之间通过视频通话进行的30至120分钟的虚拟会面。" },
        ],
      },
      {
        title: "3. 注册与账户",
        paragraphs: [
          "您必须提供真实、完整且最新的信息。未经明确授权，禁止以第三方名义创建账户。您应对密码保密及账户下的所有活动负责。Valore 保留暂停或终止违反本条款账户的权利。",
        ],
      },
      {
        title: "4. 拍卖运作方式",
        paragraphs: [
          "Valore 平台的拍卖采用递增出价制。拍卖结束时出价最高的客户获得与该专家预约会话的权利。最低出价由专家设定。平台对最终中标金额收取20%的佣金。付款将在中标确认时处理。",
        ],
      },
      {
        title: "4.1 出价不可撤销性",
        paragraphs: [
          "确认出价即表示客户承担不可撤销、不可撤回的购买承诺。中标确认后若放弃，客户将被收取出价金额20%（百分之二十）的违约金，且不影响本条款中规定的其他催收措施。",
        ],
      },
      {
        title: "5. 会话与取消",
        list: [
          { text: "中标者须在拍卖结束后7天内预约会话。" },
          { text: "客户提前24小时以上取消可获全额退款。" },
          { text: "客户在不足24小时内取消或未出席，将全额扣留已付款项。" },
          { text: "专家未提前通知即缺席，将导致账户立即暂停并向客户全额退款。" },
        ],
      },
      {
        title: "5.1 中标客户违约付款",
        paragraphs: [
          "Valore 不保证中标客户会完成付款。若发生违约，我们将采取可行的催收措施并立即通知专家。若48小时内未解决，该拍卖将免费重新安排并在平台上展示置顶推荐7天。",
        ],
      },
      {
        title: "5.2 违约付款情形下的责任",
        paragraphs: [
          "Valore 作为专家与客户之间的技术中介。若拍卖中标客户违约付款，Valore 将采取一切可行的自动催收措施，包括从已绑定银行卡扣款及冻结账户。专家将就任何相关事件立即获得通知。若付款未能在48小时内完成，该拍卖将被免费取消，专家将获得优先重新安排的资格，并享有7天免费置顶推荐。Valore 不对客户违约付款承担责任，但承诺在所有情况下迅速、透明地处理。",
        ],
      },
      {
        title: "5.3 专家取消及处罚",
        paragraphs: [
          "专家可以取消已发布的拍卖。在会话开始前超过2小时进行的取消不产生处罚。少于2小时的取消将导致专家资料上出现为期7天的“近期取消”标记。若在同一月内累计3次受处罚的取消，专家账户将被自动暂停30天。",
        ],
      },
      {
        title: "6. 平台佣金",
        paragraphs: [
          "Valore 就每笔中标金额的总额收取20%作为中介佣金。专家将获得净额80%，须遵守适用的税务规定。可用款项的提现可随时申请，处理时限最长5个工作日。",
        ],
      },
      {
        title: "7. 用户行为",
        listIntro: "所有用户须相互以尊重和礼貌相待。以下行为严格禁止：",
        list: [
          { text: "任何形式的冒犯性、歧视性行为或骚扰；" },
          { text: "传播违法、猥亵或侵犯版权的内容；" },
          { text: "欺诈、操纵出价或使用机器人程序；" },
          { text: "在付款前于平台外分享联系方式；" },
          { text: "未经双方明确同意录制会话。" },
        ],
      },
      {
        title: "7.1 用户发布的内容",
        paragraphs: [
          "用户对其在平台上发布的内容（包括照片和职业信息）承担全部责任。经通知后，Valore 保留删除侵犯第三方权利内容的权利。",
        ],
      },
      {
        title: "8. 信誉系统与处罚",
        listIntro: "Valore 通过评价与举报监控用户行为。处罚制度分级如下：",
        list: [
          { label: "第1次违规", text: "在资料上公开警告。" },
          { label: "第2次违规", text: "暂停账户30天。" },
          { label: "第3次违规", text: "永久封禁平台账户，且未结款项不予退还。" },
        ],
      },
      {
        title: "9. 知识产权",
        paragraphs: [
          "平台的所有内容——包括标志、设计、代码、文本及商标——均为 Valore 或其许可方的专属财产。未经事先书面授权，您不得复制、修改、分发或创作衍生作品。",
        ],
      },
      {
        title: "10. 责任限制",
        paragraphs: [
          "Valore 作为客户与专家之间的中介。我们不对会话内容的质量或客户所获得的职业成果负责。我们的责任上限仅限于与争议交易相关所收取的佣金金额。",
        ],
      },
      {
        title: "11. 终止",
        paragraphs: [
          "如违反本条款或出于公司战略决策，我们可随时暂停或终止您对平台的访问，无论是否提前通知。您可随时通过电子邮件申请关闭账户。",
        ],
      },
      {
        title: "12. 一般规定",
        paragraphs: [
          "本条款受巴西联邦共和国法律管辖。任何争议均以巴西巴伊亚州萨尔瓦多市司法辖区为管辖法院解决。对任何违规行为的容忍不构成放弃要求未来遵守的权利。",
        ],
      },
      {
        title: "13. 联系方式",
        listIntro: "如对本使用条款有任何疑问，请联系我们：",
        paragraphs: [`电子邮箱：${CONTACT_EMAIL}`],
      },
    ],
  },
  ar: {
    pageLabel: "قانوني",
    heading: "شروط",
    headingAccent: "الاستخدام",
    updated: "آخر تحديث: 8 يونيو 2026",
    otherDocLink: "سياسة الخصوصية",
    homeLink: "العودة إلى الرئيسية",
    sections: [
      {
        title: "بيانات المشغّل",
        list: [
          { label: "الاسم التجاري", text: RAZAO_SOCIAL },
          { label: "الرقم الضريبي (CNPJ)", text: CNPJ },
          { label: "التواصل", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. قبول الشروط",
        paragraphs: [
          "من خلال الوصول إلى Valore أو تصفحها أو استخدامها، فإنك توافق على الامتثال الكامل لشروط الاستخدام هذه وسياسة الخصوصية الخاصة بنا ومدونة سلوك المجتمع. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا تستخدم المنصة.",
        ],
      },
      {
        title: "2. التعريفات",
        list: [
          { label: "المنصة", text: "موقع وخدمات Valore." },
          { label: "المختص", text: "محترف مسجَّل يعرض وقته للمزايدة." },
          { label: "العميل", text: "مستخدم يقدّم عروضًا لحجز جلسات مع المختصين." },
          { label: "المزاد", text: "عملية المزايدة العلنية على الوقت البشري التي تُجرى على المنصة." },
          { label: "الجلسة", text: "لقاء افتراضي يتراوح بين 30 و120 دقيقة بين العميل والمختص عبر مكالمة فيديو." },
        ],
      },
      {
        title: "3. التسجيل والحساب",
        paragraphs: [
          "يجب عليك تقديم معلومات صحيحة وكاملة ومحدّثة. يُحظر إنشاء حسابات نيابة عن أطراف ثالثة دون إذن صريح. أنت مسؤول عن الحفاظ على سرية كلمة مرورك وعن جميع الأنشطة التي تتم على حسابك. تحتفظ Valore بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.",
        ],
      },
      {
        title: "4. آلية عمل المزادات",
        paragraphs: [
          "تعمل المزادات على Valore وفق نظام العرض التصاعدي. يحصل العميل صاحب أعلى عرض عند إغلاق المزاد على حق حجز جلسة مع المختص. يحدد المختص الحد الأدنى لقيمة العرض. تفرض المنصة عمولة 20٪ على القيمة النهائية للعرض الفائز. تتم معالجة الدفع لحظة تأكيد الفوز.",
        ],
      },
      {
        title: "4.1 عدم رجعية العرض",
        paragraphs: [
          "بتأكيد العرض، يتحمّل العميل التزامًا لا رجعة فيه وغير قابل للسحب بالشراء. ويؤدي العدول بعد تأكيد العرض الفائز إلى إخضاع العميل لغرامة قدرها 20٪ (عشرون بالمئة) من قيمة العرض، دون الإخلال بإجراءات التحصيل الأخرى المنصوص عليها في هذه الشروط.",
        ],
      },
      {
        title: "5. الجلسات والإلغاءات",
        list: [
          { text: "يجب على الفائز حجز الجلسة خلال 7 أيام من إغلاق المزاد." },
          { text: "الإلغاءات التي يقوم بها العميل قبل أكثر من 24 ساعة تضمن استردادًا كاملاً." },
          { text: "الإلغاءات بأقل من 24 ساعة أو عدم حضور العميل تؤدي إلى احتجاز كامل المبلغ المدفوع." },
          { text: "عدم حضور المختص دون إشعار مسبق يؤدي إلى تعليق فوري للحساب واسترداد كامل للعميل." },
        ],
      },
      {
        title: "5.1 تخلّف العميل الفائز عن السداد",
        paragraphs: [
          "لا تضمن Valore سداد العميل الفائز. في حال التخلف عن السداد، سنتخذ إجراءات التحصيل المتاحة ونخطر المختص فورًا. وإذا لم تتم التسوية خلال 48 ساعة، سيُعاد جدولة المزاد مجانًا مع إبراز على المنصة لمدة 7 أيام.",
        ],
      },
      {
        title: "5.2 المسؤولية في حال التخلف عن السداد",
        paragraphs: [
          "تعمل Valore كوسيط تقني بين المختصين والعملاء. في حال تخلف العميل الفائز بالمزاد عن السداد، ستتخذ Valore جميع إجراءات التحصيل التلقائي المتاحة، بما في ذلك الخصم من البطاقة المسجَّلة وحظر الحساب. سيتم إخطار المختص فورًا بأي حادثة من هذا القبيل. وإذا لم تتم تسوية الدفع خلال 48 ساعة، سيُلغى المزاد دون تكلفة وسيحصل المختص على أولوية لإعادة الجدولة مع إبراز مجاني لمدة 7 أيام. لا تتحمل Valore مسؤولية تخلف العميل عن السداد، لكنها تلتزم بالتصرف بسرعة وشفافية في جميع الحالات.",
        ],
      },
      {
        title: "5.3 الإلغاء من قِبل المختص والعقوبات",
        paragraphs: [
          "يمكن للمختص إلغاء مزاد تم نشره بالفعل. لا تترتب أي عقوبة على الإلغاءات التي تتم قبل أكثر من ساعتين من بدء الجلسة. أما الإلغاءات التي تتم قبل أقل من ساعتين فتؤدي إلى ظهور شارة \"إلغاء حديث\" على ملف المختص لمدة 7 أيام. وعند تراكم 3 إلغاءات معاقَب عليها خلال الشهر نفسه، يُعلَّق حساب المختص تلقائيًا لمدة 30 يومًا.",
        ],
      },
      {
        title: "6. عمولة المنصة",
        paragraphs: [
          "تحتفظ Valore بنسبة 20٪ من القيمة الإجمالية لكل عرض فائز كعمولة وساطة. يحصل المختص على 80٪ صافية، وفقًا للقواعد الضريبية المعمول بها. يمكن طلب سحب المبالغ المتاحة في أي وقت، مع مدة معالجة تصل إلى 5 أيام عمل.",
        ],
      },
      {
        title: "7. سلوك المستخدم",
        listIntro: "يجب على جميع المستخدمين معاملة بعضهم البعض باحترام ولباقة. يُحظر تمامًا:",
        list: [
          { text: "السلوك المسيء أو التمييزي أو أي شكل من أشكال التحرش؛" },
          { text: "نشر محتوى غير قانوني أو فاحش أو ينتهك حقوق النشر؛" },
          { text: "محاولات الاحتيال أو التلاعب بالعروض أو استخدام الروبوتات؛" },
          { text: "مشاركة بيانات الاتصال خارج المنصة قبل الدفع؛" },
          { text: "تسجيل الجلسات دون موافقة صريحة من الطرفين." },
        ],
      },
      {
        title: "7.1 المحتوى الذي ينشره المستخدم",
        paragraphs: [
          "يتحمّل المستخدم المسؤولية الكاملة عن المحتوى الذي ينشره على المنصة، بما في ذلك الصور والمعلومات المهنية. تحتفظ Valore بالحق في إزالة أي محتوى ينتهك حقوق الغير عند إخطارها بذلك.",
        ],
      },
      {
        title: "8. نظام السمعة والعقوبات",
        listIntro: "تراقب Valore سلوك المستخدمين من خلال التقييمات والبلاغات. نظام العقوبات متدرج:",
        list: [
          { label: "المخالفة الأولى", text: "تحذير علني على الملف الشخصي." },
          { label: "المخالفة الثانية", text: "تعليق مؤقت لمدة 30 يومًا." },
          { label: "المخالفة الثالثة", text: "حظر دائم من المنصة، دون حق استرداد المبالغ المعلّقة." },
        ],
      },
      {
        title: "9. الملكية الفكرية",
        paragraphs: [
          "جميع محتويات المنصة — الشعارات والتصميم والكود والنصوص والعلامات التجارية — ملكية حصرية لـ Valore أو للجهات المرخِّصة لها. لا يجوز لك نسخ أو تعديل أو توزيع أو إنشاء أعمال مشتقة دون إذن كتابي مسبق.",
        ],
      },
      {
        title: "10. تحديد المسؤولية",
        paragraphs: [
          "تعمل Valore كوسيط بين العملاء والمختصين. نحن غير مسؤولين عن جودة محتوى الجلسات ولا عن النتائج المهنية التي يحصل عليها العميل. تقتصر مسؤوليتنا على قيمة العمولة المستلمة فيما يتعلق بالمعاملة محل النزاع.",
        ],
      },
      {
        title: "11. الإنهاء",
        paragraphs: [
          "يجوز لنا تعليق أو إنهاء وصولك إلى المنصة في أي وقت، بإشعار أو دونه، في حال انتهاك هذه الشروط أو بقرار استراتيجي من الشركة. يمكنك إغلاق حسابك في أي وقت عبر طلب بالبريد الإلكتروني.",
        ],
      },
      {
        title: "12. أحكام عامة",
        paragraphs: [
          "تخضع هذه الشروط لقوانين جمهورية البرازيل الاتحادية. تُختار محاكم مدينة سلفادور، ولاية باهيا، البرازيل، لحل أي نزاعات. لا يشكل التسامح مع أي انتهاك تنازلاً عن الحق في المطالبة بالامتثال مستقبلاً.",
        ],
      },
      {
        title: "13. التواصل",
        listIntro: "لأي استفسارات حول شروط الاستخدام هذه، تواصل معنا:",
        paragraphs: [`البريد الإلكتروني: ${CONTACT_EMAIL}`],
      },
    ],
  },
};

export const PRIVACIDADE: Record<LangCode, LegalDoc> = {
  "pt-BR": {
    pageLabel: "Legal",
    heading: "Política de",
    headingAccent: "Privacidade",
    updated: "Última atualização: 8 de junho de 2026",
    otherDocLink: "Termos de Uso",
    homeLink: "Voltar ao início",
    sections: [
      {
        title: "Identificação do Operador",
        list: [
          { label: "Razão social", text: RAZAO_SOCIAL },
          { label: "CNPJ", text: CNPJ },
          { label: "Contato", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Introdução",
        paragraphs: [
          "A Valore (“Plataforma”, “nós”, “nos”) valoriza a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações pessoais dos usuários (“você”, “seu”) ao utilizar nossa plataforma de leilão de tempo humano.",
        ],
      },
      {
        title: "2. Dados que Coletamos",
        listIntro: "Coletamos os seguintes dados, cada um com uma finalidade específica:",
        list: [
          { label: "Nome completo", text: "usado para identificação e criação da sua conta." },
          { label: "E-mail", text: "usado para autenticação, comunicação e recuperação de acesso à conta." },
          { label: "CPF/CNPJ", text: "usado para verificação de identidade e cumprimento de obrigações fiscais e legais." },
          { label: "Telefone", text: "usado para contato e confirmação de agendamentos." },
          { label: "Cidade e Estado", text: "usados para exibição no perfil e adequação a exigências regionais." },
          { label: "Foto de perfil", text: "usada para identificação visual no seu perfil público." },
          { label: "Registros profissionais (CRM, OAB, CREA etc.)", text: "usados para verificação de credenciais de especialistas." },
          { label: "LinkedIn e redes sociais", text: "usados para exibir sua presença profissional no perfil público, quando informado." },
          { label: "Logs de acesso (IP, dispositivo, navegador, páginas visitadas)", text: "usados para segurança, prevenção de fraude e diagnóstico técnico." },
        ],
      },
      {
        title: "3. Não Utilizamos Rastreamento de Terceiros",
        paragraphs: [
          "A Valore NÃO utiliza Google Analytics, Meta Pixel ou qualquer outro serviço de rastreamento de terceiros para monitorar seu comportamento de navegação. Coletamos apenas os dados descritos nesta Política, diretamente em nossa própria infraestrutura.",
        ],
      },
      {
        title: "4. Como Usamos seus Dados",
        listIntro: "Utilizamos suas informações para:",
        list: [
          { text: "Criar e gerenciar sua conta na plataforma;" },
          { text: "Processar lances, pagamentos e saques;" },
          { text: "Verificar credenciais de especialistas e garantir a qualidade do marketplace;" },
          { text: "Enviar notificações sobre leilões, mensagens e atualizações da plataforma;" },
          { text: "Cumprir obrigações legais e regulatórias;" },
          { text: "Prevenir fraudes e garantir a segurança da comunidade Valore." },
        ],
      },
      {
        title: "5. Compartilhamento de Dados",
        listIntro: "Não vendemos seus dados pessoais. Podemos compartilhar informações com:",
        list: [
          { text: "Processador de pagamento (Mercado Pago) para transações financeiras — a Valore não armazena números de cartão de crédito; os dados de pagamento são processados e armazenados diretamente pelo Mercado Pago;" },
          { text: "Provedores de videochamada (Google Meet, Zoom, Microsoft Teams) para geração de links de sessão;" },
          { text: "Autoridades competentes, quando exigido por lei ou ordem judicial." },
        ],
      },
      {
        title: "6. Segurança",
        paragraphs: [
          "Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito (TLS 1.3), hash de senhas (bcrypt) e armazenamento seguro em servidores certificados. Apesar dos nossos esforços, nenhum sistema é 100% invulnerável. Notificaremos você em caso de incidentes de segurança relevantes.",
        ],
      },
      {
        title: "7. Retenção de Dados",
        paragraphs: [
          "Mantemos seus dados pessoais enquanto sua conta estiver ativa. Após o encerramento da conta, dados fiscais e de transação são retidos por até 5 (cinco) anos, conforme exigido pela legislação fiscal brasileira. Demais dados são excluídos ou anonimizados ao final desse prazo.",
        ],
      },
      {
        title: "8. Seus Direitos",
        listIntro: "Nos termos da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você tem os seguintes direitos sobre seus dados pessoais:",
        list: [
          { label: "Acesso", text: "solicitar uma cópia dos dados pessoais que mantemos sobre você." },
          { label: "Correção", text: "solicitar a correção de dados incompletos, inexatos ou desatualizados." },
          { label: "Exclusão", text: "solicitar a exclusão de dados tratados com base no seu consentimento." },
          { label: "Portabilidade", text: "solicitar a transferência dos seus dados a outro fornecedor de serviço." },
        ],
      },
      {
        title: "9. Encarregado de Dados (DPO)",
        paragraphs: [
          `Para exercer os direitos acima ou esclarecer dúvidas sobre o tratamento dos seus dados, entre em contato com o Encarregado de Dados (DPO) da Valore pelo e-mail ${CONTACT_EMAIL}. Responderemos em até 15 dias úteis.`,
        ],
      },
      {
        title: "10. Base Legal para o Tratamento de Dados",
        paragraphs: [
          "Tratamos seus dados pessoais com base no seu consentimento, fornecido no momento do cadastro e aceite destes documentos, e na necessidade de execução do contrato de prestação de serviços da plataforma — incluindo processamento de pagamentos, verificação de credenciais e comunicação sobre leilões e sessões.",
        ],
      },
      {
        title: "11. Alterações nesta Política",
        paragraphs: [
          "Podemos atualizar esta Política de Privacidade periodicamente. Sempre que houver mudanças materiais, notificaremos você por e-mail ou por meio de aviso na plataforma. O uso continuado da Valore após a publicação das alterações constitui aceitação dos novos termos.",
        ],
      },
      {
        title: "12. Contato",
        listIntro: "Em caso de dúvidas sobre esta Política de Privacidade, entre em contato:",
        paragraphs: [`E-mail: ${CONTACT_EMAIL}`],
      },
    ],
  },
  en: {
    pageLabel: "Legal",
    heading: "Privacy",
    headingAccent: "Policy",
    updated: "Last updated: June 8, 2026",
    otherDocLink: "Terms of Use",
    homeLink: "Back to home",
    sections: [
      {
        title: "Operator Identification",
        list: [
          { label: "Legal name", text: RAZAO_SOCIAL },
          { label: "Tax ID (CNPJ)", text: CNPJ },
          { label: "Contact", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Introduction",
        paragraphs: [
          "Valore (“Platform”, “we”, “us”) values your privacy. This Privacy Policy describes how we collect, use, store, and protect users' personal information (“you”, “your”) when using our human time auction platform.",
        ],
      },
      {
        title: "2. Data We Collect",
        listIntro: "We collect the following data, each for a specific purpose:",
        list: [
          { label: "Full name", text: "used for identification and account creation." },
          { label: "Email", text: "used for authentication, communication, and account recovery." },
          { label: "CPF/CNPJ (Brazilian tax ID)", text: "used for identity verification and compliance with tax and legal obligations." },
          { label: "Phone", text: "used for contact and appointment confirmation." },
          { label: "City and State", text: "used for profile display and compliance with regional requirements." },
          { label: "Profile photo", text: "used for visual identification on your public profile." },
          { label: "Professional licenses (CRM, OAB, CREA, etc.)", text: "used to verify specialists' credentials." },
          { label: "LinkedIn and social media", text: "used to display your professional presence on your public profile, when provided." },
          { label: "Access logs (IP address, device, browser, pages visited)", text: "used for security, fraud prevention, and technical diagnostics." },
        ],
      },
      {
        title: "3. We Do Not Use Third-Party Tracking",
        paragraphs: [
          "Valore does NOT use Google Analytics, Meta Pixel, or any other third-party tracking service to monitor your browsing behavior. We only collect the data described in this Policy, directly on our own infrastructure.",
        ],
      },
      {
        title: "4. How We Use Your Data",
        listIntro: "We use your information to:",
        list: [
          { text: "Create and manage your account on the platform;" },
          { text: "Process bids, payments, and withdrawals;" },
          { text: "Verify specialist credentials and ensure marketplace quality;" },
          { text: "Send notifications about auctions, messages, and platform updates;" },
          { text: "Comply with legal and regulatory obligations;" },
          { text: "Prevent fraud and ensure the security of the Valore community." },
        ],
      },
      {
        title: "5. Data Sharing",
        listIntro: "We do not sell your personal data. We may share information with:",
        list: [
          { text: "Payment processor (Mercado Pago) for financial transactions — Valore does not store credit card numbers; payment data is processed and stored directly by Mercado Pago;" },
          { text: "Video call providers (Google Meet, Zoom, Microsoft Teams) for generating session links;" },
          { text: "Competent authorities, when required by law or court order." },
        ],
      },
      {
        title: "6. Security",
        paragraphs: [
          "We adopt technical and organizational measures to protect your data, including encryption in transit (TLS 1.3), password hashing (bcrypt), and secure storage on certified servers. Despite our efforts, no system is 100% invulnerable. We will notify you in case of relevant security incidents.",
        ],
      },
      {
        title: "7. Data Retention",
        paragraphs: [
          "We retain your personal data for as long as your account remains active. After account closure, tax and transaction data are retained for up to 5 (five) years, as required by Brazilian tax law. Other data is deleted or anonymized at the end of this period.",
        ],
      },
      {
        title: "8. Your Rights",
        listIntro: "Under Brazil's General Data Protection Law (LGPD — Law No. 13,709/2018), you have the following rights regarding your personal data:",
        list: [
          { label: "Access", text: "request a copy of the personal data we hold about you." },
          { label: "Correction", text: "request correction of incomplete, inaccurate, or outdated data." },
          { label: "Deletion", text: "request deletion of data processed based on your consent." },
          { label: "Portability", text: "request the transfer of your data to another service provider." },
        ],
      },
      {
        title: "9. Data Protection Officer (DPO)",
        paragraphs: [
          `To exercise the rights above or to clarify questions about the processing of your data, contact Valore's Data Protection Officer (DPO) at ${CONTACT_EMAIL}. We will respond within 15 business days.`,
        ],
      },
      {
        title: "10. Legal Basis for Processing",
        paragraphs: [
          "We process your personal data based on your consent, given at the time of registration and acceptance of these documents, and on the necessity of performing the platform's service contract — including payment processing, credential verification, and communication about auctions and sessions.",
        ],
      },
      {
        title: "11. Changes to this Policy",
        paragraphs: [
          "We may update this Privacy Policy periodically. Whenever there are material changes, we will notify you by email or via a notice on the platform. Continued use of Valore after changes are published constitutes acceptance of the new terms.",
        ],
      },
      {
        title: "12. Contact",
        listIntro: "If you have questions about this Privacy Policy, please contact us:",
        paragraphs: [`Email: ${CONTACT_EMAIL}`],
      },
    ],
  },
  es: {
    pageLabel: "Legal",
    heading: "Política de",
    headingAccent: "Privacidad",
    updated: "Última actualización: 8 de junio de 2026",
    otherDocLink: "Términos de uso",
    homeLink: "Volver al inicio",
    sections: [
      {
        title: "Identificación del Operador",
        list: [
          { label: "Razón social", text: RAZAO_SOCIAL },
          { label: "CNPJ", text: CNPJ },
          { label: "Contacto", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Introducción",
        paragraphs: [
          "Valore (“Plataforma”, “nosotros”) valora tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal de los usuarios (“tú”, “tu”) al utilizar nuestra plataforma de subasta de tiempo humano.",
        ],
      },
      {
        title: "2. Datos que Recopilamos",
        listIntro: "Recopilamos los siguientes datos, cada uno con una finalidad específica:",
        list: [
          { label: "Nombre completo", text: "utilizado para identificación y creación de tu cuenta." },
          { label: "Correo electrónico", text: "utilizado para autenticación, comunicación y recuperación de acceso." },
          { label: "CPF/CNPJ", text: "utilizado para verificación de identidad y cumplimiento de obligaciones fiscales y legales." },
          { label: "Teléfono", text: "utilizado para contacto y confirmación de citas." },
          { label: "Ciudad y Estado", text: "utilizados para mostrar en el perfil y cumplir requisitos regionales." },
          { label: "Foto de perfil", text: "utilizada para identificación visual en tu perfil público." },
          { label: "Registros profesionales (CRM, OAB, CREA, etc.)", text: "utilizados para verificar las credenciales de los especialistas." },
          { label: "LinkedIn y redes sociales", text: "utilizados para mostrar tu presencia profesional en el perfil público, cuando se proporcionen." },
          { label: "Registros de acceso (IP, dispositivo, navegador, páginas visitadas)", text: "utilizados para seguridad, prevención de fraude y diagnóstico técnico." },
        ],
      },
      {
        title: "3. No Utilizamos Rastreo de Terceros",
        paragraphs: [
          "Valore NO utiliza Google Analytics, Meta Pixel ni ningún otro servicio de rastreo de terceros para monitorear tu comportamiento de navegación. Solo recopilamos los datos descritos en esta Política, directamente en nuestra propia infraestructura.",
        ],
      },
      {
        title: "4. Cómo Usamos tus Datos",
        listIntro: "Utilizamos tu información para:",
        list: [
          { text: "Crear y gestionar tu cuenta en la plataforma;" },
          { text: "Procesar pujas, pagos y retiros;" },
          { text: "Verificar credenciales de especialistas y garantizar la calidad del mercado;" },
          { text: "Enviar notificaciones sobre subastas, mensajes y actualizaciones de la plataforma;" },
          { text: "Cumplir obligaciones legales y regulatorias;" },
          { text: "Prevenir fraudes y garantizar la seguridad de la comunidad Valore." },
        ],
      },
      {
        title: "5. Intercambio de Datos",
        listIntro: "No vendemos tus datos personales. Podemos compartir información con:",
        list: [
          { text: "Procesador de pago (Mercado Pago) para transacciones financieras — Valore no almacena números de tarjeta de crédito; los datos de pago son procesados y almacenados directamente por Mercado Pago;" },
          { text: "Proveedores de videollamada (Google Meet, Zoom, Microsoft Teams) para generar enlaces de sesión;" },
          { text: "Autoridades competentes, cuando lo exija la ley o una orden judicial." },
        ],
      },
      {
        title: "6. Seguridad",
        paragraphs: [
          "Adoptamos medidas técnicas y organizativas para proteger tus datos, incluyendo cifrado en tránsito (TLS 1.3), hash de contraseñas (bcrypt) y almacenamiento seguro en servidores certificados. A pesar de nuestros esfuerzos, ningún sistema es 100% invulnerable. Te notificaremos en caso de incidentes de seguridad relevantes.",
        ],
      },
      {
        title: "7. Retención de Datos",
        paragraphs: [
          "Conservamos tus datos personales mientras tu cuenta permanezca activa. Tras el cierre de la cuenta, los datos fiscales y de transacción se conservan hasta 5 (cinco) años, según lo exige la legislación fiscal brasileña. Los demás datos se eliminan o anonimizan al final de ese plazo.",
        ],
      },
      {
        title: "8. Tus Derechos",
        listIntro: "En virtud de la Ley General de Protección de Datos de Brasil (LGPD — Ley n.º 13.709/2018), tienes los siguientes derechos sobre tus datos personales:",
        list: [
          { label: "Acceso", text: "solicitar una copia de los datos personales que mantenemos sobre ti." },
          { label: "Corrección", text: "solicitar la corrección de datos incompletos, inexactos o desactualizados." },
          { label: "Eliminación", text: "solicitar la eliminación de datos tratados con base en tu consentimiento." },
          { label: "Portabilidad", text: "solicitar la transferencia de tus datos a otro proveedor de servicios." },
        ],
      },
      {
        title: "9. Encargado de Protección de Datos (DPO)",
        paragraphs: [
          `Para ejercer los derechos anteriores o resolver dudas sobre el tratamiento de tus datos, contacta al Encargado de Protección de Datos (DPO) de Valore por correo a ${CONTACT_EMAIL}. Responderemos en un plazo de hasta 15 días hábiles.`,
        ],
      },
      {
        title: "10. Base Legal para el Tratamiento",
        paragraphs: [
          "Tratamos tus datos personales con base en tu consentimiento, otorgado en el momento del registro y la aceptación de estos documentos, y en la necesidad de ejecución del contrato de prestación de servicios de la plataforma — incluyendo el procesamiento de pagos, la verificación de credenciales y la comunicación sobre subastas y sesiones.",
        ],
      },
      {
        title: "11. Cambios en esta Política",
        paragraphs: [
          "Podemos actualizar esta Política de Privacidad periódicamente. Siempre que haya cambios materiales, te notificaremos por correo electrónico o mediante un aviso en la plataforma. El uso continuado de Valore tras la publicación de los cambios constituye la aceptación de los nuevos términos.",
        ],
      },
      {
        title: "12. Contacto",
        listIntro: "Si tienes dudas sobre esta Política de Privacidad, contáctanos:",
        paragraphs: [`Correo electrónico: ${CONTACT_EMAIL}`],
      },
    ],
  },
  fr: {
    pageLabel: "Mentions légales",
    heading: "Politique de",
    headingAccent: "Confidentialité",
    updated: "Dernière mise à jour : 8 juin 2026",
    otherDocLink: "Conditions d'utilisation",
    homeLink: "Retour à l'accueil",
    sections: [
      {
        title: "Identification de l'Exploitant",
        list: [
          { label: "Raison sociale", text: RAZAO_SOCIAL },
          { label: "CNPJ", text: CNPJ },
          { label: "Contact", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Introduction",
        paragraphs: [
          "Valore (« Plateforme », « nous ») accorde de l'importance à votre vie privée. Cette Politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons les informations personnelles des utilisateurs (« vous », « votre ») lors de l'utilisation de notre plateforme d'enchères de temps humain.",
        ],
      },
      {
        title: "2. Données que Nous Collectons",
        listIntro: "Nous collectons les données suivantes, chacune ayant une finalité spécifique :",
        list: [
          { label: "Nom complet", text: "utilisé pour l'identification et la création de votre compte." },
          { label: "E-mail", text: "utilisé pour l'authentification, la communication et la récupération d'accès." },
          { label: "CPF/CNPJ (identifiant fiscal brésilien)", text: "utilisé pour la vérification d'identité et le respect des obligations fiscales et légales." },
          { label: "Téléphone", text: "utilisé pour le contact et la confirmation des rendez-vous." },
          { label: "Ville et État", text: "utilisés pour l'affichage du profil et la conformité aux exigences régionales." },
          { label: "Photo de profil", text: "utilisée pour l'identification visuelle sur votre profil public." },
          { label: "Qualifications professionnelles (CRM, OAB, CREA, etc.)", text: "utilisées pour vérifier les qualifications des spécialistes." },
          { label: "LinkedIn et réseaux sociaux", text: "utilisés pour afficher votre présence professionnelle sur votre profil public, lorsqu'ils sont renseignés." },
          { label: "Journaux d'accès (IP, appareil, navigateur, pages visitées)", text: "utilisés pour la sécurité, la prévention de la fraude et le diagnostic technique." },
        ],
      },
      {
        title: "3. Nous N'utilisons Aucun Suivi Tiers",
        paragraphs: [
          "Valore N'utilise PAS Google Analytics, Meta Pixel ni aucun autre service de suivi tiers pour surveiller votre comportement de navigation. Nous ne collectons que les données décrites dans cette Politique, directement sur notre propre infrastructure.",
        ],
      },
      {
        title: "4. Comment Nous Utilisons vos Données",
        listIntro: "Nous utilisons vos informations pour :",
        list: [
          { text: "Créer et gérer votre compte sur la plateforme ;" },
          { text: "Traiter les offres, paiements et retraits ;" },
          { text: "Vérifier les qualifications des spécialistes et garantir la qualité de la marketplace ;" },
          { text: "Envoyer des notifications concernant les enchères, messages et mises à jour de la plateforme ;" },
          { text: "Respecter les obligations légales et réglementaires ;" },
          { text: "Prévenir la fraude et garantir la sécurité de la communauté Valore." },
        ],
      },
      {
        title: "5. Partage des Données",
        listIntro: "Nous ne vendons pas vos données personnelles. Nous pouvons partager des informations avec :",
        list: [
          { text: "Un prestataire de paiement (Mercado Pago) pour les transactions financières — Valore ne stocke pas les numéros de carte de crédit ; les données de paiement sont traitées et stockées directement par Mercado Pago ;" },
          { text: "Des fournisseurs d'appel vidéo (Google Meet, Zoom, Microsoft Teams) pour générer les liens de session ;" },
          { text: "Les autorités compétentes, lorsque la loi ou une décision de justice l'exige." },
        ],
      },
      {
        title: "6. Sécurité",
        paragraphs: [
          "Nous adoptons des mesures techniques et organisationnelles pour protéger vos données, notamment le chiffrement en transit (TLS 1.3), le hachage des mots de passe (bcrypt) et un stockage sécurisé sur des serveurs certifiés. Malgré nos efforts, aucun système n'est invulnérable à 100 %. Nous vous informerons en cas d'incidents de sécurité significatifs.",
        ],
      },
      {
        title: "7. Conservation des Données",
        paragraphs: [
          "Nous conservons vos données personnelles tant que votre compte reste actif. Après la clôture du compte, les données fiscales et de transaction sont conservées jusqu'à 5 (cinq) ans, conformément à la législation fiscale brésilienne. Les autres données sont supprimées ou anonymisées à l'issue de cette période.",
        ],
      },
      {
        title: "8. Vos Droits",
        listIntro: "En vertu de la loi brésilienne de protection des données (LGPD — loi n° 13 709/2018), vous disposez des droits suivants concernant vos données personnelles :",
        list: [
          { label: "Accès", text: "demander une copie des données personnelles que nous détenons à votre sujet." },
          { label: "Rectification", text: "demander la correction de données incomplètes, inexactes ou obsolètes." },
          { label: "Suppression", text: "demander la suppression des données traitées sur la base de votre consentement." },
          { label: "Portabilité", text: "demander le transfert de vos données vers un autre prestataire de services." },
        ],
      },
      {
        title: "9. Délégué à la Protection des Données (DPO)",
        paragraphs: [
          `Pour exercer les droits ci-dessus ou pour toute question sur le traitement de vos données, contactez le délégué à la protection des données (DPO) de Valore à ${CONTACT_EMAIL}. Nous répondrons sous 15 jours ouvrés.`,
        ],
      },
      {
        title: "10. Base Légale du Traitement",
        paragraphs: [
          "Nous traitons vos données personnelles sur la base de votre consentement, donné au moment de l'inscription et de l'acceptation de ces documents, ainsi que de la nécessité d'exécuter le contrat de prestation de services de la plateforme — y compris le traitement des paiements, la vérification des qualifications et la communication relative aux enchères et aux sessions.",
        ],
      },
      {
        title: "11. Modifications de cette Politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette Politique de confidentialité périodiquement. En cas de changements substantiels, nous vous informerons par e-mail ou via un avis sur la plateforme. L'utilisation continue de Valore après la publication des modifications constitue une acceptation des nouvelles conditions.",
        ],
      },
      {
        title: "12. Contact",
        listIntro: "Pour toute question concernant cette Politique de confidentialité, contactez-nous :",
        paragraphs: [`E-mail : ${CONTACT_EMAIL}`],
      },
    ],
  },
  de: {
    pageLabel: "Rechtliches",
    heading: "Datenschutz-",
    headingAccent: "erklärung",
    updated: "Zuletzt aktualisiert: 8. Juni 2026",
    otherDocLink: "Nutzungsbedingungen",
    homeLink: "Zurück zur Startseite",
    sections: [
      {
        title: "Angaben zum Betreiber",
        list: [
          { label: "Firmenname", text: RAZAO_SOCIAL },
          { label: "CNPJ (brasilianische Steuernummer)", text: CNPJ },
          { label: "Kontakt", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Einleitung",
        paragraphs: [
          "Valore („Plattform“, „wir“) legt Wert auf Ihre Privatsphäre. Diese Datenschutzerklärung beschreibt, wie wir personenbezogene Daten der Nutzer („Sie“, „Ihre“) bei der Nutzung unserer Plattform für Auktionen menschlicher Zeit erheben, verwenden, speichern und schützen.",
        ],
      },
      {
        title: "2. Daten, die Wir Erheben",
        listIntro: "Wir erheben die folgenden Daten, jeweils zu einem bestimmten Zweck:",
        list: [
          { label: "Vollständiger Name", text: "zur Identifizierung und Kontoerstellung verwendet." },
          { label: "E-Mail", text: "zur Authentifizierung, Kommunikation und Zugangswiederherstellung verwendet." },
          { label: "CPF/CNPJ (brasilianische Steuernummer)", text: "zur Identitätsprüfung und Erfüllung steuerlicher und rechtlicher Pflichten verwendet." },
          { label: "Telefon", text: "zur Kontaktaufnahme und Terminbestätigung verwendet." },
          { label: "Stadt und Bundesstaat", text: "zur Profilanzeige und Erfüllung regionaler Anforderungen verwendet." },
          { label: "Profilfoto", text: "zur visuellen Identifizierung in Ihrem öffentlichen Profil verwendet." },
          { label: "Berufliche Zulassungen (CRM, OAB, CREA usw.)", text: "zur Überprüfung der Qualifikationen von Spezialisten verwendet." },
          { label: "LinkedIn und soziale Medien", text: "zur Anzeige Ihrer beruflichen Präsenz in Ihrem öffentlichen Profil verwendet, sofern angegeben." },
          { label: "Zugriffsprotokolle (IP-Adresse, Gerät, Browser, besuchte Seiten)", text: "für Sicherheit, Betrugsprävention und technische Diagnose verwendet." },
        ],
      },
      {
        title: "3. Wir Verwenden Kein Tracking Dritter",
        paragraphs: [
          "Valore verwendet KEINE Google Analytics-, Meta-Pixel- oder sonstigen Tracking-Dienste Dritter zur Überwachung Ihres Surfverhaltens. Wir erheben ausschließlich die in dieser Richtlinie beschriebenen Daten, direkt auf unserer eigenen Infrastruktur.",
        ],
      },
      {
        title: "4. Wie Wir Ihre Daten Verwenden",
        listIntro: "Wir verwenden Ihre Informationen, um:",
        list: [
          { text: "Ihr Konto auf der Plattform zu erstellen und zu verwalten;" },
          { text: "Gebote, Zahlungen und Auszahlungen zu verarbeiten;" },
          { text: "Qualifikationen von Spezialisten zu überprüfen und die Marktplatzqualität sicherzustellen;" },
          { text: "Benachrichtigungen über Auktionen, Nachrichten und Plattform-Updates zu senden;" },
          { text: "Rechtliche und regulatorische Verpflichtungen zu erfüllen;" },
          { text: "Betrug zu verhindern und die Sicherheit der Valore-Community zu gewährleisten." },
        ],
      },
      {
        title: "5. Datenweitergabe",
        listIntro: "Wir verkaufen Ihre personenbezogenen Daten nicht. Wir können Informationen weitergeben an:",
        list: [
          { text: "Einen Zahlungsdienstleister (Mercado Pago) für Finanztransaktionen — Valore speichert keine Kreditkartennummern; Zahlungsdaten werden direkt von Mercado Pago verarbeitet und gespeichert;" },
          { text: "Videoanruf-Anbieter (Google Meet, Zoom, Microsoft Teams) zur Erstellung von Sitzungslinks;" },
          { text: "Zuständige Behörden, sofern gesetzlich oder gerichtlich vorgeschrieben." },
        ],
      },
      {
        title: "6. Sicherheit",
        paragraphs: [
          "Wir ergreifen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten, darunter Verschlüsselung während der Übertragung (TLS 1.3), Passwort-Hashing (bcrypt) und sichere Speicherung auf zertifizierten Servern. Trotz unserer Bemühungen ist kein System zu 100 % unverwundbar. Wir werden Sie im Falle relevanter Sicherheitsvorfälle benachrichtigen.",
        ],
      },
      {
        title: "7. Datenspeicherung",
        paragraphs: [
          "Wir bewahren Ihre personenbezogenen Daten auf, solange Ihr Konto aktiv ist. Nach Kontoschließung werden Steuer- und Transaktionsdaten gemäß den Vorgaben des brasilianischen Steuerrechts bis zu 5 (fünf) Jahre lang aufbewahrt. Andere Daten werden am Ende dieses Zeitraums gelöscht oder anonymisiert.",
        ],
      },
      {
        title: "8. Ihre Rechte",
        listIntro: "Gemäß dem brasilianischen Datenschutzgesetz (LGPD — Gesetz Nr. 13.709/2018) haben Sie folgende Rechte bezüglich Ihrer personenbezogenen Daten:",
        list: [
          { label: "Zugriff", text: "eine Kopie der über Sie gespeicherten personenbezogenen Daten anfordern." },
          { label: "Berichtigung", text: "die Berichtigung unvollständiger, ungenauer oder veralteter Daten verlangen." },
          { label: "Löschung", text: "die Löschung von Daten verlangen, die auf Grundlage Ihrer Einwilligung verarbeitet werden." },
          { label: "Übertragbarkeit", text: "die Übertragung Ihrer Daten an einen anderen Dienstanbieter verlangen." },
        ],
      },
      {
        title: "9. Datenschutzbeauftragter (DPO)",
        paragraphs: [
          `Um die oben genannten Rechte auszuüben oder Fragen zur Verarbeitung Ihrer Daten zu klären, wenden Sie sich an den Datenschutzbeauftragten (DPO) von Valore unter ${CONTACT_EMAIL}. Wir werden innerhalb von 15 Werktagen antworten.`,
        ],
      },
      {
        title: "10. Rechtsgrundlage der Verarbeitung",
        paragraphs: [
          "Wir verarbeiten Ihre personenbezogenen Daten auf der Grundlage Ihrer Einwilligung, die Sie bei der Registrierung und Annahme dieser Dokumente erteilt haben, sowie aufgrund der Notwendigkeit der Erfüllung des Dienstleistungsvertrags der Plattform — einschließlich Zahlungsabwicklung, Überprüfung von Qualifikationen und Kommunikation über Auktionen und Sitzungen.",
        ],
      },
      {
        title: "11. Änderungen dieser Richtlinie",
        paragraphs: [
          "Wir können diese Datenschutzerklärung regelmäßig aktualisieren. Bei wesentlichen Änderungen benachrichtigen wir Sie per E-Mail oder über einen Hinweis auf der Plattform. Die fortgesetzte Nutzung von Valore nach Veröffentlichung der Änderungen stellt die Annahme der neuen Bedingungen dar.",
        ],
      },
      {
        title: "12. Kontakt",
        listIntro: "Bei Fragen zu dieser Datenschutzerklärung kontaktieren Sie uns:",
        paragraphs: [`E-Mail: ${CONTACT_EMAIL}`],
      },
    ],
  },
  it: {
    pageLabel: "Legale",
    heading: "Informativa sulla",
    headingAccent: "Privacy",
    updated: "Ultimo aggiornamento: 8 giugno 2026",
    otherDocLink: "Termini di Utilizzo",
    homeLink: "Torna alla home",
    sections: [
      {
        title: "Identificazione del Gestore",
        list: [
          { label: "Ragione sociale", text: RAZAO_SOCIAL },
          { label: "CNPJ (codice fiscale brasiliano)", text: CNPJ },
          { label: "Contatto", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. Introduzione",
        paragraphs: [
          "Valore (“Piattaforma”, “noi”) tiene alla tua privacy. Questa Informativa sulla Privacy descrive come raccogliamo, utilizziamo, conserviamo e proteggiamo le informazioni personali degli utenti (“tu”, “tuo”) nell'utilizzo della nostra piattaforma di asta di tempo umano.",
        ],
      },
      {
        title: "2. Dati che Raccogliamo",
        listIntro: "Raccogliamo i seguenti dati, ciascuno con una finalità specifica:",
        list: [
          { label: "Nome completo", text: "utilizzato per l'identificazione e la creazione del tuo account." },
          { label: "Email", text: "utilizzata per l'autenticazione, la comunicazione e il recupero dell'accesso." },
          { label: "CPF/CNPJ (codice fiscale brasiliano)", text: "utilizzato per la verifica dell'identità e il rispetto degli obblighi fiscali e legali." },
          { label: "Telefono", text: "utilizzato per il contatto e la conferma degli appuntamenti." },
          { label: "Città e Stato", text: "utilizzati per la visualizzazione nel profilo e la conformità ai requisiti regionali." },
          { label: "Foto del profilo", text: "utilizzata per l'identificazione visiva nel tuo profilo pubblico." },
          { label: "Albi professionali (CRM, OAB, CREA, ecc.)", text: "utilizzati per verificare le credenziali degli specialisti." },
          { label: "LinkedIn e social media", text: "utilizzati per mostrare la tua presenza professionale nel profilo pubblico, quando forniti." },
          { label: "Log di accesso (IP, dispositivo, browser, pagine visitate)", text: "utilizzati per sicurezza, prevenzione delle frodi e diagnostica tecnica." },
        ],
      },
      {
        title: "3. Non Utilizziamo Tracciamento di Terze Parti",
        paragraphs: [
          "Valore NON utilizza Google Analytics, Meta Pixel o qualsiasi altro servizio di tracciamento di terze parti per monitorare il tuo comportamento di navigazione. Raccogliamo solo i dati descritti in questa Informativa, direttamente sulla nostra infrastruttura.",
        ],
      },
      {
        title: "4. Come Utilizziamo i tuoi Dati",
        listIntro: "Utilizziamo le tue informazioni per:",
        list: [
          { text: "Creare e gestire il tuo account sulla piattaforma;" },
          { text: "Elaborare offerte, pagamenti e prelievi;" },
          { text: "Verificare le credenziali degli specialisti e garantire la qualità del marketplace;" },
          { text: "Inviare notifiche su aste, messaggi e aggiornamenti della piattaforma;" },
          { text: "Adempiere agli obblighi legali e normativi;" },
          { text: "Prevenire frodi e garantire la sicurezza della community Valore." },
        ],
      },
      {
        title: "5. Condivisione dei Dati",
        listIntro: "Non vendiamo i tuoi dati personali. Potremmo condividere informazioni con:",
        list: [
          { text: "Un elaboratore di pagamento (Mercado Pago) per le transazioni finanziarie — Valore non memorizza i numeri delle carte di credito; i dati di pagamento vengono elaborati e conservati direttamente da Mercado Pago;" },
          { text: "Fornitori di videochiamata (Google Meet, Zoom, Microsoft Teams) per generare i link delle sessioni;" },
          { text: "Autorità competenti, quando richiesto dalla legge o da un'ordinanza giudiziaria." },
        ],
      },
      {
        title: "6. Sicurezza",
        paragraphs: [
          "Adottiamo misure tecniche e organizzative per proteggere i tuoi dati, tra cui crittografia in transito (TLS 1.3), hash delle password (bcrypt) e archiviazione sicura su server certificati. Nonostante i nostri sforzi, nessun sistema è invulnerabile al 100%. Ti informeremo in caso di incidenti di sicurezza rilevanti.",
        ],
      },
      {
        title: "7. Conservazione dei Dati",
        paragraphs: [
          "Conserviamo i tuoi dati personali finché il tuo account rimane attivo. Dopo la chiusura dell'account, i dati fiscali e di transazione vengono conservati fino a 5 (cinque) anni, come richiesto dalla normativa fiscale brasiliana. Gli altri dati vengono eliminati o anonimizzati al termine di tale periodo.",
        ],
      },
      {
        title: "8. I tuoi Diritti",
        listIntro: "Ai sensi della Legge Generale sulla Protezione dei Dati brasiliana (LGPD — Legge n. 13.709/2018), hai i seguenti diritti relativi ai tuoi dati personali:",
        list: [
          { label: "Accesso", text: "richiedere una copia dei dati personali che conserviamo su di te." },
          { label: "Rettifica", text: "richiedere la correzione di dati incompleti, inesatti o obsoleti." },
          { label: "Cancellazione", text: "richiedere la cancellazione dei dati trattati sulla base del tuo consenso." },
          { label: "Portabilità", text: "richiedere il trasferimento dei tuoi dati a un altro fornitore di servizi." },
        ],
      },
      {
        title: "9. Responsabile della Protezione dei Dati (DPO)",
        paragraphs: [
          `Per esercitare i diritti sopra indicati o per chiarire dubbi sul trattamento dei tuoi dati, contatta il Responsabile della Protezione dei Dati (DPO) di Valore all'indirizzo ${CONTACT_EMAIL}. Risponderemo entro 15 giorni lavorativi.`,
        ],
      },
      {
        title: "10. Base Giuridica del Trattamento",
        paragraphs: [
          "Trattiamo i tuoi dati personali sulla base del tuo consenso, fornito al momento della registrazione e dell'accettazione di questi documenti, e della necessità di esecuzione del contratto di fornitura dei servizi della piattaforma — incluso il trattamento dei pagamenti, la verifica delle credenziali e la comunicazione su aste e sessioni.",
        ],
      },
      {
        title: "11. Modifiche a questa Informativa",
        paragraphs: [
          "Potremmo aggiornare periodicamente questa Informativa sulla Privacy. In caso di modifiche sostanziali, ti informeremo via email o tramite un avviso sulla piattaforma. L'uso continuato di Valore dopo la pubblicazione delle modifiche costituisce accettazione dei nuovi termini.",
        ],
      },
      {
        title: "12. Contatto",
        listIntro: "In caso di dubbi su questa Informativa sulla Privacy, contattaci:",
        paragraphs: [`Email: ${CONTACT_EMAIL}`],
      },
    ],
  },
  ja: {
    pageLabel: "法的情報",
    heading: "プライバシー",
    headingAccent: "ポリシー",
    updated: "最終更新日：2026年6月8日",
    otherDocLink: "利用規約",
    homeLink: "ホームに戻る",
    sections: [
      {
        title: "運営者情報",
        list: [
          { label: "商号", text: RAZAO_SOCIAL },
          { label: "CNPJ（ブラジル法人番号）", text: CNPJ },
          { label: "連絡先", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. はじめに",
        paragraphs: [
          "Valore（「プラットフォーム」、「当社」）はお客様のプライバシーを尊重します。本プライバシーポリシーは、人の時間のオークションプラットフォームをご利用いただく際に、当社がユーザー（「お客様」）の個人情報をどのように収集、利用、保存、保護するかを説明するものです。",
        ],
      },
      {
        title: "2. 収集する情報",
        listIntro: "当社は以下の情報を、それぞれ特定の目的のために収集します：",
        list: [
          { label: "氏名", text: "本人確認およびアカウント作成のために使用します。" },
          { label: "メールアドレス", text: "認証、連絡、アカウント復旧のために使用します。" },
          { label: "CPF/CNPJ（ブラジルの納税者番号）", text: "本人確認および税務・法的義務の遵守のために使用します。" },
          { label: "電話番号", text: "連絡および予約確認のために使用します。" },
          { label: "都市・州", text: "プロフィール表示および地域要件への対応のために使用します。" },
          { label: "プロフィール写真", text: "公開プロフィールでの視覚的な識別のために使用します。" },
          { label: "職業登録番号（CRM、OAB、CREAなど）", text: "専門家の資格確認のために使用します。" },
          { label: "LinkedInおよびSNS", text: "情報が提供された場合、公開プロフィールで職業上のプレゼンスを表示するために使用します。" },
          { label: "アクセスログ（IPアドレス、デバイス、ブラウザ、閲覧ページ）", text: "セキュリティ、不正防止、技術診断のために使用します。" },
        ],
      },
      {
        title: "3. 第三者トラッキングは使用しません",
        paragraphs: [
          "Valoreは、お客様の閲覧行動を追跡するために、Google Analytics、Meta Pixel、その他いかなる第三者のトラッキングサービスも使用していません。当社は本ポリシーに記載されたデータのみを、当社自身のインフラ上で直接収集します。",
        ],
      },
      {
        title: "4. 情報の利用方法",
        listIntro: "お客様の情報は以下の目的で利用します：",
        list: [
          { text: "プラットフォーム上のアカウントの作成および管理" },
          { text: "入札、支払い、出金の処理" },
          { text: "専門家の資格確認およびマーケットプレイスの品質確保" },
          { text: "オークション、メッセージ、プラットフォーム更新に関する通知の送信" },
          { text: "法的および規制上の義務の遵守" },
          { text: "不正防止およびValoreコミュニティの安全確保" },
        ],
      },
      {
        title: "5. データの共有",
        listIntro: "お客様の個人情報を販売することはありません。以下と情報を共有する場合があります：",
        list: [
          { text: "金融取引のための決済処理業者（Mercado Pago）— Valoreはクレジットカード番号を保存しません。支払いデータはMercado Pagoによって直接処理・保管されます。" },
          { text: "セッションリンク生成のためのビデオ通話プロバイダー（Google Meet、Zoom、Microsoft Teams）" },
          { text: "法律または裁判所命令により必要な場合の関係当局" },
        ],
      },
      {
        title: "6. セキュリティ",
        paragraphs: [
          "当社は、転送時の暗号化（TLS 1.3）、パスワードのハッシュ化（bcrypt）、認証済みサーバーでの安全な保管など、技術的および組織的な対策を講じています。これらの取り組みにもかかわらず、100%安全なシステムは存在しません。重大なセキュリティインシデントが発生した場合はお客様に通知します。",
        ],
      },
      {
        title: "7. データの保持期間",
        paragraphs: [
          "お客様のアカウントが有効である限り、個人情報を保持します。アカウント閉鎖後も、ブラジルの税法で義務付けられているとおり、税務および取引データは最大5年間保持されます。その他のデータは、この期間の終了時に削除または匿名化されます。",
        ],
      },
      {
        title: "8. お客様の権利",
        listIntro: "ブラジル一般データ保護法（LGPD — 法律第13,709/2018号）に基づき、お客様には個人情報について以下の権利があります：",
        list: [
          { label: "アクセス", text: "当社が保有するお客様の個人情報のコピーを請求すること。" },
          { label: "訂正", text: "不完全、不正確、または古いデータの訂正を請求すること。" },
          { label: "削除", text: "同意に基づいて処理されたデータの削除を請求すること。" },
          { label: "データポータビリティ", text: "お客様のデータを他のサービスプロバイダーに転送するよう請求すること。" },
        ],
      },
      {
        title: "9. データ保護責任者（DPO）",
        paragraphs: [
          `上記の権利を行使する場合、またはお客様のデータの取り扱いについてご質問がある場合は、Valoreのデータ保護責任者（DPO）まで ${CONTACT_EMAIL} でご連絡ください。15営業日以内にご返答いたします。`,
        ],
      },
      {
        title: "10. 処理の法的根拠",
        paragraphs: [
          "当社は、登録時および本書類への同意時に提供されたお客様の同意、ならびに支払い処理、資格確認、オークションおよびセッションに関する連絡を含むプラットフォームのサービス提供契約の履行の必要性に基づき、お客様の個人情報を処理します。",
        ],
      },
      {
        title: "11. 本ポリシーの変更",
        paragraphs: [
          "当社は本プライバシーポリシーを随時更新することがあります。重要な変更がある場合は、メールまたはプラットフォーム上の通知でお知らせします。変更公開後もValoreを継続してご利用いただくことで、新しい条件に同意したものとみなされます。",
        ],
      },
      {
        title: "12. お問い合わせ",
        listIntro: "本プライバシーポリシーに関するご質問は、以下までご連絡ください：",
        paragraphs: [`メール：${CONTACT_EMAIL}`],
      },
    ],
  },
  zh: {
    pageLabel: "法律信息",
    heading: "隐私",
    headingAccent: "政策",
    updated: "最后更新：2026年6月8日",
    otherDocLink: "使用条款",
    homeLink: "返回首页",
    sections: [
      {
        title: "运营者信息",
        list: [
          { label: "商号", text: RAZAO_SOCIAL },
          { label: "CNPJ（巴西税号）", text: CNPJ },
          { label: "联系方式", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. 简介",
        paragraphs: [
          "Valore（“平台”，“我们”）重视您的隐私。本隐私政策说明了在您使用我们的人类时间拍卖平台时，我们如何收集、使用、存储和保护用户（“您”）的个人信息。",
        ],
      },
      {
        title: "2. 我们收集的数据",
        listIntro: "我们收集以下数据，每项均有特定用途：",
        list: [
          { label: "全名", text: "用于身份识别和账户创建。" },
          { label: "电子邮箱", text: "用于身份验证、沟通及账户找回。" },
          { label: "CPF/CNPJ（巴西税号）", text: "用于身份核实及履行税务和法律义务。" },
          { label: "电话", text: "用于联系及预约确认。" },
          { label: "城市和州", text: "用于个人资料展示及满足地区要求。" },
          { label: "个人资料照片", text: "用于在您的公开资料中进行视觉识别。" },
          { label: "职业注册信息（CRM、OAB、CREA 等）", text: "用于核实专家资质。" },
          { label: "领英（LinkedIn）及社交媒体", text: "在您提供的情况下，用于在公开资料中展示您的职业形象。" },
          { label: "访问日志（IP地址、设备、浏览器、访问页面）", text: "用于安全保障、防止欺诈及技术诊断。" },
        ],
      },
      {
        title: "3. 我们不使用第三方跟踪",
        paragraphs: [
          "Valore 不使用 Google Analytics、Meta Pixel 或任何其他第三方跟踪服务来监控您的浏览行为。我们仅在自有基础设施上直接收集本政策中所述的数据。",
        ],
      },
      {
        title: "4. 我们如何使用您的数据",
        listIntro: "我们使用您的信息用于：",
        list: [
          { text: "创建和管理您在平台上的账户；" },
          { text: "处理出价、付款及提现；" },
          { text: "核实专家资质并确保市场质量；" },
          { text: "发送关于拍卖、消息及平台更新的通知；" },
          { text: "履行法律及监管义务；" },
          { text: "预防欺诈并确保 Valore 社区的安全。" },
        ],
      },
      {
        title: "5. 数据共享",
        listIntro: "我们不会出售您的个人数据。我们可能与以下各方共享信息：",
        list: [
          { text: "用于金融交易的支付处理商（Mercado Pago）——Valore 不存储信用卡号；支付数据由 Mercado Pago 直接处理和存储；" },
          { text: "视频通话服务商（Google Meet、Zoom、Microsoft Teams），用于生成会话链接；" },
          { text: "有关部门，依法律或法院命令要求时。" },
        ],
      },
      {
        title: "6. 安全性",
        paragraphs: [
          "我们采取技术和组织措施保护您的数据，包括传输加密（TLS 1.3）、密码哈希处理（bcrypt）以及在经认证的服务器上安全存储。尽管我们尽力而为，但没有任何系统是100%无懈可击的。如发生重大安全事件，我们将通知您。",
        ],
      },
      {
        title: "7. 数据保留",
        paragraphs: [
          "只要您的账户处于活跃状态，我们将保留您的个人数据。账户关闭后，税务和交易数据将根据巴西税法要求保留最多5（五）年。其他数据将在该期限结束时删除或匿名化处理。",
        ],
      },
      {
        title: "8. 您的权利",
        listIntro: "根据巴西《通用数据保护法》（LGPD — 第13,709/2018号法律），您对您的个人数据享有以下权利：",
        list: [
          { label: "访问权", text: "请求获取我们持有的您的个人数据副本。" },
          { label: "更正权", text: "请求更正不完整、不准确或过时的数据。" },
          { label: "删除权", text: "请求删除基于您同意而处理的数据。" },
          { label: "可携权", text: "请求将您的数据转移至其他服务提供商。" },
        ],
      },
      {
        title: "9. 数据保护官（DPO）",
        paragraphs: [
          `如需行使上述权利或对您的数据处理有任何疑问，请通过 ${CONTACT_EMAIL} 联系 Valore 的数据保护官（DPO）。我们将在15个工作日内回复。`,
        ],
      },
      {
        title: "10. 处理的法律依据",
        paragraphs: [
          "我们基于您在注册及接受本文件时所给予的同意，以及履行平台服务合同的必要性（包括支付处理、资质核实以及有关拍卖和会话的沟通）来处理您的个人数据。",
        ],
      },
      {
        title: "11. 本政策的变更",
        paragraphs: [
          "我们可能会定期更新本隐私政策。如有重大变更，我们将通过电子邮件或平台通知告知您。变更发布后继续使用 Valore 即表示接受新条款。",
        ],
      },
      {
        title: "12. 联系方式",
        listIntro: "如对本隐私政策有任何疑问，请联系我们：",
        paragraphs: [`电子邮箱：${CONTACT_EMAIL}`],
      },
    ],
  },
  ar: {
    pageLabel: "قانوني",
    heading: "سياسة",
    headingAccent: "الخصوصية",
    updated: "آخر تحديث: 8 يونيو 2026",
    otherDocLink: "شروط الاستخدام",
    homeLink: "العودة إلى الرئيسية",
    sections: [
      {
        title: "بيانات المشغّل",
        list: [
          { label: "الاسم التجاري", text: RAZAO_SOCIAL },
          { label: "الرقم الضريبي (CNPJ)", text: CNPJ },
          { label: "التواصل", text: CONTACT_EMAIL },
        ],
      },
      {
        title: "1. مقدمة",
        paragraphs: [
          "تُقدِّر Valore («المنصة»، «نحن») خصوصيتك. تصف سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وتخزيننا وحمايتنا للمعلومات الشخصية للمستخدمين («أنت») عند استخدام منصتنا لمزادات الوقت البشري.",
        ],
      },
      {
        title: "2. البيانات التي نجمعها",
        listIntro: "نجمع البيانات التالية، ولكل منها غرض محدد:",
        list: [
          { label: "الاسم الكامل", text: "يُستخدم لتحديد الهوية وإنشاء حسابك." },
          { label: "البريد الإلكتروني", text: "يُستخدم للمصادقة والتواصل واسترداد الوصول إلى الحساب." },
          { label: "CPF/CNPJ (الرقم الضريبي البرازيلي)", text: "يُستخدم للتحقق من الهوية والامتثال للالتزامات الضريبية والقانونية." },
          { label: "الهاتف", text: "يُستخدم للتواصل وتأكيد المواعيد." },
          { label: "المدينة والولاية", text: "تُستخدمان لعرضهما في الملف الشخصي والامتثال للمتطلبات الإقليمية." },
          { label: "صورة الملف الشخصي", text: "تُستخدم للتعريف البصري في ملفك الشخصي العام." },
          { label: "السجلات المهنية (CRM، OAB، CREA، إلخ)", text: "تُستخدم للتحقق من مؤهلات المختصين." },
          { label: "LinkedIn ووسائل التواصل الاجتماعي", text: "تُستخدم لعرض حضورك المهني في ملفك الشخصي العام، عند تقديمها." },
          { label: "سجلات الوصول (عنوان IP، الجهاز، المتصفح، الصفحات التي تمت زيارتها)", text: "تُستخدم للأمان ومنع الاحتيال والتشخيص التقني." },
        ],
      },
      {
        title: "3. لا نستخدم تتبع الأطراف الثالثة",
        paragraphs: [
          "لا تستخدم Valore خدمة Google Analytics أو Meta Pixel أو أي خدمة تتبع أخرى تابعة لجهات خارجية لمراقبة سلوك تصفحك. نجمع فقط البيانات الموضحة في هذه السياسة، مباشرة على بنيتنا التحتية الخاصة.",
        ],
      },
      {
        title: "4. كيفية استخدامنا لبياناتك",
        listIntro: "نستخدم معلوماتك من أجل:",
        list: [
          { text: "إنشاء وإدارة حسابك على المنصة؛" },
          { text: "معالجة العروض والمدفوعات والسحوبات؛" },
          { text: "التحقق من مؤهلات المختصين وضمان جودة السوق؛" },
          { text: "إرسال إشعارات حول المزادات والرسائل وتحديثات المنصة؛" },
          { text: "الامتثال للالتزامات القانونية والتنظيمية؛" },
          { text: "منع الاحتيال وضمان أمان مجتمع Valore." },
        ],
      },
      {
        title: "5. مشاركة البيانات",
        listIntro: "نحن لا نبيع بياناتك الشخصية. قد نشارك المعلومات مع:",
        list: [
          { text: "معالج الدفع (Mercado Pago) للمعاملات المالية — لا تخزّن Valore أرقام بطاقات الائتمان؛ تتم معالجة بيانات الدفع وتخزينها مباشرة بواسطة Mercado Pago؛" },
          { text: "مزودي مكالمات الفيديو (Google Meet، Zoom، Microsoft Teams) لإنشاء روابط الجلسات؛" },
          { text: "السلطات المختصة، عند الاقتضاء بموجب القانون أو أمر قضائي." },
        ],
      },
      {
        title: "6. الأمان",
        paragraphs: [
          "نعتمد تدابير تقنية وتنظيمية لحماية بياناتك، بما في ذلك التشفير أثناء النقل (TLS 1.3)، وتجزئة كلمات المرور (bcrypt)، والتخزين الآمن على خوادم معتمدة. وبالرغم من جهودنا، لا يوجد نظام محصّن بنسبة 100٪. سنخطرك في حال وقوع حوادث أمنية ذات صلة.",
        ],
      },
      {
        title: "7. الاحتفاظ بالبيانات",
        paragraphs: [
          "نحتفظ ببياناتك الشخصية طالما ظل حسابك نشطًا. بعد إغلاق الحساب، تُحفظ البيانات الضريبية وبيانات المعاملات لمدة تصل إلى 5 (خمس) سنوات، وفقًا لما تقتضيه التشريعات الضريبية البرازيلية. أما البيانات الأخرى فتُحذف أو تُجهَّل عند نهاية هذه المدة.",
        ],
      },
      {
        title: "8. حقوقك",
        listIntro: "بموجب القانون العام لحماية البيانات في البرازيل (LGPD - القانون رقم 13.709/2018)، لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:",
        list: [
          { label: "الوصول", text: "طلب نسخة من البيانات الشخصية التي نحتفظ بها عنك." },
          { label: "التصحيح", text: "طلب تصحيح البيانات غير المكتملة أو غير الدقيقة أو القديمة." },
          { label: "الحذف", text: "طلب حذف البيانات المُعالَجة استنادًا إلى موافقتك." },
          { label: "قابلية النقل", text: "طلب نقل بياناتك إلى مزود خدمة آخر." },
        ],
      },
      {
        title: "9. مسؤول حماية البيانات (DPO)",
        paragraphs: [
          `لممارسة الحقوق المذكورة أعلاه أو لتوضيح أي استفسارات حول معالجة بياناتك، تواصل مع مسؤول حماية البيانات (DPO) لدى Valore عبر البريد الإلكتروني ${CONTACT_EMAIL}. سنرد خلال 15 يوم عمل.`,
        ],
      },
      {
        title: "10. الأساس القانوني للمعالجة",
        paragraphs: [
          "نعالج بياناتك الشخصية استنادًا إلى موافقتك، المقدَّمة عند التسجيل وقبول هذه الوثائق، وإلى ضرورة تنفيذ عقد تقديم خدمات المنصة — بما في ذلك معالجة المدفوعات والتحقق من المؤهلات والتواصل بشأن المزادات والجلسات.",
        ],
      },
      {
        title: "11. التغييرات على هذه السياسة",
        paragraphs: [
          "قد نقوم بتحديث سياسة الخصوصية هذه بشكل دوري. عند حدوث تغييرات جوهرية، سنخطرك عبر البريد الإلكتروني أو عبر إشعار على المنصة. يشكّل استمرار استخدام Valore بعد نشر التغييرات قبولاً للشروط الجديدة.",
        ],
      },
      {
        title: "12. التواصل",
        listIntro: "لأي استفسارات حول سياسة الخصوصية هذه، تواصل معنا:",
        paragraphs: [`البريد الإلكتروني: ${CONTACT_EMAIL}`],
      },
    ],
  },
};
