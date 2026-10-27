import { missing } from './missing'
import { todo, type SiteContent } from './schema'

export const en: SiteContent = {
  locale: 'en',
  translation: 'source',
  meta: {
    title: 'Gabriel Santos, Full Stack Developer',
    description:
      'Full Stack Developer in Salvador, Brazil, working remotely. Next.js, React, Node.js, NestJS, TypeScript and PostgreSQL, from the database to the screen.',
  },
  person: {
    name: 'Gabriel Santos',
    role: 'Full Stack Developer',
    coreStack: ['Next.js', 'React', 'Node.js', 'NestJS', 'TypeScript', 'PostgreSQL'],
    location: 'Salvador, Brazil',
    workMode: 'Remote',
    heroLine: 'From the database to the screen.',
    availability: 'Available for new projects',
    about:
      'Full Stack Developer with about 5 years of experience: 4 as a Systems Analyst and over 1 working remotely. I build complete products, from the database to the interface: frontends and dashboards with Next.js and React, APIs with Node.js and NestJS, and data in PostgreSQL. I use AI coding agents daily to move faster without giving up technical judgment, and I am pursuing a postgraduate degree in Software Engineering for Applied AI.',
    photo: {
      still: 'gabriel',
      alt: 'Gabriel Santos, smiling, in a blue blazer and glasses.',
    },
  },
  ui: {
    skipIntro: 'Skip intro',
    skipToContent: 'Skip to content',
    present: 'present',
    quickView: 'Quick view',
    filmView: 'Film view',
    chapters: 'Chapters',
    language: 'Language',
    contact: 'Contact',
    downloadCv: 'Download CV',
    watchTrailer: 'Watch the trailer',
    behindTheScenes: 'Behind the scenes',
    close: 'Close',
    internalNoLink: 'Internal system, no public link',
    rewind: 'Rewind the reel',
    openingTitles: 'Opening titles',
    chaptersNav: 'Sections',
    languageNav: 'Choose a language',
    bts: {
      problem: 'The problem',
      role: 'My role',
      architecture: 'Architecture',
      decisions: 'Key decisions',
      testingAndDeploy: 'Testing and deploy',
      outcome: 'Outcome',
      links: 'Links',
    },
  },
  chapters: {
    experience: { act: 'Act I', title: 'Experience' },
    projects: { act: 'Act II', title: 'Projects' },
    howIWork: { act: 'Act III', title: 'How I work' },
    contact: { title: 'Contact' },
  },
  production: 'A Gabriel Santos production',
  experience: [
    {
      id: 'fator',
      start: 2021,
      end: 2025,
      title: 'Systems Analyst',
      organization: 'Fator Sistemas & Consultorias',
      place: 'Salvador',
      summary:
        'Built and maintained systems with JavaScript, TypeScript, Node.js, Angular, SQL and Firebird.',
    },
    {
      id: 'unifacs',
      start: 2021,
      end: 2025,
      title: 'B.Sc. in Computer Science',
      organization: 'UNIFACS',
    },
    {
      id: 'group-wave',
      start: 2025,
      end: 'present',
      title: 'Full Stack Developer',
      organization: 'Group Wave Enterprise',
      place: 'Remote',
    },
    {
      id: 'ia-robots',
      start: 2026,
      end: 'present',
      title: 'Consultant & Software Developer (contract)',
      organization: 'IA Robots Solutions',
      summary: 'Robot setup and operation for OrionStar service robots, plus Hostly.',
    },
    {
      id: 'unipds',
      start: 2026,
      end: 2027,
      title: 'Postgraduate degree in Software Engineering for Applied AI',
      organization: 'UNIPDS',
    },
  ],
  projects: [
    {
      id: 'sistema-wave',
      title: 'Sistema Wave',
      organization: 'Group Wave Enterprise',
      logline:
        'An internal platform to publish campaigns, manage requests between teams (ClickUp-style), generate reports and track results on a dashboard.',
      stack: ['Next.js', 'React', 'NestJS', 'TypeScript', 'PostgreSQL'],
      internal: true,
      still: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'A stylized request board with fictional teams and tasks, standing in for the internal system.',
      },
      links: { kind: 'internal' },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          nodes: [
            { id: 'web', label: 'Web app (Next.js, React)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
          ],
          edges: [
            { from: 'web', to: 'api' },
            { from: 'api', to: 'db' },
          ],
          confirmed: false,
        },
        decisions: [missing.decision(), missing.decision()],
        testing: missing.testing(),
        deploy: missing.deploy(),
        outcome: missing.outcome(),
      },
    },
    {
      id: 'campaign-bi',
      title: 'Campaign BI',
      organization: 'Group Wave Enterprise',
      logline:
        "Dashboards built on RedTrack data: monthly and weekly analysis, and each media buyer's performance by the campaigns they launched.",
      stack: ['RedTrack', 'n8n', 'PostgreSQL', todo('what the dashboards are built with')],
      internal: true,
      still: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'A weekly performance chart with fictional campaigns and invented media buyers, standing in for the internal dashboards.',
      },
      links: { kind: 'internal' },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          nodes: [
            { id: 'redtrack', label: 'RedTrack', kind: 'external' },
            { id: 'n8n', label: 'n8n pipelines', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
            { id: 'dashboards', label: 'Dashboards', kind: 'client' },
          ],
          edges: [
            { from: 'redtrack', to: 'n8n' },
            { from: 'n8n', to: 'db' },
            { from: 'db', to: 'dashboards' },
          ],
          confirmed: false,
        },
        decisions: [
          {
            what: "Dashboards on RedTrack data, with monthly and weekly views and each media buyer's performance.",
            why: todo('why these views'),
          },
          { what: 'n8n pipelines feed PostgreSQL.', why: todo('why n8n and PostgreSQL') },
          {
            what: 'A largest-remainder allocation script for conversions and revenue.',
            why: 'The metrics were inflated. The script corrected them, and the results were reconciled against the reference spreadsheets.',
          },
        ],
        testing: missing.testing(),
        deploy: missing.deploy(),
        outcome: missing.outcome(),
      },
    },
    {
      id: 'zibby',
      title: 'Zibby',
      logline:
        'My own multi-store e-commerce platform, launched in October 2026: a storefront, an admin panel, Stripe payments and Zendrop fulfillment.',
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Stripe', 'Zendrop'],
      internal: false,
      still: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'A fictional storefront next to its admin panel.',
      },
      links: todo('a public link for Zibby, if there is one'),
      behindTheScenes: {
        problem: missing.problem(),
        role: [
          'My own product.',
          'I built it in phases with AI coding agents, and every phase went plan → review → implement → tests → diff review → merge.',
        ],
        architecture: {
          nodes: [
            { id: 'storefront', label: 'Storefront (Next.js)', kind: 'client' },
            { id: 'admin', label: 'Admin panel (Next.js)', kind: 'client' },
            { id: 'api', label: 'API (NestJS, modular monolith)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
            { id: 'stripe', label: 'Stripe (payments)', kind: 'external' },
            { id: 'zendrop', label: 'Zendrop (fulfillment)', kind: 'external' },
          ],
          edges: [
            { from: 'storefront', to: 'api' },
            { from: 'admin', to: 'api' },
            { from: 'api', to: 'db' },
            { from: 'api', to: 'stripe' },
            { from: 'api', to: 'zendrop' },
          ],
          confirmed: false,
        },
        decisions: [
          {
            what: 'A pnpm monorepo with the NestJS API and the Next.js storefront and admin, organized as a modular monolith.',
            why: todo('why a modular monolith in one monorepo'),
          },
          { what: 'PostgreSQL with Prisma.', why: todo('why PostgreSQL and Prisma') },
          {
            what: 'Stripe for payments and Zendrop for fulfillment.',
            why: todo('why Stripe and Zendrop'),
          },
        ],
        testing:
          'Automated tests across the monorepo; each phase passed them before its diff review.',
        deploy: 'Deployed to a VPS.',
        outcome: [
          'Launched in October 2026.',
          todo('one number, if you want it: orders, products or uptime'),
        ],
      },
    },
    {
      id: 'hostly',
      title: 'Hostly',
      organization: 'IA Robots Solutions',
      logline:
        'A system for OrionStar service robots: an admin panel that schedules ad campaigns and music, a backend on a VPS, and a RobotOS app that plays them and talks to people.',
      stack: ['RobotOS', todo('the rest of the Hostly stack')],
      internal: true,
      still: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'A robot schedule screen with a fictional campaign playlist, standing in for the client system.',
      },
      links: { kind: 'internal' },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          nodes: [
            { id: 'admin', label: 'Admin panel', kind: 'client' },
            { id: 'app', label: 'Robot app', kind: 'client' },
            { id: 'backend', label: 'Backend (VPS)', kind: 'service' },
            { id: 'robot', label: 'RobotOS on OrionStar LuckiBot Plus', kind: 'device' },
          ],
          edges: [
            { from: 'admin', to: 'backend', label: 'campaigns, music' },
            { from: 'app', to: 'backend' },
            { from: 'app', to: 'robot', label: 'abstraction layer' },
          ],
          confirmed: false,
        },
        decisions: [
          {
            what: 'The robot app reaches RobotOS (OrionStar LuckiBot Plus) through an abstraction layer.',
            why: 'So it can move to AgentOS later.',
          },
          {
            what: 'A backend on a VPS, and an admin panel to schedule ad campaigns and music.',
            why: todo('why this split'),
          },
          {
            what: 'Designed to become a multi-company SaaS later.',
            why: todo('what that changed in the design today'),
          },
        ],
        testing: missing.testing(),
        deploy: 'The backend is hosted on a VPS.',
        outcome: missing.outcome(),
      },
    },
    {
      id: 'bookowl',
      title: 'BookOwl',
      logline:
        'An open source library management system in Python and Django, built for a real church library.',
      stack: ['Python', 'Django'],
      internal: false,
      still: {
        kind: 'image',
        still: 'bookowl',
        alt: 'The BookOwl home screen: the owl logo over a welcome message.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Source on GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
      },
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          nodes: [
            { id: 'app', label: 'Django app (Python)', kind: 'service' },
            { id: 'db', label: todo('the BookOwl database'), kind: 'data' },
          ],
          edges: [{ from: 'app', to: 'db' }],
          confirmed: false,
        },
        decisions: [
          { what: 'Python and Django.', why: todo('why Python and Django') },
          { what: 'Open source, on GitHub.', why: todo('why open source') },
        ],
        testing: missing.testing(),
        deploy: todo('how BookOwl is deployed'),
        outcome: missing.outcome(),
      },
    },
  ],
  workflow: {
    steps: [
      'I plan',
      'I review the plan',
      'The AI implements',
      'I review the diff',
      'I run the tests',
      'Merge',
    ],
    closing: 'AI speeds things up. The judgment is mine.',
  },
  credits: {
    crew: [
      { role: 'Directed by', names: ['Gabriel Santos'] },
      { role: 'Written by', names: ['Gabriel Santos'] },
      { role: 'Shot by', names: ['Gabriel Santos'] },
    ],
    castLabel: 'Cast',
    cast: [
      { role: 'Frontend', names: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Angular'] },
      {
        role: 'Backend',
        names: ['Node.js', 'NestJS', 'Express', 'REST APIs', 'Spring Boot', 'Django'],
      },
      {
        role: 'Data',
        names: ['PostgreSQL', 'Prisma', 'MySQL', 'MongoDB', 'Redis', 'Firebird', 'RedTrack'],
      },
      { role: 'DevOps & automation', names: ['Docker', 'AWS', 'Git', 'n8n'] },
      { role: 'Architecture', names: ['Clean Architecture', 'SOLID', 'TDD'] },
    ],
    languages: {
      role: 'Languages',
      names: ['Portuguese (native)', 'Spanish (studying)', 'English (studying)'],
    },
  },
  contact: {
    cta: 'Write to me',
    email: 'gabriel.dev969@gmail.com',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gabriel-santos-b53632196/' },
      { label: 'GitHub', href: 'https://github.com/GabrielDev969' },
      { label: 'YouTube', href: 'https://www.youtube.com/@Gabriel.Dev969' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@gabriel.dev969' },
    ],
    cv: {
      href: 'cv/CV_Gabriel_Santos_EN.pdf',
      label: 'Download CV',
    },
    basedIn: 'Based in Salvador, Brazil, working remotely.',
  },
  postCredits: {
    line: 'Gabriel Santos will return in your next project.',
    rewind: 'Rewind the reel',
  },
}
