import type { Project, SiteContent } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { resolveText } from '@/lib/text'
import { ProjectFrame } from '../ui/ProjectFrame'
import { Picture } from '../ui/Picture'
import { mockups } from '../mockups'
import { ProjectLinks } from '../ui/ProjectLinks'
import { ProjectSummary } from '../ui/ProjectSummary'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectPushIn } from './ProjectPushIn'

type Props = { content: SiteContent }

function ProjectImage({ project, locale }: { project: Project; locale: Locale }) {
  const { image } = project
  if (image.kind === 'image') {
    return (
      <ProjectFrame description={image.alt}>
        <div className="project-image-inner">
          <Picture
            id={image.id}
            alt=""
            sizes="(min-width: 1024px) 50vw, 100vw"
            // A screenshot keeps its words whole: letterboxed on the surface in the 4:3 phone
            // frame, filling the wide frame from 768 px.
            className="size-full object-contain md:object-cover"
          />
        </div>
      </ProjectFrame>
    )
  }
  const Mockup = mockups[image.mockup]
  return (
    <ProjectFrame description={image.description}>
      <div className="project-image-inner">
        <Mockup locale={locale} />
      </div>
    </ProjectFrame>
  )
}

/**
 * Projects (design/STORYBOARD.md §3). The first project is the feature card, with corner
 * brackets and its metric tiles; the other four sit in a bordered grid, two columns from
 * 1024 px. Every card carries its image as a header, the status pill, the title, the inline
 * summary (problem, what I built, the architecture as a pipeline, the result), the stack as
 * chips and its links. Nothing to filter, nothing to open. Quick view keeps the facts and drops
 * the images.
 */
export function Projects({ content }: Props) {
  const { sections, projects, ui } = content

  return (
    <section id="projects" data-section aria-labelledby="projects-title">
      <SectionHeading id="projects-title" title={sections.projects.title} index={2} total={4} />
      <div className="projects page-grid">
        {projects.map((project, i) => {
          const stack = project.stack.map(resolveText).filter((s): s is string => s !== null)
          const feature = i === 0
          return (
            <ProjectPushIn key={project.id} feature={feature}>
              <article
                id={project.id}
                aria-labelledby={`${project.id}-title`}
                className={`project card ${feature ? 'project-feature card-brackets' : ''}`}
              >
                <div className="project-image quick:hidden">
                  <ProjectImage project={project} locale={content.locale} />
                </div>

                <div className="project-body">
                  <header className="project-head">
                    <p className="pill">
                      <span aria-hidden="true" className="pill-dot" />
                      {project.status}
                    </p>
                    {project.organization ? (
                      <p className="tag mt-3">{project.organization}</p>
                    ) : null}
                    <h3
                      id={`${project.id}-title`}
                      className="project-title quick:font-text quick:text-body quick:font-semibold quick:normal-case"
                    >
                      {project.title}
                    </h3>
                  </header>

                  <ProjectSummary project={project} ui={ui} />

                  {project.metrics?.length ? (
                    <dl className="metrics">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="metric">
                          <dt className="stat-label">{m.label}</dt>
                          <dd className="stat-value">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <p className="project-stack-sentence hidden quick:block">
                    <span className="italic">{ui.stack}:</span> {stack.join(', ')}.
                  </p>
                  <ul className="project-stack chips quick:hidden" aria-label={ui.stack}>
                    {stack.map((name) => (
                      <li key={name} className="chip stack-line">
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="project-links">
                    <ProjectLinks project={project} ui={ui} />
                  </div>
                </div>
              </article>
            </ProjectPushIn>
          )
        })}
      </div>
    </section>
  )
}
