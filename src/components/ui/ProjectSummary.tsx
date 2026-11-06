import type { Project, SiteContent } from '@/content/schema'
import { resolveProse } from '@/lib/text'
import { Pipeline } from './Pipeline'

type Props = { project: Project; ui: SiteContent['ui'] }

/**
 * A project's parts, inline and always in this order (design/COMMIT-SHEET.md §4): problem, what
 * I built, architecture, result. The stack follows on its panel. A part whose facts are missing
 * in production is left out with its label. Each part is its own grid item (the list itself
 * has `display: contents`), so the full view can place them around the image.
 */
export function ProjectSummary({ project, ui }: Props) {
  const { summary } = project
  const part = (name: string, label: string, sentences: string[]) =>
    sentences.length > 0 ? (
      <div className={`project-part project-${name}`}>
        <dt>{label}</dt>
        <dd>{sentences.join(' ')}</dd>
      </div>
    ) : null

  return (
    <dl className="project-summary">
      {part('problem', ui.project.problem, resolveProse(summary.problem))}
      {part('built', ui.project.built, resolveProse(summary.built))}
      <div className="project-part project-architecture">
        <dt>{ui.project.architecture}</dt>
        <dd>
          <Pipeline architecture={project.architecture} />
        </dd>
      </div>
      {part('result', ui.project.result, resolveProse(summary.result))}
    </dl>
  )
}
