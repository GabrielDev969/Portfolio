import { en } from './en'
import { missing } from './missing'
import { todo, type Milestone, type Project, type SiteContent } from './schema'

// Latin American Spanish, translated from en.ts and waiting for Gabriel's review.
// Relocation is Spanish-only: PT and EN never mention it.
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
      'Desarrollé y mantuve sistemas con JavaScript, TypeScript, Node.js, Angular, SQL y Firebird.',
  },
  unifacs: { title: 'Licenciatura en Ciencias de la Computación' },
  'group-wave': { title: 'Desarrollador Full Stack', place: 'Remoto' },
  'ia-robots': {
    title: 'Consultor y Desarrollador de Software (contrato)',
    summary: 'Configuración y operación de robots de servicio OrionStar, y desarrollo de Hostly.',
  },
  unipds: { title: 'Posgrado en Ingeniería de Software con IA Aplicada' },
}

export const es: SiteContent = {
  locale: 'es',
  translation: 'needs-review',
  meta: {
    title: 'Gabriel Santos, Desarrollador Full Stack',
    description:
      'Desarrollador Full Stack en Salvador, Brasil, trabajando en remoto y disponible para trasladarme a Santiago, Chile. Next.js, React, Node.js, NestJS, TypeScript y PostgreSQL, de la base de datos a la pantalla.',
  },
  person: {
    name: en.person.name,
    role: 'Desarrollador Full Stack',
    coreStack: en.person.coreStack,
    location: 'Salvador, Brasil',
    workMode: 'Remoto',
    relocation: 'Disponible para trasladarme a Santiago, Chile',
    heroLine: 'De la base de datos a la pantalla.',
    availability: 'Disponible · Santiago, Chile',
    about:
      'Desarrollador Full Stack con unos 5 años de experiencia: 4 como Analista de Sistemas y más de 1 trabajando en remoto. Construyo productos completos, de la base de datos a la interfaz: frontends y dashboards con Next.js y React, APIs con Node.js y NestJS, y datos en PostgreSQL. Programo a diario con agentes de IA para avanzar más rápido sin renunciar al criterio técnico, y curso un posgrado en Ingeniería de Software con IA Aplicada.',
    photo: {
      id: en.person.photo.id,
      alt: 'Gabriel Santos, sonriendo, con blazer azul y lentes.',
    },
  },
  ui: {
    skipToContent: 'Saltar al contenido',
    present: 'actualidad',
    quickView: 'Vista rápida',
    fullView: 'Vista completa',
    sections: 'Secciones',
    language: 'Idioma',
    contact: 'Contacto',
    downloadCv: 'Descargar CV',
    seeProjects: 'Ver proyectos',
    technicalDetails: 'Detalles técnicos',
    close: 'Cerrar',
    internalNoLink: 'Sistema interno, sin enlace público',
    backToTop: 'Volver arriba',
    stack: 'Stack',
    sectionsNav: 'Secciones',
    languageNav: 'Elige un idioma',
    details: {
      problem: 'El problema',
      role: 'Mi rol',
      architecture: 'Arquitectura',
      decisions: 'Decisiones clave',
      testingAndDeploy: 'Pruebas y despliegue',
      outcome: 'Resultado',
      links: 'Enlaces',
    },
  },
  sections: {
    experience: { title: 'Experiencia' },
    projects: { title: 'Proyectos' },
    howIWork: { title: 'Cómo trabajo' },
    contact: { title: 'Contacto' },
  },
  experience: en.experience.map((m) => ({ ...m, ...experience[m.id] })),
  projects: [
    {
      ...wave,
      logline:
        'Una plataforma interna para publicar campañas, gestionar solicitudes entre equipos (al estilo de ClickUp), generar informes y seguir los resultados en un dashboard.',
      image: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'Un tablero de solicitudes estilizado, con equipos y tareas ficticios, en lugar del sistema interno.',
      },
      technicalDetails: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...wave.technicalDetails.architecture,
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
        'Un sistema interno para datos de campañas: workers en NestJS procesan los datos de RedTrack desde una cola en RabbitMQ y los guardan en PostgreSQL, y una app en Next.js con inicio de sesión de Google los consulta a través de la API en NestJS: resultados mensuales y semanales, y el rendimiento de cada media buyer.',
      image: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'Un gráfico de rendimiento semanal con campañas ficticias y media buyers inventados, en lugar del sistema interno.',
      },
      technicalDetails: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...bi.technicalDetails.architecture,
          nodes: [
            { id: 'redtrack', label: 'RedTrack', kind: 'external' },
            { id: 'n8n', label: 'n8n', kind: 'service' },
            { id: 'queue', label: 'RabbitMQ', kind: 'service' },
            { id: 'web', label: 'App Next.js (inicio de sesión de Google)', kind: 'client' },
            { id: 'api', label: 'NestJS (workers y API)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
          ],
        },
        decisions: [
          {
            what: 'Vistas mensuales y semanales de los datos de RedTrack, y el rendimiento de cada media buyer.',
            why: todo('why these views'),
          },
          {
            what: 'n8n lleva los datos de RedTrack a una cola en RabbitMQ, y workers en NestJS los procesan hasta PostgreSQL.',
            why: todo('why a queue between n8n and the workers'),
          },
          {
            what: 'Un script de asignación por el método de los restos mayores para conversiones e ingresos.',
            why: 'Las métricas estaban infladas. El script corrigió los números, y los resultados se conciliaron con las planillas de referencia.',
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
        'Mi propia plataforma de e-commerce multitienda, lanzada en octubre de 2026: tienda online, panel de administración, pagos con Stripe y fulfillment con Zendrop.',
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'Una tienda ficticia junto a su panel de administración.',
      },
      technicalDetails: {
        problem: missing.problem(),
        role: [
          'Producto propio.',
          'Lo construí por fases con agentes de IA para programar, y cada fase siguió plan → revisión → implementación → pruebas → revisión del diff → merge.',
        ],
        architecture: {
          ...zibby.technicalDetails.architecture,
          nodes: [
            { id: 'storefront', label: 'Tienda (Next.js)', kind: 'client' },
            { id: 'admin', label: 'Panel de administración (Next.js)', kind: 'client' },
            { id: 'api', label: 'API (NestJS, monolito modular)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
            { id: 'stripe', label: 'Stripe (pagos)', kind: 'external' },
            { id: 'zendrop', label: 'Zendrop (fulfillment)', kind: 'external' },
          ],
        },
        decisions: [
          {
            what: 'Un monorepo pnpm con la API en NestJS y la tienda y el panel en Next.js, organizado como monolito modular.',
            why: todo('why a modular monolith in one monorepo'),
          },
          { what: 'PostgreSQL con Prisma.', why: todo('why PostgreSQL and Prisma') },
          {
            what: 'Stripe para pagos y Zendrop para fulfillment.',
            why: todo('why Stripe and Zendrop'),
          },
        ],
        testing:
          'Pruebas automatizadas en todo el monorepo; cada fase las pasó antes de la revisión del diff.',
        deploy: 'Desplegado en un VPS.',
        outcome: [
          'Lanzada en octubre de 2026.',
          todo('one number, if you want it: orders, products or uptime'),
        ],
      },
    },
    {
      ...hostly,
      logline:
        'Un sistema para robots de servicio OrionStar: un panel de administración que programa campañas publicitarias y música, un backend en un VPS y una app en RobotOS que las reproduce y conversa con las personas.',
      image: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'Una pantalla de programación del robot con una playlist de campañas ficticia, en lugar del sistema real.',
      },
      technicalDetails: {
        problem: missing.problem(),
        role: missing.role(),
        architecture: {
          ...hostly.technicalDetails.architecture,
          nodes: [
            { id: 'admin', label: 'Panel de administración', kind: 'client' },
            { id: 'app', label: 'App del robot', kind: 'client' },
            { id: 'backend', label: 'Backend (VPS)', kind: 'service' },
            { id: 'robot', label: 'RobotOS en OrionStar LuckiBot Plus', kind: 'device' },
          ],
          edges: [
            { from: 'admin', to: 'backend', label: 'campañas, música' },
            { from: 'app', to: 'backend' },
            { from: 'app', to: 'robot', label: 'capa de abstracción' },
          ],
        },
        decisions: [
          {
            what: 'La app del robot accede a RobotOS (OrionStar LuckiBot Plus) a través de una capa de abstracción, para poder migrar a AgentOS más adelante.',
          },
          {
            what: 'Un backend en un VPS y un panel de administración para programar campañas publicitarias y música.',
            why: todo('why this split'),
          },
          {
            what: 'Pensado para convertirse en un SaaS para varias empresas más adelante.',
            why: todo('what that changed in the design today'),
          },
        ],
        testing: missing.testing(),
        deploy: 'El backend está alojado en un VPS.',
        outcome: missing.outcome(),
      },
    },
    {
      ...bookowl,
      logline:
        'Un sistema open source de gestión de bibliotecas en Python y Django, hecho para la biblioteca real de una iglesia.',
      image: {
        kind: 'image',
        id: 'bookowl',
        alt: 'La pantalla de inicio de BookOwl: el logo del búho sobre un mensaje de bienvenida.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Código en GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
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
          { what: 'Python y Django.', why: todo('why Python and Django') },
          { what: 'Open source, en GitHub.', why: todo('why open source') },
        ],
        testing: missing.testing(),
        deploy: todo('how BookOwl is deployed'),
        outcome: missing.outcome(),
      },
    },
  ],
  workflow: {
    steps: [
      'Planifico',
      'Reviso el plan',
      'La IA implementa',
      'Reviso el diff',
      'Ejecuto las pruebas',
      'Merge',
    ],
    closing: 'La IA acelera. El criterio es mío.',
  },
  skills: {
    stack: [
      { label: 'Frontend', items: en.skills.stack[0]!.items },
      {
        label: 'Backend',
        items: ['Node.js', 'NestJS', 'Express', 'APIs REST', 'Spring Boot', 'Django'],
      },
      { label: 'Datos', items: en.skills.stack[2]!.items },
      { label: 'DevOps y automatización', items: en.skills.stack[3]!.items },
      { label: 'Arquitectura', items: en.skills.stack[4]!.items },
    ],
    languages: {
      label: 'Idiomas',
      items: ['Portugués (nativo)', 'Español (estudiando)', 'Inglés (estudiando)'],
    },
  },
  contact: {
    cta: 'Escríbeme',
    email: en.contact.email,
    links: en.contact.links,
    cv: {
      href: 'cv/CV_Gabriel_Santos_ES.pdf',
      label: 'Descargar CV',
    },
    basedIn: 'Vivo en Salvador, Brasil, y trabajo en remoto.',
  },
}
