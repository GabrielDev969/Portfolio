import { expect, skipColdOpen, test } from './fixtures'
import { startInViewMode } from './helpers'

const steps = [
  'I plan',
  'I review the plan',
  'The AI implements',
  'I review the diff',
  'I run the tests',
  'Merge',
]

test('How I work tells the six steps in order, then the closing line', async ({ page }) => {
  await page.goto('en/')
  await expect(page.locator('#how-i-work ol.board > li')).toHaveText(
    steps.map((step, i) => new RegExp(`${i + 1}\\s*${step}$`)),
  )
  await expect(page.getByText('AI speeds things up. The judgment is mine.')).toBeVisible()
})

test('the pencil finishes every drawing once the sheet has passed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('en/')
  await expect(page.locator('#experience .strip')).toHaveAttribute('data-strip', 'on')
  await page.evaluate(() => {
    const board = document.querySelector('.board')!
    scrollTo(0, board.getBoundingClientRect().bottom + scrollY)
  })
  await expect(async () => {
    const offsets = await page
      .locator('.board-drawing path')
      .evaluateAll((paths) => paths.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)))
    expect(offsets.every((o) => o < 0.01)).toBe(true)
  }).toPass()
})

test('Quick view lists the steps without drawings', async ({ browser }) => {
  const context = await browser.newContext()
  await skipColdOpen(context)
  await startInViewMode(context, 'quick')
  const page = await context.newPage()
  await page.goto('en/')
  await expect(page.locator('.board-drawing').first()).toBeHidden()
  await expect(page.locator('#how-i-work ol.board > li')).toHaveCount(6)
  await context.close()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the drawings are complete', async ({ page }) => {
    await page.goto('en/')
    const dashes = await page
      .locator('.board-drawing path')
      .evaluateAll((paths) => paths.map((p) => getComputedStyle(p).strokeDasharray))
    expect(new Set(dashes)).toEqual(new Set(['none']))
  })
})
