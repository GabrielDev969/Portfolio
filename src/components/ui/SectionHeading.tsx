import type { CSSProperties } from 'react'

type Props = { id: string; title: string; index: number; total: number }

const two = (n: number) => String(n).padStart(2, '0')

/**
 * A section's title (design/STORYBOARD.md): the mono tag line, `// 01 · EXPERIENCE [01/04]`,
 * with the accent badge, then the title at heading size in the display face. The tag repeats the
 * title, so it is hidden from assistive technology; the h2 says it once. Quick view keeps the
 * title with less room above it.
 */
export function SectionHeading({ id, title, index, total }: Props) {
  // The longest word sets the ceiling: a title may wrap between words, never inside one.
  const chars = Math.max(...title.split(' ').map((word) => word.length))
  return (
    <header data-section-heading className="section-heading page-grid">
      <p aria-hidden="true" className="section-tag col-span-12">
        <span className="badge">{two(index)}</span>
        <span>{`// ${title}`}</span>
        <span className="section-rule" />
        <span>{`[${two(index)}/${two(total)}]`}</span>
      </p>
      <h2
        id={id}
        className="section-title col-span-12 font-display font-black uppercase"
        style={{ '--chars': chars } as CSSProperties}
      >
        <span className="rise-line">
          <span>{title}</span>
        </span>
      </h2>
    </header>
  )
}
