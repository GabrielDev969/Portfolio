import type { CSSProperties } from 'react'
import type { SiteContent } from '@/content/schema'
import { canLinkTo } from '@/lib/public-files'
import { asset } from '@/lib/site'
import { Button } from '../ui/Button'
import { Picture } from '../ui/Picture'

type Props = { content: SiteContent }

/**
 * The hero (design/STORYBOARD.md §1), and the 5-second test: name, role, core stack, "Remote",
 * Contact and Download CV all sit on the first screen, under the top bar, at every width, at
 * first paint. Only the name animates (it rises once on load, in CSS).
 *
 * Three columns from 1024 px over the giant outlined backdrop word: the introduction (greeting,
 * name, role pill, line, stack chips, buttons, the three counters), the duotone photo in its
 * card, and three small cards (the two current roles, where and how he works). Phones stack them
 * in that order.
 */
export function Hero({ content }: Props) {
  const { person, ui, contact, experience } = content
  const now = experience.filter((m) => m.end === 'present')
  const years = (m: (typeof experience)[number]) =>
    `${m.start}–${m.end === 'present' ? ui.present : m.end}`

  return (
    <section
      id="top"
      data-section
      aria-labelledby="hero-name"
      className="hero page-grid quick:min-h-0 quick:pt-[calc(var(--top-bar)+48px)] quick:pb-8"
    >
      <p aria-hidden="true" className="hero-backdrop quick:hidden">
        {ui.backdrop}
      </p>

      <div className="hero-intro">
        <p className="hero-greeting">{ui.greeting}</p>
        <h1 id="hero-name" data-fact="name" className="hero-name">
          {person.name.split(' ').map((word, i, words) => (
            <span key={word} className="rise-line">
              <span style={{ '--i': i } as CSSProperties}>
                {word}
                {i === words.length - 1 ? <span className="text-crimson">.</span> : null}
              </span>
            </span>
          ))}
        </h1>
        <p className="pill mt-5">
          <span aria-hidden="true" className="pill-dot" />
          <span data-fact="role">{person.role}</span>
          <span aria-hidden="true">·</span>
          <span data-fact="remote">{person.workMode}</span>
        </p>
        <p className="hero-line">{person.heroLine}</p>
        <ul data-fact="stack" className="chips mt-5" aria-label={ui.stack}>
          {person.coreStack.map((name) => (
            <li key={name} className="chip">
              {name}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button variant="primary" href="#contact" data-fact="contact">
            {ui.contact}
          </Button>
          {/* Until the PDF is in public/cv/, the published page leaves the button out. */}
          {canLinkTo(contact.cv.href) ? (
            <Button variant="dark" href={asset(contact.cv.href)} download data-fact="cv">
              {ui.downloadCv}
            </Button>
          ) : null}
        </div>
        <dl className="stats">
          {person.stats.map((stat) => (
            <div key={stat.label} className="stat">
              <dt className="stat-label">{stat.label}</dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="hero-photo card card-brackets quick:hidden">
        <Picture
          id="portrait"
          alt={person.photo.alt}
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 40vw, 90vw"
          className="aspect-square w-full object-cover"
          eager
        />
        <figcaption className="tag mt-3">{`// ${person.location} · ${person.workMode}`}</figcaption>
      </figure>

      <ul className="hero-cards">
        {now.map((m) => (
          <li key={m.id} className="card hero-card">
            <p className="tag">{years(m)}</p>
            <p className="mt-1 font-semibold">{m.organization}</p>
            <p className="text-small text-ink-2">{m.title}</p>
          </li>
        ))}
        <li className="card hero-card">
          <p className="tag">{`// ${person.location}`}</p>
          <p className="mt-1 font-semibold">{person.availability}</p>
          <p className="text-small text-ink-2">{contact.basedIn}</p>
          {/* Spanish only. */}
          {person.relocation ? (
            <p className="mt-1 text-small text-ink-2">{person.relocation}.</p>
          ) : null}
        </li>
      </ul>
    </section>
  )
}
