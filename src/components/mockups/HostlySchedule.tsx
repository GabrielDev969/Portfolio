import { MockupFrame } from './MockupFrame'

// A fictional day of campaigns and music for one robot.
const schedule = [
  { time: '09:00', what: 'Welcome message', kind: 'Campaign' },
  { time: '10:00', what: 'Lobby set A', kind: 'Music' },
  { time: '11:30', what: 'Spring offer', kind: 'Campaign' },
  { time: '12:00', what: 'Lunch menu', kind: 'Campaign' },
  { time: '13:00', what: 'Lobby set B', kind: 'Music' },
]

const playlist = ['Morning light', 'Open doors', 'Quiet hour', 'Second floor', 'Late check-in']

/** Hostly: the schedule on the robot's screen, between the day's plan and the playlist. */
export function HostlySchedule() {
  return (
    <MockupFrame>
      <rect width="1200" height="502" className="fill-screen-2" />

      {/* The day's plan, as the admin panel sets it */}
      <text x="40" y="66" fontSize="30" className="fill-ink font-display font-bold">
        Today
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
              className={s.kind === 'Music' ? 'fill-ink/12' : 'fill-screen'}
            />
            <text x="112" y={y + 23} fontSize="15" className="fill-ink">
              {s.what}
            </text>
            <text x="112" y={y + 44} fontSize="12" className="fill-ink-2 italic">
              {s.kind}
            </text>
          </g>
        )
      })}

      {/* The robot's screen */}
      <rect x="300" y="24" width="600" height="454" rx="28" className="fill-ink" />
      <rect x="324" y="48" width="552" height="406" rx="10" className="fill-screen" />
      <text x="356" y="96" fontSize="15" className="fill-ink-2 italic">
        Now playing
      </text>
      <text x="356" y="148" fontSize="48" className="fill-ink font-display font-bold">
        Spring offer
      </text>
      <text x="356" y="182" fontSize="18" className="fill-ink">
        Campaign, 30 seconds
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
        Up next
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
        Lobby set B
      </text>
      {playlist.map((track, i) => (
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
