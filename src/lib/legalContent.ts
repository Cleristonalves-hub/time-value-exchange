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
          "Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca da Capital do Estado do Rio de Janeiro para resolver quaisquer controvérsias. A tolerância de qualquer violação não constituirá renúncia ao direito de exigir o cumprimento futuro.",
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
          "These Terms are governed by the laws of the Federative Republic of Brazil. The courts of the Capital of the State of Rio de Janeiro are elected to resolve any disputes. Tolerance of any violation does not constitute a waiver of the right to demand future compliance.",
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
          "Estos Términos se rigen por las leyes de la República Federativa de Brasil. Se elige el fuero de la Comarca de la Capital del Estado de Río de Janeiro para resolver cualquier controversia. La tolerancia de cualquier infracción no constituirá una renuncia al derecho de exigir el cumplimiento futuro.",
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
          "Les présentes Conditions sont régies par les lois de la République fédérative du Brésil. Le for de la Comarca de la Capitale de l'État de Rio de Janeiro est élu pour résoudre tout litige. La tolérance d'une violation ne constitue pas une renonciation au droit d'exiger le respect futur.",
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
          "Diese Bedingungen unterliegen den Gesetzen der Föderativen Republik Brasilien. Für die Beilegung von Streitigkeiten wird der Gerichtsstand der Hauptstadt des Bundesstaates Rio de Janeiro vereinbart. Die Duldung eines Verstoßes stellt keinen Verzicht auf das Recht dar, künftig die Einhaltung zu verlangen.",
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
          "Questi Termini sono regolati dalle leggi della Repubblica Federativa del Brasile. Viene eletto il foro della Comarca della Capitale dello Stato di Rio de Janeiro per risolvere eventuali controversie. La tolleranza di qualsiasi violazione non costituirà rinuncia al diritto di esigere il rispetto futuro.",
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
          "本規約はブラジル連邦共和国の法律に準拠します。紛争解決の管轄はリオデジャネイロ州都のコマルカ裁判所とします。違反行為を容認したとしても、将来の遵守を求める権利の放棄とはみなされません。",
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
          "本条款受巴西联邦共和国法律管辖。任何争议均以里约热内卢州首府司法辖区为管辖法院解决。对任何违规行为的容忍不构成放弃要求未来遵守的权利。",
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
          "تخضع هذه الشروط لقوانين جمهورية البرازيل الاتحادية. تُختار محاكم عاصمة ولاية ريو دي جانيرو لحل أي نزاعات. لا يشكل التسامح مع أي انتهاك تنازلاً عن الحق في المطالبة بالامتثال مستقبلاً.",
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
        title: "1. Introdução",
        paragraphs: [
          "A Valore (“Plataforma”, “nós”, “nos”) valoriza a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações pessoais dos usuários (“você”, “seu”) ao utilizar nossa plataforma de leilão de tempo humano.",
        ],
      },
      {
        title: "2. Dados que Coletamos",
        list: [
          { label: "Dados de cadastro", text: "nome completo, e-mail, telefone, cidade e senha." },
          { label: "Dados profissionais", text: "especialidade, credenciais, bio, anos de experiência e plataforma de videochamada preferida (para especialistas)." },
          { label: "Dados de transação", text: "histórico de lances, valores pagos e saques solicitados." },
          { label: "Dados de navegação", text: "endereço IP, tipo de dispositivo, navegador e páginas visitadas." },
        ],
      },
      {
        title: "3. Como Usamos seus Dados",
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
        title: "4. Compartilhamento de Dados",
        listIntro: "Não vendemos seus dados pessoais. Podemos compartilhar informações com:",
        list: [
          { text: "Processadores de pagamento (Stripe, Pix) para transações financeiras;" },
          { text: "Provedores de videochamada (Google Meet, Zoom, Microsoft Teams) para geração de links de sessão;" },
          { text: "Autoridades competentes, quando exigido por lei ou ordem judicial." },
        ],
      },
      {
        title: "5. Segurança",
        paragraphs: [
          "Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito (TLS 1.3), hash de senhas (bcrypt) e armazenamento seguro em servidores certificados. Apesar dos nossos esforços, nenhum sistema é 100% invulnerável. Notificaremos você em caso de incidentes de segurança relevantes.",
        ],
      },
      {
        title: "6. Seus Direitos",
        paragraphs: [
          `Você tem o direito de acessar, corrigir, excluir ou exportar seus dados pessoais. Para exercer esses direitos, entre em contato pelo e-mail ${CONTACT_EMAIL}. Responderemos em até 15 dias úteis.`,
        ],
      },
      {
        title: "7. Alterações nesta Política",
        paragraphs: [
          "Podemos atualizar esta Política de Privacidade periodicamente. Sempre que houver mudanças materiais, notificaremos você por e-mail ou por meio de aviso na plataforma. O uso continuado da Valore após a publicação das alterações constitui aceitação dos novos termos.",
        ],
      },
      {
        title: "8. Contato",
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
        title: "1. Introduction",
        paragraphs: [
          "Valore (“Platform”, “we”, “us”) values your privacy. This Privacy Policy describes how we collect, use, store, and protect users' personal information (“you”, “your”) when using our human time auction platform.",
        ],
      },
      {
        title: "2. Data We Collect",
        list: [
          { label: "Registration data", text: "full name, email, phone, city, and password." },
          { label: "Professional data", text: "specialty, credentials, bio, years of experience, and preferred video call platform (for specialists)." },
          { label: "Transaction data", text: "bid history, amounts paid, and requested withdrawals." },
          { label: "Browsing data", text: "IP address, device type, browser, and pages visited." },
        ],
      },
      {
        title: "3. How We Use Your Data",
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
        title: "4. Data Sharing",
        listIntro: "We do not sell your personal data. We may share information with:",
        list: [
          { text: "Payment processors (Stripe, Pix) for financial transactions;" },
          { text: "Video call providers (Google Meet, Zoom, Microsoft Teams) for generating session links;" },
          { text: "Competent authorities, when required by law or court order." },
        ],
      },
      {
        title: "5. Security",
        paragraphs: [
          "We adopt technical and organizational measures to protect your data, including encryption in transit (TLS 1.3), password hashing (bcrypt), and secure storage on certified servers. Despite our efforts, no system is 100% invulnerable. We will notify you in case of relevant security incidents.",
        ],
      },
      {
        title: "6. Your Rights",
        paragraphs: [
          `You have the right to access, correct, delete, or export your personal data. To exercise these rights, contact us at ${CONTACT_EMAIL}. We will respond within 15 business days.`,
        ],
      },
      {
        title: "7. Changes to this Policy",
        paragraphs: [
          "We may update this Privacy Policy periodically. Whenever there are material changes, we will notify you by email or via a notice on the platform. Continued use of Valore after changes are published constitutes acceptance of the new terms.",
        ],
      },
      {
        title: "8. Contact",
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
        title: "1. Introducción",
        paragraphs: [
          "Valore (“Plataforma”, “nosotros”) valora tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal de los usuarios (“tú”, “tu”) al utilizar nuestra plataforma de subasta de tiempo humano.",
        ],
      },
      {
        title: "2. Datos que Recopilamos",
        list: [
          { label: "Datos de registro", text: "nombre completo, correo electrónico, teléfono, ciudad y contraseña." },
          { label: "Datos profesionales", text: "especialidad, credenciales, biografía, años de experiencia y plataforma de videollamada preferida (para especialistas)." },
          { label: "Datos de transacción", text: "historial de pujas, valores pagados y retiros solicitados." },
          { label: "Datos de navegación", text: "dirección IP, tipo de dispositivo, navegador y páginas visitadas." },
        ],
      },
      {
        title: "3. Cómo Usamos tus Datos",
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
        title: "4. Intercambio de Datos",
        listIntro: "No vendemos tus datos personales. Podemos compartir información con:",
        list: [
          { text: "Procesadores de pago (Stripe, Pix) para transacciones financieras;" },
          { text: "Proveedores de videollamada (Google Meet, Zoom, Microsoft Teams) para generar enlaces de sesión;" },
          { text: "Autoridades competentes, cuando lo exija la ley o una orden judicial." },
        ],
      },
      {
        title: "5. Seguridad",
        paragraphs: [
          "Adoptamos medidas técnicas y organizativas para proteger tus datos, incluyendo cifrado en tránsito (TLS 1.3), hash de contraseñas (bcrypt) y almacenamiento seguro en servidores certificados. A pesar de nuestros esfuerzos, ningún sistema es 100% invulnerable. Te notificaremos en caso de incidentes de seguridad relevantes.",
        ],
      },
      {
        title: "6. Tus Derechos",
        paragraphs: [
          `Tienes derecho a acceder, corregir, eliminar o exportar tus datos personales. Para ejercer estos derechos, contáctanos por correo a ${CONTACT_EMAIL}. Responderemos en un plazo de hasta 15 días hábiles.`,
        ],
      },
      {
        title: "7. Cambios en esta Política",
        paragraphs: [
          "Podemos actualizar esta Política de Privacidad periódicamente. Siempre que haya cambios materiales, te notificaremos por correo electrónico o mediante un aviso en la plataforma. El uso continuado de Valore tras la publicación de los cambios constituye la aceptación de los nuevos términos.",
        ],
      },
      {
        title: "8. Contacto",
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
        title: "1. Introduction",
        paragraphs: [
          "Valore (« Plateforme », « nous ») accorde de l'importance à votre vie privée. Cette Politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons les informations personnelles des utilisateurs (« vous », « votre ») lors de l'utilisation de notre plateforme d'enchères de temps humain.",
        ],
      },
      {
        title: "2. Données que Nous Collectons",
        list: [
          { label: "Données d'inscription", text: "nom complet, e-mail, téléphone, ville et mot de passe." },
          { label: "Données professionnelles", text: "spécialité, qualifications, bio, années d'expérience et plateforme d'appel vidéo préférée (pour les spécialistes)." },
          { label: "Données de transaction", text: "historique des offres, montants payés et retraits demandés." },
          { label: "Données de navigation", text: "adresse IP, type d'appareil, navigateur et pages visitées." },
        ],
      },
      {
        title: "3. Comment Nous Utilisons vos Données",
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
        title: "4. Partage des Données",
        listIntro: "Nous ne vendons pas vos données personnelles. Nous pouvons partager des informations avec :",
        list: [
          { text: "Des prestataires de paiement (Stripe, Pix) pour les transactions financières ;" },
          { text: "Des fournisseurs d'appel vidéo (Google Meet, Zoom, Microsoft Teams) pour générer les liens de session ;" },
          { text: "Les autorités compétentes, lorsque la loi ou une décision de justice l'exige." },
        ],
      },
      {
        title: "5. Sécurité",
        paragraphs: [
          "Nous adoptons des mesures techniques et organisationnelles pour protéger vos données, notamment le chiffrement en transit (TLS 1.3), le hachage des mots de passe (bcrypt) et un stockage sécurisé sur des serveurs certifiés. Malgré nos efforts, aucun système n'est invulnérable à 100 %. Nous vous informerons en cas d'incidents de sécurité significatifs.",
        ],
      },
      {
        title: "6. Vos Droits",
        paragraphs: [
          `Vous avez le droit d'accéder, de corriger, de supprimer ou d'exporter vos données personnelles. Pour exercer ces droits, contactez-nous à ${CONTACT_EMAIL}. Nous répondrons sous 15 jours ouvrés.`,
        ],
      },
      {
        title: "7. Modifications de cette Politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette Politique de confidentialité périodiquement. En cas de changements substantiels, nous vous informerons par e-mail ou via un avis sur la plateforme. L'utilisation continue de Valore après la publication des modifications constitue une acceptation des nouvelles conditions.",
        ],
      },
      {
        title: "8. Contact",
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
        title: "1. Einleitung",
        paragraphs: [
          "Valore („Plattform“, „wir“) legt Wert auf Ihre Privatsphäre. Diese Datenschutzerklärung beschreibt, wie wir personenbezogene Daten der Nutzer („Sie“, „Ihre“) bei der Nutzung unserer Plattform für Auktionen menschlicher Zeit erheben, verwenden, speichern und schützen.",
        ],
      },
      {
        title: "2. Daten, die Wir Erheben",
        list: [
          { label: "Registrierungsdaten", text: "vollständiger Name, E-Mail, Telefon, Stadt und Passwort." },
          { label: "Berufliche Daten", text: "Spezialisierung, Qualifikationen, Werdegang, Jahre der Erfahrung und bevorzugte Videoanruf-Plattform (für Spezialisten)." },
          { label: "Transaktionsdaten", text: "Gebotshistorie, gezahlte Beträge und beantragte Auszahlungen." },
          { label: "Nutzungsdaten", text: "IP-Adresse, Gerätetyp, Browser und besuchte Seiten." },
        ],
      },
      {
        title: "3. Wie Wir Ihre Daten Verwenden",
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
        title: "4. Datenweitergabe",
        listIntro: "Wir verkaufen Ihre personenbezogenen Daten nicht. Wir können Informationen weitergeben an:",
        list: [
          { text: "Zahlungsdienstleister (Stripe, Pix) für Finanztransaktionen;" },
          { text: "Videoanruf-Anbieter (Google Meet, Zoom, Microsoft Teams) zur Erstellung von Sitzungslinks;" },
          { text: "Zuständige Behörden, sofern gesetzlich oder gerichtlich vorgeschrieben." },
        ],
      },
      {
        title: "5. Sicherheit",
        paragraphs: [
          "Wir ergreifen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten, darunter Verschlüsselung während der Übertragung (TLS 1.3), Passwort-Hashing (bcrypt) und sichere Speicherung auf zertifizierten Servern. Trotz unserer Bemühungen ist kein System zu 100 % unverwundbar. Wir werden Sie im Falle relevanter Sicherheitsvorfälle benachrichtigen.",
        ],
      },
      {
        title: "6. Ihre Rechte",
        paragraphs: [
          `Sie haben das Recht, auf Ihre personenbezogenen Daten zuzugreifen, sie zu berichtigen, zu löschen oder zu exportieren. Um diese Rechte auszuüben, kontaktieren Sie uns unter ${CONTACT_EMAIL}. Wir werden innerhalb von 15 Werktagen antworten.`,
        ],
      },
      {
        title: "7. Änderungen dieser Richtlinie",
        paragraphs: [
          "Wir können diese Datenschutzerklärung regelmäßig aktualisieren. Bei wesentlichen Änderungen benachrichtigen wir Sie per E-Mail oder über einen Hinweis auf der Plattform. Die fortgesetzte Nutzung von Valore nach Veröffentlichung der Änderungen stellt die Annahme der neuen Bedingungen dar.",
        ],
      },
      {
        title: "8. Kontakt",
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
        title: "1. Introduzione",
        paragraphs: [
          "Valore (“Piattaforma”, “noi”) tiene alla tua privacy. Questa Informativa sulla Privacy descrive come raccogliamo, utilizziamo, conserviamo e proteggiamo le informazioni personali degli utenti (“tu”, “tuo”) nell'utilizzo della nostra piattaforma di asta di tempo umano.",
        ],
      },
      {
        title: "2. Dati che Raccogliamo",
        list: [
          { label: "Dati di registrazione", text: "nome completo, email, telefono, città e password." },
          { label: "Dati professionali", text: "specialità, credenziali, bio, anni di esperienza e piattaforma di videochiamata preferita (per gli specialisti)." },
          { label: "Dati di transazione", text: "cronologia delle offerte, importi pagati e prelievi richiesti." },
          { label: "Dati di navigazione", text: "indirizzo IP, tipo di dispositivo, browser e pagine visitate." },
        ],
      },
      {
        title: "3. Come Utilizziamo i tuoi Dati",
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
        title: "4. Condivisione dei Dati",
        listIntro: "Non vendiamo i tuoi dati personali. Potremmo condividere informazioni con:",
        list: [
          { text: "Elaboratori di pagamento (Stripe, Pix) per le transazioni finanziarie;" },
          { text: "Fornitori di videochiamata (Google Meet, Zoom, Microsoft Teams) per generare i link delle sessioni;" },
          { text: "Autorità competenti, quando richiesto dalla legge o da un'ordinanza giudiziaria." },
        ],
      },
      {
        title: "5. Sicurezza",
        paragraphs: [
          "Adottiamo misure tecniche e organizzative per proteggere i tuoi dati, tra cui crittografia in transito (TLS 1.3), hash delle password (bcrypt) e archiviazione sicura su server certificati. Nonostante i nostri sforzi, nessun sistema è invulnerabile al 100%. Ti informeremo in caso di incidenti di sicurezza rilevanti.",
        ],
      },
      {
        title: "6. I tuoi Diritti",
        paragraphs: [
          `Hai il diritto di accedere, correggere, eliminare o esportare i tuoi dati personali. Per esercitare questi diritti, contattaci all'indirizzo ${CONTACT_EMAIL}. Risponderemo entro 15 giorni lavorativi.`,
        ],
      },
      {
        title: "7. Modifiche a questa Informativa",
        paragraphs: [
          "Potremmo aggiornare periodicamente questa Informativa sulla Privacy. In caso di modifiche sostanziali, ti informeremo via email o tramite un avviso sulla piattaforma. L'uso continuato di Valore dopo la pubblicazione delle modifiche costituisce accettazione dei nuovi termini.",
        ],
      },
      {
        title: "8. Contatto",
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
        title: "1. はじめに",
        paragraphs: [
          "Valore（「プラットフォーム」、「当社」）はお客様のプライバシーを尊重します。本プライバシーポリシーは、人の時間のオークションプラットフォームをご利用いただく際に、当社がユーザー（「お客様」）の個人情報をどのように収集、利用、保存、保護するかを説明するものです。",
        ],
      },
      {
        title: "2. 収集する情報",
        list: [
          { label: "登録情報", text: "氏名、メールアドレス、電話番号、都市、パスワード。" },
          { label: "職業情報", text: "専門分野、資格、経歴、経験年数、希望するビデオ通話プラットフォーム（専門家の場合）。" },
          { label: "取引情報", text: "入札履歴、支払い金額、出金申請。" },
          { label: "閲覧情報", text: "IPアドレス、デバイスの種類、ブラウザ、閲覧ページ。" },
        ],
      },
      {
        title: "3. 情報の利用方法",
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
        title: "4. データの共有",
        listIntro: "お客様の個人情報を販売することはありません。以下と情報を共有する場合があります：",
        list: [
          { text: "金融取引のための決済処理業者（Stripe、Pix）" },
          { text: "セッションリンク生成のためのビデオ通話プロバイダー（Google Meet、Zoom、Microsoft Teams）" },
          { text: "法律または裁判所命令により必要な場合の関係当局" },
        ],
      },
      {
        title: "5. セキュリティ",
        paragraphs: [
          "当社は、転送時の暗号化（TLS 1.3）、パスワードのハッシュ化（bcrypt）、認証済みサーバーでの安全な保管など、技術的および組織的な対策を講じています。これらの取り組みにもかかわらず、100%安全なシステムは存在しません。重大なセキュリティインシデントが発生した場合はお客様に通知します。",
        ],
      },
      {
        title: "6. お客様の権利",
        paragraphs: [
          `お客様には、ご自身の個人情報にアクセス、修正、削除、またはエクスポートする権利があります。これらの権利を行使するには、${CONTACT_EMAIL}までご連絡ください。15営業日以内にご返答いたします。`,
        ],
      },
      {
        title: "7. 本ポリシーの変更",
        paragraphs: [
          "当社は本プライバシーポリシーを随時更新することがあります。重要な変更がある場合は、メールまたはプラットフォーム上の通知でお知らせします。変更公開後もValoreを継続してご利用いただくことで、新しい条件に同意したものとみなされます。",
        ],
      },
      {
        title: "8. お問い合わせ",
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
        title: "1. 简介",
        paragraphs: [
          "Valore（“平台”，“我们”）重视您的隐私。本隐私政策说明了在您使用我们的人类时间拍卖平台时，我们如何收集、使用、存储和保护用户（“您”）的个人信息。",
        ],
      },
      {
        title: "2. 我们收集的数据",
        list: [
          { label: "注册数据", text: "全名、电子邮箱、电话、城市及密码。" },
          { label: "职业数据", text: "专长、资质、简介、从业年限及首选视频通话平台（针对专家）。" },
          { label: "交易数据", text: "出价记录、已付款金额及提现申请。" },
          { label: "浏览数据", text: "IP地址、设备类型、浏览器及访问页面。" },
        ],
      },
      {
        title: "3. 我们如何使用您的数据",
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
        title: "4. 数据共享",
        listIntro: "我们不会出售您的个人数据。我们可能与以下各方共享信息：",
        list: [
          { text: "支付处理商（Stripe、Pix），用于金融交易；" },
          { text: "视频通话服务商（Google Meet、Zoom、Microsoft Teams），用于生成会话链接；" },
          { text: "有关部门，依法律或法院命令要求时。" },
        ],
      },
      {
        title: "5. 安全性",
        paragraphs: [
          "我们采取技术和组织措施保护您的数据，包括传输加密（TLS 1.3）、密码哈希处理（bcrypt）以及在经认证的服务器上安全存储。尽管我们尽力而为，但没有任何系统是100%无懈可击的。如发生重大安全事件，我们将通知您。",
        ],
      },
      {
        title: "6. 您的权利",
        paragraphs: [
          `您有权访问、更正、删除或导出您的个人数据。如需行使这些权利，请通过 ${CONTACT_EMAIL} 与我们联系。我们将在15个工作日内回复。`,
        ],
      },
      {
        title: "7. 本政策的变更",
        paragraphs: [
          "我们可能会定期更新本隐私政策。如有重大变更，我们将通过电子邮件或平台通知告知您。变更发布后继续使用 Valore 即表示接受新条款。",
        ],
      },
      {
        title: "8. 联系方式",
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
        title: "1. مقدمة",
        paragraphs: [
          "تُقدِّر Valore («المنصة»، «نحن») خصوصيتك. تصف سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وتخزيننا وحمايتنا للمعلومات الشخصية للمستخدمين («أنت») عند استخدام منصتنا لمزادات الوقت البشري.",
        ],
      },
      {
        title: "2. البيانات التي نجمعها",
        list: [
          { label: "بيانات التسجيل", text: "الاسم الكامل، البريد الإلكتروني، الهاتف، المدينة، وكلمة المرور." },
          { label: "البيانات المهنية", text: "التخصص، المؤهلات، السيرة الذاتية، سنوات الخبرة، ومنصة مكالمات الفيديو المفضلة (للمختصين)." },
          { label: "بيانات المعاملات", text: "سجل العروض، المبالغ المدفوعة، وطلبات السحب." },
          { label: "بيانات التصفح", text: "عنوان IP، نوع الجهاز، المتصفح، والصفحات التي تمت زيارتها." },
        ],
      },
      {
        title: "3. كيفية استخدامنا لبياناتك",
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
        title: "4. مشاركة البيانات",
        listIntro: "نحن لا نبيع بياناتك الشخصية. قد نشارك المعلومات مع:",
        list: [
          { text: "معالجات الدفع (Stripe، Pix) للمعاملات المالية؛" },
          { text: "مزودي مكالمات الفيديو (Google Meet، Zoom، Microsoft Teams) لإنشاء روابط الجلسات؛" },
          { text: "السلطات المختصة، عند الاقتضاء بموجب القانون أو أمر قضائي." },
        ],
      },
      {
        title: "5. الأمان",
        paragraphs: [
          "نعتمد تدابير تقنية وتنظيمية لحماية بياناتك، بما في ذلك التشفير أثناء النقل (TLS 1.3)، وتجزئة كلمات المرور (bcrypt)، والتخزين الآمن على خوادم معتمدة. وبالرغم من جهودنا، لا يوجد نظام محصّن بنسبة 100٪. سنخطرك في حال وقوع حوادث أمنية ذات صلة.",
        ],
      },
      {
        title: "6. حقوقك",
        paragraphs: [
          `لديك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها أو تصديرها. لممارسة هذه الحقوق، تواصل معنا عبر البريد الإلكتروني ${CONTACT_EMAIL}. سنرد خلال 15 يوم عمل.`,
        ],
      },
      {
        title: "7. التغييرات على هذه السياسة",
        paragraphs: [
          "قد نقوم بتحديث سياسة الخصوصية هذه بشكل دوري. عند حدوث تغييرات جوهرية، سنخطرك عبر البريد الإلكتروني أو عبر إشعار على المنصة. يشكّل استمرار استخدام Valore بعد نشر التغييرات قبولاً للشروط الجديدة.",
        ],
      },
      {
        title: "8. التواصل",
        listIntro: "لأي استفسارات حول سياسة الخصوصية هذه، تواصل معنا:",
        paragraphs: [`البريد الإلكتروني: ${CONTACT_EMAIL}`],
      },
    ],
  },
};
