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
            sizes="(min-width: 1024px) 66vw, 100vw"
            // A screenshot keeps its words whole: letterboxed on the tone step in the 4:3
            // phone frame, filling the wide frame from 768 px.
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
 * Projects (design/STORYBOARD.md §3). Five projects with one shared treatment: the image bleeds
 * off the left edge, the title, problem and what I built sit on the ground beside it, the stack
 * is listed on a panel that overlaps the image's right edge by one column, and the architecture
 * and result follow. Every part is inline, with nothing to open. Quick view keeps the facts and
 * drops the images.
 */
export function Projects({ content }: Props) {
  const { sections, projects, ui } = content

  return (
    <section id="projects" data-section aria-labelledby="projects-title">
      <SectionHeading id="projects-title" title={sections.projects.title} />
      <div className="projects">
        {projects.map((project) => {
          const stack = project.stack.map(resolveText).filter((s): s is string => s !== null)
          return (
            <ProjectPushIn key={project.id}>
              <article
                id={project.id}
                aria-labelledby={`${project.id}-title`}
                className="project group/project page-grid"
              >
                <div className="project-image quick:hidden">
                  <ProjectImage project={project} locale={content.locale} />
                </div>

                <header className="project-head">
                  {project.organization ? (
                    <p className="text-small text-ink-2">{project.organization}</p>
                  ) : null}
                  <h3
                    id={`${project.id}-title`}
                    className="font-display text-heading font-bold uppercase quick:font-text quick:text-body quick:font-semibold quick:normal-case"
                  >
                    {project.title}
                  </h3>
                </header>

                <ProjectSummary project={project} ui={ui} />

                <p className="project-stack-sentence hidden quick:block">
                  <span className="italic">{ui.stack}:</span> {stack.join(', ')}.
                </p>
                <div className="project-stack quick:hidden">
                  <p className="text-small text-ink-2 italic">{ui.stack}</p>
                  <ul className="text-small font-medium">
                    {stack.map((name) => (
                      <li key={name} className="stack-line">
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-links">
                  <ProjectLinks project={project} ui={ui} />
                </div>
              </article>
            </ProjectPushIn>
          )
        })}
      </div>
    </section>
  )
}
