import { notFound } from 'next/navigation'
import { getContent } from '@/content'
import type { Milestone, ProjectLinks } from '@/content/schema'
import { isTodo } from '@/content/schema'
import { isLocale } from '@/lib/i18n'
import { asset } from '@/lib/site'
import { resolveText } from '@/lib/text'

// Phase 0 baseline: every fact in plain semantic HTML, readable without JS.
// Phases 1–5 replace these blocks with the designed sections.

type Props = { params: Promise<{ locale: string }> }

function years({ start, end }: Milestone, present: string) {
  return `${start}–${end === 'present' ? present : end}`
}

function linksOf(links: ProjectLinks, internalNote: string) {
  if (isTodo(links)) return null
  if (links.kind === 'internal') return <p>{internalNote}</p>
  return (
    <ul>
      {links.links.map((link) => (
        <li key={link.href}>
          <a href={link.href} rel="noopener noreferrer" target="_blank">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const c = getContent(locale)
  const { person, ui, chapters } = c

  return (
    <main id="top">
      <header>
        <h1>{person.name}</h1>
        <p>{person.role}</p>
        <p>{person.coreStack.join(', ')}</p>
        <p>
          {person.location}. {person.workMode}.
        </p>
        {person.relocation ? <p>{person.relocation}</p> : null}
        <p>{person.heroLine}</p>
        <p>
          <a href="#contact">{ui.contact}</a> <a href={asset(c.contact.cv.href)}>{ui.downloadCv}</a>
        </p>
        <p>{person.about}</p>
      </header>

      <section id="experience" aria-labelledby="experience-title">
        <h2 id="experience-title">{chapters.experience.title}</h2>
        <ol>
          {c.experience.map((m) => (
            <li key={m.id}>
              <p>{years(m, 'present')}</p>
              <h3>
                {m.title}, {m.organization}
              </h3>
              {m.summary ? <p>{m.summary}</p> : null}
              {m.place ? <p>{m.place}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">{chapters.projects.title}</h2>
        {c.projects.map((project) => {
          const bts = project.behindTheScenes
          const parts = [
            [ui.bts.problem, bts.problem],
            [ui.bts.role, bts.role],
            [ui.bts.testingAndDeploy, bts.testing],
            [ui.bts.testingAndDeploy, bts.deploy],
            [ui.bts.outcome, bts.outcome],
          ] as const
          return (
            <article key={project.id} aria-labelledby={`${project.id}-title`}>
              <h3 id={`${project.id}-title`}>{project.title}</h3>
              {project.organization ? <p>{project.organization}</p> : null}
              <p>{project.logline}</p>
              <p>
                {project.stack
                  .map(resolveText)
                  .filter((s): s is string => s !== null)
                  .join(', ')}
              </p>
              <details>
                <summary>{ui.behindTheScenes}</summary>
                {parts.map(([label, value], i) => {
                  const text = resolveText(value)
                  return text ? (
                    <p key={i}>
                      <strong>{label}:</strong> {text}
                    </p>
                  ) : null
                })}
                <h4>{ui.bts.architecture}</h4>
                <ul>
                  {bts.architecture.nodes.map((node) => {
                    const label = resolveText(node.label)
                    return label ? <li key={node.id}>{label}</li> : null
                  })}
                </ul>
                <h4>{ui.bts.decisions}</h4>
                <ul>
                  {bts.decisions.map((d, i) => {
                    const what = resolveText(d.what)
                    const why = resolveText(d.why)
                    return what ? <li key={i}>{why ? `${what}: ${why}` : what}</li> : null
                  })}
                </ul>
              </details>
              {linksOf(project.links, ui.internalNoLink)}
            </article>
          )
        })}
      </section>

      <section id="how-i-work" aria-labelledby="how-i-work-title">
        <h2 id="how-i-work-title">{chapters.howIWork.title}</h2>
        <ol>
          {c.workflow.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>{c.workflow.closing}</p>
      </section>

      <section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">{chapters.contact.title}</h2>
        <dl>
          {[...c.credits.crew, ...c.credits.cast, c.credits.languages].map((block) => (
            <div key={block.role}>
              <dt>{block.role}</dt>
              {block.names.map((name) => (
                <dd key={name}>{name}</dd>
              ))}
            </div>
          ))}
        </dl>
        <p>{c.contact.basedIn}</p>
        {person.relocation ? <p>{person.relocation}</p> : null}
        <p>
          <a href={`mailto:${c.contact.email}`}>{c.contact.cta}</a>
        </p>
        <p>{c.contact.email}</p>
        <ul>
          {c.contact.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener noreferrer" target="_blank">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p>
          <a href={asset(c.contact.cv.href)}>{c.contact.cv.label}</a>
        </p>
      </section>

      <footer>
        <p>{c.postCredits.line}</p>
        <a href="#top">{c.postCredits.rewind}</a>
      </footer>
    </main>
  )
}
