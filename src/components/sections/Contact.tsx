import type { Group, SiteContent } from '@/content/schema'
import { canLinkTo } from '@/lib/public-files'
import { asset } from '@/lib/site'
import { ReplayButton } from '@/swarm/ReplayButton'
import { Button } from '../ui/Button'
import { EmailBox } from '../ui/EmailBox'
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
 * Contact (design/STORYBOARD.md §5). On the left, how to reach Gabriel: availability as the
 * subtitle, where he is based (and, in Spanish only, the relocation line), "Write to me" as the
 * primary button, the e-mail box with its Copy button, the profile links in mono and the CV.
 * On the right, a card with the stack by area and his languages. Then the footer row: the year,
 * "Build it again" for the swarm, and "Back to top".
 */
export function Contact({ content }: Props) {
  const { sections, skills, contact, person, ui, swarm } = content
  const links = [
    ...contact.links.map((l) => ({ ...l, external: true, download: false })),
    ...(canLinkTo(contact.cv.href)
      ? [{ label: contact.cv.label, href: asset(contact.cv.href), external: false, download: true }]
      : []),
  ]

  return (
    <section id="contact" data-section aria-labelledby="contact-title">
      <SectionHeading id="contact-title" title={sections.contact.title} index={4} total={4} />
      <div className="page-grid gap-y-10 pb-[clamp(2rem,4vw,3rem)]">
        <div className="col-span-12 lg:col-span-7 quick:col-span-12">
          <p className="contact-lead">{person.availability}</p>
          <p className="mt-3 text-ink-2">{contact.basedIn}</p>
          {person.relocation ? <p className="text-ink-2">{person.relocation}.</p> : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="primary" href={`mailto:${contact.email}`}>
              {contact.cta}
            </Button>
          </div>
          <div className="mt-4">
            <EmailBox email={contact.email} copy={ui.copy} copied={ui.copied} />
          </div>
          <ul className="contact-links mt-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                  {...(link.download ? { download: true } : {})}
                  className="contact-link"
                >
                  {link.label}
                  <span aria-hidden="true">{link.external ? ' ↗' : ' ↓'}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact-about card col-span-12 lg:col-span-5 quick:col-span-12">
          <h3 className="tag">{`// ${ui.stack}`}</h3>
          <dl className="skill-list">
            {skills.stack.map((group) => (
              <GroupList key={group.label} group={group} />
            ))}
          </dl>
          <dl className="skill-list mt-5 border-t border-line pt-4">
            <GroupList group={skills.languages} />
          </dl>
        </div>

        <footer className="site-footer col-span-12">
          <p className="tag">{`© ${new Date().getFullYear()} ${person.name}`}</p>
          <div className="flex flex-wrap items-center gap-4">
            <ReplayButton label={swarm.replay} />
            <a href="#top" className="tag inline-flex min-h-11 items-center hover:text-ink">
              {ui.backToTop} ↑
            </a>
          </div>
        </footer>
      </div>
    </section>
  )
}
