import type { SiteContent } from '@/content/schema'
import { SectionHeading } from '../ui/SectionHeading'

type Props = { content: SiteContent }

/**
 * Experience (design/STORYBOARD.md §2): each role a bordered card, in date order (its years in
 * mono, the title, the organization, the one-line summary, the place): five side by side from
 * 1024 px, one per row on phones. Then one accent-bordered callout: how he works, in his own
 * words from the content. Quick view sets the cards as one entry per line.
 */
export function Experience({ content }: Props) {
  const { sections, experience, ui, person } = content

  return (
    <section id="experience" data-section aria-labelledby="experience-title">
      <SectionHeading id="experience-title" title={sections.experience.title} index={1} total={4} />
      <div className="page-grid gap-y-6 pb-[clamp(5rem,10vw,9rem)] quick:pb-8">
        <ol className="timeline col-span-12">
          {experience.map((m) => (
            <li key={m.id} className="timeline-item card">
              <p className="timeline-years">
                <span className="timeline-start">{m.start}</span>
                <span className="timeline-end">–{m.end === 'present' ? ui.present : m.end}</span>
              </p>
              <div className="timeline-body">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-ink-2">{m.organization}</p>
                {m.summary ? <p className="timeline-summary">{m.summary}</p> : null}
                {m.place ? <p className="tag mt-auto">{m.place}</p> : null}
              </div>
            </li>
          ))}
        </ol>
        <aside className="callout col-span-12 lg:col-span-8">
          <p className="tag text-accent">{`// ${sections.howIWork.title}`}</p>
          <p className="callout-text">{person.approach}</p>
        </aside>
      </div>
    </section>
  )
}
