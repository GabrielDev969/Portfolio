import type { MockupId } from '@/content/schema'
import { CampaignChart } from './CampaignChart'
import { HostlySchedule } from './HostlySchedule'
import { WaveBoard } from './WaveBoard'
import { ZibbyStore } from './ZibbyStore'

export const mockups: Record<MockupId, () => React.JSX.Element> = {
  'wave-board': WaveBoard,
  'campaign-chart': CampaignChart,
  'zibby-store': ZibbyStore,
  'hostly-schedule': HostlySchedule,
}
