import { notFound } from 'next/navigation'
import { PersonJsonLd } from '@/components/PersonJsonLd'
import { TopBar } from '@/components/layout/TopBar'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { HowIWork } from '@/components/sections/HowIWork'
import { Projects } from '@/components/sections/Projects'
import { getContent } from '@/content'
import { isLocale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: string }> }

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const content = getContent(locale)

  return (
    <>
      <PersonJsonLd locale={locale} content={content} />
      <TopBar locale={locale} content={content} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero locale={locale} content={content} />
        <Experience content={content} />
        <Projects content={content} />
        <HowIWork content={content} />
        <Contact content={content} />
      </main>
    </>
  )
}
