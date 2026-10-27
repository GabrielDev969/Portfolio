import { MockupFrame } from './MockupFrame'

// Fictional teams and requests: the real board is an internal system.
const columns = [
  {
    name: 'Requested',
    cards: [
      { team: 'Creative', title: 'Launch banners, 6 sizes', who: 'LM', due: 'Mon' },
      { team: 'Data', title: 'UTM audit, spring offers', who: 'RP', due: 'Tue' },
      { team: 'Copy', title: 'Email sequence, 3 parts', who: 'AC', due: 'Thu' },
    ],
  },
  {
    name: 'In progress',
    cards: [
      { team: 'Media', title: 'Video cut, 15 seconds', who: 'JV', due: 'Today' },
      { team: 'Copy', title: 'Landing page headline', who: 'AC', due: 'Today' },
    ],
  },
  {
    name: 'Review',
    cards: [
      { team: 'Creative', title: 'Offer page, mobile', who: 'LM', due: 'Wed' },
      { team: 'Data', title: 'Weekly results report', who: 'RP', due: 'Fri' },
    ],
  },
  {
    name: 'Done',
    cards: [
      { team: 'Media', title: 'Pixel check, new domain', who: 'JV', due: 'Done' },
      { team: 'Creative', title: 'Carousel, 5 slides', who: 'LM', due: 'Done' },
      { team: 'Copy', title: 'Ad variations, round 2', who: 'AC', due: 'Done' },
    ],
  },
]

const nav = ['Campaigns', 'Requests', 'Reports', 'Dashboard']

/** Sistema Wave: the request board between teams, in the style of a task tracker. */
export function WaveBoard() {
  const colX = (i: number) => 236 + i * 238
  return (
    <MockupFrame crop="left">
      <rect width="1200" height="502" className="fill-screen-2" />

      {/* Sidebar */}
      <text x="32" y="58" fontSize="34" className="fill-ink font-display font-extrabold">
        WAVE
      </text>
      {nav.map((item, i) => (
        <g key={item}>
          {i === 1 ? (
            <rect x="20" y={92 + i * 46} width="176" height="38" rx="2" className="fill-ink" />
          ) : null}
          <text
            x="34"
            y={117 + i * 46}
            fontSize="18"
            className={i === 1 ? 'fill-screen' : 'fill-ink'}
          >
            {item}
          </text>
        </g>
      ))}

      {/* Board */}
      <rect x="216" y="0" width="984" height="502" className="fill-screen" />
      <text x="236" y="60" fontSize="38" className="fill-ink font-display font-bold">
        Requests
      </text>
      {['All teams', 'This week'].map((chip, i) => (
        <g key={chip}>
          <rect
            x={420 + i * 118}
            y="34"
            width="106"
            height="32"
            rx="16"
            className="fill-none stroke-ink/40"
          />
          <text x={473 + i * 118} y="56" fontSize="15" textAnchor="middle" className="fill-ink">
            {chip}
          </text>
        </g>
      ))}
      <rect x="1018" y="32" width="160" height="38" rx="2" className="fill-ink" />
      <text x="1098" y="57" fontSize="16" textAnchor="middle" className="fill-screen font-semibold">
        New request
      </text>

      {columns.map((column, c) => (
        <g key={column.name}>
          <text x={colX(c)} y="112" fontSize="17" className="fill-ink font-semibold">
            {column.name}
          </text>
          <text x={colX(c) + 222} y="112" fontSize="15" textAnchor="end" className="fill-ink-2">
            {column.cards.length}
          </text>
          <line x1={colX(c)} x2={colX(c) + 222} y1="124" y2="124" className="stroke-ink/20" />
          {column.cards.map((card, i) => {
            const y = 138 + i * 112
            return (
              <g key={card.title}>
                <rect x={colX(c)} y={y} width="222" height="100" rx="2" className="fill-screen-2" />
                <text x={colX(c) + 14} y={y + 26} fontSize="13" className="fill-ink-2 italic">
                  {card.team}
                </text>
                <text x={colX(c) + 14} y={y + 52} fontSize="17" className="fill-ink">
                  {card.title}
                </text>
                <circle cx={colX(c) + 28} cy={y + 78} r="12" className="fill-ink/15" />
                <text
                  x={colX(c) + 28}
                  y={y + 83}
                  fontSize="11"
                  textAnchor="middle"
                  className="fill-ink font-semibold"
                >
                  {card.who}
                </text>
                <text
                  x={colX(c) + 208}
                  y={y + 83}
                  fontSize="13"
                  textAnchor="end"
                  className="fill-ink-2"
                >
                  {card.due}
                </text>
              </g>
            )
          })}
        </g>
      ))}
    </MockupFrame>
  )
}
