import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { startInViewMode, viewports } from './helpers'

const titles = [
  'Systems Analyst',
  'B.Sc. in Computer Science',
  'Full Stack Developer',
  'Consultant & Software Developer (contract)',
  'Postgraduate degree in Software Engineering for Applied AI',
]

/** Extra scroll the pins add: each pin-spacer is taller than the element it holds. */
const pinnedDistance = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.pin-spacer')].reduce(
      (sum, spacer) =>
        sum + spacer.offsetHeight - (spacer.firstElementChild as HTMLElement).offsetHeight,
      0,
    ),
  )

const strip = (page: Page) => page.locator('#experience .strip')

test('every milestone is there, in date order', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('#experience h3')).toHaveText(titles)
})

test.describe('wide screens with motion', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the reel pins for at most one screen height and shows every frame', async ({ page }) => {
    await page.goto('en/')
    await expect(strip(page)).toHaveAttribute('data-strip', 'on')
    await page.locator('#experience').scrollIntoViewIfNeeded()
    const distance = await pinnedDistance(page)
    expect(distance).toBeGreaterThan(0)
    expect(distance).toBeLessThanOrEqual(900)

    // Scroll to the end of the pin: the last frame must be fully on screen.
    await page.evaluate(() => {
      const spacer = document.querySelector<HTMLElement>('#experience .pin-spacer')!
      scrollTo(0, spacer.getBoundingClientRect().top + scrollY + spacer.offsetHeight - innerHeight)
    })
    const last = page.locator('#experience .strip-item').last()
    await expect(last).toBeInViewport({ ratio: 1 })
    await expect(last.locator('.strip-caption')).toHaveCSS('opacity', '1')
  })

  test('the reel never widens the page', async ({ page }) => {
    await page.goto('en/')
    await expect(strip(page)).toHaveAttribute('data-strip', 'on')
    for (const at of [0.25, 0.5, 0.75]) {
      await page.evaluate((f) => scrollTo(0, document.documentElement.scrollHeight * f), at)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `at ${at * 100}% of the page`).toBe(0)
    }
  })
})

test.describe('phones', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the strip is vertical and nothing is pinned', async ({ page }) => {
    await page.goto('en/')
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await expect(strip(page)).not.toHaveAttribute('data-strip', 'on')
    expect(await pinnedDistance(page)).toBe(0)
    const tops = await page
      .locator('#experience .strip-item')
      .evaluateAll((items) => items.map((i) => i.getBoundingClientRect().top))
    expect(tops).toEqual([...tops].sort((a, b) => a - b))
  })
})

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })

  test('keeps the vertical strip and pins nothing', async ({ page }) => {
    await page.goto('en/')
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await expect(strip(page)).not.toHaveAttribute('data-strip', 'on')
    expect(await pinnedDistance(page)).toBe(0)
  })
})

test('Quick view lists one milestone per line, with years and no frames', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('#experience .strip-cell').first()).toBeHidden()
  await expect(page.locator('#experience .strip-years')).toHaveText([
    '2021–2025',
    '2021–2025',
    '2025–present',
    '2026–present',
    '2026–2027',
  ])
  expect(await pinnedDistance(page)).toBe(0)
  await context.close()
})

// Chapter titles are single long words; they must stay whole at every width.
for (const viewport of viewports) {
  test(`chapter titles fit the screen · ${viewport.width}×${viewport.height}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto('en/')
    const boxes = await page
      .locator('[data-chapter-card] h2 .rise-line > span')
      .evaluateAll((spans) =>
        spans.map((s) => s.getBoundingClientRect()).map((r) => [r.left, r.right]),
      )
    for (const [left, right] of boxes) {
      expect(left).toBeGreaterThanOrEqual(0)
      expect(right).toBeLessThanOrEqual(viewport.width)
    }
    await context.close()
  })
}

test.describe('deep links after the reel is pinned', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  for (const id of ['projects', 'how-i-work', 'contact']) {
    test(`#${id} stays on screen once GSAP has pinned the reel`, async ({ page }) => {
      await page.goto(`en/#${id}`)
      await expect(strip(page)).toHaveAttribute('data-strip', 'on')
      await page.waitForTimeout(500)
      await expect(page.locator(`#${id}`)).toBeInViewport()
    })
  }
})
