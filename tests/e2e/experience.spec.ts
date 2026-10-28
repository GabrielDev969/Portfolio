import { expect, test } from './fixtures'
import { startInViewMode, viewports } from './helpers'

const titles = [
  'Systems Analyst',
  'B.Sc. in Computer Science',
  'Full Stack Developer',
  'Consultant & Software Developer (contract)',
  'Postgraduate degree in Software Engineering for Applied AI',
]

const items = '#experience .timeline-item'

test('every entry is there, in date order', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('#experience h3')).toHaveText(titles)
})

test('nothing on the page is pinned', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await page.locator('html[data-motion="ready"]').waitFor({ state: 'attached' })
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
})

test('wide screens set the five entries side by side, inside the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  const boxes = await page
    .locator(items)
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON() as DOMRect))
  expect(new Set(boxes.map((b) => Math.round(b.top))).size).toBe(1)
  const lefts = boxes.map((b) => b.left)
  expect(lefts).toEqual([...lefts].sort((a, b) => a - b))
  expect(Math.max(...boxes.map((b) => b.right))).toBeLessThanOrEqual(1440)
})

test('phones list the entries top to bottom', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('en/')
  const tops = await page
    .locator(items)
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top))
  expect(tops).toEqual([...tops].sort((a, b) => a - b))
  expect(new Set(tops).size).toBe(tops.length)
})

test('Quick view lists one entry per line, with its years', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('#experience .timeline-years')).toHaveText([
    '2021–2025',
    '2021–2025',
    '2025–present',
    '2025–present',
    '2026–2027',
  ])
  await context.close()
})

// Section titles can be single long words ("Experiência"); they must stay whole at every width.
for (const viewport of [{ width: 360, height: 780 }, ...viewports]) {
  test(`section titles fit the screen · ${viewport.width}×${viewport.height}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    for (const locale of ['pt', 'en', 'es']) {
      await page.goto(`${locale}/`)
      await page.evaluate(() => document.fonts.ready)
      const boxes = await page
        .locator('[data-section-heading] h2 .rise-line > span')
        .evaluateAll((spans) => spans.map((s) => [s.getBoundingClientRect().left, s.scrollWidth]))
      for (const [left, width] of boxes) {
        expect(left, locale).toBeGreaterThanOrEqual(0)
        expect(left! + width!, locale).toBeLessThanOrEqual(viewport.width)
      }
    }
    await context.close()
  })
}

for (const id of ['projects', 'how-i-work', 'contact']) {
  test(`a deep link to #${id} stays on screen once the motion has loaded`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`en/#${id}`)
    await page.locator('html[data-motion="ready"]').waitFor({ state: 'attached' })
    await expect(page.locator(`#${id} h2`)).toBeInViewport()
  })
}
