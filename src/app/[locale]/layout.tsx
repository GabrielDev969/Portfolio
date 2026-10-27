import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { CSSProperties, ReactNode } from 'react'
import { getContent } from '@/content'
import { isLocale, languageTags, locales } from '@/lib/i18n'
import { KeepAnchor } from '@/motion/KeepAnchor'
import { MotionProvider } from '@/motion/MotionProvider'
import { SmoothScroll } from '@/motion/SmoothScroll'
import { motionCssVars } from '@/motion/tokens'
import { display, text } from '../fonts'
import { headScript } from './head-script'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getContent(locale)
  return { title: meta.title, description: meta.description }
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
      </body>
    </html>
  )
}
