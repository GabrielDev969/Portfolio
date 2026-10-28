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
      'Desenvolvi e mantive sistemas com JavaScript, TypeScript, Node.js, Angular, SQL e Firebird.',
  },
  unifacs: { title: 'Bacharelado em Ciência da Computação' },
  'group-wave': { title: 'Desenvolvedor Full Stack', place: 'Remoto' },
  'ia-robots': {
    title: 'Consultor e Desenvolvedor de Software (contrato)',
    summary:
      'Configuração e operação de robôs de atendimento OrionStar, e desenvolvimento do Hostly.',
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
      still: en.person.photo.still,
      alt: 'Gabriel Santos, sorrindo, de blazer azul e óculos.',
    },
  },
  ui: {
    skipIntro: 'Pular abertura',
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
    rewind: 'Rebobinar o filme',
    openingTitles: 'Créditos de abertura',
    sectionsNav: 'Seções',
    languageNav: 'Escolha o idioma',
    bts: {
      problem: 'O problema',
      role: 'Meu papel',
      architecture: 'Arquitetura',
      decisions: 'Decisões principais',
      testingAndDeploy: 'Testes e deploy',
      outcome: 'Resultado',
      links: 'Links',
    },
  },
  chapters: {
    experience: { act: 'Ato I', title: 'Experiência' },
    projects: { act: 'Ato II', title: 'Projetos' },
    howIWork: { act: 'Ato III', title: 'Como trabalho' },
    contact: { title: 'Contato' },
  },
  production: 'Uma produção de Gabriel Santos',
  experience: en.experience.map((m) => ({ ...m, ...experience[m.id] })),
  projects: [
    {
      ...wave,
      logline:
        'Uma plataforma interna para publicar campanhas, gerenciar solicitações entre equipes (no estilo do ClickUp), gerar relatórios e acompanhar resultados em um dashboard.',
      still: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'Um quadro de solicitações estilizado, com equipes e tarefas fictícias, no lugar do sistema interno.',
      },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...wave.behindTheScenes.architecture,
          nodes: [
            { id: 'web', label: 'App web (Next.js, React)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
          ],
        },
        decisions: [missing.decision(), missing.decision()],
        testing: missing.testing(),
        deploy: missing.deploy(),
        outcome: missing.outcome(),
      },
    },
    {
      ...bi,
      logline:
        'Um sistema interno para dados de campanhas: workers em NestJS processam os dados do RedTrack a partir de uma fila no RabbitMQ e gravam no PostgreSQL, e um app em Next.js com login Google os lê pela API em NestJS: resultados mensais e semanais, e o desempenho de cada media buyer.',
      still: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'Um gráfico de desempenho semanal com campanhas fictícias e media buyers inventados, no lugar do sistema interno.',
      },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...bi.behindTheScenes.architecture,
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
            why: todo('why these views'),
          },
          {
            what: 'O n8n leva os dados do RedTrack para uma fila no RabbitMQ, e workers em NestJS os processam até o PostgreSQL.',
            why: todo('why a queue between n8n and the workers'),
          },
          {
            what: 'Um script de alocação pelo método dos maiores restos para conversões e receita.',
            why: 'As métricas estavam infladas. O script corrigiu os números, e os resultados foram conferidos com as planilhas de referência.',
          },
        ],
        testing: missing.testing(),
        deploy: missing.deploy(),
        outcome: missing.outcome(),
      },
    },
    {
      ...zibby,
      logline:
        'Minha própria plataforma de e-commerce multiloja, lançada em outubro de 2026: vitrine, painel administrativo, pagamentos com Stripe e fulfillment pela Zendrop.',
      still: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'Uma vitrine fictícia ao lado do seu painel administrativo.',
      },
      behindTheScenes: {
        problem: missing.problem(),
        role: [
          'Produto próprio.',
          'Construí em fases com agentes de IA para programar, e cada fase seguiu plano → revisão → implementação → testes → revisão do diff → merge.',
        ],
        architecture: {
          ...zibby.behindTheScenes.architecture,
          nodes: [
            { id: 'storefront', label: 'Vitrine (Next.js)', kind: 'client' },
            { id: 'admin', label: 'Painel administrativo (Next.js)', kind: 'client' },
            { id: 'api', label: 'API (NestJS, monólito modular)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
            { id: 'stripe', label: 'Stripe (pagamentos)', kind: 'external' },
            { id: 'zendrop', label: 'Zendrop (fulfillment)', kind: 'external' },
          ],
        },
        decisions: [
          {
            what: 'Um monorepo pnpm com a API em NestJS e a vitrine e o painel em Next.js, organizado como monólito modular.',
            why: todo('why a modular monolith in one monorepo'),
          },
          { what: 'PostgreSQL com Prisma.', why: todo('why PostgreSQL and Prisma') },
          {
            what: 'Stripe para pagamentos e Zendrop para fulfillment.',
            why: todo('why Stripe and Zendrop'),
          },
        ],
        testing:
          'Testes automatizados em todo o monorepo; cada fase passou por eles antes da revisão do diff.',
        deploy: 'Deploy em uma VPS.',
        outcome: [
          'Lançada em outubro de 2026.',
          todo('one number, if you want it: orders, products or uptime'),
        ],
      },
    },
    {
      ...hostly,
      logline:
        'Um sistema para robôs de atendimento OrionStar: um painel administrativo que agenda campanhas de anúncios e músicas, um backend em uma VPS e um app no RobotOS que reproduz tudo e conversa com as pessoas.',
      still: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'Uma tela de agenda do robô com uma playlist de campanhas fictícia, no lugar do sistema real.',
      },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...hostly.behindTheScenes.architecture,
          nodes: [
            { id: 'admin', label: 'Painel administrativo', kind: 'client' },
            { id: 'app', label: 'App do robô', kind: 'client' },
            { id: 'backend', label: 'Backend (VPS)', kind: 'service' },
            { id: 'robot', label: 'RobotOS no OrionStar LuckiBot Plus', kind: 'device' },
          ],
          edges: [
            { from: 'admin', to: 'backend', label: 'campanhas, músicas' },
            { from: 'app', to: 'backend' },
            { from: 'app', to: 'robot', label: 'camada de abstração' },
          ],
        },
        decisions: [
          {
            what: 'O app do robô acessa o RobotOS (OrionStar LuckiBot Plus) por uma camada de abstração, para poder migrar para o AgentOS depois.',
          },
          {
            what: 'Um backend em uma VPS e um painel administrativo para agendar campanhas de anúncios e músicas.',
            why: todo('why this split'),
          },
          {
            what: 'Pensado para virar um SaaS para várias empresas no futuro.',
            why: todo('what that changed in the design today'),
          },
        ],
        testing: missing.testing(),
        deploy: 'O backend fica hospedado em uma VPS.',
        outcome: missing.outcome(),
      },
    },
    {
      ...bookowl,
      logline:
        'Um sistema open source de gestão de bibliotecas em Python e Django, feito para a biblioteca de uma igreja de verdade.',
      still: {
        kind: 'image',
        still: 'bookowl',
        alt: 'A tela inicial do BookOwl: o logo da coruja sobre uma mensagem de boas-vindas.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Código no GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
      },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...bookowl.behindTheScenes.architecture,
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
  credits: {
    crew: [
      { role: 'Direção', names: ['Gabriel Santos'] },
      { role: 'Roteiro', names: ['Gabriel Santos'] },
      { role: 'Fotografia', names: ['Gabriel Santos'] },
    ],
    castLabel: 'Stack',
    cast: [
      { role: 'Frontend', names: en.credits.cast[0]!.names },
      {
        role: 'Backend',
        names: ['Node.js', 'NestJS', 'Express', 'APIs REST', 'Spring Boot', 'Django'],
      },
      { role: 'Dados', names: en.credits.cast[2]!.names },
      { role: 'DevOps e automação', names: en.credits.cast[3]!.names },
      { role: 'Arquitetura', names: en.credits.cast[4]!.names },
    ],
    languages: {
      role: 'Idiomas',
      names: ['Português (nativo)', 'Espanhol (estudando)', 'Inglês (estudando)'],
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
  postCredits: {
    line: 'Gabriel Santos voltará no seu próximo projeto.',
    rewind: 'Rebobinar o filme',
  },
}
