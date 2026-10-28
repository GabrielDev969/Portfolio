/**
 * pnpm measure:vitals — LCP and CLS of the first screen on a throttled phone (Lighthouse's
 * mobile profile: Slow 4G and a 4× slower CPU), in every locale (LOCALE=es for one): the font
 * swap can rewrap a translated line, as the Spanish hero once did (CLS 0.23). Prints the median
 * of five runs per locale. Needs `pnpm build && pnpm preview`.
 */
import { chromium, type Page } from '@playwright/test'
import { locales } from '../src/lib/i18n'

const base = process.env.BASE_URL ?? 'http://localhost:4173/Portfolio'
const only = process.env.LOCALE
const runs = 5

async function throttle(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}

async function measure(url: string) {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await context.addInitScript(() => {
    const w = window as unknown as { __lcp: { t: number; el: string }; __cls: number }
    w.__lcp = { t: 0, el: '' }
    w.__cls = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { element?: Element })[]) {
        w.__lcp = { t: e.startTime, el: e.element?.tagName.toLowerCase() ?? '?' }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & {
        value: number
        hadRecentInput: boolean
      })[]) {
        if (!e.hadRecentInput) w.__cls += e.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  const page = await context.newPage()
  await throttle(page)
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  const result = await page.evaluate(() => {
    const w = window as unknown as { __lcp: { t: number; el: string }; __cls: number }
    return { lcp: w.__lcp.t, element: w.__lcp.el, cls: w.__cls }
  })
  await browser.close()
  return result
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!

for (const locale of locales.filter((l) => !only || l === only)) {
  const results = []
  for (let i = 0; i < runs; i++) results.push(await measure(`${base}/${locale}/`))
  const lcps = results.map((r) => r.lcp)
  const lcp = median(lcps)
  // The range shows when runs split into two groups (font swap before or after the first
  // paint), which a median alone hides.
  const range = `${(Math.min(...lcps) / 1000).toFixed(2)}–${(Math.max(...lcps) / 1000).toFixed(2)} s`
  const cls = median(results.map((r) => r.cls))
  const elements = [...new Set(results.map((r) => r.element))].join(', ')
  console.log(
    `${locale}  LCP ${(lcp / 1000).toFixed(2)} s (range ${range}, element: ${elements})  CLS ${cls.toFixed(3)}  [${runs} runs]`,
  )
}
