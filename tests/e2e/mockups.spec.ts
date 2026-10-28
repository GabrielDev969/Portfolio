import { mockupCopy } from '../../src/components/mockups/copy'
import { locales } from '../../src/lib/i18n'
import { expect, test } from './fixtures'

// The mockups draw their words in SVG at fixed sizes, so a longer translation can spill out of
// its box or run into the next label. Measured in the drawing's own units (viewBox 1200 wide).
for (const locale of locales) {
  test(`every mockup label fits its box · ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${locale}/`)
    await page.evaluate(() => document.fonts.ready)
    const problems = await page.evaluate(() => {
      const gap = 8
      const out: string[] = []
      for (const svg of document.querySelectorAll<SVGSVGElement>('.project-still svg')) {
        const texts = [...svg.querySelectorAll('text')].filter((t) => t.textContent?.trim())
        const boxes = texts.map((t) => ({ t, b: t.getBBox() }))
        for (const { t, b } of boxes) {
          const label = `"${t.textContent}"`
          if (b.x < 0 || b.x + b.width > 1200) out.push(`${label} leaves the drawing`)
          // A label that starts inside a box drawn in the same group must end inside it too.
          const middle = b.y + b.height / 2
          for (const rect of t.parentElement?.querySelectorAll(':scope > rect') ?? []) {
            const r = (rect as SVGRectElement).getBBox()
            const starts = b.x >= r.x && b.x <= r.x + r.width
            if (!starts || middle < r.y || middle > r.y + r.height) continue
            if (b.x + b.width > r.x + r.width + 1) out.push(`${label} overflows its box`)
          }
        }
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i]!.b
            const c = boxes[j]!.b
            // Labels side by side need a word space between them, not just no overlap.
            const x = Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) + gap
            const y = Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y)
            if (x > 0 && y > 1) {
              out.push(`"${boxes[i]!.t.textContent}" overlaps "${boxes[j]!.t.textContent}"`)
            }
          }
        }
      }
      return out
    })
    expect(problems).toEqual([])
  })
}

test('the mockups speak the page language', async ({ page }) => {
  for (const locale of locales) {
    await page.goto(`${locale}/`)
    const { wave, hostly } = mockupCopy[locale]
    await expect(page.locator('.project-still svg text', { hasText: wave.newRequest })).toHaveCount(
      1,
    )
    await expect(
      page.locator('.project-still svg text', { hasText: hostly.nowPlaying }),
    ).toHaveCount(1)
  }
})
