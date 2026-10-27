import type { SiteContent } from '@/content/schema'
import type { Locale } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'
import { stillPath } from '@/lib/stills'

type Props = { locale: Locale; content: SiteContent }

/** schema.org Person for search engines, built from the same facts as the hero. */
export function PersonJsonLd({ locale, content }: Props) {
  const { person, contact } = content
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.role,
    description: person.about,
    url: `${siteUrl}/${locale}/`,
    image: `${siteUrl}/${stillPath(person.photo.still, 460, 'webp')}`,
    email: `mailto:${contact.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Salvador', addressCountry: 'BR' },
    knowsAbout: person.coreStack,
    knowsLanguage: ['pt-BR', 'es', 'en'],
    sameAs: contact.links.map((link) => link.href),
  }
  // Escape "<" so no string in the content can close the script element.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
