import type { Locale } from '@/lib/i18n'
import { en } from './en'
import { es } from './es'
import { pt } from './pt'
import type { SiteContent } from './schema'

const content: Record<Locale, SiteContent> = { pt, en, es }

export function getContent(locale: Locale): SiteContent {
  return content[locale]
}
