import type { Locale } from '@/lib/i18n'
import { mockupCopy } from './copy'
import { MockupFrame } from './MockupFrame'

// A fictional day of campaigns and music for one robot.
// The words are in copy.ts: slot i is copy.slots[i].
const times = [
  { time: '09:00', music: false },
  { time: '10:00', music: true },
  { time: '11:30', music: false },
  { time: '12:00', music: false },
  { time: '13:00', music: true },
]

/** Hostly: the schedule on the robot's screen, between the day's plan and the playlist. */
export function HostlySchedule({ locale }: { locale: Locale }) {
  const copy = mockupCopy[locale].hostly
  const schedule = times.map((slot, i) => ({ ...slot, what: copy.slots[i]! }))
  return (
    <MockupFrame>
      <rect width="1200" height="502" className="fill-screen-2" />

      {/* The day's plan, as the admin panel sets it */}
      <text x="40" y="66" fontSize="30" className="fill-ink font-display font-bold">
        {copy.today}
      </text>
      {schedule.map((s, i) => {
        const y = 104 + i * 72
        return (
          <g key={s.time}>
            <text x="40" y={y + 20} fontSize="15" className="fill-ink-2">
              {s.time}
            </text>
            <rect
              x="100"
              y={y}
              width="150"
              height="56"
              rx="2"
              className={s.music ? 'fill-ink/12' : 'fill-screen'}
            />
            <text x="112" y={y + 23} fontSize="15" className="fill-ink">
              {s.what}
            </text>
            <text x="112" y={y + 44} fontSize="12" className="fill-ink-2 italic">
              {s.music ? copy.music : copy.campaign}
            </text>
          </g>
        )
      })}

      {/* The robot's screen */}
      <rect x="300" y="24" width="600" height="454" rx="28" className="fill-ink" />
      <rect x="324" y="48" width="552" height="406" rx="10" className="fill-screen" />
      <text x="356" y="96" fontSize="15" className="fill-ink-2 italic">
        {copy.nowPlaying}
      </text>
      <text x="356" y="148" fontSize="48" className="fill-ink font-display font-bold">
        {copy.slots[2]}
      </text>
      <text x="356" y="182" fontSize="18" className="fill-ink">
        {copy.length}
      </text>
      <rect x="356" y="214" width="488" height="6" className="fill-ink/15" />
      <rect x="356" y="214" width="296" height="6" className="fill-ink" />
      <text x="356" y="246" fontSize="14" className="fill-ink-2">
        0:18
      </text>
      <text x="844" y="246" fontSize="14" textAnchor="end" className="fill-ink-2">
        0:30
      </text>
      <line x1="356" x2="844" y1="282" y2="282" className="stroke-ink/15" />
      <text x="356" y="318" fontSize="15" className="fill-ink-2 italic">
        {copy.upNext}
      </text>
      {schedule.slice(3).map((s, i) => (
        <g key={s.time}>
          <text x="356" y={356 + i * 40} fontSize="19" className="fill-ink font-display font-bold">
            {s.time}
          </text>
          <text x="430" y={356 + i * 40} fontSize="19" className="fill-ink">
            {s.what}
          </text>
        </g>
      ))}
      <circle cx="600" cy="36" r="4" className="fill-screen/40" />

      {/* Playlist */}
      <text x="948" y="66" fontSize="30" className="fill-ink font-display font-bold">
        {copy.slots[4]}
      </text>
      {copy.tracks.map((track, i) => (
        <g key={track}>
          <text x="948" y={116 + i * 44} fontSize="15" className="fill-ink-2">
            {String(i + 1).padStart(2, '0')}
          </text>
          <text x="980" y={116 + i * 44} fontSize="17" className="fill-ink">
            {track}
          </text>
        </g>
      ))}
    </MockupFrame>
  )
}
