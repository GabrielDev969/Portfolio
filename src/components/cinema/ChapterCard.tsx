import type { CSSProperties } from 'react'
import { ChapterReveal } from './ChapterReveal'

type Props = {
  id: string
  /** Absent for Contact, which the end credits frame instead of an act. */
  act?: string
  title: string
}

/**
 * A full-screen title card between acts: the act in italic, the plain section name at chapter
 * size, rising from behind a mask. In Quick view it collapses to a plain section heading.
 */
export function ChapterCard({ id, act, title }: Props) {
  // The longest word sets the size: a title may wrap between words, never inside one.
  const chars = Math.max(...title.split(' ').map((word) => word.length))
  return (
    <ChapterReveal>
      <header
        data-chapter-card
        className="page-grid min-h-[70svh] content-center quick:min-h-0 quick:pt-16 quick:pb-6"
      >
        <div className="@container col-span-12 md:col-span-10 md:col-start-2 quick:col-start-1">
          {act ? <p className="text-body italic quick:hidden">{act}</p> : null}
          <h2
            id={id}
            className="chapter-title font-display font-extrabold uppercase quick:text-scene"
            style={{ '--chars': chars } as CSSProperties}
          >
            <span className="rise-line">
              <span>{title}</span>
            </span>
          </h2>
        </div>
      </header>
    </ChapterReveal>
  )
}
