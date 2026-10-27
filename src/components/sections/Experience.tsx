import type { Milestone, SiteContent } from '@/content/schema'
import { ChapterCard } from '../cinema/ChapterCard'
import { Still } from '../cinema/Still'
import { ExperienceStrip } from './ExperienceStrip'

type Props = { content: SiteContent }

const range = (m: Milestone, present: string) =>
  `${m.start}–${m.end === 'present' ? present : m.end}`

/**
 * Act I · Experience (design/STORYBOARD.md §3): the timeline as a 35 mm strip. One frame per
 * milestone, in date order, with its caption on the margin below. The markup is a vertical
 * strip that works everywhere (phones, reduced motion, no JS); ExperienceStrip turns it into
 * the pinned horizontal reel on wide screens.
 */
export function Experience({ content }: Props) {
  const { chapters, experience, person, ui } = content

  return (
    <section
      id="experience"
      data-section
      data-act={chapters.experience.act}
      data-act-title={chapters.experience.title}
      aria-labelledby="experience-title"
    >
      <ChapterCard id="experience-title" {...chapters.experience} />
      <ExperienceStrip>
        <div className="strip-pin">
          <ol className="strip-track">
            {experience.map((m, i) => (
              <li key={m.id} className="strip-item">
                <div className="strip-cell" aria-hidden="true">
                  <div className="strip-frame">
                    {i === 0 ? (
                      <Still
                        id={person.photo.still}
                        alt=""
                        sizes="(min-width: 768px) 12vw, 40vw"
                        className="strip-still"
                      />
                    ) : null}
                    <p className="relative font-display">
                      <span className="block text-scene font-bold">{m.start}</span>
                      <span className="block text-body font-semibold">
                        –{m.end === 'present' ? ui.present : m.end}
                      </span>
                    </p>
                  </div>
                  <p className="strip-edge">{m.start}</p>
                </div>
                <div className="strip-caption">
                  <p className="strip-years">{range(m, ui.present)}</p>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p>{m.organization}</p>
                  {m.summary ? <p className="strip-summary">{m.summary}</p> : null}
                  {m.place ? <p className="text-small text-ink-2">{m.place}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </ExperienceStrip>
    </section>
  )
}
