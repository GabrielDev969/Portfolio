import type { SiteContent } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { QuickViewToggle } from '../ui/QuickViewToggle'
import { SectionsMenu } from '../ui/SectionsMenu'

type Props = { locale: Locale; content: SiteContent }

/**
 * The one bar, fixed at the top on the page's ground with a hairline under it (design/
 * STORYBOARD.md, Top bar): the GS monogram on the left; on the right the sections in mono (a
 * menu below 768 px, where four links do not fit beside the languages), the language switcher
 * and the terminal icon that toggles Quick view. Before it in the tab order comes "Skip to
 * content", visible only on focus.
 */
export function TopBar({ locale, content }: Props) {
  const { person, ui, sections: titles } = content
  const sections = [
    { href: '#experience', label: titles.experience.title },
    { href: '#projects', label: titles.projects.title },
    { href: '#how-i-work', label: titles.howIWork.title },
    { href: '#contact', label: titles.contact.title },
  ]
  const initials = person.name
    .split(' ')
    .map((word) => word[0])
    .join('')

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-24 bg-screen px-4 py-3 text-ink focus-visible:translate-y-0 focus-visible:outline-cyan"
      >
        {ui.skipToContent}
      </a>
      <header className="top-bar">
        <div className="flex h-full items-center justify-between gap-2 px-(--page-margin)">
          <a href="#top" className="monogram" aria-label={person.name}>
            <span aria-hidden="true">{initials}</span>
          </a>
          <div className="flex items-center gap-1 sm:gap-3">
            <nav aria-label={ui.sectionsNav} className="hidden md:block">
              <ul className="flex items-center gap-1">
                {sections.map((section) => (
                  <li key={section.href}>
                    <a href={section.href} className="nav-link">
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="md:hidden">
              <SectionsMenu label={ui.sections} navLabel={ui.sectionsNav} sections={sections} />
            </div>
            <LanguageSwitcher current={locale} label={ui.languageNav} />
            <QuickViewToggle quickView={ui.quickView} fullView={ui.fullView} />
          </div>
        </div>
      </header>
    </>
  )
}
