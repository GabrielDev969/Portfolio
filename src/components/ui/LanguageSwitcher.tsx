'use client'
import type { MouseEvent } from 'react'
import { languageTags, localeStorageKey, locales, type Locale } from '@/lib/i18n'
import { basePath } from '@/lib/site'

type Props = { current: Locale; label: string }

/** PT / EN / ES as plain links: they work without JS; with JS the choice is saved and the hash kept. */
export function LanguageSwitcher({ current, label }: Props) {
  const remember = (locale: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      localStorage.setItem(localeStorageKey, locale)
    } catch {
      // Storage can be blocked; the link still navigates.
    }
    event.currentTarget.href = `${basePath}/${locale}/${location.hash}`
  }

  return (
    <nav aria-label={label}>
      <ul className="flex">
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={`${basePath}/${locale}/`}
              hrefLang={languageTags[locale]}
              lang={languageTags[locale]}
              aria-current={locale === current ? 'true' : undefined}
              onClick={remember(locale)}
              className="inline-flex min-h-11 min-w-9 items-center justify-center text-small uppercase underline-offset-4 hover:underline aria-[current]:font-bold aria-[current]:underline sm:min-w-11"
            >
              {locale}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
