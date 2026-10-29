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
    availability: 'Disponible para nuevos proyectos',
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
    noPublicLink: 'Sin enlace público',
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
        'Una plataforma interna que usan unas 100 personas para publicar campañas en Meta de forma masiva, editar y mejorar creatividades con IA, generar copies, gestionar solicitudes entre equipos (al estilo de ClickUp) y seguir datos de campañas, finanzas y salud de la empresa en dashboards.',
      image: {
        kind: 'mockup',
        mockup: 'wave-board',
        description:
          'Un tablero de solicitudes estilizado, con equipos y tareas ficticios, en lugar del sistema interno.',
      },
      technicalDetails: {
        problem:
          'Antes de la plataforma, cada campaña se armaba a mano en NewsBreak, Meta Ads y Taboola.',
        role: 'El equipo divide el trabajo por áreas, y yo trabajo en todas ellas, para que cada parte encaje en el sistema completo.',
        architecture: {
          ...wave.technicalDetails.architecture,
          nodes: [
            { id: 'web', label: 'App web (Next.js, React)', kind: 'client' },
            { id: 'api', label: 'API (NestJS)', kind: 'service' },
            { id: 'db', label: 'PostgreSQL', kind: 'data' },
            { id: 'meta', label: 'API de Meta', kind: 'external' },
          ],
        },
        decisions: [
          {
            what: 'Las campañas se publican a través de la API de Meta, varias a la vez.',
            why: 'Antes, cada campaña se armaba a mano en cada plataforma de anuncios.',
          },
          {
            what: 'Prometheus, Grafana y logs vigilan el sistema, y las alertas llegan a Telegram ante errores o cuando una ruta está sobrecargada.',
            why: 'Para saber cómo está el sistema en todo momento, y enterarse de errores y rutas sobrecargadas en cuanto ocurren.',
          },
        ],
        testing:
          'Pruebas de seguridad que simulan ataques reales, y pruebas de estrés que buscan errores y fallas que podrían abrir una brecha de seguridad.',
        deploy:
          'Jenkins ejecuta las pruebas y validaciones, y un cambio solo se aprueba si las pasa. Primero va al entorno de develop, donde lo probamos, y cuando todo está aprobado el tech lead hace el deploy.',
        outcome:
          'Más de 500 campañas publicadas al día a través de la API de Meta, por unas 100 personas dentro de la empresa.',
      },
    },
    {
      ...bi,
      logline:
        'Un sistema interno de datos de campañas, que usan todos los días los dueños, finanzas y los líderes de squad: resultados mensuales y semanales y el rendimiento de cada media buyer, actualizados cada hora. Workers en NestJS procesan los datos de RedTrack desde una cola en RabbitMQ y los guardan en PostgreSQL, y una app en Next.js con inicio de sesión de Google los consulta a través de la API en NestJS.',
      image: {
        kind: 'mockup',
        mockup: 'campaign-chart',
        description:
          'Un gráfico de rendimiento semanal con campañas ficticias y media buyers inventados, en lugar del sistema interno.',
      },
      technicalDetails: {
        problem:
          'Finanzas extraía los datos de RedTrack con un pequeño script en Python que generaba archivos CSV. Cada extracción tardaba de 45 minutos a 2 horas, según el período.',
        role: 'Diseñé la arquitectura y construí todo el sistema, de punta a punta.',
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
            why: 'Los dueños, finanzas y los líderes de squad analizan los datos todos los días: qué está funcionando, qué está gastando y cómo va cada media buyer.',
          },
          {
            what: 'n8n publica los datos de RedTrack en una cola de RabbitMQ, y varios workers en NestJS los procesan en paralelo hasta PostgreSQL.',
            why: 'Son muchos datos a la vez. La cola separa la llegada de los datos de su procesamiento: n8n publica todo en RabbitMQ, y los workers lo consumen al ritmo que la base de datos soporta. Un registro que falla se reintenta sin afectar a los demás, y si un worker se cae no se pierde nada, porque el mensaje sigue en la cola. RedTrack identifica cada registro, así que un mensaje procesado más de una vez no duplica datos.',
          },
          {
            what: 'Un script de asignación por el método de los restos mayores para conversiones e ingresos.',
            why: 'Las métricas estaban infladas. El script corrigió los números, y los resultados se conciliaron con las planillas de referencia.',
          },
        ],
        testing: 'Las verificaciones se ejecutan en CI con cada cambio.',
        deploy:
          'Nada se publica sin pasar el CI, así que un error aparece en el pipeline, y no después de tumbar el sistema, aunque sea por poco tiempo.',
        outcome:
          'Los datos de RedTrack ahora se actualizan cada hora durante el día, y las cargas más grandes corren de madrugada. Los dashboards los leen de PostgreSQL con consultas optimizadas, en lugar de esperar de 45 minutos a 2 horas por un CSV. Campaign BI hoy funciona dentro de Sistema Wave.',
      },
    },
    {
      ...zibby,
      logline:
        'Mi propia plataforma de e-commerce multitienda, lanzada en octubre de 2026: tienda online, panel de administración con registro de productos y dashboards de ventas que muestran cómo se vende cada producto, y pagos con Stripe. Cada integración es un provider, así que cada tienda puede crearse y personalizarse con las APIs que necesite.',
      image: {
        kind: 'mockup',
        mockup: 'zibby-store',
        description: 'Una tienda ficticia junto a su panel de administración.',
      },
      technicalDetails: {
        problem:
          'Gestionar varias tiendas online desde un solo lugar, cada una con sus propios productos, ventas e integraciones.',
        role: [
          'Producto propio.',
          'Lo construí por fases con agentes de IA para programar, y cada fase siguió plan → revisión → implementación → pruebas → revisión del diff → merge.',
        ],
        architecture: {
          ...zibby.technicalDetails.architecture,
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
        decisions: [
          {
            what: 'Un monorepo pnpm con la API en NestJS y la tienda y el panel en Next.js, organizado como monolito modular.',
            why: 'Una sola persona lo construye y lo opera, así que todo sale en un deploy, con una base de datos y un solo lugar para rastrear un error. Los microservicios sumarían llamadas de red, deploys separados y fallas repartidas entre servicios, sin ganancia a este tamaño. Cada área (tiendas, productos, pedidos, pagos) queda en su propio módulo, con una frontera clara, así que una de ellas puede convertirse en un servicio aparte si algún día necesita escalar. Y en el monorepo, un cambio que cruza la API, la tienda y el panel sale en un solo commit.',
          },
          {
            what: 'Microsoft Clarity en la tienda, y el Píxel de Meta configurado por tienda.',
            why: 'Clarity graba las sesiones y genera mapas de calor, así que se puede ver dónde hacen clic los clientes, hasta dónde bajan en la página y dónde abandonan. Cada tienda agrega su propio Píxel de Meta, que envía visitas, productos agregados al carrito y compras de vuelta a Meta, para medir y optimizar sus anuncios.',
          },
          {
            what: 'Cada integración es un provider: Stripe para pagos y Resend para e-mail son los primeros, y otras APIs se conectan de la misma forma.',
            why: 'Para que cada tienda pueda crearse y personalizarse como necesite, con los servicios que elija.',
          },
        ],
        testing:
          'Pruebas automatizadas en todo el monorepo; cada fase las pasó antes de la revisión del diff.',
        deploy:
          'Desplegado en un VPS, con copias de seguridad de emergencia. Los datos de los clientes y las claves de API están cifrados: incluso ante una intrusión, solo pueden leerse con la clave de descifrado.',
        outcome: 'Lanzada en octubre de 2026.',
      },
    },
    {
      ...hostly,
      logline:
        'Una plataforma multiempresa para robots de servicio OrionStar: una app Android propia reemplaza la de fábrica y reproduce las campañas, la música y los mensajes de voz programados en un panel web. Los anuncios también van a pantallas LED registradas, también en eventos.',
      image: {
        kind: 'mockup',
        mockup: 'hostly-schedule',
        description:
          'Una pantalla de programación del robot con una playlist de campañas ficticia, en lugar del sistema real.',
      },
      technicalDetails: {
        problem:
          'La app de fábrica del robot hacía difícil cambiar los contenidos, no permitía programar campañas, fallaba en la pantalla grande y no generaba informes.',
        role: 'Escribí la especificación y desarrollo todo el sistema, con agentes de IA trabajando en paralelo, uno por issue: la API, el panel, el worker de contenidos y la app Android del robot.',
        architecture: {
          ...hostly.technicalDetails.architecture,
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
        decisions: [
          {
            what: 'La app del robot accede a RobotOS a través de una capa propia, el RobotGateway, que también tiene una versión falsa para el emulador.',
            why: 'La app funciona y se prueba sin el robot real, y si OrionStar libera AgentOS para el LuckiBot Plus, solo cambia esa capa.',
          },
          {
            what: 'La nube decide y el robot ejecuta: cada cambio en el panel recompila un manifiesto versionado, y el robot sigue el último que recibió.',
            why: 'Sin internet, el robot sigue su agenda, reproduce los contenidos de la caché y guarda los eventos para enviarlos cuando vuelva la red.',
          },
          {
            what: 'Multiempresa desde el inicio: operadora, clientes, sitios y robots, con roles y una marca por cliente que el robot hereda del cliente o de la operadora.',
            why: 'Cada cliente, como un centro comercial, usa el panel con su propia marca y ve solo sus propios robots y campañas. El alcance por organización se aplica en el centro de la API y en la base de datos, y no ruta por ruta, así que la misma base puede convertirse en un SaaS.',
          },
        ],
        testing:
          'Pruebas unitarias y de punta a punta en la API, el panel y el worker, pruebas de contrato del RobotGateway y las verificaciones de la app Android, todo en CI con cada cambio. La API niega por defecto, con un barrido que falla si alguna ruta queda sin guarda; el inicio de sesión tiene autenticación de doble factor, y la auditoría es una cadena firmada con HMAC.',
        deploy:
          'La API, el panel, el worker, PostgreSQL y Redis corren con Docker Compose en un VPS, detrás de HTTPS automático. Los contenidos están en un almacenamiento S3 privado, servidos solo con URL firmadas; el deploy solo pasa por VPN, y una copia de seguridad diaria cifrada sale del servidor.',
        outcome:
          'En uso: se conecta al robot y a las pantallas LED registradas y transmite anuncios en ambos, también en eventos.',
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
        items: ['Node.js', 'NestJS', 'Express', 'RabbitMQ', 'APIs REST', 'Spring Boot', 'Django'],
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
