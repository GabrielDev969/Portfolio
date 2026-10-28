import type { CSSProperties } from 'react'
import { HeadingReveal } from './HeadingReveal'

type Props = { id: string; title: string }

/**
 * A section's title, in plain words, at heading size on a hairline that spans the grid. It
 * rises from behind its mask once as it arrives (HeadingReveal); in Quick view, with reduced
 * motion and without JS it is simply there.
 */
export function SectionHeading({ id, title }: Props) {
  // The longest word sets the ceiling: a title may wrap between words, never inside one.
  const chars = Math.max(...title.split(' ').map((word) => word.length))
  return (
    <HeadingReveal>
      <header data-section-heading className="section-heading page-grid">
        <h2
          id={id}
          className="section-title col-span-12 font-display font-bold uppercase quick:font-text quick:text-body quick:font-semibold quick:normal-case"
          style={{ '--chars': chars } as CSSProperties}
        >
          <span className="rise-line">
            <span>{title}</span>
          </span>
        </h2>
      </header>
    </HeadingReveal>
  )
}
