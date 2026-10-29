import { en } from './en'
import { missing } from './missing'
import { todo, type Milestone, type Project, type SiteContent } from './schema'

// Brazilian Portuguese, translated from en.ts and waiting for Gabriel's review.
// Names, stacks, dates and links come from the English source so they cannot drift.
// Placeholders repeat the English todo() text, so `pnpm todos` lists each fact once.

const source = (id: string): Project => en.projects.find((p) => p.id === id)!
const wave = source('sistema-wave')
const bi = source('campaign-bi')
const zibby = source('zibby')
const hostly = source('hostly')
const bookowl = source('bookowl')

const experience: Record<string, Partial<Milestone>> = {
  fator: {
    title: 'Analista de Sistemas',
    summary:
      'Desenvolvi e mantive backends em Node.js e frontends em Angular, com JavaScript e TypeScript. Escrevi e otimizei as consultas SQL dos relatórios, ajustei bancos Firebird e migrei dados de PostgreSQL, MySQL e outros bancos para o Firebird.',
  },
  unifacs: { title: 'Bacharelado em Ciência da Computação' },
  'group-wave': {
    title: 'Desenvolvedor Full Stack',
    place: 'Remoto',
    summary:
      'Desenhei e construí o Campaign BI do começo ao fim, e atuo em todo o Sistema Wave, a plataforma interna que cerca de 100 pessoas usam para publicar mais de 500 campanhas por dia.',
  },
  'ia-robots': {
    title: 'Consultor e Desenvolvedor de Software (contrato)',
    summary:
      'Configuração e operação de robôs de atendimento OrionStar, e desenvolvimento do Hostly, que transmite anúncios nos robôs e em telões de LED.',
  },
  unipds: { title: 'Pós-graduação em Engenharia de Software com IA Aplicada' },
}

export const pt: SiteContent = {
  locale: 'pt',
  translation: 'needs-review',
  meta: {
    title: 'Gabriel Santos, Desenvolvedor Full Stack',
    description:
      'Desenvolvedor Full Stack em Salvador, Bahia, trabalhando remoto. Next.js, React, Node.js, NestJS, TypeScript e PostgreSQL, do banco de dados à tela.',
  },
  person: {
    name: en.person.name,
    role: 'Desenvolvedor Full Stack',
    coreStack: en.person.coreStack,
    location: 'Salvador, Bahia',
    workMode: 'Remoto',
    heroLine: 'Do banco de dados à tela.',
    availability: 'Disponível para novos projetos',
    about:
      'Desenvolvedor Full Stack com cerca de 5 anos de experiência: 4 como Analista de Sistemas e mais de 1 trabalhando remoto. Construo produtos completos, do banco de dados à interface: frontends e dashboards com Next.js e React, APIs com Node.js e NestJS, e dados em PostgreSQL. Programo todos os dias com agentes de IA para ir mais rápido sem abrir mão do critério técnico, e faço pós-graduação em Engenharia de Software com IA Aplicada.',
    photo: {
      id: en.person.photo.id,
      alt: 'Gabriel Santos, sorrindo, de blazer azul e óculos.',
    },
  },
  ui: {
    skipToContent: 'Pular para o conteúdo',
    present: 'atual',
    quickView: 'Visão rápida',
    fullView: 'Visão completa',
    sections: 'Seções',
    language: 'Idioma',
    contact: 'Contato',
    downloadCv: 'Baixar CV',
    seeProjects: 'Ver projetos',
    technicalDetails: 'Detalhes técnicos',
    close: 'Fechar',
    internalNoLink: 'Sistema interno, sem link público',
    noPublicLink: 'Sem link público',
    backToTop: 'Voltar ao topo',
    stack: 'Stack',
    sectionsNav: 'Seções',
    languageNav: 'Escolha o idioma',
    details: {
      problem: 'O problema',
      role: 'Meu papel',
      architecture: 'Arquitetura',
      decisions: 'Decisões principais',
      testingAndDeploy: 'Testes e deploy',
      outcome: 'Resultado',
      links: 'Links',
    },
  },
  sections: {
    experience: { title: 'Experiência' },
    projects: { title: 'Projetos' },
    howIWork: { title: 'Como trabalho' },
    contact: { title: 'Contato' },
  },
  experience: en.experience.map((m) => ({ ...m, ...experience[m.id] })),
  projects: [
    {
      ...wave,
      logline:
        'Uma plataforma interna usada por cerca de 100 pessoas para publicar campanhas na Meta em massa, editar e melhorar criativos com IA, gerar copies, gerenciar solicitações entre equipes (no estilo do ClickUp) e acompanhar dados de campanhas, financeiro e saúde da empresa em dashboards.',
      image: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'Um quadro de solicitações estilizado, com equipes e tarefas fictícias, no lugar do sistema interno.',
      },
      technicalDetails: {
        problem:
          'Antes da plataforma, cada campanha era montada à mão no NewsBreak, no Meta Ads e no Taboola.',
        role: 'O time divide o trabalho por áreas, e eu atuo em todas elas, para que cada parte se encaixe no sistema inteiro.',
        architecture: {
          ...wave.technicalDetails.architecture,
          nodes: [
            { id: 'web', label: 'App web (Next.js, React)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
            { id: 'meta', label: 'API da Meta', kind: 'external' },
          ],
        },
        decisions: [
          {
            what: 'As campanhas sobem pela API da Meta, várias de uma vez.',
            why: 'Antes, cada campanha era montada à mão em cada plataforma de anúncios.',
          },
          {
            what: 'Prometheus, Grafana e logs acompanham o sistema, e alertas vão para o Telegram em caso de erro ou quando uma rota está sobrecarregada.',
            why: 'Para saber como o sistema está a qualquer momento, e ficar sabendo de erros e rotas sobrecarregadas assim que acontecem.',
          },
        ],
        testing:
          'Testes de segurança que simulam ataques reais, e testes de estresse que procuram erros e falhas que poderiam abrir uma brecha de segurança.',
        deploy:
          'O Jenkins roda os testes e as validações, e uma mudança só é aprovada se passar por eles. Ela vai primeiro para o ambiente de develop, onde testamos, e quando tudo está aprovado o tech lead faz o deploy.',
        outcome:
          'Mais de 500 campanhas publicadas por dia pela API da Meta, por cerca de 100 pessoas dentro da empresa.',
      },
    },
    {
      ...bi,
      logline:
        'Um sistema interno de dados de campanhas, usado todos os dias pelos donos, pelo financeiro e pelos líderes de squad: resultados mensais e semanais e o desempenho de cada media buyer, atualizados a cada hora. Workers em NestJS processam os dados do RedTrack a partir de uma fila no RabbitMQ e gravam no PostgreSQL, e um app em Next.js com login Google os lê pela API em NestJS.',
      image: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'Um gráfico de desempenho semanal com campanhas fictícias e media buyers inventados, no lugar do sistema interno.',
      },
      technicalDetails: {
        problem:
          'O financeiro puxava os dados do RedTrack com um pequeno script em Python que gerava arquivos CSV. Cada extração levava de 45 minutos a 2 horas, conforme o período.',
        role: 'Desenhei a arquitetura e construí o sistema inteiro, do começo ao fim.',
        architecture: {
          ...bi.technicalDetails.architecture,
          nodes: [
            { id: 'redtrack', label: 'RedTrack', kind: 'external' },
            { id: 'n8n', label: 'n8n', kind: 'service' },
            { id: 'queue', label: 'RabbitMQ', kind: 'service' },
            { id: 'web', label: 'App Next.js (login Google)', kind: 'client' },
            { id: 'api', label: 'NestJS (workers e API)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
          ],
        },
        decisions: [
          {
            what: 'Visões mensais e semanais dos dados do RedTrack, e o desempenho de cada media buyer.',
            why: 'Os donos, o financeiro e os líderes de squad analisam os dados todos os dias: o que está dando certo, o que está gastando e como está cada media buyer.',
          },
          {
            what: 'O n8n publica os dados do RedTrack numa fila no RabbitMQ, e vários workers em NestJS os processam em paralelo até o PostgreSQL.',
            why: 'São muitos dados de uma vez. A fila separa a chegada dos dados do processamento: o n8n publica tudo no RabbitMQ, e os workers consomem no ritmo que o banco aguenta. Um registro que falha é tentado de novo sem afetar os outros, e se um worker cai nada se perde, porque a mensagem continua na fila. O RedTrack identifica cada registro, então uma mensagem processada duas vezes não duplica dados.',
          },
          {
            what: 'Um script de alocação pelo método dos maiores restos para conversões e receita.',
            why: 'As métricas estavam infladas. O script corrigiu os números, e os resultados foram conferidos com as planilhas de referência.',
          },
        ],
        testing: 'As verificações rodam no CI a cada mudança.',
        deploy:
          'Nada vai para o ar sem passar no CI, então um erro aparece no pipeline, e não depois de derrubar o sistema, mesmo que por pouco tempo.',
        outcome:
          'Os dados do RedTrack agora se atualizam a cada hora durante o dia, e as cargas maiores rodam de madrugada. Os dashboards leem do PostgreSQL com consultas otimizadas, em vez de esperar de 45 minutos a 2 horas por um CSV. O Campaign BI hoje roda dentro do Sistema Wave.',
      },
    },
    {
      ...zibby,
      logline:
        'Minha própria plataforma de e-commerce multiloja, lançada em outubro de 2026: vitrine, painel administrativo com cadastro de produtos e dashboards de vendas que mostram como cada produto está saindo, e pagamentos com Stripe. Cada integração é um provider, então cada loja pode ser criada e personalizada com as APIs de que precisa.',
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'Uma vitrine fictícia ao lado do seu painel administrativo.',
      },
      technicalDetails: {
        problem:
          'Gerenciar várias lojas online num só lugar, cada uma com seus próprios produtos, vendas e integrações.',
        role: [
          'Produto próprio.',
          'Construí em fases com agentes de IA para programar, e cada fase seguiu plano → revisão → implementação → testes → revisão do diff → merge.',
        ],
        architecture: {
          ...zibby.technicalDetails.architecture,
          nodes: [
            { id: 'storefront', label: 'Vitrine (Next.js)', kind: 'client' },
            { id: 'tracking', label: 'Microsoft Clarity, Pixel da Meta', kind: 'external' },
            { id: 'admin', label: 'Painel administrativo (Next.js)', kind: 'client' },
            { id: 'api', label: 'API (NestJS, monólito modular)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
            { id: 'stripe', label: 'Stripe (provider de pagamentos)', kind: 'external' },
            { id: 'email', label: 'Resend (provider de e-mail)', kind: 'external' },
          ],
        },
        decisions: [
          {
            what: 'Um monorepo pnpm com a API em NestJS e a vitrine e o painel em Next.js, organizado como monólito modular.',
            why: 'Uma pessoa só constrói e opera, então tudo sai num deploy, com um banco e um lugar só para rastrear um erro. Microsserviços trariam chamadas de rede, deploys separados e falhas espalhadas entre serviços, sem ganho nesse tamanho. Cada área (lojas, produtos, pedidos, pagamentos) fica no próprio módulo, com fronteira clara, então uma delas pode virar um serviço separado se um dia precisar escalar. E no monorepo uma mudança que atravessa a API, a vitrine e o painel sai num único commit.',
          },
          {
            what: 'Microsoft Clarity na vitrine, e o Pixel da Meta configurado por loja.',
            why: 'O Clarity grava as sessões e gera mapas de calor, então dá para ver onde os clientes clicam, até onde rolam a página e onde desistem. Cada loja coloca o próprio Pixel da Meta, que envia visitas, adições ao carrinho e compras de volta para a Meta, para medir e otimizar os anúncios dela.',
          },
          {
            what: 'Cada integração é um provider: Stripe para pagamentos e o Resend para e-mail são os primeiros, e outras APIs se conectam do mesmo jeito.',
            why: 'Para que cada loja possa ser criada e personalizada como precisar, com os serviços que escolher.',
          },
        ],
        testing:
          'Testes automatizados em todo o monorepo; cada fase passou por eles antes da revisão do diff.',
        deploy:
          'Deploy em uma VPS, com backups de emergência. Os dados dos clientes e as chaves de API ficam criptografados: mesmo numa invasão, só podem ser lidos com a chave de descriptografia.',
        outcome: 'Lançada em outubro de 2026.',
      },
    },
    {
      ...hostly,
      logline:
        'Uma plataforma multiempresa para robôs de atendimento OrionStar: um app Android próprio substitui o de fábrica e toca as campanhas, músicas e falas agendadas num painel web. Os anúncios também vão para telões de LED cadastrados, inclusive em eventos.',
      image: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'Uma tela de agenda do robô com uma playlist de campanhas fictícia, no lugar do sistema real.',
      },
      technicalDetails: {
        problem:
          'O app de fábrica do robô dificultava trocar a mídia, não deixava agendar campanhas, falhava na tela grande e não gerava relatório.',
        role: 'Escrevi a especificação e desenvolvo o sistema inteiro, com agentes de IA trabalhando em paralelo, um por issue: a API, o painel, o worker de mídia e o app Android do robô.',
        architecture: {
          ...hostly.technicalDetails.architecture,
          nodes: [
            { id: 'panel', label: 'Painel (Next.js)', kind: 'client' },
            { id: 'app', label: 'App do robô (Kotlin)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'robot', label: 'RobotOS no LuckiBot Plus', kind: 'device' },
            { id: 'worker', label: 'Worker de mídia (FFmpeg)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
            { id: 'screen', label: 'Telão de LED cadastrado', kind: 'device' },
            { id: 'storage', label: 'Storage S3', kind: 'data' },
          ],
          edges: [
            { from: 'panel', to: 'api' },
            { from: 'app', to: 'api', label: 'WebSocket' },
            { from: 'app', to: 'robot', label: 'RobotGateway' },
            { from: 'api', to: 'worker', label: 'fila' },
            { from: 'api', to: 'db' },
            { from: 'api', to: 'screen', label: 'anúncios' },
            { from: 'worker', to: 'storage' },
          ],
        },
        decisions: [
          {
            what: 'O app do robô acessa o RobotOS por uma camada própria, o RobotGateway, que também tem uma versão falsa para o emulador.',
            why: 'O app roda e é testado sem o robô de verdade, e se a OrionStar liberar o AgentOS para o LuckiBot Plus, só essa camada muda.',
          },
          {
            what: 'A nuvem decide e o robô executa: cada mudança no painel recompila um manifesto versionado, e o robô segue o último que recebeu.',
            why: 'Sem internet, o robô continua seguindo a agenda, toca a mídia do cache e guarda os eventos para mandar quando a rede voltar.',
          },
          {
            what: 'Multiempresa desde o início: operadora, clientes, locais e robôs, com papéis e marca por cliente, que o robô herda do cliente ou da operadora.',
            why: 'Cada cliente, como um shopping, usa o painel com a própria marca e vê só os próprios robôs e campanhas. O escopo por organização é aplicado no centro da API e no banco, e não rota por rota, então a mesma base pode virar um SaaS.',
          },
        ],
        testing:
          'Testes de unidade e e2e na API, no painel e no worker, testes de contrato do RobotGateway e as verificações do app Android, tudo no CI a cada mudança. A API nega por padrão, com uma varredura que falha se alguma rota ficar sem guarda; o login tem autenticação em dois fatores, e a auditoria é uma cadeia assinada com HMAC.',
        deploy:
          'API, painel, worker, PostgreSQL e Redis rodam com Docker Compose numa VPS, atrás de HTTPS automático. A mídia fica num storage S3 privado, servida só por URL assinada; o deploy só passa por VPN, e um backup diário criptografado sai do servidor.',
        outcome:
          'Em uso: conecta ao robô e aos telões de LED cadastrados e transmite anúncios nos dois, inclusive em eventos.',
      },
    },
    {
      ...bookowl,
      logline:
        'Um sistema open source de gestão de bibliotecas em Python e Django, feito para a biblioteca de uma igreja de verdade.',
      image: {
        kind: 'image',
        id: 'bookowl',
        alt: 'A tela inicial do BookOwl: o logo da coruja sobre uma mensagem de boas-vindas.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Código no GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
      },
      technicalDetails: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...bookowl.technicalDetails.architecture,
          nodes: [
            { id: 'app', label: 'App Django (Python)', kind: 'service' },
            { id: 'db', label: todo('the BookOwl database'), kind: 'data' },
          ],
        },
        decisions: [
          { what: 'Python e Django.', why: todo('why Python and Django') },
          { what: 'Open source, no GitHub.', why: todo('why open source') },
        ],
        testing: missing.testing(),
        deploy: todo('how BookOwl is deployed'),
        outcome: missing.outcome(),
      },
    },
  ],
  workflow: {
    steps: [
      'Planejo',
      'Reviso o plano',
      'A IA implementa',
      'Reviso o diff',
      'Rodo os testes',
      'Merge',
    ],
    closing: 'A IA acelera. O critério é meu.',
  },
  skills: {
    stack: [
      { label: 'Frontend', items: en.skills.stack[0]!.items },
      {
        label: 'Backend',
        items: ['Node.js', 'NestJS', 'Express', 'RabbitMQ', 'APIs REST', 'Spring Boot', 'Django'],
      },
      { label: 'Dados', items: en.skills.stack[2]!.items },
      { label: 'DevOps e automação', items: en.skills.stack[3]!.items },
      { label: 'Arquitetura', items: en.skills.stack[4]!.items },
    ],
    languages: {
      label: 'Idiomas',
      items: ['Português (nativo)', 'Espanhol (estudando)', 'Inglês (estudando)'],
    },
  },
  contact: {
    cta: 'Me escreva',
    email: en.contact.email,
    links: en.contact.links,
    cv: {
      href: 'cv/CV_Gabriel_Santos_PT.pdf',
      label: 'Baixar CV',
    },
    basedIn: 'Moro em Salvador, Bahia, e trabalho remoto.',
  },
}
