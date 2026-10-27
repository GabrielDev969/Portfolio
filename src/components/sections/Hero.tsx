import type { CSSProperties } from 'react'
import type { SiteContent } from '@/content/schema'
import { languageTags, type Locale } from '@/lib/i18n'
import { asset } from '@/lib/site'
import { Button } from '../ui/Button'

type Props = { locale: Locale; content: SiteContent }

/**
 * The title sequence, and the 5-second test: name, role, core stack, "Remote", Contact and
 * Download CV all sit inside the band between the closed bars at every width, without scrolling.
 * The facts and buttons are never animated in and never covered (design/STORYBOARD.md §1).
 * Phones align it to the top instead of centring it: if the text font swaps in and a fact
 * rewraps, only what is below that line moves, not the name.
 */
export function Hero({ locale, content }: Props) {
  const { person, ui, contact, chapters } = content
  const stack = new Intl.ListFormat(languageTags[locale], { type: 'conjunction' }).format(
    person.coreStack,
  )

  return (
    <section
      id="top"
      data-section
      data-act=""
      data-act-title={ui.openingTitles}
      aria-labelledby="hero-name"
      className="page-grid min-h-svh content-center gap-y-[clamp(16px,3svh,32px)] py-[calc(var(--bar-closed)+clamp(12px,3svh,40px))] max-md:content-start quick:min-h-0 quick:pt-[calc(var(--bar-open)+48px)] quick:pb-8"
    >
      <h1
        id="hero-name"
        data-fact="name"
        className="hero-name col-span-12 w-fit justify-self-start font-display text-title font-extrabold uppercase lg:col-span-7 quick:col-span-12 quick:text-scene"
      >
        {person.name.split(' ').map((word, i) => (
          <span key={word} className="rise-line">
            <span style={{ '--i': i } as CSSProperties}>{word}</span>
          </span>
        ))}
      </h1>

      <div className="col-span-12 md:col-span-7 lg:col-span-6 quick:col-span-12 quick:measure">
        <p data-fact="role" className="font-semibold">
          {person.role}
        </p>
        <p data-fact="stack">{stack}.</p>
        <p>
          {person.location}.{' '}
          <span data-fact="remote" className="font-semibold">
            {person.workMode}.
          </span>
        </p>
        {/* Two lines on phones in either font (ch scales with the font), so the swap cannot rewrap it. */}
        {person.relocation ? (
          <p className="text-balance max-sm:max-w-[30ch]">{person.relocation}.</p>
        ) : null}
        <div className="mt-[clamp(16px,2.5svh,28px)] flex flex-wrap gap-3">
          <Button variant="velvet" href="#contact" data-fact="contact">
            {ui.contact}
          </Button>
          <Button variant="ink" href={asset(contact.cv.href)} download data-fact="cv">
            {ui.downloadCv}
          </Button>
        </div>
      </div>

      {/* On wide screens the line sits beside the name, on its last baseline, like a poster title.
          On tablets it sits beside the facts, so the stack stays inside the bars when standing up. */}
      <p className="col-span-12 self-end font-text text-scene text-balance italic md:col-span-5 md:col-start-8 md:row-start-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:pb-[0.1em] quick:col-span-12 quick:col-start-1 quick:row-start-auto quick:pb-0 quick:text-body">
        {person.heroLine}
      </p>

      <a
        href="#experience"
        className="col-span-12 inline-flex min-h-11 items-center gap-2 justify-self-start text-small underline-offset-4 hover:underline lg:col-span-5 lg:col-start-8 lg:self-end quick:hidden"
        aria-label={`${ui.watchTrailer}: ${chapters.experience.title}`}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          {[0, 72, 144, 216, 288].map((angle) => (
            <circle
              key={angle}
              cx={10 + 4.6 * Math.cos(((angle - 90) * Math.PI) / 180)}
              cy={10 + 4.6 * Math.sin(((angle - 90) * Math.PI) / 180)}
              r="1.6"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          ))}
        </svg>
        {ui.watchTrailer}
      </a>
    </section>
  )
}
