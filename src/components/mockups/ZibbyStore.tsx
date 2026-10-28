import type { Locale } from '@/lib/i18n'
import { mockupCopy } from './copy'
import { MockupFrame } from './MockupFrame'

// A fictional catalogue and fictional orders.
// The words are in copy.ts.
const prices = ['$24', '$58', '$32']

const orders = [
  { id: '#1048', total: '$56.00', status: 'preparing' },
  { id: '#1047', total: '$24.00', status: 'paid' },
  { id: '#1046', total: '$90.00', status: 'shipped' },
  { id: '#1045', total: '$32.00', status: 'shipped' },
  { id: '#1044', total: '$58.00', status: 'delivered' },
] as const

/** Line drawings standing in for product photos. */
function Product({ index, cx, cy }: { index: number; cx: number; cy: number }) {
  const stroke = { strokeWidth: 3, className: 'fill-none stroke-ink' }
  if (index === 0)
    return (
      <g>
        <path d={`M${cx - 34} ${cy - 40} h68 v70 q0 14 -14 14 h-40 q-14 0 -14 -14z`} {...stroke} />
        <path d={`M${cx + 34} ${cy - 22} q28 0 28 22 t-28 22`} {...stroke} />
      </g>
    )
  if (index === 1)
    return (
      <g>
        <path
          d={`M${cx - 30} ${cy + 46} h60 M${cx} ${cy + 46} L${cx - 16} ${cy - 4} L${cx + 14} ${cy - 30}`}
          {...stroke}
        />
        <path d={`M${cx + 2} ${cy - 46} l40 22 l-14 22 l-40 -22z`} {...stroke} />
      </g>
    )
  return (
    <g>
      <path d={`M${cx - 40} ${cy - 18} h80 l-8 66 h-64z`} {...stroke} />
      <path d={`M${cx - 20} ${cy - 18} q0 -36 20 -36 q20 0 20 36`} {...stroke} />
    </g>
  )
}

/** Zibby: the storefront, with its admin panel open on top of it. */
export function ZibbyStore({ locale }: { locale: Locale }) {
  const copy = mockupCopy[locale].zibby
  // Menu items sit one word-width apart (Newsreader averages about half an em a letter).
  const navX = copy.nav.map((_, i) =>
    copy.nav.slice(0, i).reduce((x, item) => x + item.length * 17 * 0.5 + 28, 200),
  )
  return (
    <MockupFrame>
      <rect width="1200" height="502" className="fill-screen-2" />

      {/* Storefront */}
      <rect x="32" y="28" width="760" height="474" className="fill-screen" />
      <text x="60" y="76" fontSize="34" className="fill-ink font-display font-extrabold">
        ZIBBY
      </text>
      {copy.nav.map((item, i) => (
        <text key={item} x={navX[i]} y="72" fontSize="17" className="fill-ink">
          {item}
        </text>
      ))}
      <text x="764" y="72" fontSize="17" textAnchor="end" className="fill-ink">
        {copy.cart}
      </text>
      <line x1="32" x2="792" y1="98" y2="98" className="stroke-ink/15" />
      {/* Centred, so the 4:3 phone crop (x 265–935) keeps it whole. */}
      <text
        x="430"
        y="150"
        fontSize="40"
        textAnchor="middle"
        className="fill-ink font-display font-bold"
      >
        {copy.headline}
      </text>
      {copy.products.map((name, i) => {
        const px = 60 + i * 238
        return (
          <g key={name}>
            <rect x={px} y="182" width="218" height="214" className="fill-screen-2" />
            <Product index={i} cx={px + 109} cy={288} />
            <text x={px} y="424" fontSize="17" className="fill-ink">
              {name}
            </text>
            {/* The admin panel covers the last price, so it is not drawn. */}
            {px + 218 < 648 ? (
              <text
                x={px + 218}
                y="424"
                fontSize="17"
                textAnchor="end"
                className="fill-ink font-semibold"
              >
                {prices[i]}
              </text>
            ) : null}
          </g>
        )
      })}

      {/* Admin */}
      <rect x="648" y="120" width="520" height="382" className="fill-ink" />
      <text x="676" y="166" fontSize="30" className="fill-screen font-display font-bold">
        {copy.orders}
      </text>
      <text x="1140" y="164" fontSize="14" textAnchor="end" className="fill-screen/70 italic">
        {copy.admin}
      </text>
      {orders.map((o, i) => {
        const rowY = 216 + i * 52
        return (
          <g key={o.id}>
            <line x1="676" x2="1140" y1={rowY - 28} y2={rowY - 28} className="stroke-screen/20" />
            <text x="676" y={rowY} fontSize="17" className="fill-screen font-semibold">
              {o.id}
            </text>
            <text x="770" y={rowY} fontSize="17" className="fill-screen">
              {copy.status[o.status]}
            </text>
            <text x="1140" y={rowY} fontSize="17" textAnchor="end" className="fill-screen">
              {o.total}
            </text>
          </g>
        )
      })}
    </MockupFrame>
  )
}
