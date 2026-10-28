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
      id: 'gabriel',
      alt: 'Gabriel Santos, smiling, in a blue blazer and glasses.',
    },
  },
  ui: {
    skipToContent: 'Skip to content',
    present: 'present',
    quickView: 'Quick view',
    fullView: 'Full view',
    sections: 'Sections',
    language: 'Language',
    contact: 'Contact',
    downloadCv: 'Download CV',
    seeProjects: 'See projects',
    technicalDetails: 'Technical details',
    close: 'Close',
    internalNoLink: 'Internal system, no public link',
    backToTop: 'Back to top',
    stack: 'Stack',
    sectionsNav: 'Sections',
    languageNav: 'Choose a language',
    details: {
      problem: 'The problem',
      role: 'My role',
      architecture: 'Architecture',
      decisions: 'Key decisions',
      testingAndDeploy: 'Testing and deploy',
      outcome: 'Outcome',
      links: 'Links',
    },
  },
  sections: {
    experience: { title: 'Experience' },
    projects: { title: 'Projects' },
    howIWork: { title: 'How I work' },
    contact: { title: 'Contact' },
  },
  experience: [
    {
      id: 'fator',
      start: 2021,
      end: 2025,
      title: 'Systems Analyst',
      organization: 'Fator Sistemas & Consultorias',
      place: 'Salvador',
      summary:
        'Built and maintained backends in Node.js and frontends in Angular, with JavaScript and TypeScript. Wrote and optimized the SQL queries behind reports, tuned Firebird databases, and migrated data from PostgreSQL, MySQL and other databases into Firebird.',
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
      summary:
        'Designed and built Campaign BI end to end, and work across Sistema Wave, the internal platform about 100 people use to publish more than 1,000 campaigns a day.',
    },
    {
      id: 'ia-robots',
      start: 2026,
      end: 'present',
      title: 'Consultant & Software Developer (contract)',
      organization: 'IA Robots Solutions',
      summary: 'Robot setup and operation for OrionStar service robots, and Hostly development.',
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
        'An internal platform used by about 100 people to publish campaigns to Meta in bulk, edit and improve creatives with AI, generate copy, manage requests between teams (ClickUp-style), and follow campaign, finance and company-health data on dashboards.',
      stack: [
        'Next.js',
        'React',
        'NestJS',
        'TypeScript',
        'PostgreSQL',
        'Meta API',
        'Prometheus',
        'Grafana',
        'Jenkins',
      ],
      internal: true,
      image: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'A stylized request board with fictional teams and tasks, standing in for the internal system.',
      },
      links: { kind: 'internal' },
      technicalDetails: {
        problem:
          'Before the platform, every campaign was set up by hand in NewsBreak, Meta Ads and Taboola.',
        role: 'The team splits the work by area, and I work across all of it, so each part fits the whole system.',
        architecture: {
          nodes: [
            { id: 'web', label: 'Web app (Next.js, React)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
            { id: 'meta', label: 'Meta API', kind: 'external' },
          ],
          edges: [
            { from: 'web', to: 'api' },
            { from: 'api', to: 'db' },
            { from: 'api', to: 'meta' },
          ],
          confirmed: true,
        },
        decisions: [
          {
            what: 'Campaigns publish through the Meta API, many at once.',
            why: 'Before, every campaign was set up by hand on each ad platform.',
          },
          {
            what: 'Prometheus, Grafana and logs watch the system, and alerts go to Telegram on errors or when a route is under heavy load.',
            why: 'To know how the system is doing at any moment, and to hear about errors and overloaded routes as soon as they happen.',
          },
        ],
        testing:
          'Security tests that simulate real attacks, and stress tests that look for errors and failures that could open a security hole.',
        deploy:
          'Jenkins runs the tests and validations, and a change has to pass them to be approved. It goes to the develop environment first, where we test it, and once everything is approved the tech lead deploys it.',
        outcome:
          'More than 1,000 campaigns published every day through the Meta API, by about 100 people inside the company.',
      },
    },
    {
      id: 'campaign-bi',
      title: 'Campaign BI',
      organization: 'Group Wave Enterprise',
      logline:
        "An internal campaign-data system used every day by the owners, finance and the squad leads: monthly and weekly results and each media buyer's performance, refreshed every hour. NestJS workers process RedTrack data from a RabbitMQ queue into PostgreSQL, and a Next.js app with Google sign-in reads it through the NestJS API.",
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'RabbitMQ', 'n8n', 'RedTrack'],
      internal: true,
      image: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'A weekly performance chart with fictional campaigns and invented media buyers, standing in for the internal system.',
      },
      links: { kind: 'internal' },
      technicalDetails: {
        problem:
          'Finance pulled RedTrack data with a small Python script that wrote CSV files. Each pull took 45 minutes to 2 hours, depending on the date range.',
        role: 'I designed the architecture and built the whole system, end to end.',
        architecture: {
          nodes: [
            { id: 'redtrack', label: 'RedTrack', kind: 'external' },
            { id: 'n8n', label: 'n8n', kind: 'service' },
            { id: 'queue', label: 'RabbitMQ', kind: 'service' },
            { id: 'web', label: 'Next.js app (Google sign-in)', kind: 'client' },
            { id: 'api', label: 'NestJS (workers, API)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
          ],
          edges: [
            { from: 'redtrack', to: 'n8n' },
            { from: 'n8n', to: 'queue' },
            { from: 'queue', to: 'api' },
            { from: 'web', to: 'api' },
            { from: 'api', to: 'db' },
          ],
          confirmed: true,
        },
        decisions: [
          {
            what: "Monthly and weekly views of RedTrack data, and each media buyer's performance.",
            why: 'The owners, finance and the squad leads review the data every day: what is working, what is spending, and how each media buyer is doing.',
          },
          {
            what: 'n8n publishes RedTrack data to a RabbitMQ queue, and several NestJS workers process it in parallel into PostgreSQL.',
            why: 'There is a lot of data at once. The queue separates bringing the data in from processing it: n8n publishes everything to RabbitMQ, and the workers consume it at the pace the database can take. A record that fails is retried without affecting the others, and if a worker goes down nothing is lost, because the message stays in the queue. RedTrack identifies each record, so a message processed twice never duplicates data.',
          },
          {
            what: 'A largest-remainder allocation script for conversions and revenue.',
            why: 'The metrics were inflated. The script corrected them, and the results were reconciled against the reference spreadsheets.',
          },
        ],
        testing: 'The checks run in CI on every change.',
        deploy:
          'Nothing ships until CI passes, so an error shows up in the pipeline, not after it has taken the system down, even briefly.',
        outcome:
          'RedTrack data now refreshes every hour during the day, and the larger loads run overnight. The dashboards read it from PostgreSQL through optimized queries instead of waiting 45 minutes to 2 hours for a CSV. Campaign BI now runs inside Sistema Wave.',
      },
    },
    {
      id: 'zibby',
      title: 'Zibby',
      logline:
        'My own multi-store e-commerce platform, launched in October 2026: a storefront, an admin panel, Stripe payments and Zendrop fulfillment.',
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Stripe', 'Zendrop'],
      internal: false,
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'A fictional storefront next to its admin panel.',
      },
      links: todo('a public link for Zibby, if there is one'),
      technicalDetails: {
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
          confirmed: true,
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
      image: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'A robot schedule screen with a fictional campaign playlist, standing in for the real system.',
      },
      links: { kind: 'internal' },
      technicalDetails: {
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
          confirmed: true,
        },
        decisions: [
          {
            what: 'The robot app reaches RobotOS (OrionStar LuckiBot Plus) through an abstraction layer, so it can move to AgentOS later.',
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
      image: {
        kind: 'image',
        id: 'bookowl',
        alt: 'The BookOwl home screen: the owl logo over a welcome message.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Source on GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
      },
      technicalDetails: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          nodes: [
            { id: 'app', label: 'Django app (Python)', kind: 'service' },
            { id: 'db', label: todo('the BookOwl database'), kind: 'data' },
          ],
          edges: [{ from: 'app', to: 'db' }],
          confirmed: true,
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
  skills: {
    stack: [
      { label: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Angular'] },
      {
        label: 'Backend',
        items: ['Node.js', 'NestJS', 'Express', 'RabbitMQ', 'REST APIs', 'Spring Boot', 'Django'],
      },
      {
        label: 'Data',
        items: ['PostgreSQL', 'Prisma', 'MySQL', 'MongoDB', 'Redis', 'Firebird', 'RedTrack'],
      },
      {
        label: 'DevOps & automation',
        items: ['Docker', 'AWS', 'Git', 'n8n', 'Jenkins', 'Prometheus', 'Grafana'],
      },
      { label: 'Architecture', items: ['Clean Architecture', 'SOLID', 'TDD'] },
    ],
    languages: {
      label: 'Languages',
      items: ['Portuguese (native)', 'Spanish (studying)', 'English (studying)'],
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
}
