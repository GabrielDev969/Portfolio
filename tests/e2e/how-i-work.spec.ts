import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { startInViewMode } from './helpers'

const steps = [
  'I plan',
  'I review the plan',
  'The AI implements',
  'I review the diff',
  'I run the tests',
  'Merge',
]

const offsets = (page: Page) =>
  page
    .locator('.step-drawing path')
    .evaluateAll((paths) => paths.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)))

test('How I work tells the six steps in order, then the closing line', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('#how-i-work ol.steps > li')).toHaveText(
    steps.map((step, i) => new RegExp(`${i + 1}\\s*${step}$`)),
  )
  await expect(page.getByText('AI speeds things up. The judgment is mine.')).toBeVisible()
})

test('every drawing is traced once its step has arrived', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await page.locator('html[data-motion="ready"]').waitFor({ state: 'attached' })
  await page.evaluate(() => {
    const steps = document.querySelector('.steps')!
    scrollTo(0, steps.getBoundingClientRect().bottom + scrollY - innerHeight / 2)
  })
  await expect(async () => {
    expect((await offsets(page)).every((o) => o < 0.01)).toBe(true)
  }).toPass()
})

test('Quick view lists the steps without drawings', async ({ browser }) => {
  const context = await browser.newContext()
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('.step-drawing').first()).toBeHidden()
  await expect(page.locator('#how-i-work ol.steps > li')).toHaveCount(6)
  await expect(page.locator('.build-loop')).toBeHidden()
  await context.close()
})

// Freezes every animation in the build loop at one moment of its 9 s cycle.
const loopAt = (page: Page, ms: number) =>
  page.evaluate((ms) => {
    for (const a of document.getAnimations()) {
      const target = (a.effect as KeyframeEffect).target as Element | null
      if (target?.closest('.build-loop')) {
        a.pause()
        a.currentTime = ms
      }
    }
  }, ms)

test('the build loop lights one label per beat', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('.bl-labels li')).toHaveText([
    'I choose',
    'The AI builds',
    "It's ready",
  ])
  for (const [ms, lit] of [
    [1000, 0],
    [4500, 1],
    [7500, 2],
  ] as const) {
    await loopAt(page, ms)
    const underlined = await page
      .locator('.bl-labels li')
      .evaluateAll((items) =>
        items.map((li) => getComputedStyle(li).textDecorationColor !== 'rgba(0, 0, 0, 0)'),
      )
    expect(underlined, `${ms} ms`).toEqual([0, 1, 2].map((i) => i === lit))
  }
})

test('with reduced motion, the build loop holds its last beat', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('.bl-choose')).toBeHidden()
  await expect(page.locator('.bl-code')).toBeHidden()
  await expect(page.locator('.bl-done')).toHaveCSS('opacity', '1')
  await expect(page.locator('.bl-check')).toHaveCSS('stroke-dashoffset', '0px')
  await context.close()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the drawings are complete', async ({ page }) => {
    await page.goto('en/')
    const dashes = await page
      .locator('.step-drawing path')
      .evaluateAll((paths) => paths.map((p) => getComputedStyle(p).strokeDasharray))
    expect(new Set(dashes)).toEqual(new Set(['none']))
  })
})
