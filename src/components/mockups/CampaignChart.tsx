import { languageTags, type Locale } from '@/lib/i18n'
import { mockupCopy } from './copy'
import { MockupFrame } from './MockupFrame'

// Fictional numbers and invented media buyers: the real dashboards hold client data.
const weeks = [
  { revenue: 42, spend: 30 },
  { revenue: 48, spend: 32 },
  { revenue: 45, spend: 31 },
  { revenue: 53, spend: 35 },
  { revenue: 61, spend: 38 },
  { revenue: 58, spend: 37 },
  { revenue: 66, spend: 40 },
  { revenue: 72, spend: 43 },
  { revenue: 69, spend: 42 },
  { revenue: 78, spend: 45 },
  { revenue: 84, spend: 47 },
  { revenue: 81, spend: 46 },
]

const buyers = [
  { name: 'Ana R.', campaigns: 14, roas: 2.4 },
  { name: 'Bruno M.', campaigns: 11, roas: 2.1 },
  { name: 'Carla T.', campaigns: 9, roas: 1.8 },
  { name: 'Diego S.', campaigns: 12, roas: 1.6 },
  { name: 'Elisa F.', campaigns: 7, roas: 1.3 },
]

// Plot area
const left = 96
const right = 760
const top = 128
const bottom = 432
const max = 100
const x = (i: number) => left + 18 + (i * (right - left - 36)) / (weeks.length - 1)
const y = (v: number) => bottom - (v / max) * (bottom - top)

/** Campaign BI: weekly revenue against spend, and each media buyer's return. */
export function CampaignChart({ locale }: { locale: Locale }) {
  const copy = mockupCopy[locale].chart
  const roas = new Intl.NumberFormat(languageTags[locale], { minimumFractionDigits: 1 })
  const line = weeks.map((w, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(w.revenue)}`).join(' ')
  return (
    <MockupFrame crop="left">
      <rect width="1200" height="502" className="fill-screen" />

      <text x="40" y="62" fontSize="36" className="fill-ink font-display font-bold">
        {copy.title}
      </text>
      <rect x="452" y="34" width="196" height="36" rx="2" className="fill-screen-2" />
      <rect x="550" y="38" width="94" height="28" rx="2" className="fill-ink" />
      <text x="501" y="58" fontSize="15" textAnchor="middle" className="fill-ink">
        {copy.monthly}
      </text>
      <text x="597" y="58" fontSize="15" textAnchor="middle" className="fill-screen font-semibold">
        {copy.weekly}
      </text>

      {/* Grid and axis */}
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={left} x2={right} y1={y(v)} y2={y(v)} className="stroke-ink/12" />
          <text x={left - 12} y={y(v) + 5} fontSize="13" textAnchor="end" className="fill-ink-2">
            {v}k
          </text>
        </g>
      ))}
      {weeks.map((w, i) => (
        <g key={i}>
          <rect
            x={x(i) - 13}
            y={y(w.spend)}
            width="26"
            height={bottom - y(w.spend)}
            className="fill-ink/18"
          />
          <text x={x(i)} y={bottom + 24} fontSize="13" textAnchor="middle" className="fill-ink-2">
            {copy.week}
            {i + 1}
          </text>
        </g>
      ))}
      <path d={line} strokeWidth="3" className="fill-none stroke-ink" />
      {weeks.map((w, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(w.revenue)}
          r="4.5"
          className="fill-screen stroke-ink"
          strokeWidth="2"
        />
      ))}
      <g fontSize="14" className="fill-ink">
        <line x1={left} x2={left + 28} y1="100" y2="100" strokeWidth="3" className="stroke-ink" />
        <text x={left + 36} y="105">
          {copy.revenue}
        </text>
        <rect x={left + 120} y="92" width="16" height="16" className="fill-ink/18" />
        <text x={left + 144} y="105">
          {copy.spend}
        </text>
      </g>

      {/* By media buyer */}
      <rect x="800" y="96" width="368" height="372" rx="2" className="fill-screen-2" />
      <text x="824" y="134" fontSize="18" className="fill-ink font-semibold">
        {copy.byBuyer}
      </text>
      <text x="1144" y="134" fontSize="13" textAnchor="end" className="fill-ink-2 italic">
        ROAS
      </text>
      {buyers.map((b, i) => {
        const rowY = 178 + i * 60
        return (
          <g key={b.name}>
            <text x="824" y={rowY} fontSize="17" className="fill-ink">
              {b.name}
            </text>
            <text x="824" y={rowY + 22} fontSize="13" className="fill-ink-2">
              {b.campaigns} {copy.campaigns}
            </text>
            <rect x="960" y={rowY - 12} width="130" height="10" className="fill-ink/12" />
            <rect
              x="960"
              y={rowY - 12}
              width={(b.roas / 2.5) * 130}
              height="10"
              className="fill-ink"
            />
            <text
              x="1144"
              y={rowY}
              fontSize="17"
              textAnchor="end"
              className="fill-ink font-display font-bold"
            >
              {roas.format(b.roas)}×
            </text>
          </g>
        )
      })}
    </MockupFrame>
  )
}
