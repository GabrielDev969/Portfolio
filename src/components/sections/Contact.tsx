import type { Group, SiteContent } from '@/content/schema'
import { canLinkTo } from '@/lib/public-files'
import { asset } from '@/lib/site'
import { Still } from '../cinema/Still'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

type Props = { content: SiteContent }

function GroupList({ group }: { group: Group }) {
  return (
    <div className="skill-group">
      <dt>{group.label}</dt>
      <dd>{group.items.join(', ')}</dd>
    </div>
  )
}

/**
 * Contact (design/STORYBOARD.md §5): a normal section on the page's ground. On the left, how to
 * reach Gabriel: where he is based (and, in Spanish only, the relocation line), availability,
 * "Write to me" as the one red button with the e-mail beside it, the profile links and the CV.
 * On the right, his photo, the stack by area and his languages. Then a quiet "Back to top".
 */
export function Contact({ content }: Props) {
  const { sections, skills, contact, person, ui } = content

  return (
    <section id="contact" data-section aria-labelledby="contact-title">
      <SectionHeading id="contact-title" title={sections.contact.title} />
      <div className="page-grid gap-y-12 pb-[clamp(3rem,6vw,5rem)]">
        <div className="col-span-12 lg:col-span-6 quick:col-span-12">
          <p>{contact.basedIn}</p>
          {person.relocation ? <p>{person.relocation}.</p> : null}
          <p className="font-semibold">{person.availability}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button variant="velvet" href={`mailto:${contact.email}`}>
              {contact.cta}
            </Button>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex min-h-11 items-center underline underline-offset-4"
            >
              {contact.email}
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6">
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
            {canLinkTo(contact.cv.href) ? (
              <li>
                <a
                  href={asset(contact.cv.href)}
                  download
                  className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                  {contact.cv.label}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="contact-about col-span-12 lg:col-span-5 lg:col-start-8 quick:col-span-12 quick:col-start-1">
          <Still
            id={person.photo.still}
            alt={person.photo.alt}
            sizes="(min-width: 1024px) 10rem, 8rem"
            className="contact-photo quick:hidden"
          />
          <div>
            <h3 className="font-semibold">{ui.stack}</h3>
            <dl className="skill-list">
              {skills.stack.map((group) => (
                <GroupList key={group.label} group={group} />
              ))}
            </dl>
            <dl className="skill-list mt-6">
              <GroupList group={skills.languages} />
            </dl>
          </div>
        </div>

        <p className="col-span-12">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center text-small text-ink-2 underline-offset-4 hover:underline"
          >
            {ui.backToTop}
          </a>
        </p>
      </div>
    </section>
  )
}
