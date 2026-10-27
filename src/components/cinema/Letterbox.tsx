import type { SiteContent } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { ChapterNav } from '../ui/ChapterNav'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { QuickViewToggle } from '../ui/QuickViewToggle'
import { Timecode } from './Timecode'

type Props = { locale: Locale; content: SiteContent }

/**
 * The black masking bars, with the HUD living inside them so it never sits on content.
 * Top: wordmark, sections, Quick view and language. Bottom: timecode and availability.
 */
export function Letterbox({ locale, content }: Props) {
  const { person, ui, chapters } = content
  const sections = [
    { href: '#experience', label: chapters.experience.title },
    { href: '#projects', label: chapters.projects.title },
    { href: '#how-i-work', label: chapters.howIWork.title },
    { href: '#contact', label: chapters.contact.title },
  ]

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-24 bg-screen px-4 py-3 text-ink focus-visible:translate-y-0 focus-visible:outline-ink"
      >
        {ui.skipToContent}
      </a>
      <header className="bar bar-top">
        <div className="absolute inset-x-0 bottom-0 flex h-(--bar-open) items-center justify-between gap-2 px-(--page-margin)">
          <a
            href="#top"
            className="font-display text-body font-bold tracking-[0.01em] whitespace-nowrap"
          >
            {person.name}
          </a>
          <div className="flex items-center sm:gap-3">
            <ChapterNav label={ui.chapters} navLabel={ui.chaptersNav} chapters={sections} />
            <QuickViewToggle quickView={ui.quickView} filmView={ui.filmView} />
            <LanguageSwitcher current={locale} label={ui.languageNav} />
          </div>
        </div>
      </header>
      <footer className="bar bar-bottom">
        <div className="absolute inset-x-0 top-0 flex h-(--bar-open) items-center justify-between gap-4 px-(--page-margin)">
          <Timecode openingTitles={ui.openingTitles} />
          <p className="hidden text-small sm:block">{person.availability}</p>
        </div>
      </footer>
    </>
  )
}
