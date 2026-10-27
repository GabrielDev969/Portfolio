/**
 * pnpm gate — the hero mockup gate: the first screen at five viewports, in film mode and
 * Quick view, saved to qa/gate/ with a contact sheet. Needs `pnpm build && pnpm preview`.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const base = process.env.BASE_URL ?? 'http://localhost:4173/Portfolio'
const locale = process.env.LOCALE ?? 'en'
const out = join(import.meta.dirname, '..', 'qa', 'gate')
mkdirSync(out, { recursive: true })

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
]
const modes = ['film', 'quick'] as const

const browser = await chromium.launch()
const shots: { file: string; width: number; height: number }[] = []

for (const mode of modes) {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    await context.addInitScript((m) => localStorage.setItem('viewMode', m), mode)
    const page = await context.newPage()
    await page.goto(`${base}/${locale}/`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)
    const file = join(out, `${locale}-${mode}-${viewport.width}x${viewport.height}.png`)
    await page.screenshot({ path: file })
    shots.push({ file, ...viewport })
    await context.close()
  }
}
await browser.close()

// Contact sheet: one row per mode, every viewport scaled to the same height.
const rowHeight = 420
const gap = 24
const rows = await Promise.all(
  modes.map(async (mode) => {
    const row = shots.filter((s) => s.file.includes(`-${mode}-`))
    return Promise.all(
      row.map(async (s) => {
        const width = Math.round((s.width / s.height) * rowHeight)
        return { input: await sharp(s.file).resize({ height: rowHeight }).toBuffer(), width }
      }),
    )
  }),
)
const sheetWidth = Math.max(...rows.map((r) => r.reduce((w, s) => w + s.width + gap, gap)))
const composites = rows.flatMap((row, y) => {
  let x = gap
  return row.map((s) => {
    const item = { input: s.input, left: x, top: gap + y * (rowHeight + gap) }
    x += s.width + gap
    return item
  })
})
const sheet = join(out, `${locale}-contact-sheet.png`)
await sharp({
  create: {
    width: sheetWidth,
    height: gap + rows.length * (rowHeight + gap),
    channels: 3,
    background: '#777',
  },
})
  .composite(composites)
  .png()
  .toFile(sheet)

console.log(`${shots.length} screenshots and ${sheet}`)
