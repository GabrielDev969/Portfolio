import type { MetadataRoute } from 'next'
import { languageTags, locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

/** One entry per locale, each listing the others as alternates (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [languageTags[l], `${siteUrl}/${l}/`]))
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}/`,
    alternates: { languages },
  }))
}
