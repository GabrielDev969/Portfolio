import type { CSSProperties } from 'react'
import type { CreditBlock, SiteContent } from '@/content/schema'
import { canLinkTo } from '@/lib/public-files'
import { asset } from '@/lib/site'
import { ChapterCard } from '../cinema/ChapterCard'
import { CreditsRoll } from './CreditsRoll'
import { PostCredits } from './PostCredits'

type Props = { content: SiteContent }

function Credit({ block }: { block: CreditBlock }) {
  return (
    <div className="credit">
      <dt>{block.role}</dt>
      {block.names.map((name) => (
        <dd key={name}>{name}</dd>
      ))}
    </div>
  )
}

/**
 * The end credits are the contact section (design/STORYBOARD.md §8): the ground fades to
 * black, the bars close again, and the credits run centred (crew, cast, languages) before
 * they end on the one action that matters, "Write to me". Quick view turns it back into a
 * plain contact block on the ground. After it come the post-credits and the rewind.
 */
export function Contact({ content }: Props) {
  const { chapters, credits, contact, person, postCredits } = content

  return (
    <section
      id="contact"
      data-section
      data-act=""
      data-act-title={chapters.contact.title}
      aria-labelledby="contact-title"

      className="credits"
    >
      <CreditsRoll>
        <ChapterCard id="contact-title" title={chapters.contact.title} />
        <div className="credits-roll page-grid">
          <div className="col-span-12">
            <dl className="credit-list crew">
              {credits.crew.map((block) => (
                <Credit key={block.role} block={block} />
              ))}
            </dl>
            <p className="credits-heading">{credits.castLabel}</p>
            <dl className="credit-list">
              {credits.cast.map((block) => (
                <Credit key={block.role} block={block} />
              ))}
              <Credit block={credits.languages} />
            </dl>

            <div className="credits-end">
              <p>{contact.basedIn}</p>
              {person.relocation ? <p>{person.relocation}.</p> : null}
              <p>{person.availability}</p>
              <a
                href={`mailto:${contact.email}`}
                className="write-to-me"
                style={{ '--chars': contact.cta.length } as CSSProperties}
              >
                {contact.cta}
              </a>
              <p>{contact.email}</p>
              <ul className="flex flex-wrap justify-center gap-x-6 quick:justify-start">
                {contact.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex min-h-11 items-center underline underline-offset-4"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {canLinkTo(contact.cv.href) ? (
                <a
                  href={asset(contact.cv.href)}
                  download
                  className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                  {contact.cv.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </CreditsRoll>
      <PostCredits line={postCredits.line} rewind={postCredits.rewind} />
    </section>
  )
}
