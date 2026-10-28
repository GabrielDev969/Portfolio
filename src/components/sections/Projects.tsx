import type { Project, SiteContent } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { resolveText } from '@/lib/text'
import { ChapterCard } from '../cinema/ChapterCard'
import { FilmFrame } from '../cinema/FilmFrame'
import { Still } from '../cinema/Still'
import { mockups } from '../mockups'
import { BehindTheScenes } from '../ui/BehindTheScenes'
import { BehindTheScenesParts, ProjectLinks } from '../ui/BehindTheScenesParts'
import { ProjectPushIn } from './ProjectPushIn'

type Props = { content: SiteContent }

function ProjectStill({ project, locale }: { project: Project; locale: Locale }) {
  const { still } = project
  if (still.kind === 'image') {
    return (
      <FilmFrame description={still.alt}>
        <div className="project-still-inner">
          <Still
            id={still.still}
            alt=""
            sizes="(min-width: 1024px) 66vw, 100vw"
            // A screenshot keeps its words whole: letterboxed on the black mat in the 4:3
            // phone frame, filling the 2.39:1 frame from 768 px.
            className="size-full object-contain md:object-cover"
          />
        </div>
      </FilmFrame>
    )
  }
  const Mockup = mockups[still.mockup]
  return (
    <FilmFrame description={still.description}>
      <div className="project-still-inner">
        <Mockup locale={locale} />
      </div>
    </FilmFrame>
  )
}

/**
 * Act II · Projects (design/STORYBOARD.md §5). Five projects with one shared treatment: the
 * still bleeds off the left edge, the title and logline sit on the ground beside it, and the
 * stack is set as a cast list on a panel that overlaps the still's right edge by one column.
 * Behind the scenes opens the six-part panel. Quick view keeps the facts and drops the stills.
 */
export function Projects({ content }: Props) {
  const { chapters, projects, ui, credits } = content

  return (
    <section
      id="projects"
      data-section
      data-act={chapters.projects.act}
      data-act-title={chapters.projects.title}
      aria-labelledby="projects-title"
    >
      <ChapterCard id="projects-title" {...chapters.projects} />
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
                <div className="project-still quick:hidden">
                  <ProjectStill project={project} locale={content.locale} />
                </div>

                <header className="project-head">
                  {project.organization ? (
                    <p className="text-small text-ink-2">{project.organization}</p>
                  ) : null}
                  <h3
                    id={`${project.id}-title`}
                    className="font-display text-scene font-bold uppercase quick:font-text quick:text-body quick:font-semibold quick:normal-case"
                  >
                    {project.title}
                  </h3>
                  <p className="project-logline mt-3 measure">{project.logline}</p>
                  <p className="mt-1 hidden quick:block">{stack.join(', ')}.</p>
                </header>

                <div className="project-cast quick:hidden">
                  <p className="text-small text-ink-2 italic">{credits.castLabel}</p>
                  <ul className="text-small font-medium">
                    {stack.map((name) => (
                      <li key={name} className="cast-line">
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-actions">
                  <BehindTheScenes
                    id={project.id}
                    label={ui.technicalDetails}
                    title={project.title}
                    close={ui.close}
                  >
                    <BehindTheScenesParts project={project} ui={ui} />
                  </BehindTheScenes>
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
