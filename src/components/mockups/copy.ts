import type { Locale } from '@/lib/i18n'

// The words drawn inside the mockups, per locale. They are fictional screens, so they live
// here with the drawings, not in content/. Each list is read in the order the mockup draws it.
// tests/e2e/mockups.spec.ts checks that every label fits its box in every locale.

type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'today' | 'done'
type Team = 'creative' | 'data' | 'copy' | 'media'

export type MockupCopy = {
  wave: {
    nav: [string, string, string, string]
    title: string
    chips: [string, string]
    newRequest: string
    columns: [string, string, string, string]
    teams: Record<Team, string>
    days: Record<Day, string>
    /** The ten cards, column by column, top to bottom. */
    cards: string[]
  }
  chart: {
    title: string
    monthly: string
    weekly: string
    /** Prefix of the week labels: W1, W2… */
    week: string
    revenue: string
    spend: string
    byBuyer: string
    campaigns: string
  }
  zibby: {
    nav: [string, string, string]
    cart: string
    headline: string
    products: [string, string, string]
    orders: string
    admin: string
    status: { preparing: string; paid: string; shipped: string; delivered: string }
  }
  hostly: {
    today: string
    campaign: string
    music: string
    /** The five slots of the day, in time order. */
    slots: [string, string, string, string, string]
    nowPlaying: string
    length: string
    upNext: string
    tracks: [string, string, string, string, string]
  }
}

export type { Day, Team }

export const mockupCopy: Record<Locale, MockupCopy> = {
  en: {
    wave: {
      nav: ['Campaigns', 'Requests', 'Reports', 'Dashboard'],
      title: 'Requests',
      chips: ['All teams', 'This week'],
      newRequest: 'New request',
      columns: ['Requested', 'In progress', 'Review', 'Done'],
      teams: { creative: 'Creative', data: 'Data', copy: 'Copy', media: 'Media' },
      days: {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        today: 'Today',
        done: 'Done',
      },
      cards: [
        'Launch banners, 6 sizes',
        'UTM audit, spring offers',
        'Email sequence, 3 parts',
        'Video cut, 15 seconds',
        'Landing page headline',
        'Offer page, mobile',
        'Weekly results report',
        'Pixel check, new domain',
        'Carousel, 5 slides',
        'Ad variations, round 2',
      ],
    },
    chart: {
      title: 'Campaign performance',
      monthly: 'Monthly',
      weekly: 'Weekly',
      week: 'W',
      revenue: 'Revenue',
      spend: 'Spend',
      byBuyer: 'By media buyer',
      campaigns: 'campaigns',
    },
    zibby: {
      nav: ['New', 'Home', 'Kitchen'],
      cart: 'Cart (2)',
      headline: 'Made for every day',
      products: ['Ceramic mug', 'Desk lamp', 'Linen tote'],
      orders: 'Orders',
      admin: 'Admin',
      status: {
        preparing: 'Preparing',
        paid: 'Paid',
        shipped: 'Shipped',
        delivered: 'Delivered',
      },
    },
    hostly: {
      today: 'Today',
      campaign: 'Campaign',
      music: 'Music',
      slots: ['Welcome message', 'Lobby set A', 'Spring offer', 'Lunch menu', 'Lobby set B'],
      nowPlaying: 'Now playing',
      length: 'Campaign, 30 seconds',
      upNext: 'Up next',
      tracks: ['Morning light', 'Open doors', 'Quiet hour', 'Second floor', 'Late check-in'],
    },
  },
  pt: {
    wave: {
      nav: ['Campanhas', 'Solicitações', 'Relatórios', 'Dashboard'],
      title: 'Solicitações',
      chips: ['Todas as equipes', 'Esta semana'],
      newRequest: 'Nova solicitação',
      columns: ['Solicitadas', 'Em andamento', 'Em revisão', 'Concluídas'],
      teams: { creative: 'Criação', data: 'Dados', copy: 'Redação', media: 'Mídia' },
      days: {
        mon: 'Seg',
        tue: 'Ter',
        wed: 'Qua',
        thu: 'Qui',
        fri: 'Sex',
        today: 'Hoje',
        done: 'Feito',
      },
      cards: [
        'Banners, 6 tamanhos',
        'Auditoria de UTMs',
        'Sequência de 3 e-mails',
        'Corte de vídeo, 15 s',
        'Título da landing page',
        'Oferta, versão mobile',
        'Relatório semanal',
        'Pixel no novo domínio',
        'Carrossel, 5 cards',
        'Anúncios, 2ª rodada',
      ],
    },
    chart: {
      title: 'Desempenho das campanhas',
      monthly: 'Mensal',
      weekly: 'Semanal',
      week: 'S',
      revenue: 'Receita',
      spend: 'Investimento',
      byBuyer: 'Por media buyer',
      campaigns: 'campanhas',
    },
    zibby: {
      nav: ['Novidades', 'Casa', 'Cozinha'],
      cart: 'Carrinho (2)',
      headline: 'Para o dia a dia',
      products: ['Caneca de cerâmica', 'Luminária de mesa', 'Bolsa de linho'],
      orders: 'Pedidos',
      admin: 'Admin',
      status: {
        preparing: 'Em separação',
        paid: 'Pago',
        shipped: 'Despachado',
        delivered: 'Entregue',
      },
    },
    hostly: {
      today: 'Hoje',
      campaign: 'Campanha',
      music: 'Música',
      slots: [
        'Boas-vindas',
        'Lobby, trilha A',
        'Oferta semanal',
        'Menu do almoço',
        'Lobby, trilha B',
      ],
      nowPlaying: 'Tocando agora',
      length: 'Campanha, 30 segundos',
      upNext: 'A seguir',
      tracks: ['Luz da manhã', 'Portas abertas', 'Hora calma', 'Segundo andar', 'Check-in tardio'],
    },
  },
  es: {
    wave: {
      nav: ['Campañas', 'Solicitudes', 'Informes', 'Dashboard'],
      title: 'Solicitudes',
      chips: ['Todos los equipos', 'Esta semana'],
      newRequest: 'Nueva solicitud',
      columns: ['Solicitadas', 'En curso', 'En revisión', 'Listas'],
      teams: { creative: 'Creativo', data: 'Datos', copy: 'Redacción', media: 'Medios' },
      days: {
        mon: 'Lun',
        tue: 'Mar',
        wed: 'Mié',
        thu: 'Jue',
        fri: 'Vie',
        today: 'Hoy',
        done: 'Listo',
      },
      cards: [
        'Banners, 6 tamaños',
        'Auditoría de UTM',
        'Secuencia de 3 correos',
        'Corte de video, 15 s',
        'Título de la landing',
        'Oferta, versión móvil',
        'Informe semanal',
        'Píxel del nuevo dominio',
        'Carrusel, 5 imágenes',
        'Anuncios, 2.ª ronda',
      ],
    },
    chart: {
      title: 'Rendimiento de campañas',
      monthly: 'Mensual',
      weekly: 'Semanal',
      week: 'S',
      revenue: 'Ingresos',
      spend: 'Inversión',
      byBuyer: 'Por media buyer',
      campaigns: 'campañas',
    },
    zibby: {
      nav: ['Novedades', 'Hogar', 'Cocina'],
      cart: 'Carrito (2)',
      headline: 'Para cada día',
      products: ['Taza de cerámica', 'Lámpara de mesa', 'Bolso de lino'],
      orders: 'Pedidos',
      admin: 'Admin',
      status: {
        preparing: 'En preparación',
        paid: 'Pagado',
        shipped: 'Despachado',
        delivered: 'Entregado',
      },
    },
    hostly: {
      today: 'Hoy',
      campaign: 'Campaña',
      music: 'Música',
      slots: [
        'Bienvenida',
        'Lobby, lista A',
        'Oferta semanal',
        'Menú de almuerzo',
        'Lobby, lista B',
      ],
      nowPlaying: 'Reproduciendo',
      length: 'Campaña, 30 segundos',
      upNext: 'A continuación',
      tracks: [
        'Luz de mañana',
        'Puertas abiertas',
        'Hora tranquila',
        'Segundo piso',
        'Check-in tardío',
      ],
    },
  },
}
