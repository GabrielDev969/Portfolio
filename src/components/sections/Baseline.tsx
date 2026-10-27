import type { SiteContent } from '@/content/schema'
import { asset } from '@/lib/site'
import { ChapterCard } from '../cinema/ChapterCard'

// Temporary: every fact after the hero, in plain semantic HTML on the design tokens.
// Phase 5 replaces How I work and Contact.

const body = 'col-span-12 md:col-span-8 md:col-start-2 measure quick:col-start-1'

export function Baseline({ content: c }: { content: SiteContent }) {
  const { chapters } = c

  return (
    <>
      <section
        id="how-i-work"
        data-section
        data-act={chapters.howIWork.act}
        data-act-title={chapters.howIWork.title}
        aria-labelledby="how-i-work-title"
      >
        <ChapterCard id="how-i-work-title" {...chapters.howIWork} />
        <div className="page-grid pb-32 quick:pb-8">
          <div className={body}>
            <ol className="list-decimal space-y-1 pl-6">
              {c.workflow.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-6 font-semibold">{c.workflow.closing}</p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        data-section
        data-act=""
        data-act-title={chapters.contact.title}
        aria-labelledby="contact-title"
        className="bg-house pb-[calc(var(--bar-closed)+64px)] text-screen quick:bg-screen quick:pb-16 quick:text-ink"
      >
        <ChapterCard id="contact-title" title={chapters.contact.title} />
        <div className="page-grid">
          <div className={body}>
            <dl className="space-y-4">
              {[...c.credits.crew, ...c.credits.cast, c.credits.languages].map((block) => (
                <div key={block.role}>
                  <dt className="text-small">{block.role}</dt>
                  {block.names.map((name) => (
                    <dd key={name}>{name}</dd>
                  ))}
                </div>
              ))}
            </dl>
            <p className="mt-8">{c.contact.basedIn}</p>
            {c.person.relocation ? <p>{c.person.relocation}.</p> : null}
            <p className="mt-8">
              <a
                href={`mailto:${c.contact.email}`}
                className="inline-flex min-h-12 items-center rounded-[2px] bg-velvet px-6 font-semibold text-screen focus-visible:outline-screen quick:focus-visible:outline-ink"
              >
                {c.contact.cta}
              </a>
            </p>
            <p className="mt-3">{c.contact.email}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6">
              {c.contact.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <a href={asset(c.contact.cv.href)} download className="underline underline-offset-4">
                {c.contact.cv.label}
              </a>
            </p>
            <div className="mt-32 quick:hidden">
              <p>{c.postCredits.line}</p>
              <a href="#top" className="underline underline-offset-4">
                {c.postCredits.rewind}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
