import type { ProjectLinks, SiteContent } from '@/content/schema'
import { isTodo } from '@/content/schema'
import { asset } from '@/lib/site'
import { resolveProse, resolveText } from '@/lib/text'
import { ChapterCard } from '../cinema/ChapterCard'

// Temporary: every fact after the hero, in plain semantic HTML on the design tokens.
// Phases 4–5 replace one section at a time (Projects, How I work, Contact).

function Links({ links, internalNote }: { links: ProjectLinks; internalNote: string }) {
  if (isTodo(links)) return null
  if (links.kind === 'internal') return <p className="text-small text-ink-2">{internalNote}</p>
  return (
    <ul>
      {links.links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            rel="noopener noreferrer"
            target="_blank"
            className="underline underline-offset-4"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

const body = 'col-span-12 md:col-span-8 md:col-start-2 measure quick:col-start-1'

export function Baseline({ content: c }: { content: SiteContent }) {
  const { ui, chapters } = c

  return (
    <>
      <section
        id="projects"
        data-section
        data-act={chapters.projects.act}
        data-act-title={chapters.projects.title}
        aria-labelledby="projects-title"
      >
        <ChapterCard id="projects-title" {...chapters.projects} />
        <div className="page-grid pb-32 quick:pb-8">
          <div className={`${body} space-y-16 quick:space-y-10`}>
            {c.projects.map((project) => {
              const bts = project.behindTheScenes
              const parts = [
                [ui.bts.problem, bts.problem],
                [ui.bts.role, bts.role],
                [ui.bts.testingAndDeploy, bts.testing],
                [ui.bts.testingAndDeploy, bts.deploy],
                [ui.bts.outcome, bts.outcome],
              ] as const
              const stack = project.stack.map(resolveText).filter((s): s is string => s !== null)
              return (
                <article key={project.id} aria-labelledby={`${project.id}-title`}>
                  <h3
                    id={`${project.id}-title`}
                    className="font-display text-scene font-bold uppercase"
                  >
                    {project.title}
                  </h3>
                  {project.organization ? (
                    <p className="text-small text-ink-2">{project.organization}</p>
                  ) : null}
                  <p className="mt-3">{project.logline}</p>
                  <p className="mt-2 text-small">{stack.join(', ')}</p>
                  <details className="mt-4">
                    <summary className="cursor-pointer font-semibold">{ui.behindTheScenes}</summary>
                    <div className="mt-3 space-y-2 border-t border-ink/20 pt-3">
                      {parts.map(([label, value], i) => {
                        const text = resolveProse(value).join(' ')
                        return text ? (
                          <p key={i}>
                            <strong>{label}:</strong> {text}
                          </p>
                        ) : null
                      })}
                      <h4 className="font-semibold">{ui.bts.architecture}</h4>
                      <ul className="list-disc pl-5">
                        {bts.architecture.nodes.map((node) => {
                          const label = resolveText(node.label)
                          return label ? <li key={node.id}>{label}</li> : null
                        })}
                      </ul>
                      <h4 className="font-semibold">{ui.bts.decisions}</h4>
                      <ul className="list-disc pl-5">
                        {bts.decisions.map((d, i) => {
                          const what = resolveText(d.what)
                          const why = resolveText(d.why)
                          return what ? <li key={i}>{why ? `${what}: ${why}` : what}</li> : null
                        })}
                      </ul>
                    </div>
                  </details>
                  <div className="mt-3">
                    <Links links={project.links} internalNote={ui.internalNoLink} />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="how-i-work"
        data-section
        data-act={chapters.howIWork.act}
        data-act-title={chapters.howIWork.title}
        aria-labelledby="how-i-work-title"
      >
        <ChapterCard id="how-i-work-title" {...chapters.howIWork} />
        <div className="page-grid pb-32 quick:pb-8">
          <div className={body}>
            <ol className="list-decimal space-y-1 pl-6">
              {c.workflow.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-6 font-semibold">{c.workflow.closing}</p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        data-section
        data-act=""
        data-act-title={chapters.contact.title}
        aria-labelledby="contact-title"
        className="bg-house pb-[calc(var(--bar-closed)+64px)] text-screen quick:bg-screen quick:pb-16 quick:text-ink"
      >
        <ChapterCard id="contact-title" title={chapters.contact.title} />
        <div className="page-grid">
          <div className={body}>
            <dl className="space-y-4">
              {[...c.credits.crew, ...c.credits.cast, c.credits.languages].map((block) => (
                <div key={block.role}>
                  <dt className="text-small">{block.role}</dt>
                  {block.names.map((name) => (
                    <dd key={name}>{name}</dd>
                  ))}
                </div>
              ))}
            </dl>
            <p className="mt-8">{c.contact.basedIn}</p>
            {c.person.relocation ? <p>{c.person.relocation}.</p> : null}
            <p className="mt-8">
              <a
                href={`mailto:${c.contact.email}`}
                className="inline-flex min-h-12 items-center rounded-[2px] bg-velvet px-6 font-semibold text-screen focus-visible:outline-screen quick:focus-visible:outline-ink"
              >
                {c.contact.cta}
              </a>
            </p>
            <p className="mt-3">{c.contact.email}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6">
              {c.contact.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <a href={asset(c.contact.cv.href)} download className="underline underline-offset-4">
                {c.contact.cv.label}
              </a>
            </p>
            <div className="mt-32 quick:hidden">
              <p>{c.postCredits.line}</p>
              <a href="#top" className="underline underline-offset-4">
                {c.postCredits.rewind}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
