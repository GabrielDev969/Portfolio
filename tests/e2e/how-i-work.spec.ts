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
