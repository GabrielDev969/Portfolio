import type { Project, SiteContent } from '@/content/schema'
import { isTodo } from '@/content/schema'
import { resolveProse, resolveText } from '@/lib/text'
import { ArchitectureDiagram } from './ArchitectureDiagram'

type Props = { project: Project; ui: SiteContent['ui'] }

/**
 * The six parts of a project's technical details, always in this order (design/STORYBOARD.md §3):
 * problem, role, architecture, decisions, testing and deploy, outcome, then the links. A part
 * whose facts are all missing in production is left out with its heading.
 */
export function TechnicalDetailsParts({ project, ui }: Props) {
  const td = project.technicalDetails
  const decisions = td.decisions
    .map((d) => ({
      what: resolveText(d.what),
      why: d.why === undefined ? null : resolveText(d.why),
    }))
    .filter((d): d is { what: string; why: string | null } => d.what !== null)
  const paragraph = (label: string, sentences: string[]) =>
    sentences.length > 0 ? (
      <section>
        <h4 className="details-heading">{label}</h4>
        <p>{sentences.join(' ')}</p>
      </section>
    ) : null

  return (
    <div className="details-parts">
      {paragraph(ui.details.problem, resolveProse(td.problem))}
      {paragraph(ui.details.role, resolveProse(td.role))}
      <section>
        <h4 className="details-heading">{ui.details.architecture}</h4>
        <ArchitectureDiagram id={`${project.id}-diagram`} architecture={td.architecture} />
      </section>
      {decisions.length > 0 ? (
        <section>
          <h4 className="details-heading">{ui.details.decisions}</h4>
          <ul className="space-y-3">
            {decisions.map((d) => (
              <li key={d.what}>
                <p className="font-medium">{d.what}</p>
                {d.why ? <p>{d.why}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {paragraph(ui.details.testingAndDeploy, [
        ...resolveProse(td.testing),
        ...resolveProse(td.deploy),
      ])}
      {paragraph(ui.details.outcome, resolveProse(td.outcome))}
      {/* In Quick view the links already sit right above, on the project itself. */}
      <div className="quick:hidden">
        <ProjectLinks project={project} ui={ui} />
      </div>
    </div>
  )
}

/** The public links, or the note that there are none. Shown on the project too. */
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
