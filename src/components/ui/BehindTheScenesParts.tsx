import type { Project, SiteContent } from '@/content/schema'
import { isTodo } from '@/content/schema'
import { resolveProse, resolveText } from '@/lib/text'
import { ArchitectureDiagram } from './ArchitectureDiagram'

type Props = { project: Project; ui: SiteContent['ui'] }

/**
 * The six parts of a project's behind the scenes, always in this order (design/STORYBOARD.md §5):
 * problem, role, architecture, decisions, testing and deploy, outcome, then the links. A part
 * whose facts are all missing in production is left out with its heading.
 */
export function BehindTheScenesParts({ project, ui }: Props) {
  const bts = project.behindTheScenes
  const decisions = bts.decisions
    .map((d) => ({
      what: resolveText(d.what),
      why: d.why === undefined ? null : resolveText(d.why),
    }))
    .filter((d): d is { what: string; why: string | null } => d.what !== null)
  const paragraph = (label: string, sentences: string[]) =>
    sentences.length > 0 ? (
      <section>
        <h4 className="bts-heading">{label}</h4>
        <p>{sentences.join(' ')}</p>
      </section>
    ) : null

  return (
    <div className="bts-parts">
      {paragraph(ui.bts.problem, resolveProse(bts.problem))}
      {paragraph(ui.bts.role, resolveProse(bts.role))}
      <section>
        <h4 className="bts-heading">{ui.bts.architecture}</h4>
        <ArchitectureDiagram id={`${project.id}-diagram`} architecture={bts.architecture} />
      </section>
      {decisions.length > 0 ? (
        <section>
          <h4 className="bts-heading">{ui.bts.decisions}</h4>
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
      {paragraph(ui.bts.testingAndDeploy, [
        ...resolveProse(bts.testing),
        ...resolveProse(bts.deploy),
      ])}
      {paragraph(ui.bts.outcome, resolveProse(bts.outcome))}
      {/* In Quick view the links already sit right above, on the project itself. */}
      <div className="quick:hidden">
        <ProjectLinks project={project} ui={ui} />
      </div>
    </div>
  )
}

/** The public links, or the note that an internal system has none. Shown on the scene too. */
export function ProjectLinks({ project, ui }: Props) {
  const { links } = project
  if (isTodo(links)) return null
  if (links.kind === 'internal') return <p className="text-small text-ink-2">{ui.internalNoLink}</p>
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
