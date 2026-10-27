import { MockupFrame } from './MockupFrame'

// A fictional catalogue and fictional orders.
const products = [
  { name: 'Ceramic mug', price: '$24' },
  { name: 'Desk lamp', price: '$58' },
  { name: 'Linen tote', price: '$32' },
]

const orders = [
  { id: '#1048', total: '$56.00', status: 'Sent to Zendrop' },
  { id: '#1047', total: '$24.00', status: 'Paid' },
  { id: '#1046', total: '$90.00', status: 'Shipped' },
  { id: '#1045', total: '$32.00', status: 'Shipped' },
  { id: '#1044', total: '$58.00', status: 'Delivered' },
]

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
export function ZibbyStore() {
  return (
    <MockupFrame>
      <rect width="1200" height="502" className="fill-screen-2" />

      {/* Storefront */}
      <rect x="32" y="28" width="760" height="474" className="fill-screen" />
      <text x="60" y="76" fontSize="34" className="fill-ink font-display font-extrabold">
        ZIBBY
      </text>
      {['New', 'Home', 'Kitchen'].map((item, i) => (
        <text key={item} x={200 + i * 84} y="72" fontSize="17" className="fill-ink">
          {item}
        </text>
      ))}
      <text x="764" y="72" fontSize="17" textAnchor="end" className="fill-ink">
        Cart (2)
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
        Made for every day
      </text>
      {products.map((p, i) => {
        const px = 60 + i * 238
        return (
          <g key={p.name}>
            <rect x={px} y="182" width="218" height="214" className="fill-screen-2" />
            <Product index={i} cx={px + 109} cy={288} />
            <text x={px} y="424" fontSize="17" className="fill-ink">
              {p.name}
            </text>
            <text
              x={px + 218}
              y="424"
              fontSize="17"
              textAnchor="end"
              className="fill-ink font-semibold"
            >
              {p.price}
            </text>
          </g>
        )
      })}

      {/* Admin */}
      <rect x="648" y="120" width="520" height="382" className="fill-ink" />
      <text x="676" y="166" fontSize="30" className="fill-screen font-display font-bold">
        Orders
      </text>
      <text x="1140" y="164" fontSize="14" textAnchor="end" className="fill-screen/70 italic">
        Admin
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
              {o.status}
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
