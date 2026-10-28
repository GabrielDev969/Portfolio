export const locales = ['pt', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** localStorage key for the visitor's explicit language choice. */
export const localeStorageKey = 'locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** Browser language to site locale: pt* → pt, es* → es, anything else → en. */
export function matchLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const prefix = language.toLowerCase().slice(0, 2)
    if (prefix === 'pt' || prefix === 'es') return prefix
    if (prefix === 'en') return 'en'
  }
  return defaultLocale
}

/** BCP 47 tag for <html lang> and hreflang. */
export const languageTags: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
}
