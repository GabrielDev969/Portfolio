/**
 * pnpm journey — scrolls the page with the mouse wheel at 390, 768 and 1440 px, with and without
 * reduced motion, and saves a frame every 0.6 screens to qa/journey/. SECTION=<id> limits it to
 * one section (from just above it to its end); LOCALE=pt|es picks the language and saves to
 * qa/journey-<locale>/. Needs `pnpm build && pnpm preview`.
 * Every frame is meant to be looked at (landing-page-qa).
 */
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const locale = process.env.LOCALE ?? 'en'
const base = process.env.BASE_URL ?? `http://localhost:4173/Portfolio/${locale}/`
const section = process.env.SECTION
const out = join(import.meta.dirname, '..', 'qa', locale === 'en' ? 'journey' : `journey-${locale}`)
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
let frames = 0

for (const width of [390, 768, 1440]) {
  for (const motion of ['no-preference', 'reduce'] as const) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 900 },
      reducedMotion: motion,
    })
    await context.addInitScript(() => sessionStorage.setItem('introSeen', '1'))
    const page = await context.newPage()
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)

    const range = await page.evaluate((id) => {
      if (!id) return { from: 0, to: document.documentElement.scrollHeight }
      const el = document.getElementById(id)!
      const top = el.getBoundingClientRect().top + scrollY
      return { from: Math.max(0, top - innerHeight * 0.4), to: top + el.offsetHeight }
    }, section)
    const step = Math.round((await page.evaluate(() => innerHeight)) * 0.6)

    await page.mouse.move(width / 2, 300)
    await page.mouse.wheel(0, range.from)
    await page.waitForTimeout(900)
    for (let y = range.from, i = 0; y <= range.to; y += step, i++) {
      await page.screenshot({
        path: join(out, `${width}-${motion}-${String(i).padStart(3, '0')}.png`),
      })
      frames++
      await page.mouse.wheel(0, step)
      await page.waitForTimeout(800)
    }
    await context.close()
  }
}

await browser.close()
console.log(`${frames} frames in ${out}`)
