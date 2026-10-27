import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { CSSProperties, ReactNode } from 'react'
import { getContent } from '@/content'
import { isLocale, languageTags, locales, type Locale } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'
import { KeepAnchor } from '@/motion/KeepAnchor'
import { MotionProvider } from '@/motion/MotionProvider'
import { PrintAsQuickView } from '@/motion/PrintAsQuickView'
import { SmoothScroll } from '@/motion/SmoothScroll'
import { motionCssVars } from '@/motion/tokens'
import { display, text } from '../fonts'
import { headScript } from './head-script'

export const dynamicParams = false

// Open Graph wants language_TERRITORY.
const ogLocales: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US', es: 'es_LA' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta, person } = getContent(locale)
  const url = (l: Locale) => `${siteUrl}/${l}/`
  const image = { url: `${siteUrl}/og/${locale}.png`, width: 1200, height: 630, alt: meta.title }
  return {
    metadataBase: new URL(`${siteUrl}/`),
    title: meta.title,
    description: meta.description,
    authors: [{ name: person.name }],
    alternates: {
      canonical: url(locale),
      languages: {
        ...Object.fromEntries(locales.map((l) => [languageTags[l], url(l)])),
        'x-default': url('en'),
      },
    },
    openGraph: {
      type: 'profile',
      url: url(locale),
      siteName: person.name,
      title: meta.title,
      description: meta.description,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    // The head script sets data-js, data-view and data-bars before React hydrates.
    <html
      lang={languageTags[locale]}
      className={`${display.variable} ${text.variable}`}
      style={motionCssVars as CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <SmoothScroll />
        <KeepAnchor />
        <PrintAsQuickView />
      </body>
    </html>
  )
}
