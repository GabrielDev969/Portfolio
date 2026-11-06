import type { Architecture, ArchitectureNode } from '@/content/schema'
import { resolveText } from '@/lib/text'

type Props = { architecture: Architecture }

/**
 * Each node's step: the longest path that reaches it, so every arrow points forward. A node that
 * nothing points to moves up to the step just before its nearest target (Campaign BI's app sits
 * beside RabbitMQ, before NestJS).
 */
export function layers(nodes: { id: string }[], edges: { from: string; to: string }[]) {
  const depth = new Map(nodes.map((n) => [n.id, 0]))
  for (let pass = 0; pass < nodes.length; pass++) {
    for (const e of edges) depth.set(e.to, Math.max(depth.get(e.to)!, depth.get(e.from)! + 1))
  }
  for (const n of nodes) {
    if (edges.some((e) => e.to === n.id)) continue
    const targets = edges.filter((e) => e.from === n.id).map((e) => depth.get(e.to)!)
    if (targets.length > 0) depth.set(n.id, Math.min(...targets) - 1)
  }
  const rows: string[][] = []
  for (const n of nodes) (rows[depth.get(n.id)!] ??= []).push(n.id)
  return rows.filter(Boolean)
}

/**
 * A project's architecture as a pipeline of mono chips with arrows (design/STORYBOARD.md §3),
 * laid out at build time from the content: one step per layer of the data flow, the nodes of a
 * step side by side, so a system that branches is not drawn as a line. Chips follow the node
 * kind (services solid, data with a rule, external services dashed, devices rounded). The chips
 * are decorative for assistive technology; the list after them names every connection.
 */
export function Pipeline({ architecture }: Props) {
  // A node whose label is still missing in production drops out, with its arrows.
  const nodes = architecture.nodes
    .map((node) => ({ node, label: resolveText(node.label) }))
    .filter((n): n is { node: ArchitectureNode; label: string } => n.label !== null)
  const known = new Set(nodes.map((n) => n.node.id))
  const edges = architecture.edges.filter((e) => known.has(e.from) && known.has(e.to))
  const byId = new Map(nodes.map((n) => [n.node.id, n]))
  const steps = layers(
    nodes.map((n) => n.node),
    edges,
  )

  return (
    <figure className="pipeline">
      <ol aria-hidden="true" className="pipeline-steps">
        {steps.map((step) => (
          <li key={step.join()} className="pipeline-step">
            {step.map((id) => {
              const n = byId.get(id)!
              return (
                <span key={id} className={`node node-${n.node.kind}`}>
                  {n.label}
                </span>
              )
            })}
          </li>
        ))}
      </ol>
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
