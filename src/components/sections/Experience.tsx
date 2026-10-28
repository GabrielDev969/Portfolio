import type { SiteContent } from '@/content/schema'
import { SectionHeading } from '../ui/SectionHeading'

type Props = { content: SiteContent }

/**
 * Experience (design/STORYBOARD.md §2): a dated timeline, in date order. Five entries side by
 * side on a hairline from 1024 px, a vertical list on a hairline below that. Nothing is pinned
 * and nothing scrolls sideways. Quick view sets it as one entry per line.
 */
export function Experience({ content }: Props) {
  const { sections, experience, ui } = content

  return (
    <section id="experience" data-section aria-labelledby="experience-title">
      <SectionHeading id="experience-title" title={sections.experience.title} />
      <div className="page-grid pb-[clamp(5rem,10vw,9rem)] quick:pb-8">
        <ol className="timeline col-span-12">
          {experience.map((m) => (
            <li key={m.id} className="timeline-item">
              <p className="timeline-years">
                <span className="timeline-start">{m.start}</span>
                <span className="timeline-end">–{m.end === 'present' ? ui.present : m.end}</span>
              </p>
              <div className="timeline-body">
                <h3 className="font-semibold">{m.title}</h3>
                <p>{m.organization}</p>
                {m.summary ? <p className="timeline-summary">{m.summary}</p> : null}
                {m.place ? <p className="text-small text-ink-2">{m.place}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
