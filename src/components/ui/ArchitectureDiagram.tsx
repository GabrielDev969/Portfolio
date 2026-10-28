import type { Architecture, ArchitectureNode } from '@/content/schema'
import { resolveText } from '@/lib/text'

type Props = { id: string; architecture: Architecture }

// Drawn in viewBox units: 400 wide, so the 15-unit text reads at about 18 px in the drawer
// and 13 px on a phone. Rows are layers of the data flow, top to bottom.
const width = 400
const font = 15
const line = 19
const padX = 12
const padY = 10
const rowGap = 46
const colGap = 14
const maxBox = 210
// Newsreader averages about half an em per character at this size.
const charWidth = font * 0.5
// Arrow labels sit on their line, over a plate of the drawer's colour.
const labelFont = 13
const labelChar = labelFont * 0.48

type Placed = { node: ArchitectureNode; label: string; x: number; y: number; w: number; h: number }

function wrap(label: string, boxWidth: number) {
  const max = Math.max(8, Math.floor((boxWidth - 2 * padX) / charWidth))
  const lines: string[] = []
  for (const word of label.split(' ')) {
    const last = lines[lines.length - 1]
    if (last !== undefined && `${last} ${word}`.length <= max)
      lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  return lines
}

/** Each node's row: the longest path that reaches it, so every arrow points down. */
function layers(nodes: { id: string }[], edges: { from: string; to: string }[]) {
  const depth = new Map(nodes.map((n) => [n.id, 0]))
  for (let pass = 0; pass < nodes.length; pass++) {
    for (const e of edges) depth.set(e.to, Math.max(depth.get(e.to)!, depth.get(e.from)! + 1))
  }
  const rows: string[][] = []
  for (const n of nodes) (rows[depth.get(n.id)!] ??= []).push(n.id)
  return rows.filter(Boolean)
}

/**
 * A project's architecture as 2–6 boxes and arrows, laid out from the content data at build
 * time. The picture is decorative for assistive technology; the list after it says the same.
 * Shapes follow the node kind: services are solid, data stores carry a lid line, external
 * services are dashed, devices are rounded.
 */
export function ArchitectureDiagram({ id, architecture }: Props) {
  // A node whose label is still missing in production drops out, with its arrows.
  const nodes = architecture.nodes
    .map((node) => ({ node, label: resolveText(node.label) }))
    .filter((n): n is { node: ArchitectureNode; label: string } => n.label !== null)
  const known = new Set(nodes.map((n) => n.node.id))
  const edges = architecture.edges.filter((e) => known.has(e.from) && known.has(e.to))
  const byId = new Map(nodes.map((n) => [n.node.id, n]))

  const placed = new Map<string, Placed>()
  let y = 2
  for (const row of layers(
    nodes.map((n) => n.node),
    edges,
  )) {
    const w = Math.min(maxBox, (width - 4 - colGap * (row.length - 1)) / row.length)
    const wrapped = row.map((nodeId) => wrap(byId.get(nodeId)!.label, w))
    const h = Math.max(...wrapped.map((l) => l.length)) * line + 2 * padY
    const rowWidth = row.length * w + (row.length - 1) * colGap
    row.forEach((nodeId, i) => {
      const x = (width - rowWidth) / 2 + i * (w + colGap)
      placed.set(nodeId, { ...byId.get(nodeId)!, x, y, w, h })
    })
    y += h + rowGap
  }
  const height = y - rowGap + 2

  // Arrows leave and enter boxes at points spread along the edge, so two never share a line.
  const spread = (box: Placed, index: number, count: number) =>
    box.x + (box.w * (index + 1)) / (count + 1)
  const outgoing = (nodeId: string) => edges.filter((e) => e.from === nodeId)
  const incoming = (nodeId: string) => edges.filter((e) => e.to === nodeId)
  const arrow = `${id}-arrow`

  return (
    <figure className="diagram">
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full max-w-[480px] font-text"
      >
        <defs>
          <marker
            id={arrow}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 10 5 0 10z" className="fill-ink" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = placed.get(edge.from)!
          const to = placed.get(edge.to)!
          const out = outgoing(edge.from)
          const into = incoming(edge.to)
          const x1 = spread(from, out.indexOf(edge), out.length)
          const x2 = spread(to, into.indexOf(edge), into.length)
          const y1 = from.y + from.h
          const y2 = to.y - 2
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="1.5"
                className="stroke-ink"
                markerEnd={`url(#${arrow})`}
              />
              {edge.label ? (
                <g>
                  <rect
                    x={(x1 + x2) / 2 - (edge.label.length * labelChar) / 2 - 4}
                    y={(y1 + y2) / 2 - labelFont * 0.75}
                    width={edge.label.length * labelChar + 8}
                    height={labelFont * 1.4}
                    className="fill-screen-2"
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 + labelFont * 0.35}
                    textAnchor="middle"
                    fontSize={labelFont}
                    className="fill-ink italic"
                  >
                    {edge.label}
                  </text>
                </g>
              ) : null}
            </g>
          )
        })}
        {[...placed.values()].map((box) => {
          const lines = wrap(box.label, box.w)
          const solid = box.node.kind === 'service'
          return (
            <g key={box.node.id}>
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={box.node.kind === 'device' ? 12 : 2}
                strokeWidth="1.5"
                strokeDasharray={box.node.kind === 'external' ? '5 4' : undefined}
                className={solid ? 'fill-ink stroke-ink' : 'fill-screen stroke-ink'}
              />
              {box.node.kind === 'data' ? (
                <line
                  x1={box.x}
                  x2={box.x + box.w}
                  y1={box.y + 5}
                  y2={box.y + 5}
                  strokeWidth="1.5"
                  className="stroke-ink"
                />
              ) : null}
              <text
                x={box.x + box.w / 2}
                y={box.y + box.h / 2 - ((lines.length - 1) * line) / 2 + font * 0.35}
                textAnchor="middle"
                fontSize={font}
                className={solid ? 'fill-screen' : 'fill-ink'}
              >
                {lines.map((text, i) => (
                  <tspan key={i} x={box.x + box.w / 2} dy={i === 0 ? 0 : line}>
                    {text}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="sr-only">
        <ul>
          {edges.map((edge) => (
            <li key={`${edge.from}-${edge.to}`}>
              {byId.get(edge.from)!.label} → {byId.get(edge.to)!.label}
              {edge.label ? ` (${edge.label})` : ''}
            </li>
          ))}
          {nodes
            .filter((n) => !edges.some((e) => e.from === n.node.id || e.to === n.node.id))
            .map((n) => (
              <li key={n.node.id}>{n.label}</li>
            ))}
        </ul>
      </figcaption>
    </figure>
  )
}
