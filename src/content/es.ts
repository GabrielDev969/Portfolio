import { en } from './en'
import type { Milestone, Project, SiteContent } from './schema'

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
      'Desarrollé y mantuve backends en Node.js y frontends en Angular, con JavaScript y TypeScript. Escribí y optimicé las consultas SQL de los informes, ajusté bases de datos Firebird y migré datos de PostgreSQL, MySQL y otras bases de datos a Firebird.',
  },
  unifacs: { title: 'Licenciatura en Ciencias de la Computación' },
  'group-wave': {
    title: 'Desarrollador Full Stack',
    place: 'Remoto',
    summary:
      'Diseñé y construí Campaign BI de punta a punta, y trabajo en todo Sistema Wave, la plataforma interna que unas 100 personas usan para publicar más de 500 campañas al día.',
  },
  'ia-robots': {
    title: 'Consultor y Desarrollador de Software (contrato)',
    summary:
      'Configuración y operación de robots de servicio OrionStar, y desarrollo de Hostly, que transmite anuncios en los robots y en pantallas LED.',
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
    stats: [
      { value: '~5', label: 'años de experiencia' },
      { value: '500+', label: 'campañas al día en Sistema Wave' },
      { value: '~100', label: 'personas lo usan a diario' },
    ],
    availability: 'Disponible para nuevos proyectos',
    about:
      'Desarrollador Full Stack con unos 5 años de experiencia: 4 como Analista de Sistemas y más de 1 trabajando en remoto. Construyo productos completos, de la base de datos a la interfaz: frontends y dashboards con Next.js y React, APIs con Node.js y NestJS, y datos en PostgreSQL. Programo a diario con agentes de IA para avanzar más rápido sin renunciar al criterio técnico, y curso un posgrado en Ingeniería de Software con IA Aplicada.',
    photo: {
      id: en.person.photo.id,
      alt: 'Gabriel Santos, sonriendo, con blazer azul y lentes.',
    },
  },
  ui: {
    greeting: 'Hola, soy',
    backdrop: 'PORTAFOLIO',
    skipToContent: 'Saltar al contenido',
    present: 'actualidad',
    quickView: 'Vista rápida',
    fullView: 'Vista completa',
    sections: 'Secciones',
    language: 'Idioma',
    contact: 'Contacto',
    downloadCv: 'Descargar CV',
    seeProjects: 'Ver proyectos',
    internalNoLink: 'Sistema interno, sin enlace público',
    noPublicLink: 'Sin enlace público',
    backToTop: 'Volver arriba',
    stack: 'Stack',
    sectionsNav: 'Secciones',
    languageNav: 'Elige un idioma',
    project: {
      problem: 'El problema',
      built: 'Lo que construí',
      architecture: 'Arquitectura',
      result: 'Resultado',
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
      image: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'Un tablero de solicitudes estilizado, con equipos y tareas ficticios, en lugar del sistema interno.',
      },
      summary: {
        problem: 'Cada campaña se armaba a mano en cada plataforma de anuncios.',
        built:
          'Una plataforma interna que publica campañas en Meta en masa, edita creatividades con IA, genera copies, gestiona solicitudes entre equipos y muestra dashboards de campañas y finanzas. El equipo divide el trabajo por áreas; yo trabajo en todas, para que cada parte encaje en el conjunto.',
        result: 'Más de 500 campañas al día, publicadas por unas 100 personas.',
      },
      architecture: {
        ...wave.architecture,
        nodes: [
          { id: 'web', label: 'App web (Next.js, React)', kind: 'client' },
          { id: 'api', label: 'API (NestJS)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
          { id: 'meta', label: 'API de Meta', kind: 'external' },
        ],
      },
    },
    {
      ...bi,
      image: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'Un gráfico de rendimiento semanal con campañas ficticias y media buyers inventados, en lugar del sistema interno.',
      },
      summary: {
        problem: 'Finanzas esperaba de 45 minutos a 2 horas por CSV de RedTrack.',
        built:
          'Diseñé y construí todo: n8n publica los datos de RedTrack en una cola RabbitMQ y workers NestJS los escriben en paralelo en PostgreSQL, así un registro que falla se reintenta y nada se pierde. Una app Next.js muestra resultados mensuales, semanales y por media buyer.',
        result: 'Datos actualizados cada hora, y Campaign BI hoy funciona dentro de Sistema Wave.',
      },
      architecture: {
        ...bi.architecture,
        nodes: [
          { id: 'redtrack', label: 'RedTrack', kind: 'external' },
          { id: 'n8n', label: 'n8n', kind: 'service' },
          { id: 'queue', label: 'RabbitMQ', kind: 'service' },
          { id: 'web', label: 'App Next.js (inicio de sesión de Google)', kind: 'client' },
          { id: 'api', label: 'NestJS (workers y API)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
        ],
      },
    },
    {
      ...zibby,
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'Una tienda ficticia junto a su panel de administración.',
      },
      summary: {
        problem:
          'Gestionar varias tiendas online desde un solo lugar, cada una con sus propios productos, ventas e integraciones.',
        built:
          'Mi propia plataforma multitienda (tienda, panel de administración, pagos con Stripe), construida por fases con agentes de IA. Un monolito modular en NestJS, porque una persona la construye y opera: un deploy, una base de datos, cada área en su propio módulo, lista para separarse si necesita escalar.',
        result: 'Lanzada en octubre de 2026.',
      },
      architecture: {
        ...zibby.architecture,
        nodes: [
          { id: 'storefront', label: 'Tienda (Next.js)', kind: 'client' },
          { id: 'tracking', label: 'Microsoft Clarity, Píxel de Meta', kind: 'external' },
          { id: 'admin', label: 'Panel de administración (Next.js)', kind: 'client' },
          { id: 'api', label: 'API (NestJS, monolito modular)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL (Prisma)', kind: 'data' },
          { id: 'stripe', label: 'Stripe (provider de pagos)', kind: 'external' },
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
          'Una pantalla de programación del robot con una playlist de campañas ficticia, en lugar del sistema real.',
      },
      summary: {
        problem: 'La app de fábrica no permitía programar campañas ni generaba informes.',
        built:
          'Escribí la especificación y desarrollo todo el sistema con agentes de IA: app del robot, panel, API y worker de contenidos. La app accede a RobotOS por una capa propia, el RobotGateway, así funciona sin el robot real y puede pasar a AgentOS más adelante.',
        result: 'En uso, transmitiendo anuncios al robot y a pantallas LED.',
      },
      architecture: {
        ...hostly.architecture,
        nodes: [
          { id: 'panel', label: 'Panel (Next.js)', kind: 'client' },
          { id: 'app', label: 'App del robot (Kotlin)', kind: 'client' },
          { id: 'api', label: 'API (NestJS)', kind: 'service' },
          { id: 'robot', label: 'RobotOS en LuckiBot Plus', kind: 'device' },
          { id: 'worker', label: 'Worker de contenidos (FFmpeg)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
          { id: 'screen', label: 'Pantalla LED registrada', kind: 'device' },
          { id: 'storage', label: 'Almacenamiento S3', kind: 'data' },
        ],
        edges: [
          { from: 'panel', to: 'api' },
          { from: 'app', to: 'api', label: 'WebSocket' },
          { from: 'app', to: 'robot', label: 'RobotGateway' },
          { from: 'api', to: 'worker', label: 'cola' },
          { from: 'api', to: 'db' },
          { from: 'api', to: 'screen', label: 'anuncios' },
          { from: 'worker', to: 'storage' },
        ],
      },
    },
    {
      ...bookowl,
      image: {
        kind: 'image',
        id: 'bookowl',
        alt: 'La pantalla de inicio de BookOwl: el logo del búho sobre un mensaje de bienvenida.',
      },
      links: {
        kind: 'public',
        links: [{ label: 'Código en GitHub', href: 'https://github.com/GabrielDev969/BookOwl' }],
      },
      summary: {
        problem: 'La biblioteca de una iglesia no sabía qué libros tenía ni quién los tenía.',
        built:
          'La construí de principio a fin en Python y Django, open source, para la secretaria de la iglesia. Cada préstamo sigue sus estados (pendiente de retiro, activo, atrasado, devuelto, cancelado) y actualiza sus libros, así la biblioteca siempre sabe qué está en el estante.',
        result: 'En uso en la biblioteca de la iglesia, en la versión 1.4.2.',
      },
      architecture: {
        ...bookowl.architecture,
        nodes: [
          { id: 'browser', label: 'Pantallas de la biblioteca (navegador)', kind: 'client' },
          { id: 'app', label: 'App Django (Python)', kind: 'service' },
          { id: 'db', label: 'PostgreSQL', kind: 'data' },
          { id: 'telegram', label: 'Telegram (feedback)', kind: 'external' },
        ],
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
    loop: ['Yo elijo', 'La IA construye', 'Queda listo'],
  },
  skills: {
    stack: [
      { label: 'Frontend y móvil', items: en.skills.stack[0]!.items },
      {
        label: 'Backend',
        items: en.skills.stack[1]!.items.map((item) => (item === 'REST APIs' ? 'APIs REST' : item)),
      },
      {
        label: 'Datos',
        items: en.skills.stack[2]!.items.map((item) =>
          item === 'Meta API' ? 'API de Meta' : item,
        ),
      },
      { label: 'DevOps y automatización', items: en.skills.stack[3]!.items },
      {
        label: 'Arquitectura',
        items: [
          'Clean Architecture',
          'SOLID',
          'TDD',
          'Monolito modular',
          'Multi-tenant',
          'Microservicios',
        ],
      },
    ],
    languages: {
      label: 'Idiomas',
      items: ['Portugués (nativo)', 'Español (básico, en estudio)', 'Inglés (básico, en estudio)'],
    },
  },
  swarm: {
    agents: [
      'Planificación',
      'Arquitectura',
      'Layout',
      'Tipografía',
      'Texto',
      'Datos',
      'Diagrama',
      'Mockup',
      'i18n',
      'A11y',
      'Rendimiento',
      'Pruebas',
      'Seguridad',
      'Movimiento',
      'Deploy',
      'Gabriel',
    ],
    booting: 'Iniciando el enjambre…',
    building: 'Construyendo',
    ready: 'Listo · publicado',
    active: 'Activos',
    total: 'Total',
    skip: 'Saltar la construcción',
    approved: 'aprobado',
    units: {
      sections: 'secciones',
      words: 'palabras',
      items: 'elementos',
      boxes: 'cajas',
      arrows: 'flechas',
      drawings: 'dibujos',
      links: 'enlaces',
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
