import { notFound } from 'next/navigation'
import { BarsState } from '@/components/cinema/BarsState'
import { CueMark } from '@/components/cinema/CueMark'
import { FilmGrain } from '@/components/cinema/FilmGrain'
import { Letterbox } from '@/components/cinema/Letterbox'
import { Vignette } from '@/components/cinema/Vignette'
import { Baseline } from '@/components/sections/Baseline'
import { ColdOpen } from '@/components/sections/ColdOpen'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { getContent } from '@/content'
import { isLocale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: string }> }

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const content = getContent(locale)

  return (
    <>
      <ColdOpen production={content.production} skip={content.ui.skipIntro} />
      <Letterbox locale={locale} content={content} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero locale={locale} content={content} />
        <Experience content={content} />
        <Baseline content={content} />
      </main>
      <CueMark />
      <Vignette />
      <FilmGrain />
      <BarsState />
    </>
  )
}
