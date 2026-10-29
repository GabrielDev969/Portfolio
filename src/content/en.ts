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
    noPublicLink: 'No public link',
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
        'Designed and built Campaign BI end to end, and work across Sistema Wave, the internal platform about 100 people use to publish more than 500 campaigns a day.',
    },
    {
      id: 'ia-robots',
      start: 2025,
      end: 'present',
      title: 'Consultant & Software Developer (contract)',
      organization: 'IA Robots Solutions',
      summary:
        'Setup and operation of OrionStar service robots, and development of Hostly, which streams ads to the robots and to LED screens.',
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
          'More than 500 campaigns published every day through the Meta API, by about 100 people inside the company.',
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
        'My own multi-store e-commerce platform, launched in October 2026: a storefront, an admin panel with product registration and sales dashboards that show how each product is selling, and Stripe payments. Every integration is a provider, so each store can be created and customized with the APIs it needs.',
      stack: [
        'Next.js',
        'NestJS',
        'PostgreSQL',
        'Prisma',
        'Stripe',
        'Resend',
        'Microsoft Clarity',
        'Meta Pixel',
      ],
      internal: false,
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'A fictional storefront next to its admin panel.',
      },
      links: { kind: 'none' },
      technicalDetails: {
        problem:
          'Running several online stores from one place, each with its own products, sales and integrations.',
        role: [
          'My own product.',
          'I built it in phases with AI coding agents, and every phase went plan → review → implement → tests → diff review → merge.',
        ],
        architecture: {
          nodes: [
            { id: 'storefront', label: 'Storefront (Next.js)', kind: 'client' },
            { id: 'tracking', label: 'Microsoft Clarity and Meta Pixel', kind: 'external' },
            { id: 'admin', label: 'Admin panel (Next.js)', kind: 'client' },
            { id: 'api', label: 'API (NestJS, modular monolith)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
            { id: 'stripe', label: 'Stripe (payments provider)', kind: 'external' },
            { id: 'email', label: 'Resend (e-mail provider)', kind: 'external' },
          ],
          edges: [
            { from: 'storefront', to: 'api' },
            { from: 'admin', to: 'api' },
            { from: 'api', to: 'db' },
            { from: 'api', to: 'stripe' },
            { from: 'api', to: 'email' },
            { from: 'storefront', to: 'tracking' },
          ],
          confirmed: true,
        },
        decisions: [
          {
            what: 'A pnpm monorepo with the NestJS API and the Next.js storefront and admin, organized as a modular monolith.',
            why: 'One person builds and runs it, so it ships as one deploy with one database and one place to trace an error. Microservices would add network calls, separate deploys and failures spread across services, with nothing to gain at this size. Each area (stores, products, orders, payments) stays in its own module with a clear boundary, so one can become a separate service if it ever needs to scale. And in the monorepo, a change that crosses the API, the storefront and the admin goes out in one commit.',
          },
          {
            what: 'Microsoft Clarity in the storefront, and a Meta Pixel set per store.',
            why: 'Clarity records sessions and builds heatmaps, so I can see where customers click, how far they scroll and where they give up. Each store adds its own Meta Pixel, which reports visits, add-to-carts and purchases back to Meta, so its ads can be measured and optimized.',
          },
          {
            what: 'Every integration is a provider: Stripe for payments and Resend for e-mail are the first, and other APIs plug in the same way.',
            why: 'So each store can be created and customized however it needs, with the services it chooses.',
          },
        ],
        testing:
          'Automated tests across the monorepo; each phase passed them before its diff review.',
        deploy:
          'Deployed to a VPS, with emergency backups. Customer data and API keys are encrypted, so even after a break-in they can only be read with the decryption key.',
        outcome: 'Launched in October 2026.',
      },
    },
    {
      id: 'hostly',
      title: 'Hostly',
      organization: 'IA Robots Solutions',
      logline:
        'A multi-company platform for OrionStar service robots: its own Android app replaces the factory one and plays the campaigns, music and spoken lines scheduled on a web panel. The ads also go to registered LED screens, at events too.',
      stack: [
        'Kotlin',
        'RobotOS',
        'NestJS',
        'Next.js',
        'PostgreSQL',
        'Redis',
        'BullMQ',
        'FFmpeg',
        'Docker',
      ],
      internal: true,
      image: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'A robot schedule screen with a fictional campaign playlist, standing in for the real system.',
      },
      links: { kind: 'internal' },
      technicalDetails: {
        problem:
          "The robot's factory app made it hard to change the media, could not schedule campaigns, failed on the big screen and kept no report.",
        role: 'I wrote the specification and build the whole system, with AI coding agents working in parallel, one per issue: the API, the panel, the media worker and the Android app on the robot.',
        architecture: {
          nodes: [
            { id: 'panel', label: 'Panel (Next.js)', kind: 'client' },
            { id: 'app', label: 'Robot app (Kotlin)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'robot', label: 'RobotOS on LuckiBot Plus', kind: 'device' },
            { id: 'worker', label: 'Media worker (FFmpeg)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
            { id: 'screen', label: 'Registered LED screen', kind: 'device' },
            { id: 'storage', label: 'S3 storage', kind: 'data' },
          ],
          edges: [
            { from: 'panel', to: 'api' },
            { from: 'app', to: 'api', label: 'WebSocket' },
            { from: 'app', to: 'robot', label: 'RobotGateway' },
            { from: 'api', to: 'worker', label: 'queue' },
            { from: 'api', to: 'db' },
            { from: 'api', to: 'screen', label: 'ads' },
            { from: 'worker', to: 'storage' },
          ],
          confirmed: true,
        },
        decisions: [
          {
            what: 'The robot app reaches RobotOS through its own layer, the RobotGateway, which also has a fake for the emulator.',
            why: 'The app runs and is tested without the real robot, and if OrionStar ever ships AgentOS for the LuckiBot Plus, only that layer changes.',
          },
          {
            what: 'The cloud decides and the robot executes: every change on the panel recompiles a versioned manifest, and the robot follows the last one it received.',
            why: 'Without internet, the robot keeps to its schedule, plays the media from its cache and stores its events to send once the network is back.',
          },
          {
            what: 'Multi-company from the start: operator, clients, sites and robots, with roles and a brand per client that a robot inherits from its client or the operator.',
            why: 'Each client, such as a shopping mall, uses the panel under its own brand and sees only its own robots and campaigns. The organization scope is enforced at the center of the API and in the database, not route by route, so the same base can become a SaaS.',
          },
        ],
        testing:
          'Unit and end-to-end tests on the API, the panel and the worker, contract tests for the RobotGateway and the Android build checks, all in CI on every change. The API denies by default, with a sweep that fails if any route has no guard; login has two-factor authentication, and the audit log is a chain signed with HMAC.',
        deploy:
          'The API, panel, worker, PostgreSQL and Redis run with Docker Compose on a VPS behind automatic HTTPS. Media sits in private S3 storage, served only through signed URLs; deploys go only through a VPN, and a daily encrypted backup leaves the server.',
        outcome:
          'In use: it connects to the robot and to registered LED screens and streams ads to both, at events too.',
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
