import type { Locale } from '@/lib/i18n'
import { mockupCopy, type Day, type Team } from './copy'
import { MockupFrame } from './MockupFrame'

// Fictional teams and requests: the real board is an internal system. The words are in copy.ts.
const columns: { team: Team; who: string; due: Day }[][] = [
  [
    { team: 'creative', who: 'LM', due: 'mon' },
    { team: 'data', who: 'RP', due: 'tue' },
    { team: 'copy', who: 'AC', due: 'thu' },
  ],
  [
    { team: 'media', who: 'JV', due: 'today' },
    { team: 'copy', who: 'AC', due: 'today' },
  ],
  [
    { team: 'creative', who: 'LM', due: 'wed' },
    { team: 'data', who: 'RP', due: 'fri' },
  ],
  [
    { team: 'media', who: 'JV', due: 'done' },
    { team: 'creative', who: 'LM', due: 'done' },
    { team: 'copy', who: 'AC', due: 'done' },
  ],
]

// Text widths at SSR, from the fonts' average letter widths: Big Shoulders caps at most 0.44 em,
// Newsreader about 0.5 em. They place the chips after the title, whatever its language.
const displayWidth = (text: string, size: number) => text.length * size * 0.44
const textWidth = (text: string, size: number) => text.length * size * 0.5

/** Sistema Wave: the request board between teams, in the style of a task tracker. */
export function WaveBoard({ locale }: { locale: Locale }) {
  const copy = mockupCopy[locale].wave
  const colX = (i: number) => 236 + i * 238
  const chipWidths = copy.chips.map((chip) => textWidth(chip, 15) + 28)
  const chipX = [236 + displayWidth(copy.title, 38) + 28]
  chipX.push(chipX[0]! + chipWidths[0]! + 12)
  // Cards are numbered across columns, in the order of copy.cards.
  const first = (c: number) => columns.slice(0, c).reduce((n, column) => n + column.length, 0)
  return (
    <MockupFrame crop="left">
      <rect width="1200" height="502" className="fill-screen-2" />

      {/* Sidebar */}
      <text x="32" y="58" fontSize="34" className="fill-ink font-display font-extrabold">
        WAVE
      </text>
      {copy.nav.map((item, i) => (
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
        {copy.title}
      </text>
      {copy.chips.map((chip, i) => (
        <g key={chip}>
          <rect
            x={chipX[i]}
            y="34"
            width={chipWidths[i]}
            height="32"
            rx="16"
            className="fill-none stroke-ink/40"
          />
          <text
            x={chipX[i]! + chipWidths[i]! / 2}
            y="56"
            fontSize="15"
            textAnchor="middle"
            className="fill-ink"
          >
            {chip}
          </text>
        </g>
      ))}
      <g>
        <rect x="1004" y="32" width="174" height="38" rx="2" className="fill-ink" />
        <text
          x="1091"
          y="57"
          fontSize="16"
          textAnchor="middle"
          className="fill-screen font-semibold"
        >
          {copy.newRequest}
        </text>
      </g>

      {columns.map((cards, c) => (
        <g key={copy.columns[c]}>
          <text x={colX(c)} y="112" fontSize="17" className="fill-ink font-semibold">
            {copy.columns[c]}
          </text>
          <text x={colX(c) + 222} y="112" fontSize="15" textAnchor="end" className="fill-ink-2">
            {cards.length}
          </text>
          <line x1={colX(c)} x2={colX(c) + 222} y1="124" y2="124" className="stroke-ink/20" />
          {cards.map((item, i) => {
            const y = 138 + i * 112
            const title = copy.cards[first(c) + i]!
            return (
              <g key={title}>
                <rect x={colX(c)} y={y} width="222" height="100" rx="2" className="fill-screen-2" />
                <text x={colX(c) + 14} y={y + 26} fontSize="13" className="fill-ink-2 italic">
                  {copy.teams[item.team]}
                </text>
                <text x={colX(c) + 14} y={y + 52} fontSize="17" className="fill-ink">
                  {title}
                </text>
                <circle cx={colX(c) + 28} cy={y + 78} r="12" className="fill-ink/15" />
                <text
                  x={colX(c) + 28}
                  y={y + 83}
                  fontSize="11"
                  textAnchor="middle"
                  className="fill-ink font-semibold"
                >
                  {item.who}
                </text>
                <text
                  x={colX(c) + 208}
                  y={y + 83}
                  fontSize="13"
                  textAnchor="end"
                  className="fill-ink-2"
                >
                  {copy.days[item.due]}
                </text>
              </g>
            )
          })}
        </g>
      ))}
    </MockupFrame>
  )
}
