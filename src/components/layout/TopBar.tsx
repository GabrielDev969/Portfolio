import type { SiteContent } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { QuickViewToggle } from '../ui/QuickViewToggle'
import { SectionsMenu } from '../ui/SectionsMenu'

type Props = { locale: Locale; content: SiteContent }

/**
 * The one bar, fixed at the top on the page's own ground: name, sections, Quick view and
 * language. Before it in the tab order comes "Skip to content", visible only on focus.
 */
export function TopBar({ locale, content }: Props) {
  const { person, ui, sections: titles } = content
  const sections = [
    { href: '#experience', label: titles.experience.title },
    { href: '#projects', label: titles.projects.title },
    { href: '#how-i-work', label: titles.howIWork.title },
    { href: '#contact', label: titles.contact.title },
  ]

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-24 bg-screen px-4 py-3 text-ink focus-visible:translate-y-0 focus-visible:outline-ink"
      >
        {ui.skipToContent}
      </a>
      <header className="top-bar">
        <div className="flex h-full items-center justify-between gap-2 px-(--page-margin)">
          <a
            href="#top"
            className="font-display text-body font-bold tracking-[0.01em] whitespace-nowrap"
          >
            {/* Phones get the initials, so the menu, Quick view and all three languages fit
                at 360 px in every locale; the full name stays the link's accessible name. */}
            <span aria-hidden="true" className="sm:hidden">
              {person.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </span>
            <span className="max-sm:sr-only">{person.name}</span>
          </a>
          <div className="flex items-center sm:gap-3">
            <SectionsMenu label={ui.sections} navLabel={ui.sectionsNav} sections={sections} />
            <QuickViewToggle quickView={ui.quickView} fullView={ui.fullView} />
            <LanguageSwitcher current={locale} label={ui.languageNav} />
          </div>
        </div>
      </header>
    </>
  )
}
