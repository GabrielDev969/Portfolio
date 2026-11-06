import type { Project, SiteContent } from '@/content/schema'
import { isTodo } from '@/content/schema'

type Props = { project: Project; ui: SiteContent['ui'] }

/** A project's public links, or the note that there are none. */
export function ProjectLinks({ project, ui }: Props) {
  const { links } = project
  if (isTodo(links)) return null
  if (links.kind === 'internal') return <p className="text-small text-ink-2">{ui.internalNoLink}</p>
  if (links.kind === 'none') return <p className="text-small text-ink-2">{ui.noPublicLink}</p>
  return (
    <ul className="flex flex-wrap gap-x-6">
      {links.links.map((link) => (
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
  )
}
