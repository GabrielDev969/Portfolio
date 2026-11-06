import { en } from './en'
import type { Milestone, Project, SiteContent } from './schema'

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
    stats: [
      { value: '~5', label: 'anos de experiência' },
      { value: '500+', label: 'campanhas por dia no Sistema Wave' },
      { value: '~100', label: 'pessoas usam todo dia' },
    ],
    availability: 'Disponível para novos projetos',
    about:
      'Desenvolvedor Full Stack com cerca de 5 anos de experiência: 4 como Analista de Sistemas e mais de 1 trabalhando remoto. Construo produtos completos, do banco de dados à interface: frontends e dashboards com Next.js e React, APIs com Node.js e NestJS, e dados em PostgreSQL. Programo todos os dias com agentes de IA para ir mais rápido sem abrir mão do critério técnico, e faço pós-graduação em Engenharia de Software com IA Aplicada.',
    photo: {
      id: en.person.photo.id,
      alt: 'Gabriel Santos, sorrindo, de blazer azul e óculos.',
    },
  },
  ui: {
    greeting: 'Olá, eu sou',
    backdrop: 'PORTFÓLIO',
    skipToContent: 'Pular para o conteúdo',
    present: 'atual',
    quickView: 'Visão rápida',
    fullView: 'Visão completa',
    sections: 'Seções',
    language: 'Idioma',
    contact: 'Contato',
    downloadCv: 'Baixar CV',
    seeProjects: 'Ver projetos',
    internalNoLink: 'Sistema interno, sem link público',
    noPublicLink: 'Sem link público',
    backToTop: 'Voltar ao topo',
    stack: 'Stack',
    sectionsNav: 'Seções',
    languageNav: 'Escolha o idioma',
    project: {
      problem: 'O problema',
      built: 'O que construí',
      architecture: 'Arquitetura',
      result: 'Resultado',
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
      image: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'Um quadro de solicitações estilizado, com equipes e tarefas fictícias, no lugar do sistema interno.',
      },
      summary: {
        problem: 'Cada campanha era montada à mão em cada plataforma de anúncios.',
        built:
          'Uma plataforma interna que publica campanhas na Meta em massa, edita criativos com IA, gera copies, gerencia solicitações entre equipes e mostra dashboards de campanhas e financeiro. O time divide o trabalho por áreas; eu atuo em todas, para que cada parte se encaixe no todo.',
        result: 'Mais de 500 campanhas por dia, publicadas por cerca de 100 pessoas.',
      },
      architecture: {
        ...wave.architecture,
        nodes: [
          { id: 'web', label: 'App web (Next.js, React)', kind: 'client' },
          { id: 'api', label: 'API (NestJS)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
          { id: 'meta', label: 'API da Meta', kind: 'external' },
        ],
      },
    },
    {
      ...bi,
      image: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'Um gráfico de desempenho semanal com campanhas fictícias e media buyers inventados, no lugar do sistema interno.',
      },
      summary: {
        problem: 'O financeiro esperava de 45 minutos a 2 horas por CSV do RedTrack.',
        built:
          'Desenhei e construí tudo: o n8n publica os dados do RedTrack no RabbitMQ e workers NestJS gravam em paralelo no PostgreSQL, então um registro que falha é refeito e nada se perde. Um app Next.js mostra resultados mensais, semanais e por media buyer.',
        result: 'Dados atualizados a cada hora, e o Campaign BI hoje roda no Sistema Wave.',
      },
      architecture: {
        ...bi.architecture,
        nodes: [
          { id: 'redtrack', label: 'RedTrack', kind: 'external' },
          { id: 'n8n', label: 'n8n', kind: 'service' },
          { id: 'queue', label: 'RabbitMQ', kind: 'service' },
          { id: 'web', label: 'App Next.js (login Google)', kind: 'client' },
          { id: 'api', label: 'NestJS (workers e API)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
        ],
      },
    },
    {
      ...zibby,
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'Uma vitrine fictícia ao lado do seu painel administrativo.',
      },
      summary: {
        problem:
          'Gerenciar várias lojas online num só lugar, cada uma com seus próprios produtos, vendas e integrações.',
        built:
          'Minha própria plataforma multiloja (vitrine, painel administrativo, pagamentos com Stripe), construída em fases com agentes de IA. Um monólito modular em NestJS, porque uma pessoa só constrói e opera: um deploy, um banco, cada área no próprio módulo, pronta para virar um serviço se precisar escalar.',
        result: 'Lançada em outubro de 2026.',
      },
      architecture: {
        ...zibby.architecture,
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
    },
    {
      ...hostly,
      image: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'Uma tela de agenda do robô com uma playlist de campanhas fictícia, no lugar do sistema real.',
      },
      summary: {
        problem: 'O app de fábrica não deixava agendar campanhas e não gerava relatório.',
        built:
          'Escrevi a especificação e desenvolvo o sistema inteiro com agentes de IA: app do robô, painel, API e worker de mídia. O app acessa o RobotOS por uma camada própria, o RobotGateway, então roda sem o robô real e pode migrar para o AgentOS depois.',
        result: 'Em uso, transmitindo anúncios para o robô e para telões de LED.',
      },
      architecture: {
        ...hostly.architecture,
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
    },
    {
      ...bookowl,
      image: {
        kind: 'image',
        id: 'bookowl',
        alt: 'A tela inicial do BookOwl: o logo da coruja sobre uma mensagem de boas-vindas.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Código no GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
      },
      summary: {
        problem: 'A biblioteca de uma igreja não sabia quais livros tinha nem com quem estavam.',
        built:
          'Construí do começo ao fim em Python e Django, open source, para a secretária da igreja. Cada empréstimo segue seus estados (aguardando retirada, ativo, atrasado, devolvido, cancelado) e atualiza os livros, então a biblioteca sempre sabe o que está na estante.',
        result: 'Em uso na biblioteca da igreja, na versão 1.4.2.',
      },
      architecture: {
        ...bookowl.architecture,
        nodes: [
          { id: 'browser', label: 'Telas da biblioteca (navegador)', kind: 'client' },
          { id: 'app', label: 'App Django (Python)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
          { id: 'telegram', label: 'Telegram (feedback)', kind: 'external' },
        ],
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
    loop: ['Eu escolho', 'A IA constrói', 'Fica pronto'],
  },
  skills: {
    stack: [
      { label: 'Frontend e mobile', items: en.skills.stack[0]!.items },
      {
        label: 'Backend',
        items: en.skills.stack[1]!.items.map((item) => (item === 'REST APIs' ? 'APIs REST' : item)),
      },
      {
        label: 'Dados',
        items: en.skills.stack[2]!.items.map((item) =>
          item === 'Meta API' ? 'API da Meta' : item,
        ),
      },
      { label: 'DevOps e automação', items: en.skills.stack[3]!.items },
      {
        label: 'Arquitetura',
        items: [
          'Clean Architecture',
          'SOLID',
          'TDD',
          'Monólito modular',
          'Multi-tenant',
          'Microsserviços',
        ],
      },
    ],
    languages: {
      label: 'Idiomas',
      items: ['Português (nativo)', 'Espanhol (básico, estudando)', 'Inglês (básico, estudando)'],
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
