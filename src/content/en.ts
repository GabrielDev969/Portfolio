import { todo, type SiteContent } from './schema'

const missing = {
  problem: () => todo('the problem this project solved'),
  role: () => todo('what you owned in this project'),
  decision: () => ({ what: todo('a key technical decision'), why: todo('why you made it') }),
  testing: () => todo('how it is tested'),
  deploy: () => todo('how it is deployed'),
  outcome: () => todo('the outcome, ideally with a number'),
}

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
      pending: todo('replace the GitHub avatar with a professional photo'),
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
      stack: ['RedTrack', todo('the rest of the Campaign BI stack')],
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
            {
              id: 'pipeline',
              label: todo('what sits between RedTrack and the dashboards'),
              kind: 'service',
            },
            { id: 'dashboards', label: 'Dashboards', kind: 'client' },
          ],
          edges: [
            { from: 'redtrack', to: 'pipeline' },
            { from: 'pipeline', to: 'dashboards' },
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
      id: 'zibby',
      title: 'Zibby',
      logline:
        'My own multi-store e-commerce platform: a storefront and an admin panel, Stripe payments and a Zendrop integration.',
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Stripe'],
      internal: false,
      still: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'A fictional storefront next to its admin panel.',
      },
      links: todo('a public link for Zibby, if there is one'),
      behindTheScenes: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          nodes: [
            { id: 'storefront', label: 'Storefront', kind: 'client' },
            { id: 'admin', label: 'Admin panel', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
            { id: 'stripe', label: 'Stripe', kind: 'external' },
            { id: 'zendrop', label: 'Zendrop', kind: 'external' },
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
        decisions: [missing.decision(), missing.decision()],
        testing: 'Automated tests across the monorepo.',
        deploy: 'Deployed to a VPS.',
        outcome: missing.outcome(),
      },
    },
    {
      id: 'hostly',
      title: 'Hostly',
      organization: 'IA Robots Solutions',
      logline:
        'A system for OrionStar service robots: an admin panel, a backend on a VPS and a RobotOS app that plays scheduled campaigns and music and talks to people.',
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
            { id: 'backend', label: 'Backend (VPS)', kind: 'service' },
            { id: 'robot', label: 'RobotOS app on OrionStar robots', kind: 'device' },
          ],
          edges: [
            { from: 'admin', to: 'backend' },
            { from: 'robot', to: 'backend' },
          ],
          confirmed: false,
        },
        decisions: [missing.decision(), missing.decision()],
        testing: missing.testing(),
        deploy: 'The backend is hosted on a VPS.',
        outcome: missing.outcome(),
      },
    },
    {
      id: 'bookowl',
      title: 'BookOwl',
      logline: 'An open source library management system in Python and Django.',
      stack: ['Python', 'Django'],
      internal: false,
      still: {
        kind: 'image',
        src: 'scenes/bookowl',
        alt: 'The BookOwl library management interface.',
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
        decisions: [missing.decision(), missing.decision()],
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
