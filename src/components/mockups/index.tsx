import type { MockupId } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { CampaignChart } from './CampaignChart'
import { HostlySchedule } from './HostlySchedule'
import { WaveBoard } from './WaveBoard'
import { ZibbyStore } from './ZibbyStore'

/** Each mockup draws its words in the page's language (copy.ts). */
export const mockups: Record<MockupId, (props: { locale: Locale }) => React.JSX.Element> = {
  'wave-board': WaveBoard,
  'campaign-chart': CampaignChart,
  'zibby-store': ZibbyStore,
  'hostly-schedule': HostlySchedule,
}
